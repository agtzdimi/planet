#!/bin/bash

NODES_NUMBER=8
windData="$1"
pvData="$2"
formName=$(echo "$pvData" | python /home/sitewhere/getAttribute.py --formName true)

lat=$(echo "$pvData" | python /home/sitewhere/getAttribute.py --lat true)
lon=$(echo "$pvData" | python /home/sitewhere/getAttribute.py --lon true)
mkdir nodeFiles

for node in {1..8}; do
   systemLoss=$(echo "$pvData" | python /home/sitewhere/getAttribute.py --node node.$node --system.loss true)
   azimuth=$(echo "$pvData" | python /home/sitewhere/getAttribute.py --node node.$node --azimuth true)
   tilt=$(echo "$pvData" | python /home/sitewhere/getAttribute.py --node node.$node --tilt true)
   tracking=$(echo "$pvData" | python /home/sitewhere/getAttribute.py --node node.$node --tracking true)
   windStartYear=$(echo "$windData" | python /home/sitewhere/getAttribute.py --node node.$node --year true | sed 's/$/-01-01/')
   windEndYear=$(echo "$windData" | python /home/sitewhere/getAttribute.py --node node.$node --year true | sed 's/$/-12-31/')
   pvStartYear=$(echo "$pvData" | python /home/sitewhere/getAttribute.py --node node.$node --year true | sed 's/$/-01-01/')
   pvEndYear=$(echo "$pvData" | python /home/sitewhere/getAttribute.py --node node.$node --year true | sed 's/$/-12-31/')
   hubHeight=$(echo "$windData" | python /home/sitewhere/getAttribute.py --node node.$node --hub.height true)
   turbineModel=$(echo "$windData" | python /home/sitewhere/getAttribute.py --node node.$node --turbine.model true)
   windCapacity=$(echo "$windData" | python /home/sitewhere/getAttribute.py --node node.$node --capacity true)
   pvCapacity=$(echo "$pvData" | python /home/sitewhere/getAttribute.py --node node.$node --capacity true)
   curl -H 'Authorization: Token e416f7559a1fb5e98bdbf96be463b474d3a0367b' -X GET "https://www.renewables.ninja/api/data/pv?&lat=$lat&lon=$lon&date_from=$pvStartYear&date_to=$pvEndYear&capacity=$pvCapacity&tracking=$tracking&system_loss=$systemLoss&tilt=$tilt&azim=$azimuth&raw=false&dataset=merra2&format=csv" |
      cut -d , -f2 > nodeFiles/pv$node &
   curl -H 'Authorization: Token e416f7559a1fb5e98bdbf96be463b474d3a0367b' -X GET "https://www.renewables.ninja/api/data/wind?&lat=$lat&lon=$lon&date_from=$windStartYear&date_to=$windEndYear&capacity=$windCapacity&raw=false&dataset=merra2&height=$hubHeight&turbine=$turbineModel&format=csv" |
      cut -d , -f2 > nodeFiles/wind$node &
   sed -i '1d' nodeFiles/pv$node
   sed -i '1d' nodeFiles/wind$node
   awk -v id="PV" -v node="$node" 'BEGIN {FS=OFS=","} {
   if(NR==1) {
      $1=id"_node"node
      print $0}
   else { print $0}}' nodeFiles/pv$node > pvTempFile
   mv pvTempFile nodeFiles/pv$node
   awk -v id="Wind" -v node="$node" 'BEGIN {FS=OFS=","} {
   if(NR==1) {
      $1=id"_node"node
      print $0}
   else { print $0}}' nodeFiles/wind$node > windTempFile
   mv windTempFile nodeFiles/wind$node
done
wait

paste -d "," nodeFiles/wind* > /home/sitewhere/upload/Wind.csv
paste -d "," nodeFiles/pv* > /home/sitewhere/upload/PV.csv

python /home/sitewhere/csvToExcel.py --source /home/sitewhere/upload/Electricity.xlsx --dest /home/sitewhere/upload/Electricity.csv --type csv
python /home/sitewhere/csvToExcel.py --source /home/sitewhere/upload/Heat.xlsx --dest /home/sitewhere/upload/Heat.csv --type csv
rm /home/sitewhere/upload/Heat.xlsx /home/sitewhere/upload/Electricity.xlsx
rm -rf nodeFiles

for file in $(ls /home/sitewhere/upload/*.csv); do
   awk -v formName=$formName 'BEGIN {FS=OFS=","} {if(NR==1) {$(NF+1)="formName"} else {$(NF+1)=formName} print $0}' $file > tempFile
   mv tempFile $file
   mongoimport --db planet --collection files --type csv --headerline --file $file
done

echo "$windData" > /home/sitewhere/upload/windData.txt
echo "$pvData" > /home/sitewhere/upload/pvData.txt

for file in $(ls /home/sitewhere/upload/*.txt); do
   mongoimport --db planet --collection files --file $file
done

rm /home/sitewhere/upload/*
