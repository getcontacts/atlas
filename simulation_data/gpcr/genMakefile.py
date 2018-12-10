
import os
import sys
import json



def gen_makefile(makefilename, annotation_filename):
  mkstr = "GCARGS = --itypes all --hbond_cutoff_ang 180 --vdw_res_diff 5 --cores 2\n\n"
  with open(annotation_filename) as f:
    annotations = json.load(f)

  for annotation in annotations:
    check_input_exists(annotation)
    mkstr += dir_rule(annotation) + "\n"
    mkstr += structure_rule(annotation) + "\n"
    mkstr += labels_rule(annotation) + "\n"
    mkstr += contacts_rule(annotation) + "\n"
    mkstr += "###########################\n"

  with open(makefilename, "w") as f:
    f.write(mkstr)
    print("Wrote makefile to " + makefilename)
    

def check_input_exists(ann):
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
  return "../../" + ann['contactFiles']['baseDir'] + ":\n\tmkdir -p $@\n"
  

def structure_rule(ann):
  sim_dir = ann['simFiles']['baseDir'] 
  top_path = sim_dir + ann['simFiles']['topology']
  base_dir = "../../" + ann['contactFiles']['baseDir'] 
  struc_path = base_dir + ann['contactFiles']['structure']
  return struc_path + ": " + top_path + " " + base_dir + "\n\tcp $< $@\n" 
    

def labels_rule(ann):
  label_dir = '../../static_data/gpcr/residuelabels/'
  in_path = label_dir + ann['pdbid'] + "_" + ann['chain'] + ".tsv"
  base_dir = "../../" + ann['contactFiles']['baseDir'] 
  out_path = base_dir + ann['contactFiles']['labels']
  return out_path + ": " + in_path + " " + base_dir + "\n\tcp $< $@\n" 


def contacts_rule(ann):
  sim_dir = ann['simFiles']['baseDir'] 
  top_path = sim_dir + ann['simFiles']['topology']
  trj_path = sim_dir + ann['simFiles']['trajectory']
  base_dir = "../../" + ann['contactFiles']['baseDir'] 
  out_path = base_dir + ann['contactFiles']['contacts']
  return (out_path + ": " + top_path + " " + trj_path + " " + base_dir + "\n\t" 
          "get_dynamic_contacts.py --topology " + top_path + " --trajectory " + trj_path + " "
          "--output $@ --sele \"protein or ligand\" $(GCARGS)\n")


if __name__ == "__main__":
  gen_makefile('Makefile_new', 'annotations.json')
  #with open('annotations.json') as f:
  #  annotations = json.load(f)
  #print(contacts_rule(annotations[0]))
  
