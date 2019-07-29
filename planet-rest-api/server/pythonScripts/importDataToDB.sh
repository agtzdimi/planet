#!/bin/bash

formName="$1"
windData="$2"
pvData="$3"
dbError=false

for file in $(ls ./public/files/*.csv); do
   if [[ -s $file ]]; then
      awk -v formName="$formName" 'BEGIN {FS=OFS=","} {if(NR==1) {$(NF+1)="formName"} else {$(NF+1)=formName} print $0}' $file > tempFile
      awk 'BEGIN {FS=OFS=","} {if(NR==1) {$(NF+1)="Time"} else {$(NF+1)=(NR-2)} print $0}' tempFile > $file
      mongoimport --port $MONGO_PORT --host $MONGO_IP -u $MONGO_USER -p $MONGO_PASSWORD \
         --authenticationDatabase $MONGO_AUTH_DB --db planet --collection files --type csv --headerline --file $file
      if (( $? != 0 )); then
         dbError=true
      fi
   fi
done

echo "$windData" > ./public/files/windData.txt
echo "$pvData" > ./public/files/pvData.txt

for file in $(ls ./public/files/*.txt); do
   if [[ -s $file ]]; then
      mongoimport --port $MONGO_PORT --host $MONGO_IP -u $MONGO_USER -p $MONGO_PASSWORD \
         --authenticationDatabase $MONGO_AUTH_DB --db planet --collection files --file $file
      if (( $? != 0 )); then
         dbError=true
      fi
   fi
done

rm -rf ./public/files/* tempFile
if [[ $dbError == false ]]; then
   exit 0
else
   exit 1
fi
