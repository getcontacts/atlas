
import { indexUpDown, rangeCount } from './utils.js';

export class Vertex extends Object {
  /**
   * Vertex constructor which sets the name and an empty list of adjacent edges.
   * @param name A string representing this vertex' unique name
   */
  constructor(name) {
    super();
    this.name = name;
    this.edges = [];
  }
}

export class Edge {
  /**
   * Edge constructor which sets source and target vertices, color, weight and frames in which the edge lives.
   * @param v1 Source vertex. Must be in allVertices
   * @param v2 Target vertex. Must be in allVertices
   * @param frames List of ints representing frames in which this edge is present
   * @param color String representing a CSS-compatible color
   * @param weight Scaling factor for this edge
   * @constructor
   */
  constructor(v1, v2, frames, color, weight) {
    this.v1 = v1;
    this.v2 = v2;
    this.color = color;
    this.weight = weight;

    this.frames = frames;
    this.frames.indexUpDown = indexUpDown;
    this.frames.rangeCount = rangeCount;

    this.v1.edges.push(this);
    this.v2.edges.push(this);
  }

  opposite(v) {
    if (this.v1 === v) {
      return this.v2;
    }
    if (this.v2 === v) {
      return this.v1;
    }
    return undefined;
  }
}

export class TreeNode {
  constructor(name) {
    this.name = name;
    this.children = [];
  }
}

