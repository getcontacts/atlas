
pdb=$1
chn=$2
outdir=$3
outfile=$outdir/${pdb}_$chn.csv

if [ -e $outfile ]; 
then
  echo "File $outfile already exists";
else
  echo "Downloading annotations $outfile .."
  curl -s "https://www.rcsb.org/pdb/rest/customReport.xml?pdbids=${pdb}.${chn}&customReportColumns=releaseDate,experimentalTechnique,resolution,pdbDoi,geneName,taxonomy,ligandId&service=wsfile&format=csv" > $outfile
fi

