
/**
 * Gets the index of the value just above and just below `key` in a sorted array.
 * If the exact element was found, the two indices are identical.
 */
export function indexUpDown(key) {
  'use strict';
  let minIdx = 0;
  let maxIdx = this.length - 1;
  let curIdx, curElm;

  while (minIdx <= maxIdx) {
    curIdx = (minIdx + maxIdx) / 2 | 0;
    curElm = this[curIdx];

    if (curElm < key) minIdx = curIdx + 1;
    else if (curElm > key) maxIdx = curIdx - 1;
    else return [curIdx, curIdx];
  }

  return [minIdx, maxIdx];
}

/**
 * Get the number of entries whose value are greater than or equal to `start`
 * and lower than or equal to `end` in a sorted array
 */
export function rangeCount(start, end) {
  const startIdx = this.indexUpDown(start)[0];
  const endIdx = this.indexUpDown(end)[1];

  return endIdx - startIdx + 1;
}

// Array.prototype.indexUpDown = indexUpDown;
// Array.prototype.rangeCount = rangeCount;
