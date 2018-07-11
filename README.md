# Contact comparison atlas

This repo serves a static github page at https://getcontacts.github.io/atlas/ that allows structural biologists to compare interaction networks in different protein families. 

## Updating the databases

Each protein family is located in `static_data/FAMILY` where `FAMILY` can currently be one of `GPCR`, `galpha`, or `kinase`. Maintenance of structures and contacts in these families are coordinated through makefiles located in each subfolder, e.g. `static_data/GPCR/Makefile`. A makefile is a set of rules that defines dependencies between files and a recipe for generating all files. In principle a family can be updated by typing 
```bash
cd static_data/FAMILY
make clean
make
```
but some parts of this pipeline are not yet fully automated, so the following sections outline a practical guide to updating the atlas.

### GPCR

...

### G-protein subunit alpha

...

### Kinase

...

