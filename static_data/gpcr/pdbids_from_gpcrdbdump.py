

import json

with open('gpcrdb_dump.json') as f:
    db = json.load(f)

pdbids = list(map(lambda entry: entry['pdb_code'] + "\t" + entry['preferred_chain'][0], db))

print("\n".join(pdbids))
