#!/bin/bash

function sendFiles {

formName="$1"
simulationType="$2"
mode="$3"
dirName="$4"

echo "$formName ############"

mongoexport --quiet --port $MONGO_PORT --host $MONGO_IP -u $MONGO_USER -p $MONGO_PASSWORD \
   --collection files --authenticationDatabase $MONGO_AUTH_DB --db planet \
   --eval 'db.files.find({$and: [{"payload.formName": "'"$formName"'"},{"payload.simulation": {$exists: true}}]},{_id: 0})' > "$dirName/$simulationType/Parameters_initialization.txt"

mongoexport --port $MONGO_PORT --host $MONGO_IP -u $MONGO_USER -p $MONGO_PASSWORD \
   --authenticationDatabase $MONGO_AUTH_DB --db planet --collection files --type=csv --fields DH_demand,LH_demand,"formName",Time --out "$dirName/$simulationType/Heat.csv"
egrep ','"$formName"',|DH_demand|LH_demand' "$dirName/$simulationType/Heat.csv" | sed 's|,'"$formName"'||' | sed 's/,formName//' | sed '/^,,.*/d' > "$dirName/tempFile$simulationType"
sortField=$(awk 'BEGIN {FS=OFS=","} {print NF}' "$dirName/tempFile$simulationType" | head -n1)
(head -n 1 "$dirName/tempFile$simulationType" && tail -n +2 "$dirName/tempFile$simulationType" | sort -n -k$sortField,$sortField -t,) > "$dirName/$simulationType/Heat.csv"

mongoexport --port $MONGO_PORT --host $MONGO_IP -u $MONGO_USER -p $MONGO_PASSWORD \
   --authenticationDatabase $MONGO_AUTH_DB --db planet --collection files --type=csv --fields Active_node1,Reactive_node1,Active_node2,Reactive_node2,Active_node3,Reactive_node3,Active_node4,Reactive_node4,Active_node5,Reactive_node5,Active_node6,Reactive_node6,Active_node7,Reactive_node7,Active_node8,Reactive_node8,"formName",Time --out "$dirName/$simulationType/Electricity.csv"
egrep ','"$formName"',|Active_node|Reactive_node' "$dirName/$simulationType/Electricity.csv" | sed 's|,'"$formName"'||' | sed 's/,formName//' | sed '/^,,.*/d' > "$dirName/tempFile$simulationType"
sortField=$(awk 'BEGIN {FS=OFS=","} {print NF}' "$dirName/tempFile$simulationType" | head -n1)
(head -n 1 "$dirName/tempFile$simulationType" && tail -n +2 "$dirName/tempFile$simulationType" | sort -n -k$sortField,$sortField -t,) > "$dirName/$simulationType/Electricity.csv"

mongoexport --port $MONGO_PORT --host $MONGO_IP -u $MONGO_USER -p $MONGO_PASSWORD \
   --authenticationDatabase $MONGO_AUTH_DB --db planet --collection files --type=csv --fields PV_node1,PV_node2,PV_node3,PV_node4,PV_node5,PV_node6,PV_node7,PV_node8,"formName",Time --out "$dirName/$simulationType/PV.csv"
egrep ','"$formName"',|PV_node' "$dirName/$simulationType/PV.csv" | sed 's|,'"$formName"'||' | sed 's/,formName//' | sed '/^,,.*/d' > "$dirName/tempFile$simulationType"
sortField=$(awk 'BEGIN {FS=OFS=","} {print NF}' "$dirName/tempFile$simulationType" | head -n1)
(head -n 1 "$dirName/tempFile$simulationType" && tail -n +2 "$dirName/tempFile$simulationType" | sort -n -k$sortField,$sortField -t,) > "$dirName/$simulationType/PV.csv"

mongoexport --port $MONGO_PORT --host $MONGO_IP -u $MONGO_USER -p $MONGO_PASSWORD \
   --authenticationDatabase $MONGO_AUTH_DB --db planet --collection files --type=csv --fields Wind_node1,Wind_node2,Wind_node3,Wind_node4,Wind_node5,Wind_node6,Wind_node7,Wind_node8,"formName",Time --out "$dirName/$simulationType/Wind.csv"
egrep ','"$formName"',|Wind_node' "$dirName/$simulationType/Wind.csv" | sed 's|,'"$formName"'||' | sed 's/,formName//' | sed '/^,,.*/d' > "$dirName/tempFile$simulationType"
sortField=$(awk 'BEGIN {FS=OFS=","} {print NF}' "$dirName/tempFile$simulationType" | head -n1)
(head -n 1 "$dirName/tempFile$simulationType" && tail -n +2 "$dirName/tempFile$simulationType" | sort -n -k$sortField,$sortField -t,) > "$dirName/$simulationType/Wind.csv"

rm "$dirName/tempFile$simulationType"

python ./server/pythonScripts/timeSynchronizer.py --dir "$dirName/$simulationType"
}

form="$1"
mode="$2"
echo "Starting export of $form"
dirName="./public/files/$3"
lines=$(mongoexport --port $MONGO_PORT --host $MONGO_IP -u $MONGO_USER -p $MONGO_PASSWORD \
   --authenticationDatabase $MONGO_AUTH_DB --db planet -q '{"formName": "'"$form"'"}' --collection results --type=csv --fields Time,Electric_demand,WT_power,PV_power,RES_power,Surplus,EB_input,P2G_input,P2H_input,RES_Curtailment,RES_direct_utilization,EB_output,CHP_el_production,DH_demand,LHD_demand,Total_heat_demand,P2H_heat,CHP_heat,P2G_heat,G2H_heat,formName | wc -l)
if (( lines == 1 )); then
   sendFiles "$(echo $form | sed 's/ $//')" "single" "$mode" "$dirName"
else
   echo "Simulation finished successfully" > "$dirName/simulationStatus.txt"
fi
