
// import * as d3 from '../../vendor/d3v5.2/d3.js';

export class FingerprintPanel {
  /**
   *
   * @param flareModel
   * @param cellWidth
   * @param containerSelector
   */
  constructor(flareModel, cellWidth, containerSelector) {
    this.flareModel = flareModel;
    this.cellWidth = cellWidth;
    // this.clickListeners = [];
    this.headerClickListeners = [];
    this.div = d3.select(containerSelector).append('div');

    this.numCols = flareModel.getNumFrames();

    this._updateHeaders();
    this._createBody();

    this.flareModel.addVertexChangeListener(this);
  }

  fire(event) {
    // console.log(event);
    if(event.type === 'vertexChange') {
      this._updateBody();
    }
  }

  _updateHeaders() {
    // ------------- Initialize panel header -------------
    const cellWidth = this.cellWidth;
    const headerAngle = -50;
    const numCols = this.numCols;

    this.colHeaders = [];
    for (let f = 0; f < numCols; f += 1) {
      this.colHeaders[f] = this.flareModel.getFrameName(f);
    }

    const headerDiv = this.div.append('div')
      .classed('fp-header', true)
      .style('position', 'relative');

    const headerCells = headerDiv
      .selectAll('.fp-headerCell')
      .data(this.colHeaders)
      .enter()
      .append('div')
      .classed('fp-headerCell', true)
      .style('line-height', cellWidth + 'px')
      .style('position', 'absolute')
      .style('bottom', '0px')
      .style('white-space', 'nowrap')
      .style('user-select', 'none')
      .style('overflow-y', 'visible')
      .style('vertical-align', 'middle')
      .style('transform', 'rotate(' + headerAngle + 'deg)')
      .style('left', '50%')
      .style('margin-left', function (d, i) {
        return ((i - numCols / 2) * cellWidth) + 'px';
      })
      .text(function (d) {
        return d;
      })
      .on("click", (d) => {
        this.fireHeaderClickListeners(d);
      });

    // Cell width hasn't been set yet, so will represent the width of the text. Compute the max width
    // const maxHeaderCellWidth = d3.max(d3.merge(headerCells), c => c.clientWidth);  // d3 v3
    const maxHeaderCellWidth = d3.max(headerCells.nodes(), c => c.clientWidth);  // d3 v4
    headerCells.style('width', cellWidth + 'px');

    // Use the max text width and header rotation angle to compute and set the real height of the header
    const headerHeight = Math.sin(Math.abs(headerAngle) * Math.PI / 180) * maxHeaderCellWidth;
    headerDiv.style('height', headerHeight + 'px');
  }

  _createBody() {
    const cellWidth = this.cellWidth;

    // Scrollable body
    this.bodyDiv = this.div.append('div')
      .classed('fp-body', true)
      .style('position', 'relative')
      .style('height', (cellWidth * 5.5) + 'px')
      .style('overflow-y', 'auto');

    this._updateBody();
  }

  _updateBody() {
    // console.log("_updateBody")
    // ------------- Initialize panel body -------------
    const fingerprints = FingerprintPanel.computeFingerprints(this.flareModel);
    const cellWidth = this.cellWidth;
    const numCols = this.numCols;
    const activeRowBorderWidth = 2;
    const that = this;


    // The rows are duplicated in 2 layers because of how css positions things with/without border.
    // The bottom layer (z-index -1) are used to display dividers (border-bottom)
    // The top layer rows contain the actual cells
    this.bodyDiv.selectAll('.fp-row-bottom').remove();
    this.bodyDiv.selectAll('.fp-row-bottom')
      .data(fingerprints)
      .append('div')
      .attr('class', 'fp-row-bottom')
      .style('position', 'absolute')
      .style('z-index', '-1')
      .style('width', (numCols * cellWidth) + 'px')
      .style('height', cellWidth + 'px')
      .style('top', function (d, i) { return (activeRowBorderWidth + i * cellWidth) + 'px'; })
      .style('left', '50%')
      .style('border-bottom', '1px solid #DDD')
      .style('margin-left', -(numCols * cellWidth / 2) + 'px');

    this.bodyDiv.selectAll('.fp-row').remove();
    const rows = this.bodyDiv.selectAll('.fp-row')
      .data(fingerprints)
      .enter()
      .append('div')
      .attr('class', 'fp-row')
      .style('position', 'absolute')
      .style('box-sizing', 'content-box')
      .style('width', (numCols * cellWidth) + 'px')
      .style('height', cellWidth + 'px')
      .style('top', function (d, i) { return (activeRowBorderWidth + i * cellWidth) + 'px'; })
      .style('left', '50%')
      .style('border-radius', '3px')
      .style('border-color', '#bcc1dd')
      .style('border-width', activeRowBorderWidth + 'px')
      .style('margin-left', -(numCols * cellWidth / 2) + 'px')
      .on('mouseover', function () {
        d3.select(this).style('border-style', 'solid')
          .style('margin-top', '-' + activeRowBorderWidth + 'px')
          .style('margin-left', -(activeRowBorderWidth + numCols * cellWidth / 2) + 'px');
      })
      .on('mouseout', function (d) {
        if (!d.clicked) {
          d3.select(this).style('border-style', 'none')
            .style('margin-top', '0px')
            .style('margin-left', -(numCols * cellWidth / 2) + 'px');
        }
      })
      .on('click', function (d) {
        // Reset existing
        fingerprints.forEach(function (fp) {
          if (fp.clicked) {
            delete fp.clicked;
          }
        });
        rows.each(function () {
          d3.select(this).style('border-style', 'none')
            .style('margin-top', '0px')
            .style('margin-left', -(numCols * cellWidth / 2) + 'px');
        });

        d.clicked = true;
        d3.select(this).style('border-style', 'solid')
          .style('margin-top', '-' + activeRowBorderWidth + 'px')
          .style('margin-left', -(activeRowBorderWidth + numCols * cellWidth / 2) + 'px');

        const included = d.fingerprint;
        const excluded = [...Array(numCols).keys()].filter(v => included.indexOf(v) < 0);

        that.flareModel.setFrames({type: 'intersect-subtract', intersect: included, subtract: excluded});
      });


    // Place cells
    this.bodyDiv.selectAll('.fp-row')
      .each(function (rd, ri) {
      // For each row generate numCols data entries and set their content based on the fingerpring
      const rowData = new Array(numCols)
        .fill({})
        .map(function (v, i) {
          let included = false;
          let symbol = '-';

          if (rd.fingerprint.indexOf(i) >= 0) {
            included = true;
            symbol = '+';
          }

          return {
            included: included,
            symbol: symbol,
            rowData: rd,
            colIdx: i,
            rowIdx: ri,
            colHeader: that.colHeaders[i]
          };
        });

      // Add cell divs to the row
      d3.select(this).selectAll('.fp-cell')
        .data(rowData).enter()
        .append('div')
        .classed('fp-cell', true)
        .classed('fp-cell-active', function (d) { return d.included; })
        .classed('fp-cell-inactive', function (d) { return !d.included; })
        .style('position', 'absolute')
        .style('width', cellWidth + 'px')
        .style('height', cellWidth + 'px')
        .style('line-height', cellWidth + 'px')
        .style('user-select', 'none')
        .style('top', '0px')
        .style('left', function (d, i) { return (cellWidth * i) + 'px'; })
        .style('text-align', 'center')
        .style('vertical-align', 'middle')
        .text(function (d) { return d.symbol; })
        .style('cursor', 'pointer');
    });
  }

  /**
   * Computes fingerprints and sorts them by their frequency.
   * A fingerprint is an ordered list of distinct integers (corresponding to the frames section of an edge). This
   * function determines how many unique such lists there are and for each distinct list indicates how many times
   * it occurs. For example:
   *     computeFingerprints( {
   *       edges: [
   *         {frames: [0,1,3]},
   *         {frames: [1,2]},
   *         {frames: [0,1,3]}
   *       ])
   *       // Returns [ {count: 2, fingerprint: [0,1,3]}, {count: 1, fingerprint: [1,2]} ]
   */
  static computeFingerprints(flareModel) {
    // For simplicity, convert fingerprints to comma-separated string and use a dict to look up duplicates
    const retDict = new Map();

    // Go through edges and add to retDict
    flareModel.getEdges().forEach(function (edge) {
      const fpString = edge.frames + '';

      if (retDict.has(fpString)) {
        retDict.get(fpString).count += 1;
      } else {
        retDict.set(fpString, {count: 1, fingerprint: edge.frames.slice()});
      }
    });

    // Remove the keys from retDict
    const ret = Array.from(retDict.values());

    // Sort by count
    ret.sort((a, b) => b.count - a.count);

    return ret;
  }

  addHeaderClickListener(cl) {
    // Check if cl is a function
    if(cl && {}.toString.call(cl) === '[object Function]') {
      this.headerClickListeners.push(cl);
    }
  }

  fireHeaderClickListeners(data) {
    this.headerClickListeners.forEach(function (cl) {
      cl(data);
    });
  }

}
