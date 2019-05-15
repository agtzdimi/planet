#!/bin/bash

function sendFiles {

formName="$1"
simulationType="$2"
mode="$3"

echo "$formName ############"
mongoexport --port $MONGO_PORT --host $MONGO_IP -u $MONGO_USER -p $MONGO_PASSWORD \
   --authenticationDatabase $MONGO_AUTH_DB --db planet --collection files --out ./public/files/$simulationType/allDocuments.txt
grep '"formName":"'"$formName"'"' ./public/files/$simulationType/allDocuments.txt | grep 'Parameters_initialization' > ./public/files/$simulationType/Parameters_initialization.txt
grep '"formName":"'"$formName"'"' ./public/files/$simulationType/allDocuments.txt | grep 'Economy_environment_initialization' > ./public/files/$simulationType/Economy_environment_initialization.txt
grep '"formName":"'"$formName"'"' ./public/files/$simulationType/allDocuments.txt | grep 'Control_initialization' > ./public/files/$simulationType/Control_initialization.txt
mongoexport --port $MONGO_PORT --host $MONGO_IP -u $MONGO_USER -p $MONGO_PASSWORD \
   --authenticationDatabase $MONGO_AUTH_DB --db planet --collection files --type=csv --fields DH_demand,LH_demand,"formName",Time --out ./public/files/$simulationType/Heat.csv
egrep ','"$formName"',|DH_demand|LH_demand' ./public/files/$simulationType/Heat.csv | sed 's/,'"$formName"'//' | sed 's/,formName//' | sed '/^,,.*/d' > tempFile$simulationType
sortField=$(awk 'BEGIN {FS=OFS=","} {print NF}' tempFile$simulationType | head -n1)
(head -n 1 tempFile$simulationType && tail -n +2 tempFile$simulationType | sort -n -k$sortField,$sortField -t,) > ./public/files/$simulationType/Heat.csv

mongoexport --port $MONGO_PORT --host $MONGO_IP -u $MONGO_USER -p $MONGO_PASSWORD \
   --authenticationDatabase $MONGO_AUTH_DB --db planet --collection files --type=csv --fields Active_node1,Reactive_node1,Active_node2,Reactive_node2,Active_node3,Reactive_node3,Active_node4,Reactive_node4,Active_node5,Reactive_node5,Active_node6,Reactive_node6,Active_node7,Reactive_node7,Active_node8,Reactive_node8,"formName",Time --out ./public/files/$simulationType/Electricity.csv
egrep ','"$formName"',|Active_node|Reactive_node' ./public/files/$simulationType/Electricity.csv | sed 's/,'"$formName"'//' | sed 's/,formName//' | sed '/^,,.*/d' > tempFile$simulationType
sortField=$(awk 'BEGIN {FS=OFS=","} {print NF}' tempFile$simulationType | head -n1)
(head -n 1 tempFile$simulationType && tail -n +2 tempFile$simulationType | sort -n -k$sortField,$sortField -t,) > ./public/files/$simulationType/Electricity.csv

mongoexport --port $MONGO_PORT --host $MONGO_IP -u $MONGO_USER -p $MONGO_PASSWORD \
   --authenticationDatabase $MONGO_AUTH_DB --db planet --collection files --type=csv --fields PV_node1,PV_node2,PV_node3,PV_node4,PV_node5,PV_node6,PV_node7,PV_node8,"formName",Time --out ./public/files/$simulationType/PV.csv
egrep ','"$formName"',|PV_node' ./public/files/$simulationType/PV.csv | sed 's/,'"$formName"'//' | sed 's/,formName//' | sed '/^,,.*/d' > tempFile$simulationType
sortField=$(awk 'BEGIN {FS=OFS=","} {print NF}' tempFile$simulationType | head -n1)
(head -n 1 tempFile$simulationType && tail -n +2 tempFile$simulationType | sort -n -k$sortField,$sortField -t,) > ./public/files/$simulationType/PV.csv

mongoexport --port $MONGO_PORT --host $MONGO_IP -u $MONGO_USER -p $MONGO_PASSWORD \
   --authenticationDatabase $MONGO_AUTH_DB --db planet --collection files --type=csv --fields Wind_node1,Wind_node2,Wind_node3,Wind_node4,Wind_node5,Wind_node6,Wind_node7,Wind_node8,"formName",Time --out ./public/files/$simulationType/Wind.csv
egrep ','"$formName"',|Wind_node' ./public/files/$simulationType/Wind.csv | sed 's/,'"$formName"'//' | sed 's/,formName//' | sed '/^,,.*/d' > tempFile$simulationType
sortField=$(awk 'BEGIN {FS=OFS=","} {print NF}' tempFile$simulationType | head -n1)
(head -n 1 tempFile$simulationType && tail -n +2 tempFile$simulationType | sort -n -k$sortField,$sortField -t,) > ./public/files/$simulationType/Wind.csv

rm ./public/files/$simulationType/allDocuments.txt tempFile$simulationType

for file in $(ls ./public/files/$simulationType/*); do
   fileName=$(basename $(echo -e "${file}"))
   echo "########$fileName########" >> "./public/files/$simulationType/seperatedFiles.txt"
   cat $file >> "./public/files/$simulationType/seperatedFiles.txt"
done

filesPath="$(pwd)/public/files"
seperatedFiles="$(cat ./public/files/$simulationType/seperatedFiles.txt | awk 'BEGIN {RS="\n";ORS="\\n"}{print $0}' | sed 's/"/\\"/g')"
eventDate=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")
sleep 1
mosquitto_pub -h "$SITEWHERE_IP" -t 'SiteWhere/planet/input/json' -m '{"deviceToken": "'"$SIMULATION_TOPIC"'","type": "DeviceMeasurement","originator": "device", "request": {"name": "Status","value": "'"$mode"'", "eventDate": "'"$eventDate"'", "metadata": {"message": "'"$(printf %s "$seperatedFiles")"'"}}}' -p "$SITEWHERE_PORT"
# mosquitto_pub -m "$(echo $seperatedFiles)" -h $SIMULATION_MACHINE -t "$SIMULATION_TOPIC"
}

form="$1"
mode="$2"
echo "Starting export of $form"
lines=$(mongoexport --port $MONGO_PORT --host $MONGO_IP -u $MONGO_USER -p $MONGO_PASSWORD \
   --authenticationDatabase $MONGO_AUTH_DB --db planet -q '{"formName": "'"$form"'"}' --collection results --type=csv --fields Time,Electric_demand,WT_power,PV_power,RES_power,Surplus,EB_input,P2G_input,P2H_input,RES_Curtailment,RES_direct_utilization,EB_output,CHP_el_production,DH_demand,LHD_demand,Total_heat_demand,P2H_heat,CHP_heat,P2G_heat,G2H_heat,formName | wc -l)
if (( lines == 1 )); then
   sendFiles "$(echo $form | sed 's/ $//')" "single" "$mode"
fi
