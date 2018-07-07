all: annotations.json contacts/dummy

annotations.json: KLIFS_updated.csv
	python fetch_table_data.py $< > $@


KLIFS_updated.csv: KLIFS_X-ray_pocket_numbering_20180412.csv
	cat $< | \
	  sed 's/5uge/5uvf/' | \
	  sed 's/6bw7/6cfm/' | \
	  sed 's/5tkx/5uu1/' | \
	  sed 's/5lqe/5nev/' | \
	  sed 's/4bxa/5cqw/' | \
	  sed 's/4bxb/5cqu/' | \
	  sed 's/5len/6f5e/' | \
	  sed 's/1pmq/4z9l/' | \
	  sed 's/3wj6/5b7v/' | \
	  sed 's/4xg5/5ghv/' | \
	  sed 's/1p38/5uoj/' > $@

pdbids.txt: KLIFS_X-ray_pocket_numbering_20180412.csv
	python extract_pdbids.py $< > $@

structures/dummy: pdbids.txt
	mkdir -p $(dir $@)
	bash ../curl_pdbs.sh $< structures
	touch $@

structures_protonated/%.pdb: structures/%.pdb
	pymol -c $< -d "h_add; load ref.pdb; alignto ref; delete ref; save $@; quit" > /dev/null

structures_protonated/dummy: $(subst structures,structures_protonated,$(wildcard structures/*.pdb))
	touch $@

#structures_protonated/dummy: structures/dummy
#	mkdir -p $(dir $@)
#	for f in $(dir $<)*.pdb; do \
#	  out_file=$(dir $@)$$(basename -- $$f); \
#	  if [ ! -e $$out_file ]; then \
#	    echo pymol -c $$f -d "h_add; load ref.pdb; alignto ref; delete ref; save $$out_file; quit"; \
#	    pymol -c $$f -d "h_add; load ref.pdb; alignto ref; delete ref; save $$out_file; quit" > /dev/null; \
#	  fi \
#	done
#	touch $@

residuelabels/dummy: KLIFS_updated.csv
	mkdir -p $(dir $@)
	python klifs_to_residuelabels.py $< 
	for label_file in residuelabels/*.tsv; do \
	  pdb_file=$$(basename -- $$label_file); \
	  pdb_file=$${pdb_file%%.*}; \
	  pdb_file=structures_protonated/$$pdb_file.pdb; \
	  python pdb_to_ligandlabels.py $$pdb_file >> $$label_file; \
	  echo "Appended ligand to $$label_file"; \
	done
	touch $@


contacts/%.tsv: structures_protonated/%.pdb
	ligs=`python ../get_ligands.py $<`; get_static_contacts.py --structure $< --itype all --ligand $$ligs --solv HOH --hbond_cutoff_ang 180 --vdw_res_diff 5 --output $@

contacts/dummy: $(subst .pdb,.tsv,$(subst structures_protonated,contacts,$(wildcard structures_protonated/*.pdb)))
	touch $@

#contacts/dummy: structures_protonated/dummy
#	mkdir -p $(dir $@)
#	for f in $(dir $<)*.pdb; do \
#	  out_file=$$(basename -- $$f); \
#	  out_file=$${out_file%%.*}; \
#	  out_file=$(dir $@)$$out_file.tsv; \
#	  if [ ! -e $$out_file ]; then \
#	    ligs=`python ../get_ligands.py $$f`; \
#	    echo get_static_contacts.py --structure $$f --itype all --ligand $$ligs --solv HOH --hbond_cutoff_ang 180 --vdw_res_diff 5 --output $$out_file; \
#	    get_static_contacts.py --structure $$f --itype all --ligand $$ligs --solv HOH --hbond_cutoff_ang 180 --vdw_res_diff 5 --output $$out_file; \
#	  fi; \
#	done
#	touch $@
#

