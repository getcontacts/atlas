
## Details

Simulations are on sherlock at `/scratch/PI/rondror/polar_networks_subsampled_traj`. The `annotations.json` file is manually curated (and self-explanatory). Simply extend or modify and run the following on sherlock to redo full contact analysis:
```
python genMakefile.py
make
pymol alignAndStripLipids.pml
```

The reason for the makefile generation step is that we want to keep all user-defined meta-data in the `annotations.json` so rules and directory names have to be extracted from there before we can use make. 

The `alignAndStripLipids.pml` is a hack and should be incorporated in the makefile (given more time)
