
all: annotations.json structures/dummy residuelabels/dummy

gpcrdb_dump.json:
	curl -X GET --header 'Accept: application/json' 'http://gpcrdb.org/services/structure/' > $@

pdbids.txt: gpcrdb_dump.json
	python pdbids_from_gpcrdbdump.py > $@


structures/dummy: pdbids.txt
	mkdir -p $(dir $@)
	bash ../curl_pdbs.sh $< structures
	touch $@

structures_protonated/dummy: structures/dummy
	mkdir -p $(dir $@)
	for f in $(dir $<)/*.pdb; do \
	  out_file=$(dir $@)$$(basename -- $$f); \
	  if [ ! -e $$out_file ]; then \
	    echo "reduce $$f"; \
	    reduce $$f > $$out_file 2> /dev/null; \
	  fi \
	done
	touch $@


residuelabels/dummy: annotations.json
	mkdir -p $(dir $@)
	python fetch_residuelabels.py $< residuelabels
	touch $@

contacts/dummy: structures/dummy
	mkdir -p $(dir $@)
	for f in $(dir $<)/*.pdb; do \
	  out_file=$(dir $@)/$$(basename -- $$f); \
	  if [ ! -e $$out_file ]; then \
	    get_static_contacts.py --topology $$f --itype all --output $$out_file; \
	  fi \
	done
	touch $@

annotations.json: gpcrdb_dump.json
	python reformat_gpcrdbdump.py $< > $@
