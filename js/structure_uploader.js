
var uploadManager;
var uploadedStructures;

/**
 * ...
 *
 * Three files should be uploaded; an interaction file from the GetContacts package,
 * a residue label file, and a PDB-file. On succesful upload of all three, the files
 * will be validated for syntax (not content integrety) and returned as a list in the
 * argument of the `resolve` function.
 */
function createUserUpload(containerSelector) {
  uploadManager = new UploadManager(containerSelector);
}


class UploadManager {
  constructor(containerSelector) {
    // populateSessionStorageWithDummyData();
    this._createUserUpload(containerSelector);
    this._createUserTable(containerSelector);

    this.uploadedFiles = {
      'pdb': null,
      'contact': null,
      'label': null
    };
  }

  _createUserUpload(containerSelector) {
    const that = this;
    d3.select(containerSelector).append("div")
      .style("text-align", "center")
      .append("h3")
      .text("Add your own (files are not stored on server!)");

    const table = d3.select(containerSelector).append("table");

    const headRow = table.append("thead").append("tr");
    headRow.append("th");
    headRow.append("th").text("Name");
    headRow.append("th").text("Contact-file");
    headRow.append("th").text("Label-file");
    headRow.append("th").text("PDB-file");
    headRow.append("th");
    headRow.append("th");

    this.tbody = table.append("tbody");
    const trow = this.tbody.append("tr");
    trow.append("td");
    trow.append("td")
      .append("input")
      .attr("id", "nameInput")
      .attr("value", "")
      .attr("type", "text");

    let td = trow.append("td").style("position", "relative")
    td.append("input")
      .attr("id", "contactInput")
      .attr("type", "file")
      .style("position", "absolute")
      .style("opacity", 0)
      .style("width", "100%")
      .style("height", "100%")
      .on("change", function() {
        that._fileUploadInitiated("contact", this.files[0]);
      });
    // td.append("label")
    //   .attr("for", "contactDummyInput")
    //   .text("Contact-file: ");
    td.append("i")
      .attr("id", "contactDummyIcon")
      .style("position", "absolute")
      .style("right", "1rem")
      .style("top", "50%")
      .style("margin-top", "-0.5em")
      .style("opacity", 0.2)
      .attr("class", "fas fa-upload");
    td.append("input")
      .attr("id", "contactDummyInput")
      .on("focus", function(){this.blur();})
      .attr("type", "text");

    td = trow.append("td").style("position", "relative");
    td.append("input")
      .attr("id", "labelInput")
      .attr("type", "file")
      .style("position", "absolute")
      .style("opacity", 0)
      .style("width", "100%")
      .style("height", "100%")
      .on("change", function() {
        that._fileUploadInitiated("label", this.files[0]);
      });
    // td.append("label")
    //   .attr("for", "labelDummyInput")
    //   .text("Label-file: ");
    td.append("i")
      .attr("id", "labelDummyIcon")
      .style("position", "absolute")
      .style("right", "1rem")
      .style("top", "50%")
      .style("margin-top", "-0.5em")
      .style("opacity", 0.2)
      .attr("class", "fas fa-upload");
    td.append("input")
      .attr("id", "labelDummyInput")
      .on("focus", function(){this.blur();})
      .attr("type", "text");

    td = trow.append("td").style("position", "relative");
    td.append("input")
      .attr("id", "pdbInput")
      .attr("type", "file")
      .style("position", "absolute")
      .style("opacity", 0)
      .style("width", "100%")
      .style("height", "100%")
      .on("change", function () {
        that._fileUploadInitiated("pdb", this.files[0]);
      });
    // td.append("label")
    //   .attr("for", "pdbDummyInput")
    //   .text("PDB-file: ");
    td.append("i")
      .attr("id", "pdbDummyIcon")
      .style("position", "absolute")
      .style("right", "1rem")
      .style("top", "50%")
      .style("margin-top", "-0.5em")
      .style("opacity", 0.2)
      .attr("class", "fas fa-upload");
    td.append("input")
      .attr("id", "pdbDummyInput")
      .on("focus", function(){this.blur();})
      .attr("type", "text");

    trow.append("td")
      .attr("colspan", 2)
      .append("div")
      .attr("id", "upload-button")
      .classed("btn", true)
      .classed("btn-upload", true)
      .classed("btn-upload-inactive", true)
      .text("Add")
      .on("click", function () {
        that._addToTable();
      });

    // d3.select(containerSelector)
    //   .append("div")
    //   .style("position", "relative")
    //   .append("div")
    //   .attr("id", "upload-button")
    //   .classed("btn", true)
    //   .classed("btn-upload", true)
    //   .classed("btn-upload-inactive", true)
    //   .text("Add to table")
    //   .on("click", function () {
    //     that._addToTable();
    //   });
  }

  _createUserTable(containerSelector) {
    // const table = d3.select(containerSelector).append("table");

    // this.tbody = table.append("tbody");
    // console.log(this.tbody.node());
    this._reloadTableFromSessionStorage();
  }

  _reloadTableFromSessionStorage() {
    const structures = this._getTableDataFromSessionStorage();
    uploadedStructures = structures;
    const rows = this.tbody.selectAll("tr.contentRow").data(structures, d => d.name);

    rows.select("td:nth-of-type(2)")
      .html(function (d) {
        return d.contactFileName;
      });
    rows.select("td:nth-of-type(3)")
      .html(function (d) {
        return d.labelFileName;
      });
    rows.select("td:nth-of-type(4)")
      .html(function (d) {
        return d.pdbFileName;
      });

    const newRows = rows
      .enter()
      .append("tr")
      .classed("contentRow", true)
      .style("cursor", "pointer")
      .on("click", function (d) {
        const checkInput = d3.select(this).select("input");
        const currentlyChecked = checkInput.property("checked");
        d.selected = !currentlyChecked;
        checkInput.property("checked", !currentlyChecked);
        const numExistingChecked = existingStructures.reduce((acc, s) => acc + (s.selected ? 1 : 0), 0);
        const numUploadedChecked = uploadedStructures.reduce((acc, s) => acc + (s.selected ? 1 : 0), 0);
        const numChecked = numExistingChecked + numUploadedChecked;
        d3.select("#compare-button").classed("btn-compare-inactive", numChecked == 0);
      });

    newRows.append("td").append("input").attr("type", "checkbox")
      .on("click", function () {
        d3.event.stopPropagation();
      })
      .on("change", function (d) {
        d.selected = this.checked;
        const numExistingChecked = existingStructures.reduce((acc, s) => acc + (s.selected ? 1 : 0), 0);
        const numUploadedChecked = uploadedStructures.reduce((acc, s) => acc + (s.selected ? 1 : 0), 0);
        const numChecked = numExistingChecked + numUploadedChecked;
        d3.select("#compare-button").classed("btn-compare-inactive", numChecked == 0);
      });
    newRows.append("td").html(function (d) {
      return d.name;
    });
    newRows.append("td").html(function (d) {
      return d.contactFileName;
    });
    newRows.append("td").html(function (d) {
      return d.labelFileName;
    });
    newRows.append("td").html(function (d) {
      return d.pdbFileName;
    });
    newRows.append("td")
      .style("text-align", "right")
      .append("span")
      .attr("class", "glyphicon glyphicon-remove-circle")
      .style("color", "#AAA")
      .on("click", d => {
        this._removeFromTable(d.name);
      });
    newRows.append("td")
      .style("text-align", "right")
      .style("width", "1.5em")
      .append("span")
      .attr("class", "glyphicon glyphicon-chevron-right")
      .style("color", "#AAA")
      .on("click", function (d) {
        structures.forEach(function (s) {
          s.selected = false;
        });
        existingStructures.forEach(function (s) {
          s.selected = false;
        });
        d.selected = true;
        navigateToComparison(family, []);
      });

    rows.exit().remove();
  }

  _getTableDataFromSessionStorage() {
    const data = [];
    for (let i = 0 ; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.match(/^USRTABLE_/)) {
        data.push(JSON.parse(localStorage.getItem(key)));
      }
    }
    return data;
  }

  _fileUploadInitiated(textInputSelector, file) {
    const reader = new FileReader();
    reader.onload = (e) => { this._fileUploadFinished(e, file.name, textInputSelector); };
    reader.readAsText(file);
  }


  /**
   *
   * @param {ProgressEvent} e - The event triggered by the file loading
   * @param {string} fileName - The name of the file read
   * @param {string} fileType - ["contact", "label", "pdb"]
   * @private
   */
  _fileUploadFinished(e, fileName, fileType) {
    const fileContent = e.target.result;
    if (fileType == "contact" && !validateContactFile(fileContent)) {
      return;
    }
    if (fileType == "label" && !validateLabelFile(fileContent)) {
      return;
    }
    if (fileType == "pdb" && !validatePdbFile(fileContent)) {
      return;
    }

    // Put file name in text-field
    d3.select("#" + fileType + "DummyInput").node().value = fileName;

    // Hide upload icon
    d3.select("#" + fileType + "DummyIcon")
      .style("opacity", 0)

    // Set name of uploaded file if it hasn't been set yet
    const nameInput = d3.select("#nameInput");
    if (fileType == "pdb" && nameInput.node().value == "") {
      const pdbFilePrefix = fileName.substr(0,fileName.lastIndexOf("."));
      nameInput.node().value = pdbFilePrefix;
    }

    this.uploadedFiles[fileType] = fileContent;

    if (this.uploadedFiles['contact'] != null &&
      this.uploadedFiles['label'] != null &&
      this.uploadedFiles['pdb'] != null) {
      d3.select("#upload-button")
        .classed("btn-upload-inactive", false);
    }
  }

  _removeFromTable(name) {
    console.log("removeFromTable("+name+")");
    localStorage.removeItem("USRTABLE_" + name);
    this._reloadTableFromSessionStorage();
  }

  /**
   * Check if all files have been uploaded, add them to the table and clear the upload fields
   * @private
   */
  _addToTable() {
    if (this.uploadedFiles['contact'] == null ||
      this.uploadedFiles['label'] == null ||
      this.uploadedFiles['pdb'] == null) {
      return;
    }

    const protName = d3.select("#nameInput").node().value;
    const sessionName = "USRTABLE_" + protName;
    const contactName = d3.select("#contactDummyInput").node().value;
    const labelName = d3.select("#labelDummyInput").node().value;
    const pdbName = d3.select("#pdbDummyInput").node().value;
    const ligands = [];

    localStorage.setItem(sessionName, JSON.stringify({
      'name': protName,
      'ligands': ligands,
      'pdbFileName': pdbName,
      'contactFileName': contactName,
      'labelFileName': labelName,
      'contactFile': this.uploadedFiles['contact'],
      'pdbFile': this.uploadedFiles['pdb'],
      'labelFile': this.uploadedFiles['label']
    }));

    this._reloadTableFromSessionStorage();

    // Reset upload fields
    d3.select("#upload-button")
      .classed("btn-upload-inactive", true);

    d3.select("#nameInput").node().value = "";

    ['contact', 'label', 'pdb'].forEach(fileType => {

      this.uploadedFiles[fileType] = null;

      d3.select("#" + fileType + "DummyInput").node().value = "";

      // Hide upload icon
      d3.select("#" + fileType + "DummyIcon")
        .style("opacity", 0.2);

      d3.select("#" + fileType + "Input").node().value = null;
    });

  }
}

function validateContactFile(fileContents) {
  const pat = /0\t(\w+)\t(.:\w{1,3}:\d+:\w+)\t(.:\w{1,3}:\d+:\w+)/g;

  let contactCount = 0;
  let m;
  while (m = pat.exec(fileContents)) {
    contactCount += 1;
  }

  if (contactCount == 0) {
    alert("ERROR: Contact-file has no valid contacts");
    return false;
  }

  return true;
}

function validateLabelFile(fileContents) {
  const pat = /(\S+)\t(\S+)(\t(\S+))?/g;

  let labelCount = 0;
  let m;
  while (m = pat.exec(fileContents)) {
    labelCount += 1;
  }

  if (labelCount == 0) {
    alert("ERROR: Label-file has no valid label lines");
    return false;
  }

  return true;
}

function validatePdbFile(fileContents) {
  const pat = /(ATOM  |HETATM)([ \d]{5})(.....)(.)(...) (.)([ \d]{4})(.)   ([ \-\.\d]{8})([ \-\.\d]{8})([ \-\.\d]{8})(.{6}.{6} {10}(..))?.*?\n/g;

  let atomCount = 0;
  let heavyAtomCount = 0;
  let m;
  while (m = pat.exec(fileContents)){
    atomCount += 1;
    if (m.length != 14 || m[13] != " H"){
      heavyAtomCount += 1;
    }
  }

  if (atomCount == 0) {
    alert("ERROR: Uploaded PDB-file has no atoms");
    return false;
  }

  // if (heavyAtomCount == atomCount) {
  //   alert("WARNING: No hydrogen atoms detected");
  // }

  return true;
}

