
pdbfile=$1
outdir=$2

cat $pdbfile | while read line;
do
  pdb=`echo $line | cut -f 1 -d ' '`;
  chn=`echo $line | cut -f 2 -d ' '`;
  outfile=$outdir/${pdb}_$chn.pdb;
  if [ -e $outfile ]; 
  then
    echo "File $outfile already exists";
  else
    echo "Downloading $outfile .."
    curl -s https://files.rcsb.org/download/$pdb.pdb | grep -e "\(ATOM  \|HETATM\)...............$chn" > $outfile
  fi
done
  

#pdb=$1
#chn=$2
#outdir=$3
#outfile=$outdir/${pdb}_$chn.pdb
#
#if [ -e $outfile ]; 
#then
#  echo "File $outfile already exists";
#else
#  echo "Downloading $outfile .."
#  curl -s https://files.rcsb.org/download/$pdb.pdb | grep -e "\(ATOM  \|HETATM\)...............$chn" > $outfile
#fi

