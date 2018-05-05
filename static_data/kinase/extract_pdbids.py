

import sys

klifs_file = sys.argv[1]
with open(klifs_file) as f:
    raw_lines = f.readlines()
    raw_lines = list(map(lambda l: l.split(","), raw_lines))

for line in raw_lines[1:]:
    print(line[4].upper() + "\t" + line[6].upper())
