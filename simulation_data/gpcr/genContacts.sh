
get_dynamic_contacts.py --topology $1 --trajectory $2 --output $3 --itypes all --hbond_cutoff_ang 180 --vdw_res_diff 5 --cores 10 | tee output.txt

