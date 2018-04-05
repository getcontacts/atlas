
pdb=$1
chn=$2
outdir=$3
outfile=$outdir/${pdb}_$chn.csv

if [ -e $outfile ]; 
then
  echo "File $outfile already exists";
else
  echo "Downloading $outfile .."
  curl -s https://www.rcsb.org/pdb/rest/customReport.xml?pdbids=3SN6.A,3SN6.R,1AZT.A&customReportColumns=releaseDate,experimentalTechnique,resolution,pdbDoi,geneName,taxonomy,ligandId&service=wsfile&format=csv
  curl -s https://files.rcsb.org/download/$pdb.pdb | grep -e "\(ATOM  \|HETATM\)...............$chn" > $outfile
fi

