import xml.etree.ElementTree as ET
import requests
import sys
import json

pdbid_file = sys.argv[1]

#with open(pdbid_file) as f:
#  pdbid_list = ",".join(map(lambda l: l.strip().replace("\t", "."), f.readlines()))
#
#response = requests.get('https://www.rcsb.org/pdb/rest/customReport.xml?pdbids=%s&customReportColumns=releaseDate,experimentalTechnique,resolution,doi,geneName,taxonomy,pfamId,pfamAccession,ligandId&service=wsfile&format=xml' % pdbid_list)
#xml = ET.fromstring(response.text)
with open(pdbid_file) as f:
  protein_list = list(map(lambda l: l.strip().split("\t"), f.readlines()))

ligand_lists = {}
json_out = []

def addXMLRecordsToJson(xml, prot_data):
  for record in xml:
    pdb = record.find('dimEntity.structureId').text
    
    if pdb in ligand_lists:
      ligand = record.find('dimEntity.ligandId').text
      if not ligand in ligand_lists[pdb] and ligand != 'null':
        ligand_lists[pdb].append(ligand)
    else:
      chain = record.find('dimEntity.chainId').text
      sys.stderr.write("Processing "+pdb+"\n")
      for d in prot_data:
          if d[0] == pdb:
              prot = d
              break

      protid = prot[5]
      response = requests.get('https://www.ebi.ac.uk/proteins/api/proteins/'+protid+'/')
      ebidata = json.loads(response.text)
      protein = ebidata['protein']['recommendedName']['fullName']['value']
      protein = protein.replace('Guanine nucleotide-binding protein ', '')
      #sys.stderr.write(protein+'\n')
      protid = ebidata['id']
      species = ebidata['organism']['names'][0]['value'] + " (" + ebidata['organism']['names'][1]['value'] + ")"
      pfamid = prot[4]

      #protein = record.find('dimEntity.geneName').text
      #if protein:
      #  protein = protein.split("#")
      #  protein = filter(lambda p: ":" not in p, protein)
      #  protein = " ".join(protein)
      #species = record.find('dimEntity.taxonomy').text
      date = record.find('dimStructure.releaseDate').text
      doi = record.find('dimStructure.doi').text
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

      ligands = [record.find('dimEntity.ligandId').text]
      if ligands[0] == 'null':
        ligands = []
      ligand_lists[pdb] = ligands
      
      json_out.append({
        "pdbid": pdb,
        "chain": chain,
        "protein": protein,
        "protid": protid,
        "species": species,
        "pfamid": pfamid,
        "date": date,
        "doi": doi,
        "method": method,
        "resolution": resolution,
        "ligands": ligands
      })

#addXMLRecordsToJson(xml)

sz = 100
for prot_slice in [protein_list[i:i+sz] for i in range(0, len(protein_list), sz)]:
  sys.stderr.write("Processing slice of "+str(sz)+"\n")
  pdbids = ",".join(list(map(lambda prot: prot[0]+'.'+prot[1], prot_slice)))
  response = requests.get('https://www.rcsb.org/pdb/rest/customReport.xml?pdbids=%s&customReportColumns=releaseDate,experimentalTechnique,resolution,doi,geneName,taxonomy,pfamId,pfamAccession,ligandId&service=wsfile&format=xml' % pdbids)
  xml = ET.fromstring(response.text)
  addXMLRecordsToJson(xml, prot_slice)

print(json.dumps(json_out, indent=2))
  

