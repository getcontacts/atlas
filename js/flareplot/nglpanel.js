
// import * as d3 from '../../vendor/d3v5.2/d3.js';
// import * as NGL from '../../vendor/ngl_2.0.0/ngl.js';
// import * as NGL from 'https://unpkg.com/ngl@0.10.4/dist/ngl.js';

export class NGLPanel {
  /**
   *
   * @param {Flaremodel} flareModel - The flare model
   * @param {string} width - A CSS-style width of the NGL panel
   * @param {string} height - A CSS-style height of the NGL panel
   * @param {string} containerSelector - CSS selector of a container that has already set the width and height
   */
  constructor(flareModel, width, height, containerSelector) {
    const containerID = 'NGLviewport' + (Math.floor(Math.random() * 1e7));
    const that = this;

    if (width === 'auto' && window) {
      const containerStyle = window.getComputedStyle(d3.select(containerSelector).node());
      const containerPadding = parseFloat(containerStyle.paddingLeft) + parseFloat(containerStyle.paddingRight);

      width = (d3.select(containerSelector).node().clientWidth - containerPadding) + "px";
    }
    if (height === 'auto') {
      height = width;
    }

    d3.select(containerSelector)
      .append('div')
      .style('width', width)
      .style('height', height)
      .attr('id', containerID);

    this.flareModel = flareModel;

    this.stage = new NGL.Stage(containerID, { backgroundColor: 'white'});
    this.stage.viewerControls.center(NGL.Vector3(0,0,0));
    this.stage.viewerControls.zoom(-0.2);
    this.stage.mouseControls.remove('clickPick-left', NGL.MouseActions.movePick)
    this.stage.mouseControls.remove('clickPick-right', NGL.MouseActions.measurePick)
    window.addEventListener('resize', function () { that.stage.handleResize(); }, false);

    that.flareModel.addHighlightListener(that);
    that.flareModel.addToggleListener(that);
    that.flareModel.addFrameListener(that);

    // Modify tooltip
    that.stage.mouseControls.remove('hoverPick');
    that.tooltip = document.createElement('div');
    that.tooltip.class = 'ngl-tooltip';
    Object.assign(that.tooltip.style, {
      display: 'none',
      position: 'absolute',
      zIndex: 10,
      pointerEvents: 'none',
      backgroundColor: 'none',
      color: 'grey',
      padding: '0.5em',
      bottom: '0px',
      right: '0px',
      fontFamily: 'sans-serif'
    });
    that.stage.viewer.container.appendChild(that.tooltip);
    that.stage.signals.hovered.add(function (pickingProxy) {
      if (pickingProxy && (pickingProxy.atom || pickingProxy.bond)) {
        const atom = pickingProxy.atom || pickingProxy.closestBondAtom;
        that.tooltip.innerText = atom.chainname + ':' + atom.resname + ':' + atom.resno;
        that.tooltip.style.display = 'block';
      } else {
        that.tooltip.style.display = 'none';
      }
    });

    if (document) {
      document.addEventListener('mousedown', function () {
        that.dragStartTime = Date.now();
      }, false);
    }

    that.stage.signals.clicked.add(function (pickingProxy) {
      if (pickingProxy && (pickingProxy.atom || pickingProxy.bond)) {

        // Left click and not dragging
        if (pickingProxy.mouse.which == 1 && that.dragStartTime && (Date.now() - that.dragStartTime < 500)) {
          const atom = pickingProxy.atom || pickingProxy.closestBondAtom;

          that.resiMouseClicked(atom.resno, atom.chainname);
        }
        delete that.dragStartTime;
      }
    });

    // Add highlight listener
    let hoverResi, hoverChain;

    that.stage.signals.hovered.add(function (pickingProxy) {
      // If dragging, don't hover
      if (that.dragStartTime) {
        return;
      }
      if (pickingProxy && (pickingProxy.atom || pickingProxy.bond)) {
        const atom = pickingProxy.atom || pickingProxy.closestBondAtom;
        const resi = atom.resno;
        const chain = atom.chainname;

        if (hoverResi !== resi || hoverChain !== chain) {
          if (hoverResi !== undefined) {
            that.resiMouseLeave(hoverResi, hoverChain);
          }
          that.resiMouseEnter(resi, chain);
          hoverResi = resi;
          hoverChain = chain;
        }
      } else if (hoverResi) {
        that.resiMouseLeave(hoverResi, hoverChain);
        hoverResi = undefined;
        hoverChain = undefined;
      }
    });
  }

  /**
   * Associate labels with NGL residue selections and put two-way mappings in the `modelToStrucResiMap` and
   * `strucToModelResiMap` fields.
   *
   * Example input:
   *   {
   *     "R:P0G:1601" => "Ligand",
   *     "R:GLU:30" => "h1.1x29",
   *     ...
   *   }
   * which would result the maps:
   *   this.modelToStrucResiMap = { "Ligand" => "1601:R", "1x29" => "30:R", ...}
   *   this.strucToModelResiMap = { "1601:R" => "Ligand", "30:R" => "1x29", ...}
   * If the input-parameter is undefined the maps are generated based on residue id parsed from the last digits of
   * model vertex names.
   *
   * @param {Map<string, string} labelMap - Associates residue identifiers with labels
   */
  _parseLabels(labelMap) {
    this.modelToStrucResiMap = new Map();
    this.strucToModelResiMap = new Map();

    if (labelMap === undefined) {
      this.flareModel.getVertices().forEach((v) => {
        const modelResi = v.name.match(/[0-9]+$/)[0];
        const strucResi = modelResi + ':A';
        if (strucResi.indexOf(" ") >= 0) {
          console.log("WARNING: Theres a space in your label: '" + strucResi + "'");
        }

        this.modelToStrucResiMap.set(v.name, strucResi);
        this.strucToModelResiMap.set(strucResi, v.name);
      });

    } else {

      labelMap.forEach((v, k) => {
        const keyTokens = v.split(":");
        const strucChain = keyTokens[0];
        const strucResi = keyTokens[2] + ':' + strucChain;
        const modelResi = k.substr(k.lastIndexOf('.') + 1);
        if (strucResi.indexOf(" ") >= 0) {
          console.log("WARNING: Theres a space in your label: '" + strucResi + "'");
        }

        this.modelToStrucResiMap.set(modelResi, strucResi);
        this.strucToModelResiMap.set(strucResi, modelResi);
      });
    }
  }


  /**
   * Updates the currently shown structure.
   * @param {Blob} pdbFile - PDB file blob
   * @param {Map<string, string} labelFile - Associates residue identifiers with labels
   * @param {Array<Array<string>>} atomicContacts - List of atomic-level interactions
   */
  setStructure(pdbFile, labelFile, atomicContacts) {
    this.atomicContacts = atomicContacts;
    this._parseLabels(labelFile);

    // Set up the promise to load pdb-file into stage
    this.stage.loadFile(pdbFile, {ext: "pdb"})
      .then((pdbComponent) => {
        // Set up component
        this.component = pdbComponent;
        // this.ligandRepresentation = this.component.addRepresentation('ball+stick', {
        //   sele: 'ligand'
        // });
        this.component.addRepresentation('ball+stick', {
          sele: 'ligand'
        });
        this.cartoonRepresentation = this.component.addRepresentation('cartoon', {
          opacity: 0.7, // Minimum opacity at which you can still pick
          side: 'front',
          quality: 'high',
          aspectRatio: 3
        });
        // Remove component except the one that was just added
        this.stage.eachComponent((c) => { if (c != pdbComponent) { this.stage.removeComponent(c); }});
        this._updateColorScheme();
        this._updateInteractions();
        this._updateToggle();
      });
  }

  _updateInteractions() {

    const edges = this.flareModel.getEdges()
      .filter(e => this.flareModel.vertexToggled(e.v1.name) || this.flareModel.vertexToggled(e.v2.name))
      .map(e => {
        return {
          resi1: this.modelToStrucResiMap.get(e.v1.name),
          resi2: this.modelToStrucResiMap.get(e.v2.name),
          count: this.flareModel.frameCount(e)
        };
      })
      .filter(d => d.count > 0);

    let pairs = [];
    const waterAtoms = new Set();
    if(this.atomicContacts){
      function edgeHash(r1, r2){
        return r1 < r2 ? r1 + "-" + r2 : r2 + "-" + r1;
      }
      const edgeresipairs = new Set(edges.map(e => edgeHash(e.resi1, e.resi2)));
      this.atomicContacts.forEach((e) => {
        const atom1 = e[2].split(":");
        const atom2 = e[3].split(":");
        const r1 = atom1[2]+":"+atom1[0];
        const r2 = atom2[2]+":"+atom2[0];
        if(edgeresipairs.has(edgeHash(r1, r2))){
          if (e[1] == "wb" || e[1] == "lwb") {
            const atom3 = e[4].split(":");
            const r3 = atom3[2]+":"+atom3[0];
            pairs.push([r1 + "." + atom1[3], r3 + "." + atom3[3]]);
            pairs.push([r3 + "." + atom3[3], r2 + "." + atom2[3]]);
            waterAtoms.add(r3);
          } else if (e[1] == "wb2" || e[1] == "lwb2") {
            const atom3 = e[4].split(":");
            const atom4 = e[5].split(":");
            const r3 = atom3[2]+":"+atom3[0];
            const r4 = atom4[2]+":"+atom4[0];
            pairs.push([r1 + "." + atom1[3], r3 + "." + atom3[3]]);
            pairs.push([r3 + "." + atom3[3], r4 + "." + atom4[3]]);
            pairs.push([r4 + "." + atom4[3], r2 + "." + atom2[3]]);
            waterAtoms.add(r3);
            waterAtoms.add(r4);
          } else {
            pairs.push([r1 + "." + atom1[3], r2 + "." + atom2[3]])
          }
        }
      })
    } else {
      pairs = edges.map(d => [d.resi1 + '.CA', d.resi2 + '.CA']);
    }

    // Add new interactions
    const new_interactions_component = this.component.addRepresentation('distance', {
      atomPair: pairs,
      color: 'black',
      useCylinder: true,
      labelVisible: false,
      radiusSize: 0.1
    });

    // Remove old interactions
    if (this.interactionRepresentation) {
      this.component.removeRepresentation(this.interactionRepresentation);
    }
    this.interactionRepresentation = new_interactions_component;

    // Remove old waters
    if (this.waterRepresentation) {
      this.component.removeRepresentation(this.waterRepresentation);
    }
    // Add new waters
    if (waterAtoms.size > 0) {
      this.waterRepresentation = this.component.addRepresentation('hyperball', {
        sele: Array.from(waterAtoms).reduce((acc, atom) => atom + " " + acc, "")
      })
    }
  }

  _updateColorScheme() {
    const track = this.flareModel.getTrack();
    const colDefs = Array.from(track.properties)
      .filter(entry => this.modelToStrucResiMap.get(entry[0]) !== undefined)
      .map(entry => [entry[1].color, this.modelToStrucResiMap.get(entry[0])]);

    colDefs.push(['white', '*']);
    const schemeId = NGL.ColormakerRegistry.addSelectionScheme(colDefs, track.label + '_scheme');

    this.cartoonRepresentation.setParameters({ colorScheme: schemeId});
  }

  resiMouseClicked(resi, chain) {
    const strucResi = resi + ':' + chain;
    const modelVertex = this.flareModel.getVertex(this.strucToModelResiMap.get(strucResi));

    if (modelVertex) {
      const isToggled = this.flareModel.vertexToggled(modelVertex.name);

      this.flareModel.setVertexToggled(modelVertex.name, !isToggled);
    }
  }

  resiMouseEnter(resi, chain) {
    const strucResi = resi + ':' + chain;
    const modelVertex = this.flareModel.getVertex(this.strucToModelResiMap.get(strucResi));
    // const modelVertex = this.flareModel.getVertices().find(v => NGLPanel._resiFromName(v.name) === resi);

    if (modelVertex) {
      this.flareModel.setVertexHighlighted(modelVertex.name, true);
    }
  }

  resiMouseLeave(resi, chain) {
    const strucResi = resi + ':' + chain;
    const modelVertex = this.flareModel.getVertex(this.strucToModelResiMap.get(strucResi));
    // const modelVertex = this.flareModel.getVertices().find(v => NGLPanel._resiFromName(v.name) === resi);

    if (modelVertex) {
      this.flareModel.setVertexHighlighted(modelVertex.name, false);
    }
  }

  fire(event) {
    // console.log(event);
    switch (event.type) {
      case 'vertexHighlight':
        this._updateHighlight(event.data);
        break;

      case 'vertexToggle':
        this._updateToggle();
        this._updateInteractions();
        break;

      case 'framesChange':
        this._updateInteractions();
        break;

      case 'vertexChange':
        this._updateInteractions();
        break;
    }
  }

  _updateToggle() {
    const toggledNames = this.flareModel.getToggledVertices();
    const neighborNames = [];

    if (this.atomicContacts) {
      const that = this;
      this.flareModel.getToggledVertices().forEach(function (vname) {
        let vertex = that.flareModel.getVertex(vname);
        vertex.edges.forEach(function (edge) {
          let adjName = edge.opposite(vertex).name;
          if(toggledNames.indexOf(adjName) == -1) {
            neighborNames.push(adjName);
          }
        });
      });
    }

    if (this.toggleRepresentation) {
      this.component.removeRepresentation(this.toggleRepresentation);
    }

    if (this.neighborRepresentation) {
      this.component.removeRepresentation(this.neighborRepresentation);
    }

    const resis = toggledNames.map(n => this.modelToStrucResiMap.get(n)).filter(n => n !== undefined);
    if (resis.length > 0) {
      const nglselection = resis.join(' or ');
      this.toggleRepresentation = this.component.addRepresentation('hyperball', {sele: nglselection});
    }

    const neighborresis = neighborNames.map(n => this.modelToStrucResiMap.get(n)).filter(n => n !== undefined);
    if (neighborresis.length > 0) {
      const nglselection = neighborresis.join(' or ');
      this.neighborRepresentation = this.component.addRepresentation('hyperball', {
        sele: nglselection,
        opacity: 0.4, // Minimum opacity at which you can still pick
        depthWrite: false,
        side: 'front',
        quality: 'high'
      });
    }
  }

  _updateHighlight(highlightedNames) {
    // const resis = highlightedNames.map(n => NGLPanel._resiFromName(n));
    const resis = highlightedNames.map(n => this.modelToStrucResiMap.get(n))
      .filter(n => n !== undefined);

    if (this.highlightRepresentation) {
      this.component.removeRepresentation(this.highlightRepresentation);
    }
    if (resis.length > 0) {
      const nglselection = resis.join(' or ');

      // this.highlightRepresentation = this.component.addRepresentation('ball+stick', {
      this.highlightRepresentation = this.component.addRepresentation('hyperball', {
        sele: nglselection,
        opacity: 0.6
      });
      this.tooltip.innerText = nglselection;
      this.tooltip.style.display = 'block';
    } else {
      this.tooltip.style.display = 'none';
    }
  }
}
