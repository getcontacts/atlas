import xml.etree.ElementTree as ET
import requests
import sys
import json

pdbid_file = sys.argv[1]

with open(pdbid_file) as f:
    protein_list = list(map(lambda l: l.strip().split(","), f.readlines()))[1:]

json_out = []

# {id: "protein", text: "Protein"},
# {id: "species", text: "Species"},
# {id: "pdbid", text: "PDB"},
# {id: "chain", text: "Chain"},
# {id: "method", text: "Method"},
# {id: "resolution", text: "Resolution"},
# {id: "date", text: "Pub. date"},
# {id: "ligands", text: "Ligands"},

seen_pdbs = set()


def addXMLRecordsToJson(xml, prot_data):
    for prot in prot_data:
        pdb = prot[4].upper()
        chn = prot[6].upper()
        pdbchn = pdb + "." + chn
        if pdb in seen_pdbs:
            continue
        else:
            seen_pdbs.add(pdb)

        records = []
        for record in xml:
            rpdb = record.find('dimEntity.structureId').text
            rchn = record.find('dimEntity.chainId').text
            if pdb == rpdb and chn == rchn:
                records.append(record)
        try:
            record = records[0]
        except IndexError:
            sys.stderr.write("XML error with "+pdbchn+"\n")
            continue

        sys.stderr.write("Processing "+pdbchn+"\n")

        species = prot[2]
        protein = prot[1]

        # protid = prot[5]
        # response = requests.get('https://www.ebi.ac.uk/proteins/api/proteins/'+protid+'/')
        # ebidata = json.loads(response.text)
        # protein = ebidata['protein']['recommendedName']['fullName']['value']
        # protein = protein.replace('Guanine nucleotide-binding protein ', '')
        # protid = ebidata['id']
        # species = ebidata['organism']['names'][0]['value'] + " (" + ebidata['organism']['names'][1]['value'] + ")"
        # pfamid = prot[4]

        # protein = record.find('dimEntity.geneName').text
        # if protein:
        #     protein = protein.split("#")
        #     protein = filter(lambda p: ":" not in p, protein)
        #     protein = " ".join(protein)
        # species = record.find('dimEntity.taxonomy').text

        date = record.find('dimStructure.releaseDate').text
        doi = record.find('dimStructure.doi').text
        gene = record.find('dimEntity.geneName').text
        if gene is None:
            gene = ''
        else:
            gene = gene.split("#")[0]
        if doi == 'null':
            doi = ''
        method = record.find('dimStructure.experimentalTechnique').text
        if method == "X-RAY DIFFRACTION":
            method = "XC"
        elif method == "SOLUTION NMR":
            method = "NMR"
        elif method == "SOLID-STATE NMR":
            method = "SSNMR"
        elif method == "ELECTRON MICROSCOPY":
            method = "EM"
        elif method == "ELECTRON CRYSTALLOGRAPHY":
            method = "EC"
        resolution = record.find('dimStructure.resolution').text
        if resolution == 'null':
            resolution = '-'

        ligands = list(set([r.find('dimEntity.ligandId').text for r in records]))

        json_out.append({
            "pdbid": pdb,
            "chain": chn,
            "protein": protein,
            "protid": gene + "_",
            "species": species,
            "date": date,
            "doi": doi,
            "method": method,
            "resolution": resolution,
            "ligands": ligands
        })


sz = 100
slice_idx = 0
for prot_slice in [protein_list[i:i+sz] for i in range(0, len(protein_list), sz)]:
    sys.stderr.write("Processing slice %d (structure %d)\n" % (slice_idx, slice_idx*sz) )
    slice_idx+=1
    pdbids = ",".join(list(map(lambda prot: prot[4].upper()+'.'+prot[6].upper(), prot_slice)))
    response = requests.get("https://www.rcsb.org/pdb/rest/customReport.xml?pdbids=%s&customReportColumns=releaseDate,"
                            "experimentalTechnique,resolution,doi,geneName,taxonomy,pfamId,pfamAccession,"
                            "ligandId&service=wsfile&format=xml" % pdbids)
    xml = ET.fromstring(response.text)
    addXMLRecordsToJson(xml, prot_slice)

print(json.dumps(json_out, indent=2))
  

