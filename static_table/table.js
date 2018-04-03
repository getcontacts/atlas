
function createTable(structureJson, containerSelector) {
  console.log("createTable " + structureJson);

  d3.json(structureJson).then(function (structures) {
    console.log(structures);
    const table = d3.select(containerSelector)
      .append("table");

    const headData = [
      {id: "select", text: ""},
      {id: "pdb_code", text: "PDB"},
      {id: "protein", text: "Receptor"},
      {id: "species", text: "Species"},
      {id: "type", text: "Method"},
      {id: "resolution", text: "Resolution"},
      {id: "publication_date", text: "Pub. date"},
      {id: "ligands", text: "Ligands"},
      {id: "gotoSingle", text: ""}
    ];

    let sortAscending = true;

    let headRow = table.append("thead")
      .append("tr")
      .selectAll("th").data(headData).enter().append("th")
      .attr("class", function (d) {
        return "col-" + d.id;
      })
      .text(function (d) {
        return d.text;
      })
      .on("click", function (d) {
        if (d3.select(this).classed("col-ascending") || d3.select(this).classed("col-ascending")) {
          sortAscending = !sortAscending;
        } else {
          sortAscending = true;
        }


        let cmp = function (a, b) {
          return (sortAscending ? d3.ascending : d3.descending)(a[d.id], b[d.id]);
        };

        if (d.id === "ligands") {
          cmp = function (a, b) {
            let la = a.ligands.length > 0 ? a.ligands[0].name : "";
            let lb = b.ligands.length > 0 ? b.ligands[0].name : "";
            return (sortAscending ? d3.ascending : d3.descending)(la, lb);
          };
        }
        rows.sort(cmp);

        headRow.classed("col-ascending", false);
        headRow.classed("col-descending", false);
        d3.select(this).classed(sortAscending ? "col-ascending" : "col-descending", true);
      });

    const tbody = table.append("tbody");

    const rows = tbody.selectAll("tr")
      .data(structures)
      .enter()
      .append("tr")
      .sort(function (a, b) {
        if (a.family === b.family) {
          return d3.ascending(a.species, b.species);
        }
        return d3.ascending(a.family, b.family);
      })
      .style("cursor", "pointer")
      .on("click", function (d) {
        const checkInput = d3.select(this).select("input");
        const currentlyChecked = checkInput.property("checked");
        d.selected = !currentlyChecked;
        checkInput.property("checked", !currentlyChecked);
        const numChecked = structures.reduce((acc, s) => acc + (s.selected ? 1 : 0), 0);
        d3.select("#compare-button").classed("btn-inactive", numChecked == 0);
      });
    rows.append("td").append("input").attr("type", "checkbox")
      .on("click", function () {
        d3.event.stopPropagation();
      })
      .on("change", function (d) {
        d.selected = this.checked;
        const numChecked = structures.reduce((acc, s) => acc + (s.selected ? 1 : 0), 0);
        d3.select("#compare-button").classed("btn-inactive", numChecked == 0);
      });
    rows.append("td").html(function (d) {
      return d.pdb_code;
    });
    rows.append("td").html(function (d) {
      return proteinHtml(d.protein);
    });
    rows.append("td").html(function (d) {
      return d.species;
    });
    rows.append("td").html(function (d) {
      return typeHtml(d.type);
    });
    rows.append("td").html(function (d) {
      return d.resolution;
    });
//        rows.append("td").html(function(d){ return publicationHtml(d.publication); });
    rows.append("td").html(function (d) {
      return d.publication_date;
    });
    rows.append("td").html(function (d) {
      return ligandHtml(d.ligands);
    });
//        rows.append("td").html(function(d){ return preferred_chain; });
//        rows.append("td").html(function(d){ return d.family; });
    rows.append("td").append("span")
      .attr("class", "glyphicon glyphicon-chevron-right")
      .style("color", "#AAA")
      .on("click", function (d) {
        structures.forEach(function (s) {
          s.selected = false;
        });
        d.selected = true;
        navigateToComparison(structures);
      });


    // Set up compare button
    d3.select("body")
      .append("div")
      .attr("id", "compare-button")
      .classed("btn", true)
      .classed("btn-inactive", true)
      .text("Compare selected structures")
      .on("click", function () {
        navigateToComparison(structures);
      });
  });
}




function ligandHtml(ligands){
  const ligstr = ligands.map((l) => l.name).join(", ");
  if (ligstr.length > 40) {
    return ligstr.substr(0,36)+" ...";
  } else {
    return ligstr;
  }
}

function proteinHtml(protein){
  return protein.split("_")[0].toUpperCase();
}

function typeHtml(type){
  if (type.indexOf("X-ray") > -1) { return "XC"; }
  if (type.indexOf("Electron microscopy") > -1) { return "EM"; }
  return "??";
}

/** Extract selected structures and go to comparison page */
function navigateToComparison(structures){
  var sel_pdbs = structures.filter((s) => s.selected)
    .map((s) => (s.protein + "_" + s.pdb_code + "_" + s.preferred_chain).toUpperCase())
    .join(",");
  window.location.href="static_compare.html?structure_ids="+sel_pdbs;
}


