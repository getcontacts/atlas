
# See http://pfam.xfam.org/family/PF00503
PFAMIDS = PF00503

all: annotations.json structures/dummy

pdbmap.txt: 
	curl -O ftp://ftp.ebi.ac.uk/pub/databases/Pfam/current_release/pdbmap.gz
	gunzip pdbmap.gz
	cat pdbmap | tr -d ';' > $@
	rm pdbmap

pdbids.txt: pdbmap.txt
	grep -e "$(PFAMIDS)" $< | sort | rev | uniq -f 5 | rev > $@

structures/dummy: pdbids.txt
	mkdir -p structures
	bash ../curl_pdbs.sh $< structures
#	cat $< | while read line; do bash ../curl_pdb_chain.sh $$line structures; done
	touch $@

annotations.json: pdbids.txt
	python ../fetch_table_data.py $< > $@
