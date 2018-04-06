
# See http://pfam.xfam.org/family/PF00069
KINASE_PFAMIDS = PF00069

# See http://pfam.xfam.org/family/PF00503
GALPHA_PFAMIDS = PF00503

# See http://pfam.xfam.org/clan/CL0192
GPCR_PFAMIDS = PF07698\|PF00001\|PF00002\|PF00003\|PF13853\|PF02117\|PF10292\|PF02175\|PF10316\|PF10317\|PF10318\|PF10327\|PF10319\|PF10320\|PF10321\|PF10322\|PF10323\|PF10324\|PF10328\|PF10325\|PF10326\|PF07695\|PF01036\|PF05875\|PF05462\|PF06681\|PF12036\|PF04789\|PF01534\|PF11710\|PF10192\|PF11970\|PF16927\|PF03006\|PF06814\|PF02101\|PF04080\|PF03383\|PF13965\|PF03125\|PF02118\|PF05296\|PF03402

all: galpha/annotations.json gpcr/annotations.json kinase/annotations.json

# This database had some problems. For instance, the G-protein 1BH2 wasn't present
#pdb_chain_pfam.tsv: 
#	curl -O ftp://ftp.ebi.ac.uk/pub/databases/msd/sifts/flatfiles/tsv/pdb_chain_pfam.tsv.gz
#	gunzip pdb_chain_pfam.tsv.gz

pdbmap.txt: 
	curl -O ftp://ftp.ebi.ac.uk/pub/databases/Pfam/current_release/pdbmap.gz
	gunzip pdbmap.gz
	cat pdbmap | tr -d ';' > $@
	rm pdbmap

galpha:
	mkdir $@

gpcr:
	mkdir $@

kinase:
	mkdir $@

kinase/pdbids.txt: pdbmap.txt kinase
	grep -e "$(KINASE_PFAMIDS)" $< | cut -f 1,2 | sort | rev | uniq -f 1 | rev > $@
	cat $@ | while read line; do bash curl_pdb_chain.sh $$line kinase; done

gpcr/pdbids.txt: pdbmap.txt gpcr
	grep -e "$(GPCR_PFAMIDS)" $< | cut -f 1,2 | sort | rev | uniq -f 1 | rev > $@
	cat $@ | while read line; do bash curl_pdb_chain.sh $$line gpcr; done

galpha/pdbids.txt: pdbmap.txt galpha
	grep -e "$(GALPHA_PFAMIDS)" $< | cut -f 1,2 | sort | rev | uniq -f 1 | rev > $@
	cat $@ | while read line; do bash curl_pdb_chain.sh $$line galpha; done


galpha/annotations.json: galpha/pdbids.txt
	python fetch_table_data.py $< > $@

gpcr/annotations.json: gpcr/pdbids.txt
	python fetch_table_data.py $< > $@

kinase/annotations.json: kinase/pdbids.txt
	python fetch_table_data.py $< > $@


clean:
	rm */pdbids.txt
