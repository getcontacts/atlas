import * as fp from './flareplot/flareplot.js';
import {FingerprintPanel} from "./flareplot/fingerprintpanel.js";
import { NGLPanel } from "./flareplot/nglpanel.js";
import { buildMultiFlare } from "./contact_to_flare.js";
// import * as NGL from 'https://unpkg.com/ngl@0.10.4/dist/ngl.js';


export class CompareManager {
  constructor(family, pdbIds){
    this.family = family;
    this.pdbIds = pdbIds;
  }

  update(itypes) {
    const contactFiles = this.pdbIds.map((pdb) => "static_data/"+this.family+"/contacts/" + pdb + ".tsv");
    const labelFiles = this.pdbIds.map((pdb) => "static_data/"+this.family+"/residuelabels/" + pdb + ".tsv");
    const structureFiles = this.pdbIds.map((pdb) => "static_data/"+this.family+"/structures/" + pdb + ".pdb");
    const contactFilePromises = contactFiles.map((cf) => d3.text(cf));
    const labelFilePromises = labelFiles.map((lf) => d3.text(lf));
    const that = this;

    Promise.all(contactFilePromises.concat(labelFilePromises))
      .then(function (data) {
        let contactsData = data.slice(0, contactFiles.length);

        // Split data into lines, lines into fields, and filter on interaction types
        contactsData = contactsData.map(function (cd) {
          // return cd.split("\n");
          return cd.split("\n")
            .map((line) => line.split("\t"))
            .filter((row) => itypes.includes(row[1]));
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

        const graph = buildMultiFlare(contactsData, labelsData, that.pdbIds);

        if (that.flareplot) {
          that.model.setGraph(graph);
        } else {
          that.flareplot = new fp.Flareplot(graph, 600, "#flareDiv");
          console.log(that.flareplot);
          that.model = that.flareplot.getModel();
          that.fingerprintpanel = new FingerprintPanel(that.model, 23, "#fingerprintDiv");
          that.nglpanel = new NGLPanel(structureFiles[0], that.model, "600px", "600px", "#nglDiv",
            {resiLabelFile: labelFiles[0]});
        }
      });
  }
}
