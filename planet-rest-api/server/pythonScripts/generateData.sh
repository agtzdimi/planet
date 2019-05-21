#!/bin/bash

function genFilesLessHour {

cut -d , -f1 nodeFiles/$1 | awk -v diff="$2" 'BEGIN {FS=OFS=","} {
   if ( NR == 1 ) { print $0 ; next }
   if ( NR == 2 ) { previous=$0 }
   else { current=$0
         val = ( current - previous ) / ( diff )
         print previous
         for ( i=1; i < diff ;i++ ) { 
            print ( previous + i*val )
         }
         previous = current 
      }
   }
   END {
      print current
      for ( i=1; i<diff ;i++ ) {
         print (previous + i*val )
      }
   }' > temp$1

mv temp$1 nodeFiles/$1
}

function genFilesMoreHour {

cut -d , -f1 nodeFiles/$1 | awk -v step="$2" 'BEGIN { FS = OFS = "," } {
   if( NR == 1 ) { 
      print $0
      next
   }
   if ( NR == 2 ) { start = step }
   if( start < 1 ) {
      print $0
      start = ( start + step )
   } else {
      start = ( start - 1 )
   }
}' > temp$1

mv temp$1 nodeFiles/$1
}

function replicateColumns {

awk -v id="$1" -v count=$2 'BEGIN {FS=OFS=","} {
   if(NR==1) {
      line=id"_node"1
      for(i=2;i<=count;i++) {
         line=line FS id"_node"i
      }
      print line
   } 
   else {
      val=$0
      for(i=1;i<count;i++) {
         val = val FS $0
      }
      print val
   }
}' "nodeFiles/${1}1" > ./public/files/$1.csv

}


NODES_COUNT=$(grep -o 'node\.[0-9]' ./public/files/Parameters_initialization.txt | wc -l)
windData="$1"
pvData="$2"
isLoad="$3"
formName="$(echo $pvData | python ./server/pythonScripts/getAttribute.py --formName true)"
dbError=false

lat=$(echo "$pvData" | python ./server/pythonScripts/getAttribute.py --lat true)
lon=$(echo "$pvData" | python ./server/pythonScripts/getAttribute.py --lon true)
mkdir nodeFiles

systemLoss=$(echo "$pvData" | python ./server/pythonScripts/getAttribute.py --node node.1 --system.loss true)
azimuth=$(echo "$pvData" | python ./server/pythonScripts/getAttribute.py --node node.1 --azimuth true)
tilt=$(echo "$pvData" | python ./server/pythonScripts/getAttribute.py --node node.1 --tilt true)
tracking=$(echo "$pvData" | python ./server/pythonScripts/getAttribute.py --node node.1 --tracking true)
windStartYear=$(echo "$windData" | python ./server/pythonScripts/getAttribute.py --node node.1 --startDate true)
windEndYear=$(echo "$windData" | python ./server/pythonScripts/getAttribute.py --node node.1 --endDate true)
pvStartYear=$(echo "$pvData" | python ./server/pythonScripts/getAttribute.py --node node.1 --startDate true)
pvEndYear=$(echo "$pvData" | python ./server/pythonScripts/getAttribute.py --node node.1 --endDate true)
hubHeight=$(echo "$windData" | python ./server/pythonScripts/getAttribute.py --node node.1 --hub.height true)
turbineModel=$(echo "$windData" | python ./server/pythonScripts/getAttribute.py --node node.1 --turbine.model true)
windCapacity=$(echo "$windData" | python ./server/pythonScripts/getAttribute.py --node node.1 --capacity true)
pvCapacity=$(echo "$pvData" | python ./server/pythonScripts/getAttribute.py --node node.1 --capacity true)
leapYearIndexBefore=$(python ./server/pythonScripts/checkLeapYear.py --startDate "$pvStartYear" --endDate "$pvEndYear" | cut -d ' ' -f1)
if [[ "$(echo $pvStartYear | cut -d - -f1)" != "$(echo $pvEndYear | cut -d - -f1)" ]]; then 
   pvStartYear=$(echo "$pvStartYear" | sed 's/^[0-9]*\(\-.*\)/2015\1/')
   pvEndYear=$(echo "$pvEndYear" | sed 's/^[0-9]*\(\-.*\)/2016\1/')
else
   pvStartYear=$(echo "$pvStartYear" | sed 's/^[0-9]*\(\-.*\)/2016\1/')
   pvEndYear=$(echo "$pvEndYear" | sed 's/^[0-9]*\(\-.*\)/2016\1/')
fi
leapYearIndexAfter=$(python ./server/pythonScripts/checkLeapYear.py --startDate "$pvStartYear" --endDate "$pvEndYear" | cut -d ' ' -f1)

windEndYear="$pvEndYear"
windStartYear="$pvStartYear"
turbineModel=$(echo "$turbineModel" | sed 's/[[:space:]]/+/g')

echo "Lat= $lat Lon = $lon StartDt = $pvStartYear EndDt = $pvEndYear Capacity = $pvCapacity Tracking = $tracking SystemLoss = $systemLoss Tilt = $tilt Azimuth = $azimuth"
curl -H 'Authorization: Token e416f7559a1fb5e98bdbf96be463b474d3a0367b' -X GET "https://www.renewables.ninja/api/data/pv?&lat=$lat&lon=$lon&date_from=$pvStartYear&date_to=$pvEndYear&capacity=$pvCapacity&tracking=$tracking&system_loss=$systemLoss&tilt=$tilt&azim=$azimuth&raw=false&dataset=merra2&format=csv" |
   cut -d , -f2 > nodeFiles/PV1
curl -H 'Authorization: Token e416f7559a1fb5e98bdbf96be463b474d3a0367b' -X GET "https://www.renewables.ninja/api/data/wind?&lat=$lat&lon=$lon&date_from=$windStartYear&date_to=$windEndYear&capacity=$windCapacity&raw=false&dataset=merra2&height=$hubHeight&turbine=$turbineModel&format=csv" |
   cut -d , -f2 > nodeFiles/Wind1

sed -i '1d' nodeFiles/PV1
sed -i '1d' nodeFiles/Wind1
if [[ "$leapYearIndexAfter" != "$leapYearIndexBefore" ]]; then
   eval ' for hour in {'"$((leapYearIndexAfter+1))"'..'"$((leapYearIndexAfter+24))"'}; do sed -i ""$hour"d" nodeFiles/PV1; sed -i ""$hour"d" nodeFiles/Wind1 ;done'
fi

timeStep=$(cat ./public/files/Parameters_initialization.txt | python ./server/pythonScripts/getAttribute.py --time.step true)
steps=$(awk -v step="$timeStep" 'BEGIN {print (1/step)}')

if [[ $steps > "1" ]]; then
   genFilesLessHour "PV1" "$steps"
   genFilesLessHour "Wind1" "$steps"
elif [[ $steps < "1" ]]; then
   stepToIncrease=$(awk -v step="$timeStep" 'BEGIN{print (step - 1)}')
   genFilesMoreHour "PV1" "$stepToIncrease"
   genFilesMoreHour "Wind1" "$stepToIncrease"
fi

replicateColumns "PV" "$NODES_COUNT"
replicateColumns "Wind" "$NODES_COUNT"

if [[ -s ./public/files/Electricity.xlsx || -s ./public/files/Heat.xlsx ]]; then
   python ./server/pythonScripts/csvToExcel.py --source ./public/files/Electricity.xlsx --dest ./public/files/Electricity.csv --type csv
   python ./server/pythonScripts/csvToExcel.py --source ./public/files/Heat.xlsx --dest ./public/files/Heat.csv --type csv
fi
rm -rf nodeFiles

for file in $(ls ./public/files/*.csv); do
   if [[ -s $file ]]; then
      awk -v formName="$formName" 'BEGIN {FS=OFS=","} {if(NR==1) {$(NF+1)="formName"} else {$(NF+1)=formName} print $0}' $file > tempFile
      awk 'BEGIN {FS=OFS=","} {if(NR==1) {$(NF+1)="Time"} else {$(NF+1)=(NR-2)} print $0}' tempFile > $file
      mongoimport --port $MONGO_PORT --host $MONGO_IP -u $MONGO_USER -p $MONGO_PASSWORD \
         --authenticationDatabase $MONGO_AUTH_DB --db planet --collection files --type csv --headerline --file $file
      if (( $? != 0 )); then
         dbError=true
      fi
   fi
done

echo "$windData" > ./public/files/windData.txt
echo "$pvData" > ./public/files/pvData.txt

for file in $(ls ./public/files/*.txt); do
   if [[ -s $file ]]; then
      mongoimport --port $MONGO_PORT --host $MONGO_IP -u $MONGO_USER -p $MONGO_PASSWORD \
         --authenticationDatabase $MONGO_AUTH_DB --db planet --collection files --file $file
      if (( $? != 0 )); then
         dbError=true
      fi
   fi
done

rm -rf ./public/files/* tempFile
if [[ $dbError == false ]]; then
   exit 0
else
   exit 1
fi
