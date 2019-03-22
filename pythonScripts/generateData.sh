#!/bin/bash

NODES_NUMBER=8
windData="$1"
pvData="$2"
isLoad="$3"
formName="$(echo $pvData | python /home/planet/getAttribute.py --formName true)"
dbError=false

lat=$(echo "$pvData" | python /home/planet/getAttribute.py --lat true)
lon=$(echo "$pvData" | python /home/planet/getAttribute.py --lon true)
mkdir nodeFiles

for node in {1..8}; do
   systemLoss=$(echo "$pvData" | python /home/planet/getAttribute.py --node node.$node --system.loss true)
   azimuth=$(echo "$pvData" | python /home/planet/getAttribute.py --node node.$node --azimuth true)
   tilt=$(echo "$pvData" | python /home/planet/getAttribute.py --node node.$node --tilt true)
   tracking=$(echo "$pvData" | python /home/planet/getAttribute.py --node node.$node --tracking true)
   windStartYear=$(echo "$windData" | python /home/planet/getAttribute.py --node node.$node --startDate true)
   windEndYear=$(echo "$windData" | python /home/planet/getAttribute.py --node node.$node --endDate true)
   pvStartYear=$(echo "$pvData" | python /home/planet/getAttribute.py --node node.$node --startDate true)
   pvEndYear=$(echo "$pvData" | python /home/planet/getAttribute.py --node node.$node --endDate true)
   hubHeight=$(echo "$windData" | python /home/planet/getAttribute.py --node node.$node --hub.height true)
   turbineModel=$(echo "$windData" | python /home/planet/getAttribute.py --node node.$node --turbine.model true)
   windCapacity=$(echo "$windData" | python /home/planet/getAttribute.py --node node.$node --capacity true)
   pvCapacity=$(echo "$pvData" | python /home/planet/getAttribute.py --node node.$node --capacity true)
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

paste -d "," nodeFiles/wind* > /home/planet/upload/Wind.csv
paste -d "," nodeFiles/pv* > /home/planet/upload/PV.csv

if [[ -s /home/planet/upload/Electricity.xlsx || -s /home/planet/upload/Heat.xlsx ]]; then
   python /home/planet/csvToExcel.py --source /home/planet/upload/Electricity.xlsx --dest /home/planet/upload/Electricity.csv --type csv
   python /home/planet/csvToExcel.py --source /home/planet/upload/Heat.xlsx --dest /home/planet/upload/Heat.csv --type csv
fi
rm -rf nodeFiles

for file in /home/planet/upload/Electricity.csv /home/planet/upload/Heat.csv; do
   if [[ -s $file ]]; then
      awk -v formName="$formName" 'BEGIN {FS=OFS=","} {if(NR==1) {$(NF+1)="formName"} else {$(NF+1)=formName} print $0}' $file > tempFile
      awk 'BEGIN {FS=OFS=","} {if(NR==1) {$(NF+1)="Time"} else {$(NF+1)=(NR-2)} print $0}' tempFile > $file
      mongoimport --port 21569 --db planet --collection files --type csv --headerline --file $file
      if (( $? != 0 )); then
         dbError=true
      fi
   fi
done

echo "$windData" > /home/planet/upload/windData.txt
echo "$pvData" > /home/planet/upload/pvData.txt

for file in $(ls /home/planet/upload/*.txt); do
   if [[ -s $file ]]; then
      mongoimport --port 21569 --db planet --collection files --file $file
      if (( $? != 0 )); then
         dbError=true
      fi
   fi
done

rm -rf /home/planet/upload/* tempFile
if [[ $dbError == false ]]; then
   exit 0
else
   exit 1
fi
