/**
 * Build a multi-flare graph from a set of contacts.
 * @param {string[][]} contacts - List of contacts. Each contact is an array of strings of length at least 4
 * @param {Map{string:[string]}[]} labels -
 * @param {string[]} conditions - Names for conditions used in the frameDict
 * @returns {{edges: Array, trees: Array, tracks: Array, frameDict: {}}}
 */
export function buildMultiFlare(contacts, labels, conditions){
  // console.log('buildMultiFlare')
  // console.log(contacts)
  // console.log(labels)
  // console.log(conditions)
  // Number of contacts
  const n = contacts.length;

  // Graph with stub fields
  const ret = {
    edges : [],
    trees: [{treeLabel: "default", treeProperties: []}],
    tracks: [{trackLabel: "default", trackProperties: []}],
    frameDict: {},
    defaults: {edgeWidth: 4}
  };

  // Build tree
  const tree = ret.trees[0];
  const paths = new Set();
  labels.forEach(function(labelDict){
    labelDict.forEach((val) => {
      const labelVal = val[0];
      if (!paths.has(labelVal)){
        paths.add(labelVal);
        tree.treeProperties.push({path: labelVal})
      }
    });
  });

  // Build track
  const track = ret.tracks[0];
  labels.forEach(function(labelDict){
    labelDict.forEach((val) => {
      let label = val[0];
      label = label.substr(label.lastIndexOf(".") + 1);
      const labelCol = val[1];
      track.trackProperties.push({nodeName: label, color: labelCol, size: 1.0});
    });
  });

  // Build frameDict
  const frameDict = ret.frameDict;
  conditions.forEach((cond, i) => frameDict[""+i] = cond);

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
      let n1 = labels[i].get(resi1);
      let n2 = labels[i].get(resi2);
      if (n1 !== undefined && n2 !== undefined) {
        n1 = n1[0].substring(n1[0].lastIndexOf(".")+1);
        n2 = n2[0].substring(n2[0].lastIndexOf(".")+1);
        const edge = findEdge(n1, n2);
        if(edge.frames.indexOf(i) < 0) {
          edge.frames.push(i);
        }
      }
    });
  }

  return ret;
}
