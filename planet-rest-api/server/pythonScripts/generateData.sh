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

windData="$1"
pvData="$2"
echo "||||||||||||||||||||||${pvData}||||||||||||||||||||||||||||||||||||${windData}||||||||||||||||||||||||||||||||||||||||||||||$3|||||||$4|||||||$5"
import="$3"
if [[ $import == true ]]; then
   NODES_COUNT=$(grep -o 'node\.[0-9]' ./public/files/Parameters_initialization.txt | wc -l)
else
   NODES_COUNT="$4"
fi

formName="$(echo $pvData | python ./server/pythonScripts/getAttribute.py --formName true)"

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

if [[ $import == true ]]; then
   timeStep=$(cat ./public/files/Parameters_initialization.txt | python ./server/pythonScripts/getAttribute.py --time.step true)
else
   timeStep="$5"
fi
steps=$(awk -v step="$timeStep" 'BEGIN {print (1/step)}')

hourStart=$(awk -v start=$pvStartYear 'BEGIN {
   split(start,startDate,"-")
   dayHour = startDate[3]*24
   for (mon=1;mon<startDate[2];mon++) {
      if(mon == 4 || mon == 6 || mon == 9 || mon == 11) {
         monthHour = monthHour + 720
      }
      else if(mon == 1 || mon == 3 || mon == 5 || mon == 7 || mon == 8 || mon == 10 || mon == 12) {
         monthHour = monthHour + 744
      }
      else {
         monthHour = monthHour + 672
      }
   }
   print (monthHour + dayHour - 23 + 1)
}'
)
hourEnd=$(awk -v end=$pvEndYear 'BEGIN {
   split(end,endDate,"-")
   dayHour = endDate[3]*24
   for (mon=1;mon<endDate[2];mon++) {
      if(mon == 4 || mon == 6 || mon == 9 || mon == 11) {
         monthHour = monthHour + 720
      }
      else if(mon == 1 || mon == 3 || mon == 5 || mon == 7 || mon == 8 || mon == 10 || mon == 12) {
         monthHour = monthHour + 744
      }
      else {
         monthHour = monthHour + 672
      }
   }
   print (monthHour + dayHour + 1)
}')

head -n1 ./public/staticFiles/Electricity.csv | cut -d , -f1-$((NODES_COUNT*2)) > nodeFiles/Electricity
head -n1 ./public/staticFiles/Heat.csv > nodeFiles/Heat
sed -n "$hourStart"','"$hourEnd"'p' ./public/staticFiles/Electricity.csv | cut -d , -f1-$((NODES_COUNT*2)) >> nodeFiles/Electricity
sed -n "$hourStart"','"$hourEnd"'p' ./public/staticFiles/Heat.csv >> nodeFiles/Heat

if [[ $steps > "1" ]]; then
   genFilesLessHour "PV1" "$steps"
   genFilesLessHour "Wind1" "$steps"
   eval ' for node in {1..'"$((NODES_COUNT*2))"'}; do cut -d , -f"$node" nodeFiles/Electricity > nodeFiles/Electricity"$node"; genFilesLessHour "Electricity$node" "$steps" ;done'
   rm nodeFiles/Electricity
   paste -d , nodeFiles/Electricity* > ./public/files/Electricity.csv
   for node in {1..2}; do
      cut -d , -f$node nodeFiles/Heat > nodeFiles/Heat$node
      genFilesLessHour "Heat$node" "$steps"
   done
   rm nodeFiles/Heat
   paste -d , nodeFiles/Heat* > ./public/files/Heat.csv
elif [[ $steps < "1" ]]; then
   stepToIncrease=$(awk -v step="$timeStep" 'BEGIN{print (step - 1)}')
   genFilesMoreHour "PV1" "$stepToIncrease"
   genFilesMoreHour "Wind1" "$stepToIncrease"
   genFilesMoreHour "Heat1" "$stepToIncrease"
   genFilesMoreHour "Electricity1" "$stepToIncrease"
else
   mv nodeFiles/Electricity ./public/files/Electricity.csv
   mv nodeFiles/Heat ./public/files/Heat.csv
fi

replicateColumns "PV" "$NODES_COUNT"
replicateColumns "Wind" "$NODES_COUNT"

rm -rf nodeFiles

if [[ $import == true ]]; then
   ./server/pythonScripts/importDataToDB.sh "$formName" "$windData" "$pvData"
fi
