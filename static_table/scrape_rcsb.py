"""
Given a file containing PDB-ids this script scrapes RCSB for info and writes it to stdout. Each PDB-id is 
on a line by itself. Chains can be specified by appending e.g. '_B'.

Usage:
    scrape_rcsb.py pdbid_file.txt
"""

import re
import bs4
import requests
import sys
import json


def scrape_pdb(pdbid):
  chain = 'A'
  if len(pdbid) == 6:
      chain = pdbid[5]
      pdbid = pdbid[0:4]

  response = requests.get('https://www.rcsb.org/structure/'+pdbid)
  soup = bs4.BeautifulSoup(response.text, "html.parser")
  release_li = soup.select('#header_deposited-released-dates')[0]
  year = release_li
  year = re.search(r'Released:.*strong>(.*)-.*-', str(release_li))[1]

  title = soup.select('#structureTitle')[0].get_text()

  method = soup.select('#exp_0_method')[0].get_text()
  organism = soup.select('#macromolecule-entityId-1-rowDescription td')[3].get_text()

  #genename = soup.select('#macromolecule-entityId-1-rowDescription td')[4].get_text()
  #genename = re.search("\((.*)\)", genename)[1]
  genename = soup.select('#macromolecule-entityId-1-rowDescription td')[4]
  genename = re.search("Gene Names</strong>: ([a-zA-Z0-9\-]*)", str(genename))[1]

  ligands = []
  for tr in soup.select('#LigandsMainTable tbody')[0].select("tr"):
      ligands.append({"name": tr.select("td:nth-of-type(1)")[0].select("a:nth-of-type(1)")[0].get_text()})

  publication = soup.select('#primarycitation #pubmedDOI a')[0]['href']
  #pub_year = soup.select('#primarycitation p').get_text()
  #pub_year = re.search(r'Released:.*strong>(.*)-.*-', str(release_li))[1]

  #print("\t".join((pdbid, organism, genename, year, ligands, title)))
  ret = {
          "species": organism,
          "family": "?",
          "publication_date": year,
          "pdb_code": pdbid,
          "preferred_chain": chain,
          "publication": publication,
          "ligands": ligands,
          "protein": "?",
          "type": method,
          "resolution": 2.2
          }
  print(json.dumps(ret, indent=2))


#    "species":"Homo sapiens",
#    "family":"001_002_026_001",
#    "publication_date":"2012-12-12",
#    "pdb_code":"3VW7",
#    "preferred_chain":"A",
#    "publication":"http://dx.doi.org/10.1038/NATURE11701",
#    "ligands":[  
#      {  
#        "function":"Antagonist",
#        "type":"Small molecule",
#        "name":"Vorapaxar"
#      }
#    ],
#    "protein":"par1_human",
#    "type":"X-ray diffraction",
#    "resolution":2.2

with open(sys.argv[1]) as f:
  for pdbid in f.readlines():
    try:
      scrape_pdb(pdbid.strip())
    except IndexError:
      pass


