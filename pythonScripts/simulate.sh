#!/bin/bash

formName="$1"

mongoexport --db planet --collection files --out /home/sitewhere/upload/allDocuments.txt
grep '"formName":"'"$formName"'"' /home/sitewhere/upload/allDocuments.txt | grep 'Parameters_initialization' > /home/sitewhere/upload/Parameters_initialization.txt
grep '"formName":"'"$formName"'"' /home/sitewhere/upload/allDocuments.txt | grep 'Economy_environment_initialization' > /home/sitewhere/upload/Economy_environment_initialization.txt
grep '"formName":"'"$formName"'"' /home/sitewhere/upload/allDocuments.txt | grep 'Control_initialization' > /home/sitewhere/upload/Control_initialization.txt
mongoexport --db planet --collection files --type=csv --fields DH_demand,LH_demand,"formName" --out /home/sitewhere/upload/Heat.csv
egrep ','"$formName"'$|DH_demand|LH_demand' /home/sitewhere/upload/Heat.csv | sed 's/,'"$formName"'$//'| sed 's/^,$//' | awk 'BEGIN {FS=OFS=","} /^\s*$/ {next;}{print $0}' | sed 's/,formName//' > tempFile
mv tempFile /home/sitewhere/upload/Heat.csv
python /home/sitewhere/csvToExcel.py --source /home/sitewhere/upload/Heat.csv --dest /home/sitewhere/upload/Heat.xlsx --type xlsx
mongoexport --db planet --collection files --type=csv --fields Active_node1,Reactive_node1,Active_node2,Reactive_node2,Active_node3,Reactive_node3,Active_node4,Reactive_node4,Active_node5,Reactive_node5,Active_node6,Reactive_node6,Active_node7,Reactive_node7,Active_node8,Reactive_node8,"formName" --out /home/sitewhere/upload/Electricity.csv
egrep ','"$formName"'$|Active_node|Reactive_node' /home/sitewhere/upload/Electricity.csv | sed 's/,'"$formName"'$//'| sed 's/^,$//' | awk 'BEGIN {FS=OFS=","} /^\s*$/ {next;}{print $0}' | sed 's/,formName//' > tempFile
mv tempFile /home/sitewhere/upload/Electricity.csv
python /home/sitewhere/csvToExcel.py --source /home/sitewhere/upload/Electricity.csv --dest /home/sitewhere/upload/Electricity.xlsx --type xlsx

rm /home/sitewhere/upload/Heat.csv /home/sitewhere/upload/allDocuments.txt /home/sitewhere/upload/Electricity.csv

mosquitto_pub -m "execute,/home/sitewhere/upload/*,sitewhere@192.168.42.128:" -h 192.168.42.1 -t simulations
