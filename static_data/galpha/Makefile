

all: annotations.json structures_protonated/dummy contacts/dummy

# See http://pfam.xfam.org/family/PF00503
PFAMIDS = PF00503

pdbmap.txt: 
	curl -O ftp://ftp.ebi.ac.uk/pub/databases/Pfam/current_release/pdbmap.gz
	gunzip pdbmap.gz
	cat pdbmap | tr -d ';' > $@
	rm pdbmap

pdbids_withpfam.txt: pdbmap.txt pdbids.txt
	grep -e "$(PFAMIDS)" $< | sort | rev | uniq -f 5 | rev | python ../filter.py pdbids.txt > $@

# This assumes that all pdbids are isolated from the galpha_structure_table.txt (https://www.mrc-lmb.cam.ac.uk/CGN/lookup_galpha_structure.html)
pdbids.txt: galpha_structure_table.txt
	head -n 1 $< | cut -f 3- | tr '\t' '\n' > $@

structures/dummy: pdbids_withpfam.txt
	mkdir -p structures
	bash ../curl_pdbs.sh $< structures
#	cat $< | while read line; do bash ../curl_pdb_chain.sh $$line structures; done
	touch $@

structures_protonated/dummy: structures/dummy
	mkdir -p $(dir $@)
	for f in $(dir $<)*.pdb; do \
	  out_file=$(dir $@)$$(basename -- $$f); \
	  if [ ! -e $$out_file ]; then \
	    echo pymol -c $$f -d "h_add; load ref.pdb; alignto ref; delete ref; save $$out_file; quit"; \
	    pymol -c $$f -d "h_add; load ref.pdb; alignto ref; delete ref; save $$out_file; quit" > /dev/null; \
	  fi \
	done
	touch $@

residuelabels/dummy: annotations.json
	mkdir -p $(dir $@)
	python fetch_residuelabels.py $< residuelabels
	touch $@

contacts/dummy: structures_protonated/dummy
	mkdir -p $(dir $@)
	for f in $(dir $<)*.pdb; do \
	  out_file=$$(basename -- $$f); \
	  out_file=$${out_file%%.*}; \
	  out_file=$(dir $@)$$out_file.tsv; \
	  if [ ! -e $$out_file ]; then \
	    ligs=`python ../get_ligands.py $$f`; \
            if [ -z "$$ligs" ]; then ligs="LLLL"; fi; \
	    echo get_static_contacts.py --structure $$f --itype all --ligand "resname $$ligs" --solv 'resname HOH' --hbond_cutoff_ang 180 --vdw_res_diff 5 --sele 'protein or not protein' --output $$out_file; \
	    get_static_contacts.py --structure $$f --itype all --ligand "resname $$ligs" --solv 'resname HOH' --hbond_cutoff_ang 180 --vdw_res_diff 5 --sele 'protein or not protein' --output $$out_file; \
	  fi; \
	done
	touch $@


annotations.json: pdbids_withpfam.txt
	python ../fetch_table_data.py $< > $@
