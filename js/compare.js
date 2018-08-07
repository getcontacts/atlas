import * as fp from './flareplot/flareplot.js';
import {FingerprintPanel} from "./flareplot/fingerprintpanel.js";
import { NGLPanel } from "./flareplot/nglpanel.js";
import { buildMultiFlare } from "./contact_to_flare.js";
// import * as NGL from 'https://unpkg.com/ngl@0.10.4/dist/ngl.js';


export class CompareManager {
  constructor(family, pdbIds){
    this.family = family;
    this.pdbIds = pdbIds;
    this.structureIdx = 0;
    this.curItypes = ['hbss'];
  }

  updateItypes(itypes) {
    this.curItypes = itypes;
    this.update();
  }

  updateStructure(pdbid) {
    //this.pdbIds.forEach((id, idx) => {if(pdbid==id){this.curStructure = idx;}});
    //this.update();
    this.structureIdx = this.pdbIds.indexOf(pdbid);
    const atomicContacts = this.contactsData[this.structureIdx];
    const structureFile = "static_data/" + this.family + "/structures_protonated/" + pdbid + ".pdb";
    const labelFile = "static_data/" + this.family + "/residuelabels/" + pdbid + ".tsv";
    const that = this;

    // Style fingerprint header
    const headerDiv = this.fingerprintpanel.div.select(".fp-header")
      .selectAll('.fp-headerCell')
      .style("font-weight", function(d, i) {
        return i == that.structureIdx ? "bold" : "normal";
      });

    // Update flareplot labels
    this.flareplot.vertexGroup.selectAll("g.vertex text")
      .style("opacity", function (d) {
        const label = that.labelToResiData[that.structureIdx][d.data.name];
        if (label) {
          return null;
        } else {
          return 0.2;
        }
      })
      .text(function (d) {
        const label = that.labelToResiData[that.structureIdx][d.data.name];
        if (label) {
          return label.substring(label.indexOf(":") + 1);
        } else {
          return d.data.name;
        }
      });

    // Change structure in ngl panel
    this.nglpanel.setStructure(structureFile, labelFile, atomicContacts);
  }


  update(){
    const contactFiles = this.pdbIds.map((pdb) => "static_data/"+this.family+"/contacts/" + pdb + ".tsv");
    const labelFiles = this.pdbIds.map((pdb) => "static_data/"+this.family+"/residuelabels/" + pdb + ".tsv");
    const annotationFile = "static_data/" + this.family + "/annotations.json";

    const contactFilePromises = contactFiles.map((cf) => d3.text(cf));
    const labelFilePromises = labelFiles.map((lf) => d3.text(lf));
    const annotationPromise = [d3.json(annotationFile)];
    const that = this;

    Promise.all(contactFilePromises.concat(labelFilePromises).concat(annotationPromise))
      .then(function (data) {
        // Split data into lines, lines into fields, and filter on interaction types
        that.contactsData = data
          .slice(0, contactFiles.length)
          .map(function (cd) {
            return cd.split("\n")
              .map((line) => line.split("\t"))
              .filter((row) => that.curItypes.includes(row[1]));
          });

        that.labelsData = data.slice(contactFiles.length, data.length - 1)
          .map(function (ld) {
            return ld.split("\n")
              .map((line) => line.split("\t"))
              .filter((row) => row.length >= 2)
              .reduce((acc, row) => {
                acc[row[0]] = row.slice(1);
                return acc;
              }, {});
          });
        that.labelToResiData = data.slice(contactFiles.length, data.length - 1)
          .map(function (ld) {
            return ld.split("\n")
              .map((line) => line.split("\t"))
              .filter((row) => row.length >= 2)
              .reduce((acc, row) => {
                acc[row[1].substring(row[1].lastIndexOf(".") + 1)] = row[0];
                return acc;
              }, {});
          });

        // Use annotation data to compose headers
        const annotationData = data[data.length - 1];
        const headerData = new Map();
        that.pdbIds.forEach((pdbid) => {headerData.set(pdbid, "");});
        annotationData.forEach((ann) => {
          const key = ann.pdbid + "_" + ann.chain;
          if (headerData.has(key)) {
            const header = ann['protid'].split("_")[0].toUpperCase() + ":" + ann.pdbid + ":" + ann.chain;
            headerData.set(key, header);
          }
        });
        const headers = that.pdbIds.map((pdbid) => headerData.get(pdbid));


        const graph = buildMultiFlare(that.contactsData, that.labelsData, headers);

        if (that.flareplot) {
          that.model.setGraph(graph);
          that.updateStructure(that.pdbIds[0]);
        } else {
          that.flareplot = new fp.Flareplot(graph, "auto", "#flareDiv", {

          });
          that.model = that.flareplot.getModel();
          // that.nglpanel = new NGLPanel(structureFiles[that.curStructure], that.model, "600px", "600px", "#nglDiv",
          //   {resiLabelFile: labelFiles[0]});
          that.nglpanel = new NGLPanel(that.model, "auto", "auto", "#nglDiv");
          that.fingerprintpanel = new FingerprintPanel(that.model, 23, "#fingerprintDiv");
          that.updateStructure(that.pdbIds[0]);
          that.fingerprintpanel.addHeaderClickListener(function(headerData){
            const pdb = headerData[0].split(":").slice(1).join("_");
            that.updateStructure(pdb);
          });
          that.fingerprintpanel.addRowClickListener(function(rowData){
            if (rowData.fingerprint.indexOf(that.structureIdx) == -1){
              const pdb = that.pdbIds[rowData.fingerprint[0]];
              that.updateStructure(pdb);
            }

          });
        }
      });
  }

}
