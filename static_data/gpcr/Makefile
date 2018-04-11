
# See http://pfam.xfam.org/family/PF00503
PFAMIDS = PF00503

all: annotations.json structures/dummy residuelabels/dummy

gpcrdb_dump.json:
	curl -X GET --header 'Accept: application/json' 'http://gpcrdb.org/services/structure/' > $@

pdbids.txt: gpcrdb_dump.json
	python pdbids_from_gpcrdbdump.py > $@


structures/dummy: pdbids.txt
	mkdir -p structures
	bash ../curl_pdbs.sh $< structures
	touch $@

residuelabels/dummy: annotations.json
	python fetch_residuelabels.py $< residuelabels
	touch $@

annotations.json: gpcrdb_dump.json
	python reformat_gpcrdbdump.py $< > $@
