import sys
import requests
import json
from ftplib import FTP
import gzip
from lxml import etree
import os.path
import re
from collections import defaultdict

annotation_file = sys.argv[1]
output_dir = sys.argv[2]

aminoresnmap={ 
        'A':'ALA', 'R':'ARG', 'N':'ASN', 'D':'ASP', 'B':'ASX', 'C':'CYS', 'E':'GLU', 
        'Q':'GLN', 'Z':'GLX', 'G':'GLY', 'H':'HIS', 'I':'ILE', 'L':'LEU', 'K':'LYS', 
        'M':'MET', 'F':'PHE', 'P':'PRO', 'S':'SER', 'T':'THR', 'W':'TRP', 'Y':'TYR', 'V':'VAL'
        } 

def extract_ligands(fname):
    excluded_ligands = set([
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
        "IPA", "IMD", "HOH"
        ])

    with open(fname) as f:
        lines = f.readlines()
    ligands = set([(l[17:20].strip(), l[22:26].strip()) for l in lines if l.startswith("HETATM")])
    ligands = [(resn, resi) for (resn, resi) in ligands if resn not in excluded_ligands]
    return ligands


with open(annotation_file) as f:
    annotations = json.loads(f.read())

pdb_to_chain = {prot['pdbid']: prot['chain'] for prot in annotations}

# Dictionary association pdb-ids with a list of CGN number / residue number pairs
with open('galpha_structure_table.txt') as f:
    lines = f.readlines()
    pdbs = [pdb.strip() for pdb in lines[0].split('\t')[2:]]
    pdb_to_res = defaultdict(list)

    for line in lines[1:]:
        tokens = line.split("\t")
        cgn_number = tokens[0]

        for i, res in enumerate(tokens[2:]):
            res = res.strip()
            if res == "-":
                continue
            pdb = pdbs[i]
            resi = int(res[1:])
            resn = aminoresnmap[res[0]]
            pdb_to_res[pdb].append((cgn_number, resi, resn))

print(pdb_to_chain)


