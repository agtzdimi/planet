#!/bin/bash

function sendFiles {

formName="$1"
simulationType="$2"
echo "$formName #######################"

mongoexport --port 21569 --db planet --collection files --out /home/planet/upload/$simulationType/allDocuments.txt
grep '"formName":"'"$formName"'"' /home/planet/upload/$simulationType/allDocuments.txt | grep 'Parameters_initialization' > /home/planet/upload/$simulationType/Parameters_initialization.txt
grep '"formName":"'"$formName"'"' /home/planet/upload/$simulationType/allDocuments.txt | grep 'Economy_environment_initialization' > /home/planet/upload/$simulationType/Economy_environment_initialization.txt
grep '"formName":"'"$formName"'"' /home/planet/upload/$simulationType/allDocuments.txt | grep 'Control_initialization' > /home/planet/upload/$simulationType/Control_initialization.txt
mongoexport --port 21569 --db planet --collection files --type=csv --fields DH_demand,LH_demand,"formName",Time --out /home/planet/upload/$simulationType/Heat.csv
egrep ','"$formName"',|DH_demand|LH_demand' /home/planet/upload/$simulationType/Heat.csv | sed 's/,'"$formName"'//' | sed 's/,formName//' | sed '/^,,.*/d' > tempFile$simulationType
sortField=$(awk 'BEGIN {FS=OFS=","} {print NF}' tempFile$simulationType | head -n1)
(head -n 1 tempFile$simulationType && tail -n +2 tempFile$simulationType | sort -n -k$sortField,$sortField -t,) > /home/planet/upload/$simulationType/Heat.csv

python /home/planet/csvToExcel.py --source /home/planet/upload/$simulationType/Heat.csv --dest /home/planet/upload/$simulationType/Heat.xlsx --type xlsx
mongoexport --port 21569 --db planet --collection files --type=csv --fields Active_node1,Reactive_node1,Active_node2,Reactive_node2,Active_node3,Reactive_node3,Active_node4,Reactive_node4,Active_node5,Reactive_node5,Active_node6,Reactive_node6,Active_node7,Reactive_node7,Active_node8,Reactive_node8,"formName",Time --out /home/planet/upload/$simulationType/Electricity.csv
egrep ','"$formName"',|Active_node|Reactive_node' /home/planet/upload/$simulationType/Electricity.csv | sed 's/,'"$formName"'//' | sed 's/,formName//' | sed '/^,,.*/d' > tempFile$simulationType
sortField=$(awk 'BEGIN {FS=OFS=","} {print NF}' tempFile$simulationType | head -n1)
(head -n 1 tempFile$simulationType && tail -n +2 tempFile$simulationType | sort -n -k$sortField,$sortField -t,) > /home/planet/upload/$simulationType/Electricity.csv
python /home/planet/csvToExcel.py --source /home/planet/upload/$simulationType/Electricity.csv --dest /home/planet/upload/$simulationType/Electricity.xlsx --type xlsx

rm /home/planet/upload/$simulationType/Heat.csv /home/planet/upload/$simulationType/allDocuments.txt /home/planet/upload/$simulationType/Electricity.csv tempFile$simulationType

mosquitto_pub -m "execute,/home/planet/upload/$simulationType/*,planet@192.168.11.128:,$simulationType,$formName" -h 160.40.49.244 -t simulations
}

form="$1"
echo "$form" | egrep ', '
if (( $? == 0 )); then
   echo "Starting Multi Simulation..."
   form1="$(echo "$form" | sed 's/^ //' | awk 'BEGIN {FS=OFS="  -  "}{print $1}')"
   form2="$(echo "$form" | sed 's/^ //' | sed 's/ $//' | awk 'BEGIN {FS=OFS=", "}{print $2}')"
   lines1=$(mongoexport --port 21569 --db planet -q '{"formName": "'"$form1"'"}' --collection results --type=csv --fields Time,Electric_demand,WT_power,PV_power,RES_power,Surplus,EB_input,P2G_input,P2H_input,RES_Curtailment,RES_direct_utilization,EB_output,CHP_el_production,DH_demand,LHD_demand,Total_heat_demand,P2H_heat,CHP_heat,P2G_heat,G2H_heat,formName | wc -l)
   lines2=$(mongoexport --port 21569 --db planet -q '{"formName": "'"$form2"'"}' --collection results --type=csv --fields Time,Electric_demand,WT_power,PV_power,RES_power,Surplus,EB_input,P2G_input,P2H_input,RES_Curtailment,RES_direct_utilization,EB_output,CHP_el_production,DH_demand,LHD_demand,Total_heat_demand,P2H_heat,CHP_heat,P2G_heat,G2H_heat,formName | wc -l)
   if (( lines1 == 1 )); then
      echo "Sending files for:$form1..."
      sendFiles "$form1" "multi1"
   fi
   if (( lines2 == 1 )); then
      echo "Sending files for:$form2..."
      sendFiles "$form2" "multi2"
   fi
else
   echo "Starting export of $form"
   lines=$(mongoexport --port 21569 --db planet -q '{"formName": "'"$form"'"}' --collection results --type=csv --fields Time,Electric_demand,WT_power,PV_power,RES_power,Surplus,EB_input,P2G_input,P2H_input,RES_Curtailment,RES_direct_utilization,EB_output,CHP_el_production,DH_demand,LHD_demand,Total_heat_demand,P2H_heat,CHP_heat,P2G_heat,G2H_heat,formName | wc -l)
   if (( lines == 1 )); then
      sendFiles "$(echo $form | sed 's/ $//')" "single"
   fi
fi
