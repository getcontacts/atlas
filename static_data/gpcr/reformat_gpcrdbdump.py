
import requests
import json
import sys
import re

with open(sys.argv[1]) as f:
    db = json.load(f)

def reformat(gpcrdb_entry):
    pdbid = gpcrdb_entry['pdb_code'],
    sys.stderr.write('Reformating ' + str(pdbid) + '\n')
    protid = gpcrdb_entry['protein']
    url = 'http://gpcrdb.org/services/protein/'+protid+'/'
    response = requests.get(url)
    protein_data = response.json()
    protein = protein_data['name']
    acc = protein_data['accession']

    response = requests.get('https://www.ebi.ac.uk/proteins/api/proteins/'+acc+'/')
    ebidata = response.json()
    #protein = ebidata['protein']['recommendedName']['fullName']['value']
    for spec_obj in ebidata['organism']['names']:
        if spec_obj['type'] == 'scientific':
            species_sci = spec_obj['value']
        elif spec_obj['type'] == 'common':
            species_com = spec_obj['value']
    species = species_sci
    if species_com:
        species += " (" + species_com + ")"

    
    method = gpcrdb_entry['type']
    if method == "X-ray diffraction":
        method = "XC"
    elif method == "Electron microscopy":
        method = "EM"

    doi = gpcrdb_entry['publication']
    if doi:
        doi = re.sub(r"^https?://(dx\.)?doi.org/", "", doi)
    else:
        doi = ''

    ligands = list(map(lambda l: l['name'], gpcrdb_entry['ligands']))

    return {
            'pdbid': gpcrdb_entry['pdb_code'],
            'chain': gpcrdb_entry['preferred_chain'][0],
            'protein': protein,
            'protid': protid,
            'species': species,
            'date': gpcrdb_entry['publication_date'],
            'method': method,
            'resolution': gpcrdb_entry['resolution'],
            'doi': doi,
            'ligands': ligands
            }

db = list(map(reformat, db))
print(json.dumps(db, indent=2))
