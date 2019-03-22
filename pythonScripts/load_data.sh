#!/bin/bash

function loadData {

formName="$1"
echo "$formName #######################"

mkdir -p /home/planet/upload/loadData
mongoexport --port 21569 --db planet --collection files --out /home/planet/upload/loadData/allDocuments.txt
grep '"formName":"'"$formName"'"' /home/planet/upload/loadData/allDocuments.txt | grep 'Parameters_initialization' > /home/planet/upload/loadData/Parameters_initialization.txt
grep '"formName":"'"$formName"'"' /home/planet/upload/loadData/allDocuments.txt | grep 'Economy_environment_initialization' > /home/planet/upload/loadData/Economy_environment_initialization.txt
grep '"formName":"'"$formName"'"' /home/planet/upload/loadData/allDocuments.txt | grep 'Control_initialization' > /home/planet/upload/loadData/Control_initialization.txt
grep '"formName":"'"$formName"'"' /home/planet/upload/loadData/allDocuments.txt | grep 'Wind.xlsx' > /home/planet/upload/loadData/WindData.txt
mongoexport --port 21569 --db planet --collection files --type=csv --fields DH_demand,LH_demand,"formName",Time --out /home/planet/upload/loadData/Heat.csv
egrep ','"$formName"',|DH_demand|LH_demand' /home/planet/upload/loadData/Heat.csv | sed 's/,'"$formName"'//' | sed 's/,formName//' | sed '/^,,.*/d' > tempFileloadData
sortField=$(awk 'BEGIN {FS=OFS=","} {print NF}' tempFileloadData | head -n1)
(head -n 1 tempFileloadData && tail -n +2 tempFileloadData | sort -n -k$sortField,$sortField -t,) | cut -d , -f1,2 > /home/planet/upload/loadData/Heat.csv

mongoexport --port 21569 --db planet --collection files --type=csv --fields Active_node1,Reactive_node1,Active_node2,Reactive_node2,Active_node3,Reactive_node3,Active_node4,Reactive_node4,Active_node5,Reactive_node5,Active_node6,Reactive_node6,Active_node7,Reactive_node7,Active_node8,Reactive_node8,"formName",Time --out /home/planet/upload/loadData/Electricity.csv
egrep ','"$formName"',|Active_node|Reactive_node' /home/planet/upload/loadData/Electricity.csv | sed 's/,'"$formName"'//' | sed 's/,formName//' | sed '/^,,.*/d' > tempFileloadData
sortField=$(awk 'BEGIN {FS=OFS=","} {print NF}' tempFileloadData | head -n1)
(head -n 1 tempFileloadData && tail -n +2 tempFileloadData | sort -n -k$sortField,$sortField -t,) | cut -d, -f1-16 > /home/planet/upload/loadData/Electricity.csv

rm /home/planet/upload/loadData/allDocuments.txt tempFileloadData
}

form="$1"
echo "Starting export of $form"
loadData "$(echo $form | sed 's/^ //' | sed 's/ $//')"
