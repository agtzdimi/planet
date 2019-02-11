#!/bin/bash

while true; do
   if [[ -s /home/sitewhere/results.csv ]]; then
      cat /home/sitewhere/results.csv
      break
   fi
done
