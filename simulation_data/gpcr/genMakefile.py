
import os
import sys
import json



def gen_makefile(makefilename, annotation_filename):
  mkstr = "SECONDARY:\n\n"
  mkstr += "GCARGS = --itypes all --hbond_cutoff_ang 180 --vdw_res_diff 5 --cores 2\n\n"
  with open(annotation_filename) as f:
    annotations = json.load(f)

  all_rules = ""

  for annotation in annotations:
    check_input_exists(annotation)
    mkstr += "###########################\n"
    mkstr += dir_rule(annotation) + "\n"
    mkstr += structure_rule(annotation) + "\n"
    mkstr += labels_rule(annotation) + "\n"
    mkstr += contacts_rule(annotation) + "\n"

    base_dir = annotation['id']
    out_path = base_dir + "/contacts.tsv " + base_dir + "/labels.tsv " + base_dir + "/top.pdb"
    all_rules += out_path + " "

  with open(makefilename, "w") as f:
    f.write("all: " + all_rules + "\n\n")
    f.write(mkstr)
    print("Wrote makefile to " + makefilename)
    

def check_input_exists(ann):
  if True:
    return
  base_dir = ann['simFiles']['baseDir']
  top_path = base_dir + ann['simFiles']['topology']
  trj_path = base_dir + ann['simFiles']['trajectory']
  
  if not os.path.isfile(top_path):
    print("Topology file could not be found: " + top_path)
    sys.exit(-1)

  if not os.path.isfile(trj_path):
    print("Trajectory file could not be found: " + trj_path)
    sys.exit(-1)


def dir_rule(ann):
  return ann['id'] + ":\n\tmkdir -p $@\n"
  

def structure_rule(ann):
  sim_dir = ann['simFiles']['baseDir'] 
  top_path = sim_dir + ann['simFiles']['topology']
  base_dir = ann['id']
  struc_path = base_dir + "/top.pdb"
  return struc_path + ": " + top_path + " " + base_dir + "\n\tcp $< $@\n" 
    

def labels_rule(ann):
  label_dir = '../../static_data/gpcr/residuelabels/'
  in_path = label_dir + ann['pdbid'] + "_" + ann['chain'] + ".tsv"
  base_dir = ann['id']
  out_path = base_dir + "/labels.tsv"
  return out_path + ": " + in_path + " " + base_dir + "\n\tcp $< $@\n" 


def contacts_rule(ann):
  sim_dir = ann['simFiles']['baseDir'] 
  top_path = sim_dir + ann['simFiles']['topology']
  lig_resns = " ".join([lig for lig in ann['ligands']])
  trj_path = sim_dir + ann['simFiles']['trajectory']
  base_dir = ann['id']
  out_path = base_dir + "/contacts.tsv"
  return (out_path + ": " + top_path + " " + trj_path + " " + base_dir + "\n\t" 
          "get_dynamic_contacts.py --topology " + top_path + " --trajectory " + trj_path + " "
          "--output $@ --sele \"protein or ligand\" --ligand \"resname " + lig_resns + "\" $(GCARGS)\n")


if __name__ == "__main__":
  gen_makefile('Makefile_new', 'annotations.json')
  #with open('annotations.json') as f:
  #  annotations = json.load(f)
  #print(contacts_rule(annotations[0]))
  
