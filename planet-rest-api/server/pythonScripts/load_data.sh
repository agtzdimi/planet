#!/bin/bash

function loadData {

formName="$1"
dirName="./public/files/$2"
echo "$formName #######################$(pwd)"

mkdir -p "$dirName/loadData"
mongoexport --port $MONGO_PORT --host $MONGO_IP -u $MONGO_USER -p $MONGO_PASSWORD \
    --authenticationDatabase $MONGO_AUTH_DB --db planet --collection files --out "$dirName/loadData/allDocuments.txt" -q "{\"payload.formName\": \"""$formName""\"}"
grep 'Parameters_initialization' "$dirName/loadData/allDocuments.txt" > "$dirName/loadData/Parameters_initialization.txt"
grep 'Control_initialization' "$dirName/loadData/allDocuments.txt" > "$dirName/loadData/Control_initialization.txt"
grep 'Economy_environment_initialization' "$dirName/loadData/allDocuments.txt" > "$dirName/loadData/Economy_environment_initialization.txt"
grep 'Wind.xlsx' "$dirName/loadData/allDocuments.txt" > "$dirName/loadData/WindData.txt"
grep 'PV.xlsx' "$dirName/loadData/allDocuments.txt" > "$dirName/loadData/PVData.txt"
mongoexport --port $MONGO_PORT --host $MONGO_IP -u $MONGO_USER -p $MONGO_PASSWORD \
    --authenticationDatabase $MONGO_AUTH_DB --db planet --collection files --type=csv --fields DH_demand,LH_demand,"formName",Time \
    --out "$dirName/loadData/Heat.csv" -q "{\"formName\": \"""$formName""\"}"
sed 's|,'"$formName"'||' "$dirName/loadData/Heat.csv" | sed 's/,formName//' | sed '/^,,.*/d' > "$dirName/tempFileloadData"
sortField=$(awk 'BEGIN {FS=OFS=","} {print NF}' "$dirName/tempFileloadData" | head -n1)
(head -n 1 "$dirName/tempFileloadData" && tail -n +2 "$dirName/tempFileloadData" | sort -n -k$sortField,$sortField -t,) | cut -d , -f1,2 > "$dirName/loadData/Heat.csv"

mongoexport --port $MONGO_PORT --host $MONGO_IP -u $MONGO_USER -p $MONGO_PASSWORD \
    --authenticationDatabase $MONGO_AUTH_DB --db planet --collection files --type=csv \
    --fields Active_node1,Reactive_node1,Active_node2,Reactive_node2,Active_node3,Reactive_node3,Active_node4,Reactive_node4,Active_node5,Reactive_node5,Active_node6,Reactive_node6,Active_node7,Reactive_node7,Active_node8,Reactive_node8,"formName",Time \
    --out "$dirName/loadData/Electricity.csv" -q "{\"formName\": \"""$formName""\"}"
sed 's|,'"$formName"'||' "$dirName/loadData/Electricity.csv" | sed 's/,formName//' | sed '/^,,.*/d' > "$dirName/tempFileloadData"
sortField=$(awk 'BEGIN {FS=OFS=","} {print NF}' "$dirName/tempFileloadData" | head -n1)
(head -n 1 "$dirName/tempFileloadData" && tail -n +2 "$dirName/tempFileloadData" | sort -n -k$sortField,$sortField -t,) | cut -d, -f1-16 > "$dirName/loadData/Electricity.csv"

rm "$dirName/loadData/allDocuments.txt" "$dirName/tempFileloadData"
}

form="$1"
echo "Starting export of $form"
loadData "$(echo $form | sed 's/^ //' | sed 's/ $//')" "$2"
