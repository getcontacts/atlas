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
  }

  update(){
    const contactFiles = this.pdbIds.map((pdb) => "static_data/"+this.family+"/contacts/" + pdb + ".tsv");
    const labelFiles = this.pdbIds.map((pdb) => "static_data/"+this.family+"/residuelabels/" + pdb + ".tsv");
    const structureFiles = this.pdbIds.map((pdb) => "static_data/"+this.family+"/structures_protonated/" + pdb + ".pdb");
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

        let labelsData = data.slice(contactFiles.length);
        labelsData = labelsData.map(function (ld) {
          return ld.split("\n")
            .map((line) => line.split("\t"))
            .filter((row) => row.length >= 2)
            .reduce((acc, row) => {
              acc[row[0]] = row.slice(1);
              return acc;
            }, {});
        });

        const graph = buildMultiFlare(that.contactsData, labelsData, that.pdbIds);

        if (that.flareplot) {
          that.model.setGraph(graph);
        } else {
          that.flareplot = new fp.Flareplot(graph, 600, "#flareDiv");
          that.model = that.flareplot.getModel();
          that.nglpanel = new NGLPanel(structureFiles[that.curStructure], that.model, "600px", "600px", "#nglDiv",
            {resiLabelFile: labelFiles[0]});
          that.fingerprintpanel = new FingerprintPanel(that.model, 23, "#fingerprintDiv");
          that.fingerprintpanel.addHeaderClickListener(function(pdbId){
            that.updateStructure(pdbId);
          })

        }
      });
  }

}
