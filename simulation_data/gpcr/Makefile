all: ../../simulation_data/gpcr/DOR-inactive-naltrondiole-wLig-rep1/contacts.tsv ../../simulation_data/gpcr/DOR-inactive-naltrondiole-wLig-rep2/contacts.tsv ../../simulation_data/gpcr/DOR-inactive-naltrondiole-wLig-rep3/contacts.tsv ../../simulation_data/gpcr/M2R-active-restrained-rep1/contacts.tsv ../../simulation_data/gpcr/M2R-active-restrained-rep2/contacts.tsv ../../simulation_data/gpcr/M2R-active-restrained-rep3/contacts.tsv ../../simulation_data/gpcr/M2R-active-unrestrained-rep1/contacts.tsv ../../simulation_data/gpcr/M2R-active-unrestrained-rep2/contacts.tsv ../../simulation_data/gpcr/M2R-active-unrestrained-rep3/contacts.tsv ../../simulation_data/gpcr/M2R-inactive-QNB-condA-rep1/contacts.tsv ../../simulation_data/gpcr/M2R-inactive-QNB-condAE-rep1/contacts.tsv ../../simulation_data/gpcr/MOR-active-Nb-rep1/contacts.tsv ../../simulation_data/gpcr/MOR-active-Nb-rep2/contacts.tsv ../../simulation_data/gpcr/MOR-active-Nb-rep3/contacts.tsv ../../simulation_data/gpcr/MOR-active-noNb-BU72-rep1/contacts.tsv ../../simulation_data/gpcr/MOR-active-noNb-BU72-rep2/contacts.tsv ../../simulation_data/gpcr/MOR-active-noNb-BU72-rep3/contacts.tsv ../../simulation_data/gpcr/MOR-inactive-bFNA-rep1/contacts.tsv ../../simulation_data/gpcr/MOR-inactive-bFNA-rep2/contacts.tsv ../../simulation_data/gpcr/A2A-active-NEC-rep1/contacts.tsv ../../simulation_data/gpcr/A2A-active-NEC-rep2/contacts.tsv ../../simulation_data/gpcr/A2A-active-NEC-rep3/contacts.tsv ../../simulation_data/gpcr/A2A-active-NEC-rep4/contacts.tsv ../../simulation_data/gpcr/A2A-active-NEC-rep5/contacts.tsv 

SECONDARY:

GCARGS = --itypes all --hbond_cutoff_ang 180 --vdw_res_diff 5 --cores 2

###########################
../../simulation_data/gpcr/DOR-inactive-naltrondiole-wLig-rep1/:
	mkdir -p $@

../../simulation_data/gpcr/DOR-inactive-naltrondiole-wLig-rep1/top.pdb: /scratch/PI/rondror/polar_networks_subsampled_traj/DOR-inactive-naltrindole-unpublished/condition-naltrindole-bound/rep_1/step5_assembly.pdb ../../simulation_data/gpcr/DOR-inactive-naltrondiole-wLig-rep1/
	cp $< $@

../../simulation_data/gpcr/DOR-inactive-naltrondiole-wLig-rep1/labels.tsv: ../../static_data/gpcr/residuelabels/4N6H_A.tsv ../../simulation_data/gpcr/DOR-inactive-naltrondiole-wLig-rep1/
	cp $< $@

../../simulation_data/gpcr/DOR-inactive-naltrondiole-wLig-rep1/contacts.tsv: /scratch/PI/rondror/polar_networks_subsampled_traj/DOR-inactive-naltrindole-unpublished/condition-naltrindole-bound/rep_1/step5_assembly.pdb /scratch/PI/rondror/polar_networks_subsampled_traj/DOR-inactive-naltrindole-unpublished/condition-naltrindole-bound/rep_1/stitched.dcd ../../simulation_data/gpcr/DOR-inactive-naltrondiole-wLig-rep1/
	get_dynamic_contacts.py --topology /scratch/PI/rondror/polar_networks_subsampled_traj/DOR-inactive-naltrindole-unpublished/condition-naltrindole-bound/rep_1/step5_assembly.pdb --trajectory /scratch/PI/rondror/polar_networks_subsampled_traj/DOR-inactive-naltrindole-unpublished/condition-naltrindole-bound/rep_1/stitched.dcd --output $@ --sele "protein or ligand" --ligand "resname EJ4" $(GCARGS)

###########################
../../simulation_data/gpcr/DOR-inactive-naltrondiole-wLig-rep2/:
	mkdir -p $@

../../simulation_data/gpcr/DOR-inactive-naltrondiole-wLig-rep2/top.pdb: /scratch/PI/rondror/polar_networks_subsampled_traj/DOR-inactive-naltrindole-unpublished/condition-naltrindole-bound/rep_2/step5_assembly.pdb ../../simulation_data/gpcr/DOR-inactive-naltrondiole-wLig-rep2/
	cp $< $@

../../simulation_data/gpcr/DOR-inactive-naltrondiole-wLig-rep2/labels.tsv: ../../static_data/gpcr/residuelabels/4N6H_A.tsv ../../simulation_data/gpcr/DOR-inactive-naltrondiole-wLig-rep2/
	cp $< $@

../../simulation_data/gpcr/DOR-inactive-naltrondiole-wLig-rep2/contacts.tsv: /scratch/PI/rondror/polar_networks_subsampled_traj/DOR-inactive-naltrindole-unpublished/condition-naltrindole-bound/rep_2/step5_assembly.pdb /scratch/PI/rondror/polar_networks_subsampled_traj/DOR-inactive-naltrindole-unpublished/condition-naltrindole-bound/rep_2/stitched.dcd ../../simulation_data/gpcr/DOR-inactive-naltrondiole-wLig-rep2/
	get_dynamic_contacts.py --topology /scratch/PI/rondror/polar_networks_subsampled_traj/DOR-inactive-naltrindole-unpublished/condition-naltrindole-bound/rep_2/step5_assembly.pdb --trajectory /scratch/PI/rondror/polar_networks_subsampled_traj/DOR-inactive-naltrindole-unpublished/condition-naltrindole-bound/rep_2/stitched.dcd --output $@ --sele "protein or ligand" --ligand "resname EJ4" $(GCARGS)

###########################
../../simulation_data/gpcr/DOR-inactive-naltrondiole-wLig-rep3/:
	mkdir -p $@

../../simulation_data/gpcr/DOR-inactive-naltrondiole-wLig-rep3/top.pdb: /scratch/PI/rondror/polar_networks_subsampled_traj/DOR-inactive-naltrindole-unpublished/condition-naltrindole-bound/rep_3/step5_assembly.pdb ../../simulation_data/gpcr/DOR-inactive-naltrondiole-wLig-rep3/
	cp $< $@

../../simulation_data/gpcr/DOR-inactive-naltrondiole-wLig-rep3/labels.tsv: ../../static_data/gpcr/residuelabels/4N6H_A.tsv ../../simulation_data/gpcr/DOR-inactive-naltrondiole-wLig-rep3/
	cp $< $@

../../simulation_data/gpcr/DOR-inactive-naltrondiole-wLig-rep3/contacts.tsv: /scratch/PI/rondror/polar_networks_subsampled_traj/DOR-inactive-naltrindole-unpublished/condition-naltrindole-bound/rep_3/step5_assembly.pdb /scratch/PI/rondror/polar_networks_subsampled_traj/DOR-inactive-naltrindole-unpublished/condition-naltrindole-bound/rep_3/stitched.dcd ../../simulation_data/gpcr/DOR-inactive-naltrondiole-wLig-rep3/
	get_dynamic_contacts.py --topology /scratch/PI/rondror/polar_networks_subsampled_traj/DOR-inactive-naltrindole-unpublished/condition-naltrindole-bound/rep_3/step5_assembly.pdb --trajectory /scratch/PI/rondror/polar_networks_subsampled_traj/DOR-inactive-naltrindole-unpublished/condition-naltrindole-bound/rep_3/stitched.dcd --output $@ --sele "protein or ligand" --ligand "resname EJ4" $(GCARGS)

###########################
../../simulation_data/gpcr/M2R-active-restrained-rep1/:
	mkdir -p $@

../../simulation_data/gpcr/M2R-active-restrained-rep1/top.pdb: /scratch/PI/rondror/polar_networks_subsampled_traj/M2R-active-restrained-unpublished/condition-prot-asp2x50-3x49/rep_1/step5_assembly.pdb ../../simulation_data/gpcr/M2R-active-restrained-rep1/
	cp $< $@

../../simulation_data/gpcr/M2R-active-restrained-rep1/labels.tsv: ../../static_data/gpcr/residuelabels/4MQS_A.tsv ../../simulation_data/gpcr/M2R-active-restrained-rep1/
	cp $< $@

../../simulation_data/gpcr/M2R-active-restrained-rep1/contacts.tsv: /scratch/PI/rondror/polar_networks_subsampled_traj/M2R-active-restrained-unpublished/condition-prot-asp2x50-3x49/rep_1/step5_assembly.pdb /scratch/PI/rondror/polar_networks_subsampled_traj/M2R-active-restrained-unpublished/condition-prot-asp2x50-3x49/rep_1/stitched.dcd ../../simulation_data/gpcr/M2R-active-restrained-rep1/
	get_dynamic_contacts.py --topology /scratch/PI/rondror/polar_networks_subsampled_traj/M2R-active-restrained-unpublished/condition-prot-asp2x50-3x49/rep_1/step5_assembly.pdb --trajectory /scratch/PI/rondror/polar_networks_subsampled_traj/M2R-active-restrained-unpublished/condition-prot-asp2x50-3x49/rep_1/stitched.dcd --output $@ --sele "protein or ligand" --ligand "resname IXO" $(GCARGS)

###########################
../../simulation_data/gpcr/M2R-active-restrained-rep2/:
	mkdir -p $@

../../simulation_data/gpcr/M2R-active-restrained-rep2/top.pdb: /scratch/PI/rondror/polar_networks_subsampled_traj/M2R-active-restrained-unpublished/condition-prot-asp2x50-3x49/rep_2/step5_assembly.pdb ../../simulation_data/gpcr/M2R-active-restrained-rep2/
	cp $< $@

../../simulation_data/gpcr/M2R-active-restrained-rep2/labels.tsv: ../../static_data/gpcr/residuelabels/4MQS_A.tsv ../../simulation_data/gpcr/M2R-active-restrained-rep2/
	cp $< $@

../../simulation_data/gpcr/M2R-active-restrained-rep2/contacts.tsv: /scratch/PI/rondror/polar_networks_subsampled_traj/M2R-active-restrained-unpublished/condition-prot-asp2x50-3x49/rep_2/step5_assembly.pdb /scratch/PI/rondror/polar_networks_subsampled_traj/M2R-active-restrained-unpublished/condition-prot-asp2x50-3x49/rep_2/stitched.dcd ../../simulation_data/gpcr/M2R-active-restrained-rep2/
	get_dynamic_contacts.py --topology /scratch/PI/rondror/polar_networks_subsampled_traj/M2R-active-restrained-unpublished/condition-prot-asp2x50-3x49/rep_2/step5_assembly.pdb --trajectory /scratch/PI/rondror/polar_networks_subsampled_traj/M2R-active-restrained-unpublished/condition-prot-asp2x50-3x49/rep_2/stitched.dcd --output $@ --sele "protein or ligand" --ligand "resname IXO" $(GCARGS)

###########################
../../simulation_data/gpcr/M2R-active-restrained-rep3/:
	mkdir -p $@

../../simulation_data/gpcr/M2R-active-restrained-rep3/top.pdb: /scratch/PI/rondror/polar_networks_subsampled_traj/M2R-active-restrained-unpublished/condition-prot-asp2x50-3x49/rep_3/step5_assembly.pdb ../../simulation_data/gpcr/M2R-active-restrained-rep3/
	cp $< $@

../../simulation_data/gpcr/M2R-active-restrained-rep3/labels.tsv: ../../static_data/gpcr/residuelabels/4MQS_A.tsv ../../simulation_data/gpcr/M2R-active-restrained-rep3/
	cp $< $@

../../simulation_data/gpcr/M2R-active-restrained-rep3/contacts.tsv: /scratch/PI/rondror/polar_networks_subsampled_traj/M2R-active-restrained-unpublished/condition-prot-asp2x50-3x49/rep_3/step5_assembly.pdb /scratch/PI/rondror/polar_networks_subsampled_traj/M2R-active-restrained-unpublished/condition-prot-asp2x50-3x49/rep_3/stitched.dcd ../../simulation_data/gpcr/M2R-active-restrained-rep3/
	get_dynamic_contacts.py --topology /scratch/PI/rondror/polar_networks_subsampled_traj/M2R-active-restrained-unpublished/condition-prot-asp2x50-3x49/rep_3/step5_assembly.pdb --trajectory /scratch/PI/rondror/polar_networks_subsampled_traj/M2R-active-restrained-unpublished/condition-prot-asp2x50-3x49/rep_3/stitched.dcd --output $@ --sele "protein or ligand" --ligand "resname IXO" $(GCARGS)

###########################
../../simulation_data/gpcr/M2R-active-unrestrained-rep1/:
	mkdir -p $@

../../simulation_data/gpcr/M2R-active-unrestrained-rep1/top.pdb: /scratch/PI/rondror/polar_networks_subsampled_traj/M2R-active-unrestrained-unpublished/condition-prot-asp2x50-3x49/rep_1/step5_assembly.pdb ../../simulation_data/gpcr/M2R-active-unrestrained-rep1/
	cp $< $@

../../simulation_data/gpcr/M2R-active-unrestrained-rep1/labels.tsv: ../../static_data/gpcr/residuelabels/4MQS_A.tsv ../../simulation_data/gpcr/M2R-active-unrestrained-rep1/
	cp $< $@

../../simulation_data/gpcr/M2R-active-unrestrained-rep1/contacts.tsv: /scratch/PI/rondror/polar_networks_subsampled_traj/M2R-active-unrestrained-unpublished/condition-prot-asp2x50-3x49/rep_1/step5_assembly.pdb /scratch/PI/rondror/polar_networks_subsampled_traj/M2R-active-unrestrained-unpublished/condition-prot-asp2x50-3x49/rep_1/stitched.dcd ../../simulation_data/gpcr/M2R-active-unrestrained-rep1/
	get_dynamic_contacts.py --topology /scratch/PI/rondror/polar_networks_subsampled_traj/M2R-active-unrestrained-unpublished/condition-prot-asp2x50-3x49/rep_1/step5_assembly.pdb --trajectory /scratch/PI/rondror/polar_networks_subsampled_traj/M2R-active-unrestrained-unpublished/condition-prot-asp2x50-3x49/rep_1/stitched.dcd --output $@ --sele "protein or ligand" --ligand "resname IXO" $(GCARGS)

###########################
../../simulation_data/gpcr/M2R-active-unrestrained-rep2/:
	mkdir -p $@

../../simulation_data/gpcr/M2R-active-unrestrained-rep2/top.pdb: /scratch/PI/rondror/polar_networks_subsampled_traj/M2R-active-unrestrained-unpublished/condition-prot-asp2x50-3x49/rep_2/step5_assembly.pdb ../../simulation_data/gpcr/M2R-active-unrestrained-rep2/
	cp $< $@

../../simulation_data/gpcr/M2R-active-unrestrained-rep2/labels.tsv: ../../static_data/gpcr/residuelabels/4MQS_A.tsv ../../simulation_data/gpcr/M2R-active-unrestrained-rep2/
	cp $< $@

../../simulation_data/gpcr/M2R-active-unrestrained-rep2/contacts.tsv: /scratch/PI/rondror/polar_networks_subsampled_traj/M2R-active-unrestrained-unpublished/condition-prot-asp2x50-3x49/rep_2/step5_assembly.pdb /scratch/PI/rondror/polar_networks_subsampled_traj/M2R-active-unrestrained-unpublished/condition-prot-asp2x50-3x49/rep_2/stitched.dcd ../../simulation_data/gpcr/M2R-active-unrestrained-rep2/
	get_dynamic_contacts.py --topology /scratch/PI/rondror/polar_networks_subsampled_traj/M2R-active-unrestrained-unpublished/condition-prot-asp2x50-3x49/rep_2/step5_assembly.pdb --trajectory /scratch/PI/rondror/polar_networks_subsampled_traj/M2R-active-unrestrained-unpublished/condition-prot-asp2x50-3x49/rep_2/stitched.dcd --output $@ --sele "protein or ligand" --ligand "resname IXO" $(GCARGS)

###########################
../../simulation_data/gpcr/M2R-active-unrestrained-rep3/:
	mkdir -p $@

../../simulation_data/gpcr/M2R-active-unrestrained-rep3/top.pdb: /scratch/PI/rondror/polar_networks_subsampled_traj/M2R-active-unrestrained-unpublished/condition-prot-asp2x50-3x49/rep_3/step5_assembly.pdb ../../simulation_data/gpcr/M2R-active-unrestrained-rep3/
	cp $< $@

../../simulation_data/gpcr/M2R-active-unrestrained-rep3/labels.tsv: ../../static_data/gpcr/residuelabels/4MQS_A.tsv ../../simulation_data/gpcr/M2R-active-unrestrained-rep3/
	cp $< $@

../../simulation_data/gpcr/M2R-active-unrestrained-rep3/contacts.tsv: /scratch/PI/rondror/polar_networks_subsampled_traj/M2R-active-unrestrained-unpublished/condition-prot-asp2x50-3x49/rep_3/step5_assembly.pdb /scratch/PI/rondror/polar_networks_subsampled_traj/M2R-active-unrestrained-unpublished/condition-prot-asp2x50-3x49/rep_3/stitched.dcd ../../simulation_data/gpcr/M2R-active-unrestrained-rep3/
	get_dynamic_contacts.py --topology /scratch/PI/rondror/polar_networks_subsampled_traj/M2R-active-unrestrained-unpublished/condition-prot-asp2x50-3x49/rep_3/step5_assembly.pdb --trajectory /scratch/PI/rondror/polar_networks_subsampled_traj/M2R-active-unrestrained-unpublished/condition-prot-asp2x50-3x49/rep_3/stitched.dcd --output $@ --sele "protein or ligand" --ligand "resname IXO" $(GCARGS)

###########################
../../simulation_data/gpcr/M2R-inactive-QNB-condA-rep1/:
	mkdir -p $@

../../simulation_data/gpcr/M2R-inactive-QNB-condA-rep1/top.pdb: /scratch/PI/rondror/polar_networks_subsampled_traj/M2R-inactive-QNB-nature2012/condition-A/rep_1/nature2012-A-M2-QNB-all.mae ../../simulation_data/gpcr/M2R-inactive-QNB-condA-rep1/
	cp $< $@

../../simulation_data/gpcr/M2R-inactive-QNB-condA-rep1/labels.tsv: ../../static_data/gpcr/residuelabels/3UON_A.tsv ../../simulation_data/gpcr/M2R-inactive-QNB-condA-rep1/
	cp $< $@

../../simulation_data/gpcr/M2R-inactive-QNB-condA-rep1/contacts.tsv: /scratch/PI/rondror/polar_networks_subsampled_traj/M2R-inactive-QNB-nature2012/condition-A/rep_1/nature2012-A-M2-QNB-all.mae /scratch/PI/rondror/polar_networks_subsampled_traj/M2R-inactive-QNB-nature2012/condition-A/rep_1/stitched.dcd ../../simulation_data/gpcr/M2R-inactive-QNB-condA-rep1/
	get_dynamic_contacts.py --topology /scratch/PI/rondror/polar_networks_subsampled_traj/M2R-inactive-QNB-nature2012/condition-A/rep_1/nature2012-A-M2-QNB-all.mae --trajectory /scratch/PI/rondror/polar_networks_subsampled_traj/M2R-inactive-QNB-nature2012/condition-A/rep_1/stitched.dcd --output $@ --sele "protein or ligand" --ligand "resname QNBP" $(GCARGS)

###########################
../../simulation_data/gpcr/M2R-inactive-QNB-condAE-rep1/:
	mkdir -p $@

../../simulation_data/gpcr/M2R-inactive-QNB-condAE-rep1/top.pdb: /scratch/PI/rondror/polar_networks_subsampled_traj/M2R-inactive-QNB-nature2013/condition-AE/rep_1/nature2013-AE-64-all.mae ../../simulation_data/gpcr/M2R-inactive-QNB-condAE-rep1/
	cp $< $@

../../simulation_data/gpcr/M2R-inactive-QNB-condAE-rep1/labels.tsv: ../../static_data/gpcr/residuelabels/3UON_A.tsv ../../simulation_data/gpcr/M2R-inactive-QNB-condAE-rep1/
	cp $< $@

../../simulation_data/gpcr/M2R-inactive-QNB-condAE-rep1/contacts.tsv: /scratch/PI/rondror/polar_networks_subsampled_traj/M2R-inactive-QNB-nature2013/condition-AE/rep_1/nature2013-AE-64-all.mae /scratch/PI/rondror/polar_networks_subsampled_traj/M2R-inactive-QNB-nature2013/condition-AE/rep_1/stitched.dcd ../../simulation_data/gpcr/M2R-inactive-QNB-condAE-rep1/
	get_dynamic_contacts.py --topology /scratch/PI/rondror/polar_networks_subsampled_traj/M2R-inactive-QNB-nature2013/condition-AE/rep_1/nature2013-AE-64-all.mae --trajectory /scratch/PI/rondror/polar_networks_subsampled_traj/M2R-inactive-QNB-nature2013/condition-AE/rep_1/stitched.dcd --output $@ --sele "protein or ligand" --ligand "resname QNB" $(GCARGS)

###########################
../../simulation_data/gpcr/MOR-active-Nb-rep1/:
	mkdir -p $@

../../simulation_data/gpcr/MOR-active-Nb-rep1/top.pdb: /scratch/PI/rondror/polar_networks_subsampled_traj/MOR-active-Nb-unpublished/condition-prot-D114-D164-nb-interface-restrained/rep_1/step5_assembly.pdb ../../simulation_data/gpcr/MOR-active-Nb-rep1/
	cp $< $@

../../simulation_data/gpcr/MOR-active-Nb-rep1/labels.tsv: ../../static_data/gpcr/residuelabels/5C1M_A.tsv ../../simulation_data/gpcr/MOR-active-Nb-rep1/
	cp $< $@

../../simulation_data/gpcr/MOR-active-Nb-rep1/contacts.tsv: /scratch/PI/rondror/polar_networks_subsampled_traj/MOR-active-Nb-unpublished/condition-prot-D114-D164-nb-interface-restrained/rep_1/step5_assembly.pdb /scratch/PI/rondror/polar_networks_subsampled_traj/MOR-active-Nb-unpublished/condition-prot-D114-D164-nb-interface-restrained/rep_1/stitched.dcd ../../simulation_data/gpcr/MOR-active-Nb-rep1/
	get_dynamic_contacts.py --topology /scratch/PI/rondror/polar_networks_subsampled_traj/MOR-active-Nb-unpublished/condition-prot-D114-D164-nb-interface-restrained/rep_1/step5_assembly.pdb --trajectory /scratch/PI/rondror/polar_networks_subsampled_traj/MOR-active-Nb-unpublished/condition-prot-D114-D164-nb-interface-restrained/rep_1/stitched.dcd --output $@ --sele "protein or ligand" --ligand "resname H3B" $(GCARGS)

###########################
../../simulation_data/gpcr/MOR-active-Nb-rep2/:
	mkdir -p $@

../../simulation_data/gpcr/MOR-active-Nb-rep2/top.pdb: /scratch/PI/rondror/polar_networks_subsampled_traj/MOR-active-Nb-unpublished/condition-prot-D114-D164-nb-interface-restrained/rep_2/step5_assembly.pdb ../../simulation_data/gpcr/MOR-active-Nb-rep2/
	cp $< $@

../../simulation_data/gpcr/MOR-active-Nb-rep2/labels.tsv: ../../static_data/gpcr/residuelabels/5C1M_A.tsv ../../simulation_data/gpcr/MOR-active-Nb-rep2/
	cp $< $@

../../simulation_data/gpcr/MOR-active-Nb-rep2/contacts.tsv: /scratch/PI/rondror/polar_networks_subsampled_traj/MOR-active-Nb-unpublished/condition-prot-D114-D164-nb-interface-restrained/rep_2/step5_assembly.pdb /scratch/PI/rondror/polar_networks_subsampled_traj/MOR-active-Nb-unpublished/condition-prot-D114-D164-nb-interface-restrained/rep_2/stitched.dcd ../../simulation_data/gpcr/MOR-active-Nb-rep2/
	get_dynamic_contacts.py --topology /scratch/PI/rondror/polar_networks_subsampled_traj/MOR-active-Nb-unpublished/condition-prot-D114-D164-nb-interface-restrained/rep_2/step5_assembly.pdb --trajectory /scratch/PI/rondror/polar_networks_subsampled_traj/MOR-active-Nb-unpublished/condition-prot-D114-D164-nb-interface-restrained/rep_2/stitched.dcd --output $@ --sele "protein or ligand" --ligand "resname H3B" $(GCARGS)

###########################
../../simulation_data/gpcr/MOR-active-Nb-rep3/:
	mkdir -p $@

../../simulation_data/gpcr/MOR-active-Nb-rep3/top.pdb: /scratch/PI/rondror/polar_networks_subsampled_traj/MOR-active-Nb-unpublished/condition-prot-D114-D164-nb-interface-restrained/rep_3/step5_assembly.pdb ../../simulation_data/gpcr/MOR-active-Nb-rep3/
	cp $< $@

../../simulation_data/gpcr/MOR-active-Nb-rep3/labels.tsv: ../../static_data/gpcr/residuelabels/5C1M_A.tsv ../../simulation_data/gpcr/MOR-active-Nb-rep3/
	cp $< $@

../../simulation_data/gpcr/MOR-active-Nb-rep3/contacts.tsv: /scratch/PI/rondror/polar_networks_subsampled_traj/MOR-active-Nb-unpublished/condition-prot-D114-D164-nb-interface-restrained/rep_3/step5_assembly.pdb /scratch/PI/rondror/polar_networks_subsampled_traj/MOR-active-Nb-unpublished/condition-prot-D114-D164-nb-interface-restrained/rep_3/stitched.dcd ../../simulation_data/gpcr/MOR-active-Nb-rep3/
	get_dynamic_contacts.py --topology /scratch/PI/rondror/polar_networks_subsampled_traj/MOR-active-Nb-unpublished/condition-prot-D114-D164-nb-interface-restrained/rep_3/step5_assembly.pdb --trajectory /scratch/PI/rondror/polar_networks_subsampled_traj/MOR-active-Nb-unpublished/condition-prot-D114-D164-nb-interface-restrained/rep_3/stitched.dcd --output $@ --sele "protein or ligand" --ligand "resname H3B" $(GCARGS)

###########################
../../simulation_data/gpcr/MOR-active-noNb-BU72-rep1/:
	mkdir -p $@

../../simulation_data/gpcr/MOR-active-noNb-BU72-rep1/top.pdb: /scratch/PI/rondror/polar_networks_subsampled_traj/MOR-active-noNb-BU72-nature2015/condition-nb-interface-restrained-BU72/rep_1/step5_assembly.pdb ../../simulation_data/gpcr/MOR-active-noNb-BU72-rep1/
	cp $< $@

../../simulation_data/gpcr/MOR-active-noNb-BU72-rep1/labels.tsv: ../../static_data/gpcr/residuelabels/5C1M_A.tsv ../../simulation_data/gpcr/MOR-active-noNb-BU72-rep1/
	cp $< $@

../../simulation_data/gpcr/MOR-active-noNb-BU72-rep1/contacts.tsv: /scratch/PI/rondror/polar_networks_subsampled_traj/MOR-active-noNb-BU72-nature2015/condition-nb-interface-restrained-BU72/rep_1/step5_assembly.pdb /scratch/PI/rondror/polar_networks_subsampled_traj/MOR-active-noNb-BU72-nature2015/condition-nb-interface-restrained-BU72/rep_1/stitched.dcd ../../simulation_data/gpcr/MOR-active-noNb-BU72-rep1/
	get_dynamic_contacts.py --topology /scratch/PI/rondror/polar_networks_subsampled_traj/MOR-active-noNb-BU72-nature2015/condition-nb-interface-restrained-BU72/rep_1/step5_assembly.pdb --trajectory /scratch/PI/rondror/polar_networks_subsampled_traj/MOR-active-noNb-BU72-nature2015/condition-nb-interface-restrained-BU72/rep_1/stitched.dcd --output $@ --sele "protein or ligand" --ligand "resname H3B" $(GCARGS)

###########################
../../simulation_data/gpcr/MOR-active-noNb-BU72-rep2/:
	mkdir -p $@

../../simulation_data/gpcr/MOR-active-noNb-BU72-rep2/top.pdb: /scratch/PI/rondror/polar_networks_subsampled_traj/MOR-active-noNb-BU72-nature2015/condition-nb-interface-restrained-BU72/rep_2/step5_assembly.pdb ../../simulation_data/gpcr/MOR-active-noNb-BU72-rep2/
	cp $< $@

../../simulation_data/gpcr/MOR-active-noNb-BU72-rep2/labels.tsv: ../../static_data/gpcr/residuelabels/5C1M_A.tsv ../../simulation_data/gpcr/MOR-active-noNb-BU72-rep2/
	cp $< $@

../../simulation_data/gpcr/MOR-active-noNb-BU72-rep2/contacts.tsv: /scratch/PI/rondror/polar_networks_subsampled_traj/MOR-active-noNb-BU72-nature2015/condition-nb-interface-restrained-BU72/rep_2/step5_assembly.pdb /scratch/PI/rondror/polar_networks_subsampled_traj/MOR-active-noNb-BU72-nature2015/condition-nb-interface-restrained-BU72/rep_2/stitched.dcd ../../simulation_data/gpcr/MOR-active-noNb-BU72-rep2/
	get_dynamic_contacts.py --topology /scratch/PI/rondror/polar_networks_subsampled_traj/MOR-active-noNb-BU72-nature2015/condition-nb-interface-restrained-BU72/rep_2/step5_assembly.pdb --trajectory /scratch/PI/rondror/polar_networks_subsampled_traj/MOR-active-noNb-BU72-nature2015/condition-nb-interface-restrained-BU72/rep_2/stitched.dcd --output $@ --sele "protein or ligand" --ligand "resname H3B" $(GCARGS)

###########################
../../simulation_data/gpcr/MOR-active-noNb-BU72-rep3/:
	mkdir -p $@

../../simulation_data/gpcr/MOR-active-noNb-BU72-rep3/top.pdb: /scratch/PI/rondror/polar_networks_subsampled_traj/MOR-active-noNb-BU72-nature2015/condition-nb-interface-restrained-BU72/rep_3/step5_assembly.pdb ../../simulation_data/gpcr/MOR-active-noNb-BU72-rep3/
	cp $< $@

../../simulation_data/gpcr/MOR-active-noNb-BU72-rep3/labels.tsv: ../../static_data/gpcr/residuelabels/5C1M_A.tsv ../../simulation_data/gpcr/MOR-active-noNb-BU72-rep3/
	cp $< $@

../../simulation_data/gpcr/MOR-active-noNb-BU72-rep3/contacts.tsv: /scratch/PI/rondror/polar_networks_subsampled_traj/MOR-active-noNb-BU72-nature2015/condition-nb-interface-restrained-BU72/rep_3/step5_assembly.pdb /scratch/PI/rondror/polar_networks_subsampled_traj/MOR-active-noNb-BU72-nature2015/condition-nb-interface-restrained-BU72/rep_3/stitched.dcd ../../simulation_data/gpcr/MOR-active-noNb-BU72-rep3/
	get_dynamic_contacts.py --topology /scratch/PI/rondror/polar_networks_subsampled_traj/MOR-active-noNb-BU72-nature2015/condition-nb-interface-restrained-BU72/rep_3/step5_assembly.pdb --trajectory /scratch/PI/rondror/polar_networks_subsampled_traj/MOR-active-noNb-BU72-nature2015/condition-nb-interface-restrained-BU72/rep_3/stitched.dcd --output $@ --sele "protein or ligand" --ligand "resname H3B" $(GCARGS)

###########################
../../simulation_data/gpcr/MOR-inactive-bFNA-rep1/:
	mkdir -p $@

../../simulation_data/gpcr/MOR-inactive-bFNA-rep1/top.pdb: /scratch/PI/rondror/polar_networks_subsampled_traj/MOR-inactive-bFNA-nature2015/condition-bFNA-bound/rep_1/step5_assembly.pdb ../../simulation_data/gpcr/MOR-inactive-bFNA-rep1/
	cp $< $@

../../simulation_data/gpcr/MOR-inactive-bFNA-rep1/labels.tsv: ../../static_data/gpcr/residuelabels/4DKL_A.tsv ../../simulation_data/gpcr/MOR-inactive-bFNA-rep1/
	cp $< $@

../../simulation_data/gpcr/MOR-inactive-bFNA-rep1/contacts.tsv: /scratch/PI/rondror/polar_networks_subsampled_traj/MOR-inactive-bFNA-nature2015/condition-bFNA-bound/rep_1/step5_assembly.pdb /scratch/PI/rondror/polar_networks_subsampled_traj/MOR-inactive-bFNA-nature2015/condition-bFNA-bound/rep_1/stitched.dcd ../../simulation_data/gpcr/MOR-inactive-bFNA-rep1/
	get_dynamic_contacts.py --topology /scratch/PI/rondror/polar_networks_subsampled_traj/MOR-inactive-bFNA-nature2015/condition-bFNA-bound/rep_1/step5_assembly.pdb --trajectory /scratch/PI/rondror/polar_networks_subsampled_traj/MOR-inactive-bFNA-nature2015/condition-bFNA-bound/rep_1/stitched.dcd --output $@ --sele "protein or ligand" --ligand "resname H3B" $(GCARGS)

###########################
../../simulation_data/gpcr/MOR-inactive-bFNA-rep2/:
	mkdir -p $@

../../simulation_data/gpcr/MOR-inactive-bFNA-rep2/top.pdb: /scratch/PI/rondror/polar_networks_subsampled_traj/MOR-inactive-bFNA-nature2015/condition-bFNA-bound/rep_2/step5_assembly.pdb ../../simulation_data/gpcr/MOR-inactive-bFNA-rep2/
	cp $< $@

../../simulation_data/gpcr/MOR-inactive-bFNA-rep2/labels.tsv: ../../static_data/gpcr/residuelabels/4DKL_A.tsv ../../simulation_data/gpcr/MOR-inactive-bFNA-rep2/
	cp $< $@

../../simulation_data/gpcr/MOR-inactive-bFNA-rep2/contacts.tsv: /scratch/PI/rondror/polar_networks_subsampled_traj/MOR-inactive-bFNA-nature2015/condition-bFNA-bound/rep_2/step5_assembly.pdb /scratch/PI/rondror/polar_networks_subsampled_traj/MOR-inactive-bFNA-nature2015/condition-bFNA-bound/rep_2/stitched.dcd ../../simulation_data/gpcr/MOR-inactive-bFNA-rep2/
	get_dynamic_contacts.py --topology /scratch/PI/rondror/polar_networks_subsampled_traj/MOR-inactive-bFNA-nature2015/condition-bFNA-bound/rep_2/step5_assembly.pdb --trajectory /scratch/PI/rondror/polar_networks_subsampled_traj/MOR-inactive-bFNA-nature2015/condition-bFNA-bound/rep_2/stitched.dcd --output $@ --sele "protein or ligand" --ligand "resname H3B" $(GCARGS)

###########################
../../simulation_data/gpcr/A2A-active-NEC-rep1/:
	mkdir -p $@

../../simulation_data/gpcr/A2A-active-NEC-rep1/top.pdb: /scratch/PI/rondror/polar_networks_subsampled_traj/A2A-active-NEC-unpublished/active-NEC/rep_1/step5_assembly.pdb ../../simulation_data/gpcr/A2A-active-NEC-rep1/
	cp $< $@

../../simulation_data/gpcr/A2A-active-NEC-rep1/labels.tsv: ../../static_data/gpcr/residuelabels/5G53_A.tsv ../../simulation_data/gpcr/A2A-active-NEC-rep1/
	cp $< $@

../../simulation_data/gpcr/A2A-active-NEC-rep1/contacts.tsv: /scratch/PI/rondror/polar_networks_subsampled_traj/A2A-active-NEC-unpublished/active-NEC/rep_1/step5_assembly.pdb /scratch/PI/rondror/polar_networks_subsampled_traj/A2A-active-NEC-unpublished/active-NEC/rep_1/stitched.dcd ../../simulation_data/gpcr/A2A-active-NEC-rep1/
	get_dynamic_contacts.py --topology /scratch/PI/rondror/polar_networks_subsampled_traj/A2A-active-NEC-unpublished/active-NEC/rep_1/step5_assembly.pdb --trajectory /scratch/PI/rondror/polar_networks_subsampled_traj/A2A-active-NEC-unpublished/active-NEC/rep_1/stitched.dcd --output $@ --sele "protein or ligand" --ligand "resname NEC" $(GCARGS)

###########################
../../simulation_data/gpcr/A2A-active-NEC-rep2/:
	mkdir -p $@

../../simulation_data/gpcr/A2A-active-NEC-rep2/top.pdb: /scratch/PI/rondror/polar_networks_subsampled_traj/A2A-active-NEC-unpublished/active-NEC/rep_2/step5_assembly.pdb ../../simulation_data/gpcr/A2A-active-NEC-rep2/
	cp $< $@

../../simulation_data/gpcr/A2A-active-NEC-rep2/labels.tsv: ../../static_data/gpcr/residuelabels/5G53_A.tsv ../../simulation_data/gpcr/A2A-active-NEC-rep2/
	cp $< $@

../../simulation_data/gpcr/A2A-active-NEC-rep2/contacts.tsv: /scratch/PI/rondror/polar_networks_subsampled_traj/A2A-active-NEC-unpublished/active-NEC/rep_2/step5_assembly.pdb /scratch/PI/rondror/polar_networks_subsampled_traj/A2A-active-NEC-unpublished/active-NEC/rep_2/stitched.dcd ../../simulation_data/gpcr/A2A-active-NEC-rep2/
	get_dynamic_contacts.py --topology /scratch/PI/rondror/polar_networks_subsampled_traj/A2A-active-NEC-unpublished/active-NEC/rep_2/step5_assembly.pdb --trajectory /scratch/PI/rondror/polar_networks_subsampled_traj/A2A-active-NEC-unpublished/active-NEC/rep_2/stitched.dcd --output $@ --sele "protein or ligand" --ligand "resname NEC" $(GCARGS)

###########################
../../simulation_data/gpcr/A2A-active-NEC-rep3/:
	mkdir -p $@

../../simulation_data/gpcr/A2A-active-NEC-rep3/top.pdb: /scratch/PI/rondror/polar_networks_subsampled_traj/A2A-active-NEC-unpublished/active-NEC/rep_3/step5_assembly.pdb ../../simulation_data/gpcr/A2A-active-NEC-rep3/
	cp $< $@

../../simulation_data/gpcr/A2A-active-NEC-rep3/labels.tsv: ../../static_data/gpcr/residuelabels/5G53_A.tsv ../../simulation_data/gpcr/A2A-active-NEC-rep3/
	cp $< $@

../../simulation_data/gpcr/A2A-active-NEC-rep3/contacts.tsv: /scratch/PI/rondror/polar_networks_subsampled_traj/A2A-active-NEC-unpublished/active-NEC/rep_3/step5_assembly.pdb /scratch/PI/rondror/polar_networks_subsampled_traj/A2A-active-NEC-unpublished/active-NEC/rep_3/stitched.dcd ../../simulation_data/gpcr/A2A-active-NEC-rep3/
	get_dynamic_contacts.py --topology /scratch/PI/rondror/polar_networks_subsampled_traj/A2A-active-NEC-unpublished/active-NEC/rep_3/step5_assembly.pdb --trajectory /scratch/PI/rondror/polar_networks_subsampled_traj/A2A-active-NEC-unpublished/active-NEC/rep_3/stitched.dcd --output $@ --sele "protein or ligand" --ligand "resname NEC" $(GCARGS)

###########################
../../simulation_data/gpcr/A2A-active-NEC-rep4/:
	mkdir -p $@

../../simulation_data/gpcr/A2A-active-NEC-rep4/top.pdb: /scratch/PI/rondror/polar_networks_subsampled_traj/A2A-active-NEC-unpublished/active-NEC/rep_4/step5_assembly.pdb ../../simulation_data/gpcr/A2A-active-NEC-rep4/
	cp $< $@

../../simulation_data/gpcr/A2A-active-NEC-rep4/labels.tsv: ../../static_data/gpcr/residuelabels/5G53_A.tsv ../../simulation_data/gpcr/A2A-active-NEC-rep4/
	cp $< $@

../../simulation_data/gpcr/A2A-active-NEC-rep4/contacts.tsv: /scratch/PI/rondror/polar_networks_subsampled_traj/A2A-active-NEC-unpublished/active-NEC/rep_4/step5_assembly.pdb /scratch/PI/rondror/polar_networks_subsampled_traj/A2A-active-NEC-unpublished/active-NEC/rep_4/stitched.dcd ../../simulation_data/gpcr/A2A-active-NEC-rep4/
	get_dynamic_contacts.py --topology /scratch/PI/rondror/polar_networks_subsampled_traj/A2A-active-NEC-unpublished/active-NEC/rep_4/step5_assembly.pdb --trajectory /scratch/PI/rondror/polar_networks_subsampled_traj/A2A-active-NEC-unpublished/active-NEC/rep_4/stitched.dcd --output $@ --sele "protein or ligand" --ligand "resname NEC" $(GCARGS)

###########################
../../simulation_data/gpcr/A2A-active-NEC-rep5/:
	mkdir -p $@

../../simulation_data/gpcr/A2A-active-NEC-rep5/top.pdb: /scratch/PI/rondror/polar_networks_subsampled_traj/A2A-active-NEC-unpublished/active-NEC/rep_5/step5_assembly.pdb ../../simulation_data/gpcr/A2A-active-NEC-rep5/
	cp $< $@

../../simulation_data/gpcr/A2A-active-NEC-rep5/labels.tsv: ../../static_data/gpcr/residuelabels/5G53_A.tsv ../../simulation_data/gpcr/A2A-active-NEC-rep5/
	cp $< $@

../../simulation_data/gpcr/A2A-active-NEC-rep5/contacts.tsv: /scratch/PI/rondror/polar_networks_subsampled_traj/A2A-active-NEC-unpublished/active-NEC/rep_5/step5_assembly.pdb /scratch/PI/rondror/polar_networks_subsampled_traj/A2A-active-NEC-unpublished/active-NEC/rep_5/stitched.dcd ../../simulation_data/gpcr/A2A-active-NEC-rep5/
	get_dynamic_contacts.py --topology /scratch/PI/rondror/polar_networks_subsampled_traj/A2A-active-NEC-unpublished/active-NEC/rep_5/step5_assembly.pdb --trajectory /scratch/PI/rondror/polar_networks_subsampled_traj/A2A-active-NEC-unpublished/active-NEC/rep_5/stitched.dcd --output $@ --sele "protein or ligand" --ligand "resname NEC" $(GCARGS)

