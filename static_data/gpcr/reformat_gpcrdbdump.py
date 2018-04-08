
import requests
import json
import sys

with open(sys.argv[1]) as f:
    db = json.load(f)

def reformat(gpcrdb_entry):
    pdbid = gpcrdb_entry['pdb_code'],
    sys.err.write('Reformating ' + pdbid + '\n')
    protid = gpcrdb_entry['protein']
    url = 'http://gpcrdb.org/services/protein/'+protid+'/'
    response = requests.get(url)
    protein_data = response.json()
    protein = protein_data['name']
    
    method = gpcrdb_entry['type']
    if method == "X-ray diffraction":
        method = "XC"
    elif method == "Electron microscopy":
        method = "EM"

    doi = gpcrdb_entry['publication']
    if doi:
        doi = doi.replace('http://dx.doi.org/', '')
    else:
        doi = ''

    ligands = list(map(lambda l: l['name'], gpcrdb_entry['ligands']))

    return {
            'pdbid': gpcrdb_entry['pdb_code'],
            'chain': gpcrdb_entry['preferred_chain'][0],
            'protein': protein,
            'protid': protid,
            'species': gpcrdb_entry['species'],
            'date': gpcrdb_entry['publication_date'],
            'method': method,
            'resolution': gpcrdb_entry['resolution'],
            'doi': doi,
            'ligands': ligands
            }

db = list(map(reformat, db))
print(json.dumps(db, indent=2))
