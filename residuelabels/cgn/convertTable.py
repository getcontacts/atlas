import re
from bs4 import BeautifulSoup

# Map from single-to-three character residue name
resnmap = {
        'A': 'ALA', 'C': 'CYS', 'D': 'ASP', 'E': 'GLU', 'F': 'PHE', 'G': 'GLY', 'H': 'HIS',
        'I': 'ILE', 'K': 'LYS', 'L': 'LEU', 'M': 'MET', 'N': 'ASN', 'P': 'PRO', 'Q': 'GLN', 
        'R': 'ARG', 'S': 'SER', 'T': 'THR', 'V': 'VAL', 'W': 'TRP', 'Y': 'TYR'
}

print('Parsing table ..')

with open('cgn_fulltable.html') as f:
    data = BeautifulSoup(f.read(), 'lxml')

pdbs = list(map(lambda th: th.string, data.find_all('th')))[1:]
labels = [[] for _ in pdbs]

# Parse labels from data
for row in data.tbody.find_all('tr'):
    cgnid = row.td.string
    for colidx, col in enumerate(list(row.find_all('td'))[1:]):
        if col.string == '-': 
            continue
        resid = 'A:' + resnmap[col.string[0]] + ':' + col.string[1:]
        labels[colidx].append([cgnid, resid])

# Relabel G-domains so they have numbers
for labellist in labels:
    before_h_domain = True
    for label in labellist:
        cgnid = label[0]
        if cgnid[0] == 'H':
            before_h_domain = False
        elif cgnid[0] == 'G' and before_h_domain:
            label[0] = 'G1' + cgnid[1:]
        elif cgnid[0] == 'G' and not before_h_domain:
            label[0] = 'G2' + cgnid[1:]

# Secondary structure color function
def label_col(label):
    cols = {'H': 'rgb(207, 112, 112)', 'S': 'rgb(226, 223, 147)', 'L': 'rgb(221, 230, 222)'}
    sse = label.split('.')[1]
    if len(sse) == 4: 
        return cols['L']
    return cols[sse[0]]

# Write to residue label files
for pdb, labels in zip(pdbs, labels):
    fname = pdb + '_labels.tsv'
    print('Writing ' + fname)
    with open(fname, 'w') as f:
        for cgnid, resid in labellist:
            f.write(resid + '\t' + cgnid + '\t' + label_col(cgnid) + '\n')


