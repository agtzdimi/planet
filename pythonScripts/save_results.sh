#!/bin/bash

function sortFile {
filePath="$1"
(head -n 1 "$filePath" && tail -n +2 "$filePath" | sort -n -k1,1 -t,) > "${filePath}_temp"
mv "${filePath}_temp" "$filePath"
}

fileName="$1"
formName="$2"
echo "Trying to save:$formName..."
formName="$(echo $formName | sed 's/^ //')"
formName="$(echo $formName | sed 's/ $//')"

if [[ "$fileName" == "Results2" ]]; then
   linesF2=$(mongoexport --db planet -q '{"formName": "'"$formName"'"}' --collection results --type=csv --fields Data_names,Grafico_tot,formName | egrep -v "^,," | wc -l)
   if (( linesF2 == 1 )) && [[ -s "/home/planet/${fileName}.csv" ]]; then
      mongoimport --db planet --collection results --type csv --headerline --file "/home/planet/${fileName}.csv"
      mongoexport --db planet --collection results -q '{"formName": "'"$formName"'"}' --type=csv --fields Data_names,Grafico_tot,formName --out "/home/planet/${fileName}.csv"
      sortFile "/home/planet/${fileName}.csv"
   elif (( linesF2 > 1 )); then
      mongoexport --db planet --collection results -q '{"formName": "'"$formName"'"}' --type=csv --fields Data_names,Grafico_tot,formName --out "/home/planet/${fileName}.csv"
      sortFile "/home/planet/${fileName}.csv"
   fi
else
   linesF1=$(mongoexport --db planet -q '{"formName": "'"$formName"'"}' --collection results --type=csv --fields Time,Electric_demand,WT_power,PV_power,RES_power,Surplus,EB_input,P2G_input,P2H_input,RES_Curtailment,RES_direct_utilization,EB_output,CHP_el_production,DH_demand,LHD_demand,Total_heat_demand,P2H_heat,CHP_heat,P2G_heat,G2H_heat,formName | egrep -v "^,," | wc -l)
   if (( linesF1 == 1 )) && [[ -s "/home/planet/${fileName}.csv" ]]; then
      mongoimport --db planet --collection results --type csv --headerline --file "/home/planet/${fileName}.csv"
      mongoexport --db planet --collection results -q '{"formName": "'"$formName"'"}' --type=csv --fields Time,Electric_demand,WT_power,PV_power,RES_power,Surplus,EB_input,P2G_input,P2H_input,RES_Curtailment,RES_direct_utilization,EB_output,CHP_el_production,DH_demand,LHD_demand,Total_heat_demand,P2H_heat,CHP_heat,P2G_heat,G2H_heat,formName --out "/home/planet/${fileName}.csv"
      sortFile "/home/planet/${fileName}.csv"
   elif (( linesF1 > 1 )); then
      mongoexport --db planet --collection results -q '{"formName": "'"$formName"'"}' --type=csv --fields Time,Electric_demand,WT_power,PV_power,RES_power,Surplus,EB_input,P2G_input,P2H_input,RES_Curtailment,RES_direct_utilization,EB_output,CHP_el_production,DH_demand,LHD_demand,Total_heat_demand,P2H_heat,CHP_heat,P2G_heat,G2H_heat,formName --out "/home/planet/${fileName}.csv"
      sortFile "/home/planet/${fileName}.csv"
   fi
fi