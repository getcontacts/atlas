
function createTable(structureJson, containerSelector) {
  console.log("createTable " + structureJson);

  d3.json(structureJson).then(function (structures) {
    console.log(structures);
    const table = d3.select(containerSelector)
      .append("table");

    const headData = [
      {id: "select", text: ""},
      {id: "protein", text: "Protein"},
      {id: "pdb", text: "PDB"},
      {id: "species", text: "Species"},
      {id: "type", text: "Method"},
      {id: "resolution", text: "Resolution"},
      {id: "date", text: "Pub. date"},
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
        if (d3.select(this).classed("col-ascending") || d3.select(this).classed("col-descending")) {
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
      return d.protein;
    });
    rows.append("td").html(function (d) {
      const linktext = d.pdbid+'.'+d.chain.toLowerCase();
      return "<a href='https://www.rcsb.org/structure/"+d.pdbid+"' target='_new'>"+linktext+"</a>";
    });
    rows.append("td").html(function (d) {
      return d.species;
    });
    rows.append("td").html(function (d) {
      return d.method;
    });
    rows.append("td").html(function (d) {
      return d.resolution;
    });
//        rows.append("td").html(function(d){ return publicationHtml(d.publication); });
    rows.append("td").html(function (d) {
      return d.date;
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



const excludeLigands = new Set([
  "C14", "D10", "D12", "R16", "OLB", "OCT", "CLR", "ACE", "ACT", "PLM", "C8E", "LDA", "PEF", "4E6",
  "HTG", "ZN", "BGL", "BMA", "NAG", "HG", "MAN", "BOG", "OLA", "OLC", "PEG", "LFA", "LYR", "NA",
  "MPG", "1WV", "DGA", "TRS", "PEE", "GLY", "CL", "BR", "22B", "BNG", "L3B", "L2P", "NO3", "1PE",
  "P6G", "YCM", "2CV", "MHA", "Y01", "SOG", "TRE", "TLA", "PGE", "HTO", "PG4", "SQU", "LI1", "TRD",
  "UND", "GAL", "GLC", "L1P", "L3P", "L4P", "K", "DD9", "HP6", "PH1", "SGA", "XE", "SQL", "GOL",
  "PCA", "ARC", "MC3", "LMT", "STE", "SO4", "12P", "ACM", "BU1", "N9S", "DMS", "PO4", "CCS", "DGN",
  "NH2", "FLC", "TAR", "CIT", "SXN", "UNL", "LME", "TWT", "MSE", "LPP", "MAL", "HEX", "CPS", "BXC",
  "2DP", "DPG", "EDT", "BGC", "P5E", "AZI", "NLE"
]);

function ligandHtml(ligands){
  return ligands.filter((l) => !excludeLigands.has(l))
    .map(function(l){
    return "<span class='hoverlink' onmouseenter='showLigandTooltip(\""+l+"\")' onmouseleave='hideLigandTooltip()'>"+
      l+
      "</span>";
  }).join(", ");
}

function showLigandTooltip(ligandName){
  const firstLetter = ligandName[0];
  const contents = "<img width='200px' src='https://cdn.rcsb.org/etl/ligand/img/"+firstLetter+"/"+ligandName+"/"+ligandName+"-large.png'>";
  d3.select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("right", (document.body.clientWidth-event.pageX+10)+"px")
    .style("top", (event.pageY+10)+"px")
    .html(contents);

}

function hideLigandTooltip(){
  d3.select("#tooltip").remove();
}

/** Extract selected structures and go to comparison page */
function navigateToComparison(structures){
  var sel_pdbs = structures.filter((s) => s.selected)
    .map((s) => (s.pdbid + "_" + s.chain).toUpperCase())
    .join(",");
  window.location.href="static_compare.html?structure_ids="+sel_pdbs;
}


