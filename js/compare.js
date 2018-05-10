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

  const n = contacts.length;

  // Build tree
  const paths = new Set();
  labels.forEach(function(labelDict){
    for (const labelKey in labelDict){
      const labelVal = labelDict[labelKey][0];
      if (!paths.has(labelVal)){
        paths.add(labelVal);
        tree.treeProperties.push({path: labelVal})
      }
    }
  });

  // Helper function to find and create edges by [name1, name2] identifier
  function findEdge(n1, n2){
    if (n2 < n1){
      // Swap
      const tmpN = n2;
      n2 = n1;
      n1 = tmpN;
    }

    for (let e = 0; e < ret.edges.length; e += 1){
      if (ret.edges[e].name1 == n1 && ret.edges[e].name2 == n2){
        return ret.edges[e];
      }
    }
    const edge = {name1: n1, name2: n2, frames: []};
    ret.edges.push(edge);
    return edge;
  }

  for (let i=0; i < n; i += 1){
    contacts[i].forEach(function(contact){
      const resi1 = contact[2].substr(0,contact[2].lastIndexOf(":"));
      const resi2 = contact[3].substr(0,contact[3].lastIndexOf(":"));
      const n1 = labels[i][resi1];
      const n2 = labels[i][resi2];
      const edge = findEdge(n1, n2);
      edge.frames.push(i);
    });
  }


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
          .filter((row) => row.length >= 2)
          .reduce((acc, row) => {acc[row[0]] = row.slice(1); return acc;}, {});
      });

      const graph = buildMultiFlareGraph(contactsData, labelsData);
      console.log(graph);

    });

  // flareplot = new fp.Flareplot(graph, 300, "#flareplotcontainer");
}
