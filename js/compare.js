import * as fp from './flareplot/flareplot.js';

function buildMultiFlareGraph(contacts, labels){

  console.log('buildMultiFlareGraph');
  console.log(contacts)
  console.log(labels)
  const n = contacts.length;

  const ret = {
    edges : [],
    trees: [{treeLabel: "default", treeProperties: []}],
    tracks: [{trackLabel: "default", trackProperties: []}]
  };

  // Build tree
  const tree = ret.trees[0];
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

  // Build track
  const track = ret.tracks[0];
  labels.forEach(function(labelDict){
    for (const labelKey in labelDict){
      let labelVal = labelDict[labelKey][0];
      labelVal = labelVal.substr(labelVal.lastIndexOf(".")+1);
      const labelCol = labelDict[labelKey][1];
      track.trackProperties.push({nodeName: labelVal, color: labelCol, size: 1.0});
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
      let n1 = labels[i][resi1];
      let n2 = labels[i][resi2];
      if (n1 !== undefined && n2 !== undefined) {
        n1 = n1[0].substring(n1[0].lastIndexOf(".")+1);
        n2 = n2[0].substring(n2[0].lastIndexOf(".")+1);
        const edge = findEdge(n1, n2);
        edge.frames.push(i);
      }
    });
  }

  return ret;
}



export function update(pdbIds, itypes) {
  // console.log('update')
  // console.log(pdbIds);
  // console.log(itypes);
  const contactFiles = pdbIds.map((pdb) => "static_data/gpcr/contacts/"+pdb+".tsv");
  const labelFiles = pdbIds.map((pdb) => "static_data/gpcr/residuelabels/"+pdb+".tsv");
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

      if (window.flareplot) {
        window.flareplot.getModel().setGraph(graph);
      } else {
        window.flareplot = new fp.Flareplot(graph, 600, "#flareDiv");
      }
    });

}
