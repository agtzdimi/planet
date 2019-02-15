#!/bin/bash

function loadData {

formName="$1"
echo "$formName #######################"

mkdir -p /home/planet/upload/loadData
mongoexport --db planet --collection files --out /home/planet/upload/loadData/allDocuments.txt
grep '"formName":"'"$formName"'"' /home/planet/upload/loadData/allDocuments.txt | grep 'Parameters_initialization' > /home/planet/upload/loadData/Parameters_initialization.txt
grep '"formName":"'"$formName"'"' /home/planet/upload/loadData/allDocuments.txt | grep 'Economy_environment_initialization' > /home/planet/upload/loadData/Economy_environment_initialization.txt
grep '"formName":"'"$formName"'"' /home/planet/upload/loadData/allDocuments.txt | grep 'Control_initialization' > /home/planet/upload/loadData/Control_initialization.txt
mongoexport --db planet --collection files --type=csv --fields DH_demand,LH_demand,"formName" --out /home/planet/upload/loadData/Heat.csv
egrep ','"$formName"'$|DH_demand|LH_demand' /home/planet/upload/loadData/Heat.csv | sed 's/,'"$formName"'$//'| sed 's/^,$//' | awk 'BEGIN {FS=OFS=","} /^\s*$/ {next;}{print $0}' | sed 's/,formName//' > tempFileloadData
mv tempFileloadData /home/planet/upload/loadData/Heat.csv
python /home/planet/csvToExcel.py --source /home/planet/upload/loadData/Heat.csv --dest /home/planet/upload/loadData/Heat.xlsx --type xlsx
mongoexport --db planet --collection files --type=csv --fields Active_node1,Reactive_node1,Active_node2,Reactive_node2,Active_node3,Reactive_node3,Active_node4,Reactive_node4,Active_node5,Reactive_node5,Active_node6,Reactive_node6,Active_node7,Reactive_node7,Active_node8,Reactive_node8,"formName" --out /home/planet/upload/loadData/Electricity.csv
egrep ','"$formName"'$|Active_node|Reactive_node' /home/planet/upload/loadData/Electricity.csv | sed 's/,'"$formName"'$//'| sed 's/^,$//' | awk 'BEGIN {FS=OFS=","} /^\s*$/ {next;}{print $0}' | sed 's/,formName//' > tempFileloadData
mv tempFileloadData /home/planet/upload/loadData/Electricity.csv
python /home/planet/csvToExcel.py --source /home/planet/upload/loadData/Electricity.csv --dest /home/planet/upload/loadData/Electricity.xlsx --type xlsx

rm /home/planet/upload/loadData/Heat.csv /home/planet/upload/loadData/allDocuments.txt /home/planet/upload/loadData/Electricity.csv
}

form="$1"
echo "Starting export of $form"
loadData "$(echo $form | sed 's/^ //' | sed 's/ $//')"
