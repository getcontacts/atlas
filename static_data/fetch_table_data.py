import xml.etree.ElementTree as ET
import requests
import sys
import json

pdbid_file = sys.argv[1]

with open(pdbid_file) as f:
  pdbid_list = ",".join(map(lambda l: l.strip().replace("\t", "."), f.readlines()))

response = requests.get('https://www.rcsb.org/pdb/rest/customReport.xml?pdbids=%s&customReportColumns=releaseDate,experimentalTechnique,resolution,doi,geneName,taxonomy,ligandId&service=wsfile&format=xml' % pdbid_list)
xml = ET.fromstring(response.text)

ligand_lists = {}
json_out = []

for record in xml:
  pdb = record.find('dimEntity.structureId').text
  if pdb in ligand_lists:
    ligand = record.find('dimEntity.ligandId').text
    if not ligand in ligand_lists[pdb] and ligand != 'null':
      ligand_lists[pdb].append(ligand)
  else:
    chain = record.find('dimEntity.chainId').text
    protein = record.find('dimEntity.geneName').text
    if protein:
      protein = protein.split("#")
      protein = filter(lambda p: ":" not in p, protein)
      protein = " ".join(protein)
    species = record.find('dimEntity.taxonomy').text
    date = record.find('dimStructure.releaseDate').text
    doi = record.find('dimStructure.doi').text
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
    ligands = [record.find('dimEntity.ligandId').text]
    if ligands[0] == 'null':
      ligands = []
    ligand_lists[pdb] = ligands
    
    json_out.append({
      "pdbid": pdb,
      "chain": chain,
      "protein": protein,
      "species": species,
      "date": date,
      "doi": doi,
      "method": method,
      "resolution": resolution,
      "ligands": ligands
    })
      
print(json.dumps(json_out, indent=2))
  

