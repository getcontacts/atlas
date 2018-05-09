import * as fp from './flareplot/flareplot.js';

function buildMultiFlareGraph(contacts, labels){

  const ret = {
    edges : [],
  }
}



export function update(contactFiles, labelFiles, itypes) {
  const contactFilePromises = contactFiles.map((cf) => d3.text(cf));
  const labelFilePromises = labelFiles.map((lf) => d3.text(lf));

  Promise.all(contactFilePromises.concat(labelFilePromises))
    .then(function (data) {
      let contactsData = data.slice(0, contactFiles.length);

      console.log(contactFiles);
      // Split data into lines, lines into fields, and filter on interaction types
      contactsData = contactsData.map(function(cd){
        // return cd.split("\n");
        return cd.split("\n")
          .map((line) => line.split("\t"))
          .filter((row)=>itypes.includes(row[1]));
      });
      console.log(contactsData);

      let labelsData = data.slice(contactFiles.length);
      labelsData =

      const graph = buildMultiFlareGraph(contactsData);
      console.log(graph);

    });

  // flareplot = new fp.Flareplot(graph, 300, "#flareplotcontainer");
}
