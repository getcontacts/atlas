
function createTable(family, containerSelector) {
  // const structureJson = "static_data/"+family+"/annotations.json";
  const staticJson = "static_data/"+family+"/annotations.json";
  const dynamicJson = "simulation_data/"+family+"/annotations.json";

  // const contactFilePromises = contactFiles.map((cf) => d3.text(cf));
  // const labelFilePromises = labelFiles.map((lf) => d3.text(lf));
  // const annotationPromise = [d3.json(annotationFile)];
  // const that = this;
  //
  // Promise.all(contactFilePromises.concat(labelFilePromises).concat(annotationPromise))
  //   .then(function (data) {

  // d3.json(staticJson).then(function (structures) {
  // const staticPromise = d3.json(staticJson);
  // const dynamicPromise = d3.json(dynamicJson);
  Promise.all([d3.json(staticJson), d3.json(dynamicJson)]).then(function (strucArrs) {
    const structures = strucArrs[0].concat(strucArrs[1]);

    const table = d3.select(containerSelector)
      .append("table");

    const headData = [
      {id: "select", text: ""},
      {id: "protein", text: "Protein"},
      {id: "protId", text: "Gene"},
      {id: "species", text: "Species"},
      {id: "pdbid", text: "PDB"},
      {id: "chain", text: "Chain"},
      {id: "method", text: "Method"},
      {id: "resolution", text: "Resolution"},
      {id: "date", text: "Pub. date"},
      {id: "ligands", text: "Ligands"},
      {id: "gotoContactDL", text: ""},
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
        return d3.ascending(a.protid, b.protid);
      })
      .style("cursor", "pointer")
      .on("click", function (d) {
        const checkInput = d3.select(this).select("input");
        const currentlyChecked = checkInput.property("checked");
        d.selected = !currentlyChecked;
        checkInput.property("checked", !currentlyChecked);
        const numChecked = structures.reduce((acc, s) => acc + (s.selected ? 1 : 0), 0);
        d3.select("#compare-button").classed("btn-compare-inactive", numChecked == 0);
      });

    rows.append("td").append("input").attr("type", "checkbox")
      .on("click", function () {
        d3.event.stopPropagation();
      })
      .on("change", function (d) {
        d.selected = this.checked;
        const numChecked = structures.reduce((acc, s) => acc + (s.selected ? 1 : 0), 0);
        d3.select("#compare-button").classed("btn-compare-inactive", numChecked == 0);
      });
    rows.append("td").html(function (d) {
      return d.protein;
    });
    rows.append("td").html(function (d) {
      return d.protid.split("_")[0].toUpperCase();
    });
    rows.append("td").html(function (d) {
      return d.species;
    });
    rows.append("td").html(function (d) {
      const text = d.pdbid;

      return text + " <a href='https://www.rcsb.org/structure/"+d.pdbid+"' target='_new'>" +
        "<i class=\"fas fa-external-link-alt\"></i>" +
        "</a>";
    });
    rows.append("td").html(function (d) {
      return d.chain;
    });
    rows.append("td").html(function (d) {
      return d.method;
    });
    rows.append("td").html(function (d) {
      return d.resolution;
    });
//        rows.append("td").html(function(d){ return publicationHtml(d.publication); });
    rows.append("td").html(function (d) {
      const text = d.date;

      if (d.doi) {
        return text + " <a href='https://doi.org/" + d.doi + "' target='_new'>" +
          "<i class=\"fas fa-external-link-alt\"></i>" +
          "</a>";
      } else {
        return text;
      }
    });
    rows.append("td").html(function (d) {
      return ligandHtml(d.ligands);
    });
    rows.append("td").append("a")
      .attr("target", "_blank")
      .attr("href", function (d) { return "static_data/"+family+"/contacts/"+d.pdbid+"_"+d.chain+".tsv"; })
      .append("span")
      .attr("class", "glyphicon glyphicon-download-alt")
      .style("color", "#AAA");
    rows.append("td").append("span")
      .attr("class", "glyphicon glyphicon-chevron-right")
      .style("color", "#AAA")
      .on("click", function (d) {
        structures.forEach(function (s) {
          s.selected = false;
        });
        d.selected = true;
        navigateToComparison(family, structures);
      });


    // Set up compare button
    d3.select("body")
      .append("div")
      .attr("id", "compare-button")
      .classed("btn", true)
      .classed("btn-compare", true)
      .classed("btn-compare-inactive", true)
      .text("Compare selected structures")
      .on("click", function () {
        navigateToComparison(family, structures);
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
    "2DP", "DPG", "EDT", "BGC", "P5E", "AZI", "NLE", "PE5", "MG", "MN", "CAC", "CA", "MLY", "DAO",
    "CS", "SO3", "CO", "CSS", "EDO", "MOH", "NI", "PTL", "BU3", "MG8", "PGO", "TPO", "SEP", "CME",
    "PTR", "KCX", "MRD", "CSD", "CSO", "TAM", "OCY", "TFA", "UNX", "SR", "CSO", "PG4", "null", "UNK",
    "IPA", "IMD", "SCN"
]);

function ligandHtml(ligands){
  return ligands.filter((l) => !excludeLigands.has(l))
    .map(function(l){
      let displayedName = l;
      if(l.length > 20){
        displayedName = displayedName.substr(0,19) + "&hellip;";
      }

      return "<span class='hoverlink' onmouseenter='showLigandTooltip(\"" + l + "\")' onmouseleave='hideLigandTooltip()'>" +
        displayedName +
        "</span>";
  }).join("<br>");
}

function showLigandTooltip(ligandName){
  let img = "";
  if(ligandName.length <= 3) {
    const firstLetter = ligandName[0];
    img = "<img width='200px' src='https://cdn.rcsb.org/etl/ligand/img/" +
      firstLetter + "/" + ligandName + "/" + ligandName + "-large.png'>";
  } else {
    img = "<img width='200px' src='https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/" + ligandName + "/PNG?" +
      "record_type=2d&image_size=300x300'>";
  }
  d3.select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("right", (document.body.clientWidth-event.pageX+10)+"px")
    .style("top", (event.pageY+10)+"px")
    .html(img);

}

function hideLigandTooltip(){
  d3.select("#tooltip").remove();
}

/** Extract selected structures and go to comparison page */
function navigateToComparison(family, structures){
  console.log("navigatetocomparison")
  console.log(family)
  console.log(structures)
  var sel_pdbs = structures.filter((s) => s.selected)
    .map(function(s) {
      if(s.hasOwnProperty("structure"))
        return s.structure;
      else
        return (s.pdbid + "_" + s.chain).toUpperCase();
    })
    .join(",");
  window.location.href="compare.html?family="+family+"&pdbids="+sel_pdbs;
}


