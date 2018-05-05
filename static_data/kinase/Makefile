

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
