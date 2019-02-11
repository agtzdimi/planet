#!/bin/bash

while read msg; do
   if [[ "$msg" == "Simulation File" ]]; then
      paste /home/sitewhere/uploadedFiles/* -d "," | tr -d '\r' > /home/sitewhere/results.csv
      dos2unix /home/sitewhere/results.csv
      #rm /home/sitewhere/uploadedFiles/*
   fi
done < <(mosquitto_sub -h localhost -t simulate)
