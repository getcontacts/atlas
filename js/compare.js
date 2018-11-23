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
  constructor(family, pdbIds, usrIds){
    this.family = family;
    this.pdbIds = pdbIds;
    this.usrIds = usrIds;
    this.structureIdx = 0;
    this.curItypes = ['hbss'];
  }

  _readAndParseFiles() {
    if (this.fileData !== undefined)
      return new Promise((resolve) => {resolve();});

    this.fileSelected = 0;
    this.fileData = [];

    const parseTsvString =
      (s) => s.split("\n")
        .filter((line) => line[0] != "#" && line.trim().length > 0)  // Strip comments and empty lines
        .map((line) => line.split("\t"));

    const parseLabelString =
        (s) => new Map(
          parseTsvString(s)
            .filter((row) => row.length >= 2)
            .map((row) => [row[0], row.slice(1)]));

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

    const that = this;

    // Read, parse and add builtin structures
    const n = this.pdbIds.length;
    const contactFiles = this.pdbIds.map((pdb) => "static_data/"+this.family+"/contacts/" + pdb + ".tsv");
    const labelFiles = this.pdbIds.map((pdb) => "static_data/"+this.family+"/residuelabels/" + pdb + ".tsv");
    const pdbFiles = this.pdbIds.map((pdb) => "static_data/" + this.family + "/structures_protonated/" + pdb + ".pdb");
    const annotationFile = "static_data/" + this.family + "/annotations.json";

    const contactFilePromises = contactFiles.map((cf) => d3.text(cf));
    const labelFilePromises = labelFiles.map((lf) => d3.text(lf));
    const pdbFilePromises = pdbFiles.map((lf) => d3.text(lf));
    const annotationPromise = [d3.json(annotationFile)];

    return new Promise(
      function(resolve) {
        Promise.all(contactFilePromises.concat(labelFilePromises).concat(pdbFilePromises).concat(annotationPromise))
          .then(function (data) {
            // that.annotationData = data[3 * n];
            const annotationData = data[3 * n];
            const annMap = CompareManager._parseAnnotation(annotationData);

            for (let i = 0; i < contactFiles.length; i++) {
              that.fileData.push({
                id: annMap.get(that.pdbIds[i]),
                contacts: parseTsvString(data[0 * n + i]),
                labels: parseLabelString(data[1 * n + i]),
                labelToResiMap: labelToResi(data[1 * n + i]),
                pdbFile: data[2 * n + i]
              });
            }

            resolve();
          });
      }
    );
  }

  /**
   *
   * @param {Object} annotationJson
   * @returns {Map<string, string>}
   * @private
   */
  static _parseAnnotation(annotationJson) {
    const kvArray = annotationJson.map((ann) => [
      ann.pdbid + "_" + ann.chain,
      ann['protid'].split("_")[0].toUpperCase() + ":" + ann.pdbid + ":" + ann.chain
      ]);
    return new Map(kvArray);
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

      // Use annotation data to compose headers
      // const annotationData = this.annotationData;
      // const headerData = new Map();
      // this.pdbIds.forEach((pdbid) => {headerData.set(pdbid, "");});
      // annotationData.forEach((ann) => {
      //   const key = ann.pdbid + "_" + ann.chain;
      //   if (headerData.has(key)) {
      //     const header = ann['protid'].split("_")[0].toUpperCase() + ":" + ann.pdbid + ":" + ann.chain;
      //     headerData.set(key, header);
      //   }
      // });
      // const headers = this.pdbIds
      //   .map((pdbid) => headerData.get(pdbid))
      //   .concat(this.usrIds
      //     .map((key) => key.substr(9)));
      const headers = this.fileData.map((fd) => fd.id);

      console.log(headers);

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
    console.log("updateStructure", structureid);
    //this.pdbIds.forEach((id, idx) => {if(pdbid==id){this.curStructure = idx;}});
    //this.update();
    const fileData = this.fileData.find((fd) => fd.id == structureid);
    const pdbBlob = new Blob( [ fileData.pdbFile ], { type: 'text/plain'} );
    // Only retain contacts with the right interaction type
    const contactData = fileData.contacts.filter((c) => this.curItypes.has(c[1]));
    this.nglpanel.setStructure(pdbBlob, fileData.labelToResiMap, contactData);

    // // Style fingerprint header
    // const headerDiv = this.fingerprintpanel.div.select(".fp-header")
    //   .selectAll('.fp-headerCell')
    //   .style("font-weight", function(d, i) {
    //     return i == that.structureIdx ? "bold" : "normal";
    //   });
    //
    // // Update flareplot labels
    // this.flareplot.vertexGroup.selectAll("g.vertex text")
    //   .style("opacity", function (d) {
    //     // const label = that.labelToResiData[that.structureIdx][d.data.name];
    //     const label = that.labelToResiData.get(d.data.name);
    //     if (label) {
    //       return null;
    //     } else {
    //       return 0.2;
    //     }
    //   })
    //   .text(function (d) {
    //     // const label = that.labelToResiData[that.structureIdx][d.data.name];
    //     const label = that.labelToResiData.get(d.data.name);
    //     if (label) {
    //       return label.substring(label.indexOf(":") + 1);
    //     } else {
    //       return d.data.name;
    //     }
    //   });

    // this.structureIdx = this.pdbIds.indexOf(structureid);
    // const atomicContacts = this.contactsData[this.structureIdx];
    // const structureFile = "static_data/" + this.family + "/structures_protonated/" + structureid + ".pdb";
    // const labelFile = "static_data/" + this.family + "/residuelabels/" + structureid + ".tsv";
    // const that = this;
    //
    // // Style fingerprint header
    // const headerDiv = this.fingerprintpanel.div.select(".fp-header")
    //   .selectAll('.fp-headerCell')
    //   .style("font-weight", function(d, i) {
    //     return i == that.structureIdx ? "bold" : "normal";
    //   });
    //
    // // Update flareplot labels
    // this.flareplot.vertexGroup.selectAll("g.vertex text")
    //   .style("opacity", function (d) {
    //     // const label = that.labelToResiData[that.structureIdx][d.data.name];
    //     const label = that.labelToResiData.get(d.data.name);
    //     if (label) {
    //       return null;
    //     } else {
    //       return 0.2;
    //     }
    //   })
    //   .text(function (d) {
    //     // const label = that.labelToResiData[that.structureIdx][d.data.name];
    //     const label = that.labelToResiData.get(d.data.name);
    //     if (label) {
    //       return label.substring(label.indexOf(":") + 1);
    //     } else {
    //       return d.data.name;
    //     }
    //   });
    //
    // // Change structure in ngl panel
    // this.nglpanel.setStructure(structureFile, labelFile, atomicContacts);
  }


}
