import sys
import requests
import json
from ftplib import FTP
import gzip
from lxml import etree
import os.path


with open(sys.argv[1]) as f:
    annotations = json.loads(f.read())

ftp = FTP('ftp.ebi.ac.uk')
ftp.login()
generic_numbers = {}

for prot in annotations:
    protid = prot['protid']

    # Fill in generic_numbers if it isn't already
    if protid not in generic_numbers:
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

        generic_numbers[protid] = {}
        for residue in residue_data:
            gen_number = residue['display_generic_number']
            if gen_number:
                generic_numbers[protid][residue['sequence_number']] = gen_number

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
                gene_to_pdb_res[int(uniprot_resi)] = {"resi": pdb_resi, "chain": pdb_chain, "resn": pdb_resn}

    resi_mapping = []
    for resi in residue_data:
        if not resi['display_generic_number']:
            continue
        seq_number = resi['sequence_number']
        gpcrdb_id = resi['display_generic_number']
        pdb_res = gene_to_pdb_res[seq_number]
        pdb_res_str = pdb_res['chain'] + pdb_res['resn'] + pdb_res['resi']
        resi_mapping.append([gene_to_pdb_resi[seq_number], gpcrdb_id])


