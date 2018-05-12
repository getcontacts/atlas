
// import * as d3 from '../../vendor/d3v5.2/d3.js';
// import * as NGL from '../../vendor/ngl_2.0.0/ngl.js';
// import * as NGL from 'https://unpkg.com/ngl@0.10.4/dist/ngl.js';

export class NGLPanel {
  /**
   *
   * @param {string} fname - A local file-name or a 4-letter PDB-id (will download from RCSB)
   * @param {Flaremodel} flareModel - The flare model
   * @param {string} width - A CSS-style width of the NGL panel
   * @param {string} height - A CSS-style height of the NGL panel
   * @param {string} containerSelector - CSS selector of a container that has already set the width and height
   * @param {Object=} layoutOptions - Optional options for defining layout features. Can specify
   *   - {string} resiLabelFile - File name of a residue label file that associates residue identifiers with labels
   */
  constructor(fname, flareModel, width, height, containerSelector, layoutOptions) {
    console.log("NGLPanel()");
    const containerID = 'NGLviewport' + (Math.floor(Math.random() * 1e7));
    const that = this;

    d3.select(containerSelector)
      .append('div')
      .style('width', width)
      .style('height', height)
      .attr('id', containerID);

    this.flareModel = flareModel;

    this.stage = new NGL.Stage(containerID, { backgroundColor: 'white'});
    window.addEventListener('resize', function () { that.stage.handleResize(); }, false);

    if (layoutOptions && layoutOptions.resiLabelFile) {
      this.setStructure(fname, layoutOptions.resiLabelFile, undefined, true);
    } else {
      this.setStructure(fname, undefined, undefined, true);
    }
  }

  /**
   * Updates the currently shown structure.
   * @param pdbFile path to a pdb-file or a PDB-id
   * @param labelFile path to label-file
   * @param atomicContacts list of atomic-level interactions
   * @param firstTime indicates if this is the first time the function is called. Used to determine if autoView
   * should be called
   */
  setStructure(pdbFile, labelFile, atomicContacts, firstTime) {
    console.log('setStructure');
    console.log(pdbFile);
    console.log(labelFile);
    console.log(firstTime);
    this.atomicContacts = atomicContacts;

    // Clear stage
    this.stage.removeAllComponents();

    // Create residue label file promise
    let resiLabelPromise = Promise.resolve(undefined);

    if (labelFile !== undefined) {
      resiLabelPromise = d3.text(labelFile);
    }

    // Set up the promise to load pdb-file into stage
    if (pdbFile.match(/^[0-9][0-9A-Za-z][0-9A-Za-z][0-9A-Za-z]$/)) {
      pdbFile = 'rcsb://' + pdbFile;
    }
    let stagePromise = this.stage.loadFile(pdbFile);
    const that = this;

    // Wait for promises to resolve
    Promise.all([resiLabelPromise, stagePromise])
      .then(function (values) {

        // Set up residue labels
        that.modelToStrucResiMap = new Map();
        that.strucToModelResiMap = new Map();
        if (values[0] === undefined) {
          that.flareModel.getVertices().forEach(v => {
            const modelResi = v.name.match(/[0-9]+$/)[0];
            const strucResi = modelResi + ':A';

            that.modelToStrucResiMap.set(v.name, strucResi);
            that.strucToModelResiMap.set(strucResi, v.name);
          });
        } else {
          values[0].split('\n').forEach(line => {
            line = line.trim();
            if (line.length === 0) {
              return;
            }
            const tokens = line.split('\t');
            const strucChain = tokens[0].split(':')[0];
            const strucResi = tokens[0].split(':')[2] + ':' + strucChain;
            const modelResi = tokens[1].substr(tokens[1].lastIndexOf('.') + 1);

            that.modelToStrucResiMap.set(modelResi, strucResi);
            that.strucToModelResiMap.set(strucResi, modelResi);
          });
        }

        // Set up component
        that.component = values[1];
        that.ligandRepresentation = that.component.addRepresentation('ball+stick', {
          sele: 'ligand'
        });
        that.cartoonRepresentation = that.component.addRepresentation('cartoon', {
          opacity: 0.7, // Minimum opacity at which you can still pick
          depthWrite: false,
          side: 'front',
          quality: 'high'
        });
        if (firstTime) {
          console.log('first time .. autoview');
          that.component.autoView();
        }
        that._updateColorScheme();
        that._updateInteractions();
        that._updateToggle();

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
          fontSize: '0.5rem',
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
            if (that.dragStartTime && (Date.now() - that.dragStartTime < 500)) {
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
      });
  }

  _updateInteractions() {
    if (this.interactionRepresentation) {
      this.component.removeRepresentation(this.interactionRepresentation);
    }

    const pairs = this.flareModel.getEdges()
      .filter(e => this.flareModel.vertexToggled(e.v1.name) || this.flareModel.vertexToggled(e.v2.name))
      .map(e => {return {edge: e, count: this.flareModel.frameCount(e)};})
      .filter(d => d.count > 0)
      .map(d => [
        this.modelToStrucResiMap.get(d.edge.v1.name) + '.CA',
        this.modelToStrucResiMap.get(d.edge.v2.name) + '.CA'
      ]);
    // .map(d => [NGLPanel._resiFromName(d.edge.v1.name) + '.CA', NGLPanel._resiFromName(d.edge.v2.name) + '.CA']);

    this.interactionRepresentation = this.component.addRepresentation('distance', {
      atomPair: pairs,
      color: 'black',
      useCylinder: true,
      labelVisible: false
    });
    // color: '#414141',
  }

  _updateColorScheme() {
    const track = this.flareModel.getTrack();
    const colDefs = Array.from(track.properties)
      .filter(entry => this.modelToStrucResiMap.get(entry[0]) !== undefined)
      .map(entry => [entry[1].color, this.modelToStrucResiMap.get(entry[0])]);
    // .map(entry => [entry[1].color, '' + NGLPanel._resiFromName(entry[0])]);

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
    console.log('updateToggle: ');
    console.log(toggledNames);

    if (this.atomicContacts) {
      const that = this;
      this.flareModel.getToggledVertices().forEach(function (vname) {
        let vertex = that.flareModel.getVertex(vname);
        vertex.edges.forEach(function (edge) {
          let adjName = edge.opposite(vertex).name;
          toggledNames.push(adjName);
        });
      });
    }

    const resis = toggledNames.map(n => this.modelToStrucResiMap.get(n))
      .filter(n => n !== undefined);

    if (this.toggleRepresentation) {
      console.log('updateToggle removeRepr');
      this.component.removeRepresentation(this.toggleRepresentation);
    }
    if (resis.length > 0) {
      const nglselection = resis.join(' or ');
      this.toggleRepresentation = this.component.addRepresentation('hyperball', {sele: nglselection});
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
      this.highlightRepresentation = this.component.addRepresentation('hyperball', {sele: nglselection});
      this.tooltip.innerText = nglselection;
      this.tooltip.style.display = 'block';
    } else {
      this.tooltip.style.display = 'none';
    }
  }
}
