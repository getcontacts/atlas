
import { Edge, Vertex, TreeNode } from './graph.js';
import { FPValueError } from './errors.js';

export class Flaremodel {
  /**
   * Creates a flare model representing vertices, time/condition-dependent interaction and certain selections on these
   * and exposes an event model that triggers when any of these aspects change.
   *
   * @param inputGraph A flare JSON represented as either a string or an object. This object wont be stored or modified
   * in any way. It must follow the format specified at https://github.com/getcontacts/flareplot/tree/master/input
   */
  constructor(inputGraph) {
    // Modifiable set of flare properties that can be modified through setters
    this.curTree = 0;
    this.curTrack = 0;
    this.curFrameSelection = {type: 'single', frame: 0}; // See setFrames
    this.vertexFilter = function () { return true; };
    this.toggledVertices = new Set();
    this.highlightedVertices = new Set();

    // Event listeners
    this.listeners = new Map([
      ['vertexChange', []],
      ['vertexHighlight', []],
      ['vertexToggle', []],
      ['framesChange', []]
    ]);

    this.setGraph(inputGraph);
  }

  setGraph(inputGraph) {
    // Immutable set of flare properties that wont change after initialization
    this.allVertices = new Map(); // vertex-name (string) to Vertex
    this.allEdges = []; // list of Edge
    this.allTrees = []; // list of {treeLabel: string, root: TreeNode}
    this.allTracks = []; // list of {trackLabel: string, trackProps}
    this.frameInfo = undefined;
    this.lastFrame = 0;

    // Preprocess the inputGraph and populate the static properties
    if (typeof inputGraph === 'string') {
      inputGraph = JSON.parse(inputGraph);
    }

    // Create defaults, trees, and tracks if they don't exist
    const defaults = inputGraph.defaults || {};
    const edges = inputGraph.edges || [];
    const trees = inputGraph.trees || [{'treeLabel': 'default', 'treeProperties': []}];
    const tracks = inputGraph.tracks || [{'trackLabel': 'default', 'trackProperties': []}];
    const frameInfo = inputGraph.frameInfo || inputGraph.frameDict;

    // For backwards compatibility convert treePaths to treeProperties
    trees.forEach(t => {
      if (t.treePaths && t.treeProperties === undefined) {
        t.treeProperties = t.treePaths.map(tp => {
          return {'path': tp};
        });
      }
    });

    // =========== Populate allVertices =========== \\

    // Fill vertices from edges
    edges.forEach(e => {
      if (!this.allVertices.has(e.name1)) {
        this.allVertices.set(e.name1, new Vertex(e.name1));
      }
      if (!this.allVertices.has(e.name2)) {
        this.allVertices.set(e.name2, new Vertex(e.name2));
      }
    });

    // Fill vertices from trees
    trees.forEach(t => {
      t.treeProperties.forEach(p => {
        const name = p.path.substring(p.path.lastIndexOf('.') + 1);

        if (!this.allVertices.has(name)) {
          this.allVertices.set(name, new Vertex(name));
        }
      });
    });

    // Fill vertices from tracks
    tracks.forEach(t => {
      t.trackProperties.forEach(c => {
        const name = c.nodeName;

        if (!this.allVertices.has(name)) {
          this.allVertices.set(name, new Vertex(name));
        }
      });
    });

    // =========== Populate allEdges ========== \\
    edges.forEach(e => {
      const v1 = this.allVertices.get(e.name1);
      const v2 = this.allVertices.get(e.name2);
      const frames = e.frames ? e.frames.slice() : [];
      const color = e.color || defaults.edgeColor || 'black';
      const weight = e.width || defaults.edgeWidth || 2.0;

      this.allEdges.push(new Edge(v1, v2, frames, color, weight));

      if (frames.length > 0) {
        this.lastFrame = Math.max(this.lastFrame, frames[frames.length - 1]);
        if (frames[0] < 0) {
          throw new FPValueError('Edge (' + v1.name + '-' + v2.name + ') has frame (' + frames[0] + ') less than 0');
        }
      }
    });

    // =========== Populate allTrees ========== \\

    /**
     * Helper function used to connect TreeNode to children by providing dot-separated paths to leaves
     * @param nodeMap A Map associating internal node paths (e.g. 'root.n1.leaf1') to TreeNode instances
     * @param fullName Node path to add to the map
     */
    function addToMap(nodeMap, fullName) {
      const i = fullName.lastIndexOf('.');
      const name = fullName.substring(i + 1);

      if (!nodeMap.has(fullName)) {
        const node = new TreeNode(name);

        nodeMap.set(fullName, node);
        if (fullName.length) {
          const parent = addToMap(nodeMap, fullName.substring(0, i));

          parent.children.push(node);
        }
      }
      return nodeMap.get(fullName);
    }

    trees.forEach(t => {
      const addedNames = [];
      // Ensure that each tree-object has a `tree` attribute with the hierarchy
      const tree = new Map();

      t.treeProperties.forEach(p => {
        addToMap(tree, p.path);
        addedNames.push(p.path.substring(p.path.lastIndexOf('.') + 1));
      });

      // Ensure that even nodes not mentioned in the treePaths are added to the tree
      this.allVertices.forEach(v => {
        if (addedNames.indexOf(v.name) === -1) {
          addToMap(tree, v.name);
        }
      });
      this.allTrees.push({
        label: t.treeLabel,
        root: tree.get('')
      });
    });

    // =========== Populate allTracks ========== \\

    tracks.forEach(track => {
      // Ensure that nodes not mentioned in the trackProperties are created with default values
      const remainingVertices = new Set(this.allVertices.keys());
      const vertexTrackData = new Map();

      track.trackProperties.forEach(p => {
        if (!this.allVertices.has(p.nodeName)) {
          throw new FPValueError(
            'NodeName \'' + p.nodeName + '\' specified in track ' + track.trackLabel + ' not' + ' located'
          );
        }
        // const vertex = this.allVertices.get(p.nodeName);
        vertexTrackData.set(p.nodeName, {color: p.color || 'white', size: p.size || 1.0});

        remainingVertices.delete(p.nodeName);
      });

      remainingVertices.forEach(v => {
        const color = defaults.trackColor || 'white';
        const size = defaults.trackSize || 0.0;

        vertexTrackData.set(v, {color: color, size: size});
      });

      this.allTracks.push({
        label: track,
        properties: vertexTrackData
      });
    });

    // =========== Populate frameInfo ========== \\
    if (frameInfo) {
      this.frameInfo = new Map();
      if (Array.isArray(frameInfo)) {
        for (let i = 0; i < frameInfo.length; i += 1) {
          this.frameInfo.set(i, frameInfo[i]);
        }
      } else if (typeof frameInfo === 'object') {
        for (let f in frameInfo) {
          if (frameInfo.hasOwnProperty(f)) {
            if (isNaN(parseInt(f, 10))) {
              throw new FPValueError('frameDict has frame that is not an index: ' + f);
            }
            f = parseInt(f, 10);
            this.frameInfo.set(f, frameInfo[f]);
          }
        }
      }

      // Check that all frames have a corresponding entry in frameInfo
      this.allEdges.forEach(e => {
        e.frames.forEach(f => {
          if (!this.frameInfo.has(f)) {
            throw new FPValueError('Edge (' + e.v1.name + '-' + e.v2.name + ') has frame (' + f + ') with no info');
          }
        });
      });
    }

    this._fireListeners('vertexChange', this.getVertices());
    this._fireListeners('framesChange', undefined);
  }

  // ==================== getters ==================== \\

  getVertex(name) {
    const v = this.allVertices.get(name);

    if (v && this.vertexFilter(v)) {
      return v;
    }
    return undefined;
  }

  getVertices() {
    return Array.from(this.allVertices.values())
      .filter(this.vertexFilter);
  }

  getEdges() {
    return this.allEdges.filter(e => {
      return this.vertexFilter(e.v1) && this.vertexFilter(e.v2);
    });
  }

  getTree() {
    if (this.curTree < 0 || this.curTree >= this.allTrees.length) {
      throw new FPValueError(
        'Flaremodel.getTree: Current tree index (' + this.curTree + ') does not reference a tree in the model'
      );
    }

    // TODO: Create a new tree with disabled vertices pruned
    return this.allTrees[this.curTree];
  }

  /**
   * Returns the current track. Each track is an object that associates vertex-names with color and size properties.
   * @returns {label: string, properties: Map[key: string, value: {color: string, size: number}]}
   */
  getTrack() {
    if (this.curTrack < 0 || this.curTrack >= this.allTracks.length) {
      throw new FPValueError(
        'Flaremodel.getTrack: Current track index (' + this.curTrack + ') does not reference a track in the model'
      );
    }

    // TODO: Create a new track with disabled vertices pruned
    return this.allTracks[this.curTrack];
  }

  vertexToggled(vertexName) {
    return this.toggledVertices.has(vertexName);
  }

  getToggledVertices() {
    return Array.from(this.toggledVertices.keys());
  }

  isMultiFlare() {
    return this.frameInfo !== undefined;
  }

  getFrameName(f) {
    return this.frameInfo.get(f);
  }

  getNumFrames() {
    return this.lastFrame + 1;
  }

  /** Count the number of that are active in this edge given the current frame selection */
  frameCount(edge) {
    switch (this.curFrameSelection.type) {
      case 'single':
        return edge.frames.indexOf(this.curFrameSelection.frame) >= 0 ? 1 : 0;
      case 'range':
        return edge.frames.rangeCount(this.curFrameSelection.begin, this.curFrameSelection.end);
      case 'intersect-subtract':
        // Return 0 if any frame is in E
        const E = this.curFrameSelection.subtract || [];
        const I = this.curFrameSelection.intersect;
        const allInIntersect = I.every(f => edge.frames.indexOf(f) >= 0);
        const anyInExclude = E.some(f => edge.frames.indexOf(f) >= 0);

        if (allInIntersect && !anyInExclude) {
          return 1;
        }
        return 0;
      default:
        throw new FPValueError(
          'Flaremodel.frameCount: Invalid frame selection: \'' + this.curFrameSelection.type + '\''
        );
    }
  }

  // ==================== setters ==================== \\

  /**
   * Set the active frame selection.
   * @param frameSelection An object indicating a set of frames and the type of operation to perform on them.
   * Must follow either of these formats:
   *     { type: 'single', frame: <int> }
   *     { type: 'range', begin: <int>, end: <int> }
   *     { type: 'intersect-subtract', intersect: <list of int>, subtract: <list of int> }
   */
  setFrames(frameSelection) {
    this.curFrameSelection = frameSelection;

    // Fire framesChange listeners without any data
    this._fireListeners('framesChange', undefined);
  }

  /**
   * Toggle highlighting for vertex
   * @param vertex The vertex to affect
   * @param highlighted A boolean indicating whether highlighting is on or off
   */
  setVertexHighlighted(vertex, highlighted) {
    if (highlighted) {
      this.highlightedVertices.add(vertex);
    } else if (this.highlightedVertices.has(vertex)) {
      this.highlightedVertices.delete(vertex);
    }

    this._fireListeners('vertexHighlight', Array.from(this.highlightedVertices));
  }

  /**
   * Set vertex toggle status
   * @param vertex The vertex to affect
   * @param toggled A boolean indicating whether toggling is on or off
   */
  setVertexToggled(vertex, toggled) {
    if (toggled && this.allVertices.has(vertex)) {
      this.toggledVertices.add(vertex);
    } else {
      this.toggledVertices.delete(vertex);
    }

    this._fireListeners('vertexToggle', Array.from(this.toggledVertices));
  }

  setVertexFilter(filter) {
    const isFunction = (filter && {}.toString.call(filter) === '[object Function]');

    if (isFunction(filter)) {
      this.vertexFilter = filter;
    }

    this._fireListeners('vertexChange', this.getVertices());
  }

  setTree(treeIdx) {
    if (treeIdx < 0 || treeIdx >= this.allTrees.length) {
      throw new FPValueError(
        'Flaremodel.setTree: Tree index (' + treeIdx + ') is not in the range of valid trees (0-' +
        (this.allTrees.length - 1) + ')'
      );
    }

    this.curTree = treeIdx;
    this._fireListeners('vertexChange', this.getVertices());
  }

  // ==================== Event listeners ==================== \\

  _addListener(listenerType, listener) {
    if (typeof listener.fire === 'function' && this.listeners.has(listenerType)) {
      this.listeners.get(listenerType).push(listener);
    }
  }

  _fireListeners(listenerType, data) {
    this.listeners.get(listenerType).forEach(function (l) {
      l.fire({type: listenerType, data: data});
    });
  }

  addVertexChangeListener(l) {
    this._addListener('vertexChange', l);
  }

  addHighlightListener(l) {
    this._addListener('vertexHighlight', l);
  }

  addToggleListener(l) {
    this._addListener('vertexToggle', l);
  }

  addFrameListener(l) {
    this._addListener('framesChange', l);
  }
}

