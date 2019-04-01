#!/bin/bash

function loadData {

formName="$1"
echo "$formName #######################$(pwd)"

mkdir -p ./public/files/loadData
mongoexport --port 21569 --db planet --collection files --out ./public/files/loadData/allDocuments.txt
grep '"formName":"'"$formName"'"' ./public/files/loadData/allDocuments.txt | grep 'Parameters_initialization' > ./public/files/loadData/Parameters_initialization.txt
grep '"formName":"'"$formName"'"' ./public/files/loadData/allDocuments.txt | grep 'Economy_environment_initialization' > ./public/files/loadData/Economy_environment_initialization.txt
grep '"formName":"'"$formName"'"' ./public/files/loadData/allDocuments.txt | grep 'Control_initialization' > ./public/files/loadData/Control_initialization.txt
grep '"formName":"'"$formName"'"' ./public/files/loadData/allDocuments.txt | grep 'Wind.xlsx' > ./public/files/loadData/WindData.txt
mongoexport --port 21569 --db planet --collection files --type=csv --fields DH_demand,LH_demand,"formName",Time --out ./public/files/loadData/Heat.csv
egrep ','"$formName"',|DH_demand|LH_demand' ./public/files/loadData/Heat.csv | sed 's/,'"$formName"'//' | sed 's/,formName//' | sed '/^,,.*/d' > tempFileloadData
sortField=$(awk 'BEGIN {FS=OFS=","} {print NF}' tempFileloadData | head -n1)
(head -n 1 tempFileloadData && tail -n +2 tempFileloadData | sort -n -k$sortField,$sortField -t,) | cut -d , -f1,2 > ./public/files/loadData/Heat.csv

mongoexport --port 21569 --db planet --collection files --type=csv --fields Active_node1,Reactive_node1,Active_node2,Reactive_node2,Active_node3,Reactive_node3,Active_node4,Reactive_node4,Active_node5,Reactive_node5,Active_node6,Reactive_node6,Active_node7,Reactive_node7,Active_node8,Reactive_node8,"formName",Time --out ./public/files/loadData/Electricity.csv
egrep ','"$formName"',|Active_node|Reactive_node' ./public/files/loadData/Electricity.csv | sed 's/,'"$formName"'//' | sed 's/,formName//' | sed '/^,,.*/d' > tempFileloadData
sortField=$(awk 'BEGIN {FS=OFS=","} {print NF}' tempFileloadData | head -n1)
(head -n 1 tempFileloadData && tail -n +2 tempFileloadData | sort -n -k$sortField,$sortField -t,) | cut -d, -f1-16 > ./public/files/loadData/Electricity.csv

rm ./public/files/loadData/allDocuments.txt tempFileloadData
}

form="$1"
echo "Starting export of $form"
loadData "$(echo $form | sed 's/^ //' | sed 's/ $//')"
