import * as fp from './flareplot/flareplot.js';
import {FingerprintPanel} from "./flareplot/fingerprintpanel.js";
import { NGLPanel } from "./flareplot/nglpanel.js";
import { buildMultiFlare } from "./contact_to_flare.js";
// import * as NGL from 'https://unpkg.com/ngl@0.10.4/dist/ngl.js';

/**
 * The fileData field is a list of objects that store contents of contact, label, and pdb files. An example of
 * an object could be
 *   {
 *     id: '...',
 *     contacts: [['0', 'hbsb', '...', '...'], ...],
 *     labels: {'...' => Array(2), ...},
 *     labelToResiMap: {'...' => '...', ...},
 *     pdbFile: 'ATOM  ...\nATOM ...'
 *   }
 */
export class CompareManager {
  /**
   * TODO: Document
   * @param family
   * @param structureIds a list of strings where each string is either a PDB/Chain identifier or a key for the
   * localStorage prefixed with 'USRTABLE_'.
   */
  constructor(family, pdbIds, mdIds, usrIds){
    this.family = family;
    this.pdbIds = pdbIds;
    this.mdIds = mdIds;
    this.usrIds = usrIds;
    this.structureIdx = 0;
    this.curItypes = ['hbss'];
  }

  _readAndParseFiles() {
    if (this.fileData !== undefined)
      return new Promise((resolve) => {resolve();});

    // this.fileSelected = 0;
    this.fileData = [];

    const parseTsvString =
      (s) => s.split("\n")
        .filter((line) => line[0] != "#" && line.trim().length > 0)  // Strip comments and empty lines
        .map((line) => line.split("\t"));

    const parseLabelString =
        (s) => new Map(
          parseTsvString(s)
            .filter((row) => row.length >= 2)
            .map((row) => [row[0].trim(), row.slice(1)]));

    const labelToResi =
      (s) => new Map(
        parseTsvString(s)
          .filter((row) => row.length >= 2)
          .map((row) => [row[1].substring(row[1].lastIndexOf(".") + 1), row[0]])
      );

    // Add user structures
    this.usrIds.forEach((usrid) => {
      const rawStorage = JSON.parse(localStorage.getItem(usrid));
      this.fileData.push({
        id: usrid.substr(9),
        contacts: parseTsvString(rawStorage.contactFile),
        labels: parseLabelString(rawStorage.labelFile),
        labelToResiMap: labelToResi(rawStorage.labelFile),
        pdbFile: rawStorage.pdbFile
        });
    });

    if (!["gpcr", "kinase", "galpha"].includes(this.family)) {
      return new Promise(function(resolve){resolve();});
    }

    const that = this;

    // Read, parse and add builtin structures
    const n = this.pdbIds.length;
    const pdbContactPromises = this.pdbIds
      .map((id) => "static_data/"+this.family+"/contacts/" + id + ".tsv")
      .map((fname) => d3.text(fname));
    const pdbLabelPromises = this.pdbIds
      .map((id) => "static_data/"+this.family+"/residuelabels/" + id + ".tsv")
      .map((fname) => d3.text(fname));
    const pdbStructurePromises = this.pdbIds
      .map((id) => "static_data/" + this.family + "/structures_protonated/" + id + ".pdb")
      .map((fname) => d3.text(fname));
    const pdbAnnotationPromise = d3.json("static_data/" + this.family + "/annotations.json");

    const m = this.mdIds.length;
    const mdContactPromises = this.mdIds
      .map((id) => "simulation_data/" + this.family + "/" + id + "/contacts.tsv")
      .map((fname) => d3.text(fname));
    const mdLabelPromises = this.mdIds
      .map((id) => "simulation_data/"+this.family+"/" + id + "/labels.tsv")
      .map((fname) => d3.text(fname));
    const mdStructurePromises = this.mdIds
      .map((id) => "simulation_data/" + this.family + "/" + id + "/structure.pdb")
      .map((fname) => d3.text(fname));
    const mdAnnotationPromise = d3.json("simulation_data/" + this.family + "/annotations.json");

    return new Promise(
      function(resolve) {
        Promise.all(
          pdbContactPromises
            .concat(pdbLabelPromises)
            .concat(pdbStructurePromises)
            .concat(pdbAnnotationPromise)
            .concat(mdContactPromises)
            .concat(mdLabelPromises)
            .concat(mdStructurePromises)
            .concat(mdAnnotationPromise))
          .then(function (data) {
            const pdbAnnotationData = data[3 * n + 0];
            const mdAnnotationData = data[3 * n + 3 * m + 1];
            const annMap = CompareManager._parseAnnotations(pdbAnnotationData, mdAnnotationData);

            for (let i = 0; i < n; i++) {
              that.fileData.push({
                id: annMap.get(that.pdbIds[i]),
                contacts: parseTsvString(data[0 * n + i]),
                labels: parseLabelString(data[1 * n + i]),
                labelToResiMap: labelToResi(data[1 * n + i]),
                pdbFile: data[2 * n + i]
              });
            }

            for (let i = 0; i < m; i++) {
              console.log(0+3*i+3*n+1);
              that.fileData.push({
                id: annMap.get(that.mdIds[i]),
                contacts: parseTsvString(data[0 * m + i + 3 * n + 1]),
                labels: parseLabelString(data[1 * m + i + 3 * n + 1]),
                labelToResiMap: labelToResi(data[1 * m + i + 3 * n + 1]),
                pdbFile: data[2 * m + i + 3 * n + 1]
              });
            }

            console.log(that.fileData);
            resolve();
          });
      }
    );
  }

  /**
   *
   * @param {Object} annotationJson
   * @param {Object} annotationJson_sim
   * @returns {Map<string, string>}
   * @private
   */
  static _parseAnnotations(pdbAnnotationJson, mdAnnotationJson) {
    const kvArray = pdbAnnotationJson.map((ann) => [
      ann.pdbid + "_" + ann.chain,
      ann['protid'].split("_")[0].toUpperCase() + ":" + ann.pdbid + ":" + ann.chain
    ]);
    console.log(mdAnnotationJson);
    const mdKvArray = mdAnnotationJson.map((ann) => [ann['id'], ann['protein']]);
    return new Map(kvArray.concat(mdKvArray));
  }

  updateItypes(itypes) {
    if (Array.isArray(itypes)){
      this.curItypes = new Set(itypes);
    } else {
      this.curItypes = Array.from(itypes);
    }

    this.update();
  }

  update(){
    this._readAndParseFiles().then(() => {
      const contactsData = this.fileData.map((fd) => fd.contacts.filter((row) => this.curItypes.has(row[1])));
      const labelsData = this.fileData.map((fd) => fd.labels); // TODO: Move to readAndParseFiles
      const headers = this.fileData.map((fd) => fd.id);

      const graph = buildMultiFlare(contactsData, labelsData, headers);

      if (this.flareplot) {
        this.model.setGraph(graph);
        // this.updateStructure(this.pdbIds[0]);
        this.updateStructure(this.fileData[0].id);
      } else {
        this.flareplot = new fp.Flareplot(graph, "auto", "#flareDiv", {});
        this.model = this.flareplot.getModel();
        this.nglpanel = new NGLPanel(this.model, "auto", "auto", "#nglDiv");
        this.fingerprintpanel = new FingerprintPanel(this.model, 23, "#fingerprintDiv");
        this.updateStructure(this.fileData[0].id);

        this.fingerprintpanel.addHeaderClickListener((headerData) => {
          this.updateStructure(this.fileData[headerData[1]].id);
        });

        this.fingerprintpanel.addRowClickListener((rowData) => {
          if (rowData.fingerprint.indexOf(this.structureIdx) == -1){
            const pdb = this.fileData[rowData.fingerprint[0]].id;
            this.updateStructure(pdb);
          }
        });
      }
    });
  }

  updateStructure(structureid) {
    this.structureIdx = this.fileData.findIndex((fd) => fd.id == structureid);
    const fileData = this.fileData[this.structureIdx];
    const pdbBlob = new Blob( [ fileData.pdbFile ], { type: 'text/plain'} );

    // Only retain contacts with the right interaction type
    const contactData = fileData.contacts.filter((c) => this.curItypes.has(c[1]));

    this.nglpanel.setStructure(pdbBlob, fileData.labelToResiMap, contactData);

    // Style fingerprint header
    this.fingerprintpanel.div.select(".fp-header")
      .selectAll('.fp-headerCell')
      .style("font-weight", (d, i) => {
        return i == this.structureIdx ? "bold" : "normal";
      });

    // Update flareplot labels
    this.flareplot.vertexGroup.selectAll("g.vertex text")
      .style("opacity", function (d) {
        // const label = that.labelToResiData[that.structureIdx][d.data.name];
        const label = fileData.labelToResiMap.get(d.data.name);
        if (label) {
          return null;
        } else {
          return 0.2;
        }
      })
      .text(function (d) {
        // const label = that.labelToResiData[that.structureIdx][d.data.name];
        const label = fileData.labelToResiMap.get(d.data.name);
        if (label) {
          return label.substring(label.indexOf(":") + 1);
        } else {
          return d.data.name;
        }
      });
  }

}
