
SIMDIR = /scratch/PI/rondror/polar_networks_subsampled_traj
ALLOUTDIRS = $(wildcard */*/rep_*)
ALLCONTACTS = $(addsuffix /contacts.tsv,$(ALLOUTDIRS))
ALLRESCONTACTS = $(addsuffix /rescontacts.tsv,$(ALLOUTDIRS))



all: $(ALLCONTACTS) $(ALLRESCONTACTS)



GCARGS = --itypes all --hbond_cutoff_ang 180 --vdw_res_diff 5 --cores 2

A2A-active-NEC-unpublished/active-NEC/rep_%/contacts.tsv: 
	get_dynamic_contacts.py --topology $(SIMDIR)/$(dir $@)/step5_assembly.pdb --trajectory $(SIMDIR)/$(dir $@)/stitched.dcd --output $@ --sele "protein or resname NEC" $(GCARGS) | tee $(dir $@)/stdout.txt

A2A-inactive-ZMA-unpublished/inactive-ZMA/rep_%/contacts.tsv:
	get_dynamic_contacts.py --topology $(SIMDIR)/$(dir $@)/step5_assembly.pdb --trajectory $(SIMDIR)/$(dir $@)/stitched.dcd --output $@ --sele "protein or resname ZMA" $(GCARGS) | tee $(dir $@)/stdout.txt

DOR-inactive-naltrindole-unpublished/condition-naltrindole-bound/rep_%/contacts.tsv:
	get_dynamic_contacts.py --topology $(SIMDIR)/$(dir $@)/step5_assembly.pdb --trajectory $(SIMDIR)/$(dir $@)/stitched.dcd --output $@ --sele "protein or resname EJ4" $(GCARGS) | tee $(dir $@)/stdout.txt

M2R-active-restrained-unpublished/condition-prot-asp2x50-3x49/rep_%/contacts.tsv:
	get_dynamic_contacts.py --topology $(SIMDIR)/$(dir $@)/step5_assembly.pdb --trajectory $(SIMDIR)/$(dir $@)/stitched.dcd --output $@ --sele "protein or resname IXO" $(GCARGS) | tee $(dir $@)/stdout.txt

M2R-active-unrestrained-unpublished/condition-prot-asp2x50-3x49/rep_%/contacts.tsv:
	get_dynamic_contacts.py --topology $(SIMDIR)/$(dir $@)/step5_assembly.pdb --trajectory $(SIMDIR)/$(dir $@)/stitched.dcd --output $@ --sele "protein or resname IXO" $(GCARGS) | tee $(dir $@)/stdout.txt

M2R-inactive-QNB-nature2012/condition-A/rep_1/contacts.tsv:
	get_dynamic_contacts.py --topology $(SIMDIR)/$(dir $@)/nature2012-A-M2-QNB-all.mae --trajectory $(SIMDIR)/$(dir $@)/stitched.dcd --output $@ --sele "protein or resname QNBP" $(GCARGS) | tee $(dir $@)/stdout.txt

M2R-inactive-QNB-nature2013/condition-AE/rep_1/contacts.tsv:
	get_dynamic_contacts.py --topology $(SIMDIR)/$(dir $@)/nature2013-AE-64-all.mae --trajectory $(SIMDIR)/$(dir $@)/stitched.dcd --output $@ --sele "protein or resname qnb" $(GCARGS) | tee $(dir $@)/stdout.txt

MOR-active-Nb-unpublished/condition-prot-D114-D164-nb-interface-restrained/rep_%/contacts.tsv:
	get_dynamic_contacts.py --topology $(SIMDIR)/$(dir $@)/step5_assembly.pdb --trajectory $(SIMDIR)/$(dir $@)/stitched.dcd --output $@ --sele "protein or resname H3B" $(GCARGS) | tee $(dir $@)/stdout.txt

MOR-active-noNb-BU72-nature2015/condition-nb-interface-restrained-BU72/rep_%/contacts.tsv:
	get_dynamic_contacts.py --topology $(SIMDIR)/$(dir $@)/step5_assembly.pdb --trajectory $(SIMDIR)/$(dir $@)/stitched.dcd --output $@ --sele "protein or resname H3B" $(GCARGS) | tee $(dir $@)/stdout.txt

MOR-inactive-bFNA-nature2015/condition-bFNA-bound/rep_%/contacts.tsv:
	get_dynamic_contacts.py --topology $(SIMDIR)/$(dir $@)/step5_assembly.pdb --trajectory $(SIMDIR)/$(dir $@)/stitched.dcd --output $@ --sele "protein or resname BF0" $(GCARGS) | tee $(dir $@)/stdout.txt

Rhodopsin-active-unrestrained-unpublished/2x72-E113Q-M257Y-constitutively-active/rep_%/contacts.tsv:
	get_dynamic_contacts.py --topology $(SIMDIR)/$(dir $@)/step5_assembly.pdb --trajectory $(SIMDIR)/$(dir $@)/stitched.dcd --output $@ --sele "protein or resname RET" $(GCARGS) | tee $(dir $@)/stdout.txt
	
US28-active-restrained-unpublished/fractalkine-bound/rep_%/contacts.tsv:
	get_dynamic_contacts.py --topology $(SIMDIR)/$(dir $@)/step5_assembly.pdb --trajectory $(SIMDIR)/$(dir $@)/stitched.dcd --output $@ --sele "protein" $(GCARGS) | tee $(dir $@)/stdout.txt
	
US28-active-unrestrained-unpublished/fractalkine-bound/rep_%/contacts.tsv:
	get_dynamic_contacts.py --topology $(SIMDIR)/$(dir $@)/step5_assembly.pdb --trajectory $(SIMDIR)/$(dir $@)/stitched.dcd --output $@ --sele "protein" $(GCARGS) | tee $(dir $@)/stdout.txt
	


%/rescontacts.tsv: %/contacts.tsv
	$$(dirname `which get_dynamic_contacts.py`)/Applications/get_rescontacts.py --input $< --output $@


clean: 
	rm -f $(ALLCONTACTS) $(ALLRESCONTACTS)
