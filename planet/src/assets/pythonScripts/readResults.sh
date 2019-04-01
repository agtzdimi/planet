#!/bin/bash

while true; do
   if [[ -s /home/planet/results.csv ]]; then
      cat /home/planet/results.csv
      break
   fi
done
