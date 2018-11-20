/**
 * Creates a structure uploader and validator Promise which creates a div in the current
 * page and either "resolves" or "rejects" based on the succes of uploading and parsing.
 *
 * Three files should be uploaded; an interaction file from the GetContacts package,
 * a residue label file, and a PDB-file. On succesful upload of all three, the files
 * will be validated for syntax (not content integrety) and returned as a list in the
 * argument of the `resolve` function.
 *
 * The dialog for creating
 * @param container_id
 */


function createUserUpload(containerSelector) {
  new UploadManager(containerSelector);
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
      .text("Upload your own");

    const table = d3.select(containerSelector).append("table");

    const tbody = table.append("tbody");
    const trow = tbody.append("tr");
    let td = trow.append("td").style("border-bottom", "none");
    td.append("label")
      .attr("for", "nameInput")
      .text("Name: ");
    td.append("input")
      .attr("id", "nameInput")
      .attr("value", "")
      .attr("type", "text");

    td = trow.append("td").style("position", "relative").style("border-bottom", "none");
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
    td.append("label")
      .attr("for", "contactDummyInput")
      .text("Contact-file: ");
    td.append("i")
      .attr("id", "contactDummyIcon")
      .style("position", "relative")
      .style("left", "2rem")
      .style("opacity", 0.2)
      .attr("class", "fas fa-upload");
    td.append("input")
      .attr("id", "contactDummyInput")
      .attr("type", "text");

    td = trow.append("td").style("position", "relative").style("border-bottom", "none");
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
    td.append("label")
      .attr("for", "labelDummyInput")
      .text("Label-file: ");
    td.append("i")
      .attr("id", "labelDummyIcon")
      .style("position", "relative")
      .style("left", "2rem")
      .style("opacity", 0.2)
      .attr("class", "fas fa-upload");
    td.append("input")
      .attr("id", "labelDummyInput")
      .attr("type", "text");

    td = trow.append("td").style("position", "relative").style("border-bottom", "none");
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
    td.append("label")
      .attr("for", "pdbDummyInput")
      .text("PDB-file: ");
    td.append("i")
      .attr("id", "pdbDummyIcon")
      .style("position", "relative")
      .style("left", "2rem")
      .style("opacity", 0.2)
      .attr("class", "fas fa-upload");
    td.append("input")
      .attr("id", "pdbDummyInput")
      .attr("type", "text");

    d3.select(containerSelector)
      .append("div")
      .style("position", "relative")
      .append("div")
      .attr("id", "upload-button")
      .classed("btn", true)
      .classed("btn-upload", true)
      .classed("btn-upload-inactive", true)
      .text("Add to table")
      .on("click", function () {
        that._addToTable();
      });
  }

  _createUserTable(containerSelector) {
    const table = d3.select(containerSelector).append("table");
    this.tbody = table.append("tbody");
    this._reloadTableFromSessionStorage();
  }

  _reloadTableFromSessionStorage() {
    const structures = this._getTableDataFromSessionStorage();
    const rows = this.tbody.selectAll("tr").data(structures, d => d.name);

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
      .style("cursor", "pointer")
      .on("click", function (d) {
        const checkInput = d3.select(this).select("input");
        const currentlyChecked = checkInput.property("checked");
        d.selected = !currentlyChecked;
        checkInput.property("checked", !currentlyChecked);
        const numChecked = structures.reduce((acc, s) => acc + (s.selected ? 1 : 0), 0);
        d3.select("#compare-button").classed("btn-compare-inactive", numChecked == 0);
      });

    newRows.append("td").append("input").attr("type", "checkbox")
      .on("click", function () {
        d3.event.stopPropagation();
      })
      .on("change", function (d) {
        d.selected = this.checked;
        const numChecked = structures.reduce((acc, s) => acc + (s.selected ? 1 : 0), 0);
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
    newRows.append("td").append("span")
      .attr("class", "glyphicon glyphicon-remove-circle")
      .style("color", "#AAA")
      .on("click", d => {
        this._removeFromTable(d.name);
      });
    newRows.append("td").append("span")
      .attr("class", "glyphicon glyphicon-chevron-right")
      .style("color", "#AAA")
      .on("click", function (d) {
        structures.forEach(function (s) {
          s.selected = false;
        });
        d.selected = true;
        navigateToComparison(family, structures);
      });

    rows.exit().remove();
  }

  _getTableDataFromSessionStorage() {
    const data = [];
    for (let i = 0 ; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key.match(/^USRTABLE_/)) {
        data.push(JSON.parse(sessionStorage.getItem(key)));
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
    sessionStorage.removeItem("USRTABLE_" + name);
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

    sessionStorage.setItem(sessionName, JSON.stringify({
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

function populateSessionStorageWithDummyData() {
  // sessionStorage.clear();
  sessionStorage.setItem("USRTABLE_3sn6", JSON.stringify({
    'name': 'B2AR complex',
    'ligands': ['P0G'],
    'pdbFileName': '3sn6_R.pdb',
    'contactFileName': '3sn6_R_contacts.tsv',
    'labelFileName': '3sn6_labels.tsv',
    'contactFile': '0       sb      R:ASP:300:OD1   R:HIS:296:NE2\n0       sb      R:ARG:1148:NH2  R:ASP:1010:OD1',
    'pdbFile': 'PDBFILE 3SN6',
    'labelFile': 'R:P0G:1601      Ligand  white\nR:GLU:30        h1.1x29 #78C5D5'
  }));

  sessionStorage.setItem("USRTABLE_4OR2", JSON.stringify({
    'name': 'Glutamate receptor',
    'ligands': ['FM9'],
    'pdbFileName': '4or2_A.pdb',
    'contactFileName': '4or2_A_contacts.tsv',
    'labelFileName': '4or2_labels.tsv',
    'contactFile': '0       sb      A:ASP:1012:OD1  A:LYS:1015:NZ\n0       sb      A:ASP:1028:OD2  A:LYS:1032:NZ',
    'pdbFile': 'PDBFILE 4OR2',
    'labelFile': 'A:FM9:1901      Ligand  white\nA:ILE:591       h1.1x38 #78C5D5'
  }));
  // sessionStorage.clear();
}

