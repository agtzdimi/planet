#!/bin/bash

while read msg; do
   if [[ "$msg" == "Simulation File" ]]; then
      paste /home/planet/uploadedFiles/* -d "," | tr -d '\r' > /home/planet/results.csv
      dos2unix /home/planet/results.csv
      #rm /home/planet/uploadedFiles/*
   fi
done < <(mosquitto_sub -h localhost -t simulate)
