import sys
import requests
import json
from ftplib import FTP
import gzip
import xml.etree.ElementTree as ET
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
        url = 'http://gpcrdb.org/services/residues/extended/'+protid+'/'
        response = requests.get(url)
        residue_data = response.json() 

        generic_numbers[protid] = {}
        for residue in residue_data:
            gen_number = residue['display_generic_number']
            if gen_number:
                generic_numbers[protid][residue['sequence_number']] = gen_number

    pdbid = prot['pdbid'].lower()
    xml_file = 'sifts_mapping/'+pdbid+'.xml.gz'
    if not os.path.isfile(xml_file):
        pdbid_mid = pdbid[1:3]
        ftp.cwd('/pub/databases/msd/sifts/split_xml/'+pdbid_mid+'/')
        ftp.retrbinary('RETR '+pdbid+'.xml.gz', open(xml_file, 'wb').write)
    with gzip.open(xml_file) as f:
        sifts_xml = ET.fromstring(f.read())

    # Determine accession id
    print(sifts_xml)
    for child in sifts_xml:
        print(child)
    for entity in sifts_xml.findall('entity'):
        print("Found something")
        for segment in entity.findall('segment'):
            for map_region in segment.find('listMapRegion').findall('mapRegion'):
                detail = map_region.find('dbDetail')
                print(detail)
                if detail and detail.text == protid.upper():
                    accession = map_region.find('db')['dbAccessionId']
    print(protid + ": " + accession)







