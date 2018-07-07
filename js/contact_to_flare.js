/**
 * Build a multi-flare graph from a set of contacts.
 * @param {string[][]} contacts - List of contacts. Each contact is an array of strings of length at least 4
 * @param {string[][]} labels - List of residue labels. Each entry is an array of 2-3 strings
 * @param {string[]} conditions - Names for conditions used in the frameDict
 * @returns {{edges: Array, trees: Array, tracks: Array, frameDict: {}}}
 */
export function buildMultiFlare(contacts, labels, conditions){
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
      let n1 = labels[i][resi1];
      let n2 = labels[i][resi2];
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
