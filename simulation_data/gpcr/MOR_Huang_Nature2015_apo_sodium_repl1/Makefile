SIMROOT = /oak/stanford/groups/rondror/publications/published_simulations/MOR_Huang_Nature2015/apo_sodium



all: Prod_1.nc Prod_2.nc Prod_3.nc Prod_4.nc Prod_5.nc Prod_6.nc Prod_7.nc Prod_8.nc Prod_9.nc Prod_10.nc Prod_11.nc Prod_12.nc Prod_13.nc Prod_14.nc Prod_15.nc Prod_16.nc Prod_17.nc Prod_18.nc Prod_19.nc  Prod_20.nc Prod_21.nc Prod_22.nc Prod_23.nc Prod_24.nc Prod_25.nc Prod_26.nc Prod_27.nc Prod_28.nc Prod_29.nc 

Prod_%.tsv: $(SIMROOT)/Prod_%.nc
	bash ../genContacts.sh $(SIMROOT)/step5_assembly.psf $< $@
