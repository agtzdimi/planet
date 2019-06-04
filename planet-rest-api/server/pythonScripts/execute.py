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
import argparse
import json
import pandas as pd
import shutil
import re
import datetime

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
   
   splitted = []
   splitted = finalFile.split('\n')
   msg=""
   for line in range(1,len(splitted)):
      if line % 100 == 0:
         msg = msg + splitted[line] + "\n"
         p1 = subprocess.Popen(['mosquitto_pub','-m',msg,'-h','192.168.11.128','-t','simulations_results'])
         p1.wait()
         msg=""
      else:
         msg = msg + splitted[line] + "\n"
   p1 = subprocess.Popen(['mosquitto_pub','-m',msg,'-h','192.168.11.128','-t','simulations_results'])
   p1.wait()

if __name__ == "__main__":

   #parser = argparse.ArgumentParser()
   #parser.add_argument("--msg", required=True,
   #   help="Simulation Files Data")
   #args = vars(parser.parse_args())
   pd.options.mode.chained_assignment = None  # default='warn'
   switcher = {
      1: "DEMO_PLANETm_POC3_model1",
      2: "PLANETm_POC3_model2",
      3: "DEMO_PLANETm_POC3_model3",
      4 : "DEMO_PLANETm_POC3_model4"
   }
   # Start the matlab workspace
   print ("Starting Matlab engine...")
   eng = matlab.engine.start_matlab()
   # Initialize the simulink file
   try:
      with open("Parameters_initialization.txt", "r") as read_file:
         data = json.load(read_file)
      model = data['payload']['model']
      startDate = datetime.datetime.strptime(data['payload']['startDate'], '%Y-%m-%d')
      steps = data['payload']['simulation']['time.step']
      horizonDays= round(24 /steps, 0)
      currentModel = switcher.get(model, "Invalid Model")
      eng.run(currentModel,nargout=0)
      message='Simulation finished successfully'
   except Exception as e:
      message=str(e)
      lineMatch = re.search(' line (.*),',message)
      with open( currentModel + '.m' ) as file:
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
      csv_input['Hours'] = csv_input['Time']
      i = 0
      for timestep in csv_input['Time']:
         if timestep % horizonDays == 0:
            csv_input['Hours'][i] = str(startDate.year) + "/" + str(startDate.month) + "/" + str(startDate.day)
         else:
            csv_input['Hours'][i] = "{:02d}".format(startDate.hour) + ":" + "{:02d}".format(startDate.minute)
         startDate = startDate + datetime.timedelta(steps / 24)
         i+=1
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