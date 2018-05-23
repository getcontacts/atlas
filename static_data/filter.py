#!/usr/bin/env python

import sys

filter_file = sys.argv[1]

with open(filter_file) as f:
    linefilter = set([l.strip() for l in f.readlines() if l.strip()])

for line in sys.stdin:
    if line.split()[0] in linefilter:
        print(line.strip("\n"))
