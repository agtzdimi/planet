#!/bin/bash

fileName="$1"
formName="$2"
formName="$(echo $formName | sed 's/^ //')"
formName="$(echo $formName | sed 's/ $//')"

lines=$(mongoexport --db planet -q '{"formName": "'"$formName"'"}' --collection results --type=csv --fields Time,Electric_demand,WT_power,PV_power,RES_power,Surplus,EB_input,P2G_input,P2H_input,RES_Curtailment,RES_direct_utilization,EB_output,CHP_el_production,DH_demand,LHD_demand,Total_heat_demand,P2H_heat,CHP_heat,P2G_heat,G2H_heat,formName | wc -l)
if (( lines == 1 || lines == 26 || lines == 8761 )); then
   if [[ -s "/home/sitewhere/${fileName}.csv" ]]; then
      mongoimport --db planet --collection results --type csv --headerline --file "/home/sitewhere/${fileName}.csv"
   fi
elif (( lines > 1 )); then
   if [[ "$fileName" == "Results2" ]]; then
      mongoexport --db planet --collection results -q '{"formName": "'"$formName"'"}' --type=csv --fields Data_names,Grafico_tot,formName --out "/home/sitewhere/${fileName}.csv"
   else
      mongoexport --db planet --collection results -q '{"formName": "'"$formName"'"}' --type=csv --fields Time,Electric_demand,WT_power,PV_power,RES_power,Surplus,EB_input,P2G_input,P2H_input,RES_Curtailment,RES_direct_utilization,EB_output,CHP_el_production,DH_demand,LHD_demand,Total_heat_demand,P2H_heat,CHP_heat,P2G_heat,G2H_heat,formName --out "/home/sitewhere/${fileName}.csv"
   fi
fi