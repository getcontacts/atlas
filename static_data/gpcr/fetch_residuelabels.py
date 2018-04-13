import sys
import requests
import json
from ftplib import FTP
import gzip
from lxml import etree
import os.path
import re

annotation_file = sys.argv[1]
output_dir = sys.argv[2]

with open(annotation_file) as f:
    annotations = json.loads(f.read())

ftp = FTP('ftp.ebi.ac.uk')
ftp.login()
generic_numbers = {}

for prot in annotations:
    protid = prot['protid']

    json_file = "gpcrdb_generic_numbers/"+protid+".json"
    if not os.path.isfile(json_file):
        print("Fetching " + protid + " generic residue numbers from GPCRdb ..")
        url = 'http://gpcrdb.org/services/residues/extended/'+protid+'/'
        response = requests.get(url)
        residue_data = response.json() 
        with open(json_file, "w") as f:
            f.write(json.dumps(residue_data, indent=2))
    else:
        with open(json_file) as f:
            residue_data = json.load(f)

    ## Fill in generic_numbers if it isn't already
    #if protid not in generic_numbers:
    #    generic_numbers[protid] = {}
    #    for residue in residue_data:
    #        gen_number = residue['display_generic_number']
    #        if gen_number:
    #            generic_numbers[protid][residue['sequence_number']] = gen_number


    pdbid = prot['pdbid'].lower()
    xml_file = 'sifts_mapping/'+pdbid+'.xml.gz'
    if not os.path.isfile(xml_file):
        print("Fetching SIFTS residue mapping for " + pdbid + " .. ")
        pdbid_mid = pdbid[1:3]
        ftp.cwd('/pub/databases/msd/sifts/split_xml/'+pdbid_mid+'/')
        ftp.retrbinary('RETR '+pdbid+'.xml.gz', open(xml_file, 'wb').write)
    with gzip.open(xml_file) as f:
        sifts_xml = etree.fromstring(f.read())

    # Determine accession id
    print("Finding accession in SIFTS residue mapping xml .. ")
    for map_region in sifts_xml.iter('{*}mapRegion'):
        try:
            detail = next(map_region.iter('{*}dbDetail'))
            if detail.text == protid.upper():
                accession = next(map_region.iter('{*}db')).get('dbAccessionId')
        except StopIteration:
            pass

    print("Accession: " + protid + ": " + accession)
    print("Parsing PDB to gene residue mapping from SIFTS .. ")
    gene_to_pdb_res = {}
    for resi_element in sifts_xml.iter('{*}residue'):
        try:
            res_of_interest = False
            for db in resi_element.iter('{*}crossRefDb'):
                if db.get('dbSource') == 'UniProt' and db.get('dbAccessionId') == accession:
                    res_of_interest = True
                    uniprot_resi = db.get('dbResNum')
                elif db.get('dbSource') == 'PDB':
                    pdb_resi = db.get('dbResNum')
                    pdb_chain = db.get('dbChainId')
                    pdb_resn = db.get('dbResName')
            if res_of_interest and pdb_resi != "null" and uniprot_resi != "null":
                gene_to_pdb_res[int(uniprot_resi)] = ":".join([pdb_resi, pdb_chain, pdb_resn])
        except StopIteration:
            pass
     
    resi_mapping = []
    for resi in residue_data:
        if not resi['display_generic_number']:
            continue
        seq_number = resi['sequence_number']
        gpcrdb_id = resi['display_generic_number']
        if seq_number not in gene_to_pdb_res:
            continue
        gpcrdb_tokens = re.split(r'[.x]', gpcrdb_id)
        gpcrdb_id = 'h' + gpcrdb_tokens[0] + '.' + gpcrdb_tokens[0] + 'x' + gpcrdb_tokens[2]

        if gpcrdb_tokens[0] == '1':
            color = "#78C5D5"
        elif gpcrdb_tokens[0] == '2':
            color = "#459BA8"
        elif gpcrdb_tokens[0] == '3':
            color = "#79C268"
        elif gpcrdb_tokens[0] == '4':
            color = "#C5D846"
        elif gpcrdb_tokens[0] == '5':
            color = "#F5D63D"
        elif gpcrdb_tokens[0] == '6':
            color = "#F18B32"
        elif gpcrdb_tokens[0] == '7':
            color = "#E868A1"
        elif gpcrdb_tokens[0] == '8':
            color = "#C063A6"
        else:
            color = "white"

        pdb_res = gene_to_pdb_res[seq_number]
                
        resi_mapping.append(pdb_res + "\t" + gpcrdb_id + "\t" + color + "\n")

    chain = prot['chain'].upper()
    label_file = output_dir+'/'+pdbid.upper()+'_'+chain+'.tsv'
    print('Writing label file '+label_file+' .. ')
    with open(label_file, 'w') as f:
        f.writelines(resi_mapping)

    if pdbid.upper() == "5DF1":
        print(gene_to_pdb_res)
        print(resi_mapping)
        sys.exit(-1)


