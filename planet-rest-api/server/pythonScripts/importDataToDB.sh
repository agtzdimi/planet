#!/bin/bash

formName="$1"
windData="$2"
pvData="$3"
dirName="$4"
dbError=false

for file in $(ls $dirName/*.csv); do
   if [[ -s $file ]]; then
      awk -v formName="$formName" 'BEGIN {FS=OFS=","} {if(NR==1) {$(NF+1)="formName"} else {$(NF+1)=formName} print $0}' $file > "$dirName/tempFile"
      awk 'BEGIN {FS=OFS=","} {if(NR==1) {$(NF+1)="Time"} else {$(NF+1)=(NR-2)} print $0}' "$dirName/tempFile" > $file
      mongoimport --port $MONGO_PORT --host $MONGO_IP -u $MONGO_USER -p $MONGO_PASSWORD \
         --authenticationDatabase $MONGO_AUTH_DB --db planet --collection files --type csv --headerline --file $file
      if (( $? != 0 )); then
         dbError=true
      fi
   fi
done

echo "$windData" > "$dirName/windData.txt"
echo "$pvData" > "$dirName/pvData.txt"

for file in $(ls $dirName/*.txt); do
   if [[ -s $file ]]; then
      mongoimport --port $MONGO_PORT --host $MONGO_IP -u $MONGO_USER -p $MONGO_PASSWORD \
         --authenticationDatabase $MONGO_AUTH_DB --db planet --collection files --file $file
      if (( $? != 0 )); then
         dbError=true
      fi
   fi
done

rm -rf "$dirName"
if [[ $dbError == false ]]; then
   exit 0
else
   exit 1
fi
