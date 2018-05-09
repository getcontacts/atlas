import * as fp from './flareplot/flareplot.js';

function buildMultiFlareGraph(contacts, labels){

  console.log('buildMultiFlareGraph');
  console.log(contacts)
  console.log(labels)

  const ret = {
    edges : [],
    trees: []
  };

  const tree = {
    treeLabel: "default",
    treeProperties: []
  };
  ret.trees.push(tree);

  // Build tree
  const paths = new Set();
  labels.forEach(function(labelList){
    labelList.forEach(function(label){
      if (!paths.has(label[1])){
        paths.add(label[1]);
        tree.treeProperties.push({path: label[1]})
      }
    })
  });


  return ret;
}



export function update(contactFiles, labelFiles, itypes) {
  const contactFilePromises = contactFiles.map((cf) => d3.text(cf));
  const labelFilePromises = labelFiles.map((lf) => d3.text(lf));

  Promise.all(contactFilePromises.concat(labelFilePromises))
    .then(function (data) {
      let contactsData = data.slice(0, contactFiles.length);

      // Split data into lines, lines into fields, and filter on interaction types
      contactsData = contactsData.map(function(cd){
        // return cd.split("\n");
        return cd.split("\n")
          .map((line) => line.split("\t"))
          .filter((row)=>itypes.includes(row[1]));
      });

      let labelsData = data.slice(contactFiles.length);
      labelsData = labelsData.map(function(ld){
        return ld.split("\n")
          .map((line) => line.split("\t"))
          .filter((row) => row.length >= 2);
      });

      const graph = buildMultiFlareGraph(contactsData, labelsData);
      console.log(graph);

    });

  // flareplot = new fp.Flareplot(graph, 300, "#flareplotcontainer");
}
