

import sys

def resi_to_resn_map(pdbfile):
    ret = {}
    with open(pdbfile) as f:
        for line in f:
            if line.startswith("ATOM") or line.startswith("HETATM"):
                resi = line[22:26].strip()
                resn = line[17:20]
                ret[resi] = resn

    return ret



with open(sys.argv[1]) as f:
    lines = f.readlines()

    # Parse labels
    labels = lines[0].strip().split(",")[7:]
    # ==> ['I.1', 'I.2', 'I.3', 'g.l.4', 'g.l.6', 'g.l.7', ...]
    # Modify labels to ensure order of subtrees
    ordered_labels = []
    group_prev = '?'
    group_idx = -1
    for l in labels:
        group = "".join(l.split(".")[:-1])
        if group != group_prev:
            group_idx += 1
            group_prev = group

        ordered_labels.append(group+"_"+str(group_idx) + "." + l.replace(".", ":"))
    # ==> ['I_0.I:1', 'I_0.I:2', 'I_0.I:3', 'gl_1.g:l:4' ..]

    for line in lines[1:]:
        tokens = line.split(",")
        pdb = tokens[4].upper()
        chain = tokens[6].upper()
        resis = [t.strip() for t in tokens[7:]]

        resn_map = resi_to_resn_map("structures/" + pdb + "_" + chain + ".pdb")
        print(pdb + "_" + chain)

        assert len(ordered_labels) == len(resis)
        with open("residuelabels/" + pdb + "_" + chain + ".tsv", "w") as labelfile:
            for label, resi in zip(ordered_labels, resis):
                if "_" in resi or resi not in resn_map:
                    continue
                if not resi in resn_map:
                    print("\"" + resi + "\"", resi in resn_map)
                    print(resn_map)
                assert resi in resn_map
                atomid = chain + ":" + resn_map[resi] + ":" + resi

                labelfile.write(atomid + "\t" + label + "\t#2b5bc1\n")

