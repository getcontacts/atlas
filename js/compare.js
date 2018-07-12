import * as fp from './flareplot/flareplot.js';
import {FingerprintPanel} from "./flareplot/fingerprintpanel.js";
import { NGLPanel } from "./flareplot/nglpanel.js";
import { buildMultiFlare } from "./contact_to_flare.js";
// import * as NGL from 'https://unpkg.com/ngl@0.10.4/dist/ngl.js';


export class CompareManager {
  constructor(family, pdbIds){
    this.family = family;
    this.pdbIds = pdbIds;
    this.curStructure = 0;
    this.curItypes = ['hbss'];
  }

  updateItypes(itypes) {
    this.curItypes = itypes;
    this.update();
  }

  updateStructure(pdbid) {
    //this.pdbIds.forEach((id, idx) => {if(pdbid==id){this.curStructure = idx;}});
    //this.update();
    const structureIdx = this.pdbIds.indexOf(pdbid);
    const atomicContacts = this.contactsData[structureIdx];
    const structureFile = "static_data/" + this.family + "/structures_protonated/" + pdbid + ".pdb";
    const labelFile = "static_data/" + this.family + "/residuelabels/" + pdbid + ".tsv";
    this.nglpanel.setStructure(structureFile, labelFile, atomicContacts);

    const that = this;
    this.flareplot.vertexGroup.selectAll("g.vertex text")
      .text(function (d) {
        const label = that.labelToResiData[structureIdx][d.data.name];
        if (label) {
          return label.substring(label.indexOf(":") + 1);
        } else {
          return d.data.name;
        }
      });
  }


  update(){
    const contactFiles = this.pdbIds.map((pdb) => "static_data/"+this.family+"/contacts/" + pdb + ".tsv");
    const labelFiles = this.pdbIds.map((pdb) => "static_data/"+this.family+"/residuelabels/" + pdb + ".tsv");
    // const structureFiles = this.pdbIds.map((pdb) => "static_data/"+this.family+"/structures_protonated/" + pdb + ".pdb");
    const contactFilePromises = contactFiles.map((cf) => d3.text(cf));
    const labelFilePromises = labelFiles.map((lf) => d3.text(lf));
    const that = this;

    Promise.all(contactFilePromises.concat(labelFilePromises))
      .then(function (data) {
        // Split data into lines, lines into fields, and filter on interaction types
        that.contactsData = data
          .slice(0, contactFiles.length)
          .map(function (cd) {
            return cd.split("\n")
              .map((line) => line.split("\t"))
              .filter((row) => that.curItypes.includes(row[1]));
          });

        that.labelsData = data.slice(contactFiles.length)
          .map(function (ld) {
            return ld.split("\n")
              .map((line) => line.split("\t"))
              .filter((row) => row.length >= 2)
              .reduce((acc, row) => {
                acc[row[0]] = row.slice(1);
                return acc;
              }, {});
          });
        that.labelToResiData = data.slice(contactFiles.length)
          .map(function (ld) {
            return ld.split("\n")
              .map((line) => line.split("\t"))
              .filter((row) => row.length >= 2)
              .reduce((acc, row) => {
                acc[row[1].substring(row[1].lastIndexOf(".") + 1)] = row[0];
                return acc;
              }, {});
          });

        const graph = buildMultiFlare(that.contactsData, that.labelsData, that.pdbIds);

        if (that.flareplot) {
          that.model.setGraph(graph);
        } else {
          that.flareplot = new fp.Flareplot(graph, "auto", "#flareDiv", {

          });
          that.model = that.flareplot.getModel();
          // that.nglpanel = new NGLPanel(structureFiles[that.curStructure], that.model, "600px", "600px", "#nglDiv",
          //   {resiLabelFile: labelFiles[0]});
          that.nglpanel = new NGLPanel(that.model, "auto", "auto", "#nglDiv");
          that.fingerprintpanel = new FingerprintPanel(that.model, 23, "#fingerprintDiv");
          that.updateStructure(that.pdbIds[0]);
          that.fingerprintpanel.addHeaderClickListener(function(pdbId){
            that.updateStructure(pdbId);
          })

        }
      });
  }

}
