""" Script that uses the Python API of OpalRT to execute a model
The script will make a connection to a current loaded model. If the model is not loaded it will
load the model and execute it.
Notes:
   Before runinng this script, verify that the model is compiled
"""

import matlab.engine
import subprocess
import os
import xlrd
import csv
import shutil
import json
import pandas as pd
import shutil
import re

def csv_from_excel(filename):
   wb = xlrd.open_workbook(filename + ".xlsx")
   sh = wb.sheet_by_index(0)
   with open(filename + '.csv', 'w', newline='') as csvFile:
      wr = csv.writer(csvFile)
      for rownum in range(sh.nrows):
         wr.writerow(sh.row_values(rownum))

def sendFiles(fileName):
   finalFile = '"\n'
   with open(fileName) as f:
      content = f.readlines()
   
   for i in range(len(content)):
      finalFile = finalFile + content[i]
   finalFile = finalFile + '\n"'
   p1 = subprocess.Popen(['mosquitto_pub','-m',finalFile,'-h','192.168.11.128','-t','simulations_results'])
   p1.wait()

if __name__ == "__main__":
   # Start the matlab workspace
   print ("Starting Matlab engine...")
   eng = matlab.engine.start_matlab()
   # Initialize the simulink file
   try:
      eng.PLANETm_v2(nargout=0)
      message='Simulation finished successfully'
   except Exception as e:
      message=str(e)
      lineMatch = re.search(' line (.*),',message)
      with open('PLANETm_v2.m') as file:
         for i, line in enumerate(file):
            index = i+1
            if str(index) == str(lineMatch.group(1)):
               message = message + line
      with open('Results1.csv', 'a'):
         os.utime('Results1.csv', None)
      with open('Results2.csv', 'a'):
         os.utime('Results2.csv', None)

   with open('simulationStatus.txt', 'a') as simStatus:
      simStatus.write(message)
   print ("Simulation Finished!")

   with open("Control_initialization.txt", "r") as read_file:
      data = json.load(read_file)
   
   formName = data['payload']['formName']
   try:
      csv_from_excel("Results1")
      csv_from_excel("Results2")
      csv_input = pd.read_csv('Results1.csv')
      csv_input['formName'] = formName
      csv_input.to_csv('output.csv', index=False)
      csv_input2 = pd.read_csv('Results2.csv')
      csv_input2['formName'] = formName
      csv_input2.to_csv('output2.csv', index=False)
      os.remove("Results1.csv")
      os.rename("output.csv", "Results1.csv")
      os.remove("Results2.csv")
      os.rename("output2.csv", "Results2.csv")
   except Exception as e:
      print(str(e))

   sendFiles("Results1.csv")
   sendFiles("Results2.csv")
   sendFiles("simulationStatus.txt")