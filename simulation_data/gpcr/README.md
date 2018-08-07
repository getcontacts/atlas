
## Details

Simulations are on sherlock at `/scratch/PI/rondror/polar_networks_subsampled_traj`. A directory structure of `Simulation Name/condition/rep_?` is assumed but individual rules need to be set up in the `Makefile` to specify topology and trajectory file names as well as ligand identifier. To redo full contact analysis run the following on sherlock:
```
make clean
make
```
