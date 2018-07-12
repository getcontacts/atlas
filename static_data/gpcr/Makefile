
all: annotations.json structures/dummy residuelabels/dummy contacts/dummy

clean:
	rm annotations.json structures/dummy residuelabels/dummy contacts/dummy pdbids.txt gpcrdb_dump.json

gpcrdb_dump.json:
	curl -X GET --header 'Accept: application/json' 'http://gpcrdb.org/services/structure/' > $@

pdbids.txt: gpcrdb_dump.json
	python pdbids_from_gpcrdbdump.py > $@

annotations.json: gpcrdb_dump.json
	python reformat_gpcrdbdump.py $< > $@

structures/dummy: pdbids.txt
	mkdir -p $(dir $@)
	bash ../curl_pdbs.sh $< structures
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
	    echo get_static_contacts.py --structure $$f --itype all --ligand $$ligs --solv HOH --hbond_cutoff_ang 180 --vdw_res_diff 5 --output $$out_file; \
	    get_static_contacts.py --structure $$f --itype all --ligand $$ligs --solv HOH --hbond_cutoff_ang 180 --vdw_res_diff 5 --output $$out_file; \
	  fi; \
	done
	touch $@


