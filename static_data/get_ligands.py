#!/usr/bin/env python

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


if __name__ == "__main__":

    import sys
    pdbf = sys.argv[1]
    print(" ".join([resn for resn, _ in extract_ligands(pdbf)]))
