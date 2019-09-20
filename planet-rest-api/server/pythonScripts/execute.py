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
import threading
import time
import requests
import argparse
import random

class SimulationData (threading.Thread):
   def __init__(self):
      super(SimulationData , self).__init__(name="SimulationData thread")

   def run(self):
      pd.options.mode.chained_assignment = None  # default='warn'
      switcher = {
         1: "PLANETm_POC3_model1",
         2: "PLANETm_POC3_model2",
         3: "DEMO_PLANETm_POC3_model3",
         4 : "DEMO_PLANETm_POC3_model4"
      }
      # Start the matlab workspace
      print ("Starting Matlab engine...")
      eng = matlab.engine.start_matlab()
      flexibilityBaseline = []
      flexibilityMin = []
      flexibilityModif = []
      flexibilityMax = []
      consumptions = []
      # Initialize the simulink file
      try:
         with open("Parameters_initialization.txt", "r") as read_file:
            data = json.load(read_file)
         formName = data['payload']['formName']
         model = data['payload']['model']
         startDate = datetime.datetime.strptime(data['payload']['startDate'], '%Y-%m-%d').date()
         steps = data['payload']['simulation']['time.step']
         unixTimestamp = datetime.datetime.strptime(str(startDate), "%Y-%m-%d").timestamp()
         if model == 2 or model == 4:
            nodes = 8
         else:
            nodes = 1
         for node in range(nodes):
            nodeName = 'node.' + str(node+1)
            for attr, value in data['payload']['electric.grid'][nodeName]['VES'].items():
               if attr == 'name':
                  flexibilityBaseline.append(nodeName)
                  flexibilityMin.append(nodeName)
                  flexibilityMax.append(nodeName)
                  flexibilityModif.append(nodeName)
                  consumptions.append(nodeName)
                  vesData = data['payload']['electric.grid'][nodeName]['VES'].copy()
                  URL = 'http://' + vesData['IP'] + ':' + vesData['Port'] + '/planet/VTES/api/v1.0/flexibility'
                  vesData['VESID'] = vesData['name']
                  vesData['nodeID'] = str(node+1)
                  vesData['simulationID'] = formName + "-" +vesData['VESID'] + "-" + vesData['nodeID'] + "-" + "flex"
                  vesName = vesData['name']
                  vesIp = vesData['IP']
                  vesPort = vesData['Port']
                  del vesData['name']
                  del vesData['IP']
                  del vesData['Port']
                  del vesData['optionalParameters']
                  del vesData['optionalInputData']
                  times = len(vesData['inputData']['tOutForecast'])
                  print("Requesting Flexibility from:" + vesName + ", for " + 'node.' + str(node+1) + " of scenario " + formName)
                  vesData['parameters']['timeStep'] = int(steps * 60)
                  for i in range(times):
                     vesData['parameters']['timeStamp'] = int(unixTimestamp)
                     URL = 'http://' + vesIp + ':' + vesPort + '/planet/VTES/api/v1.0/flexibility'
                     r = requests.post(url = URL, json = vesData)
                     r.encoding = 'utf-8'
                     flexibilityResponse = json.loads(r.text)
                     min = flexibilityResponse['flexibility'][0]['consumptions'][0]['total'] + (flexibilityResponse['flexibility'][0]['consumptions'][1]['total'] - flexibilityResponse['flexibility'][0]['consumptions'][0]['total'])
                     max = flexibilityResponse['flexibility'][0]['consumptions'][0]['total'] + (flexibilityResponse['flexibility'][0]['consumptions'][2]['total'] - flexibilityResponse['flexibility'][0]['consumptions'][0]['total'])
                     print("Flexibility in timestep " + str(i+1) +":")
                     calcModif = random.uniform(min,max)
                     flexibilityBaseline.append(flexibilityResponse['flexibility'][0]['consumptions'][0]['total'])
                     flexibilityMin.append(flexibilityResponse['flexibility'][0]['consumptions'][1]['total'])
                     flexibilityMax.append(flexibilityResponse['flexibility'][0]['consumptions'][2]['total'])
                     flexibilityModif.append(calcModif)
                     consumptionData = {
                      "simulationID": formName + "-" +vesData['VESID'] + "-" + vesData['nodeID'] + "-" + "cons",
                      "nodeID": vesData['nodeID'],
                      "VESID": vesData['VESID'],
                      "parameters": {
                          "timeStamp": vesData['parameters']['timeStamp'],
                          "duration": vesData['parameters']['timeStep'],
                          "noAssets": vesData['parameters']['noAssets'],
                          "assetType": vesData['parameters']['assetType']
                       },
                      "inputData": {
                          "tOut": vesData['inputData']['tOutForecast'][0],
                          "tInInit": vesData['inputData']['tInInit'],
                          "powerUnit": "Watt",
                          "powerConsumption": calcModif
                       }
                     }
                     URL = 'http://' + vesIp + ':' + vesPort + '/planet/VTES/api/v1.0/requestConsumption'
                     r = requests.post(url = URL, json = consumptionData)
                     r.encoding = 'utf-8'
                     consumptionResponse = json.loads(r.text)
                     vesData['inputData']['tInInit'] = consumptionResponse['tInFinal']
                     vesData['parameters']['vesHorizon'] = vesData['parameters']['vesHorizon'] - vesData['parameters']['timeStep']
                     del vesData['inputData']['tOutForecast'][0]
                     unixTimestamp = unixTimestamp + steps * 3600
                     print("Consumption in timestep " + str(i+1) +":")
                     consumptions.append(consumptionResponse['tInFinal'])
         horizonDays= round(24 /steps, 0)
         startDate = datetime.datetime.strptime(data['payload']['startDate'], '%Y-%m-%d')
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
   
      
      try:
         csv_from_excel("Results1")
         csv_from_excel("Results2")
         csv_input = pd.read_csv('Results1.csv')
         csv_input['formName'] = formName
         csv_input['Hours'] = csv_input['Time']
         csv_input['FlexibilityBaseline'] = pd.Series(flexibilityBaseline)
         csv_input['FlexibilityMin'] = pd.Series(flexibilityMin)
         csv_input['FlexibilityMax'] = pd.Series(flexibilityMax)
         csv_input['FlexibilityModif'] = pd.Series(flexibilityModif)
         csv_input['IndoorTemp'] = pd.Series(consumptions)
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

def csv_from_excel(filename):
   wb = xlrd.open_workbook(filename + ".xlsx")
   sh = wb.sheet_by_index(0)
   with open(filename + '.csv', 'w', newline='') as csvFile:
      wr = csv.writer(csvFile)
      for rownum in range(sh.nrows):
         wr.writerow(sh.row_values(rownum))

def sendFiles(fileName):
   finalFile = '"\n'
   global path
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
         if line == 1:
            msg = msg + path + "\n"
         msg = msg + splitted[line] + "\n"
   p1 = subprocess.Popen(['mosquitto_pub','-m',msg,'-h','192.168.11.128','-t','simulations_results'])
   p1.wait()


class BarStatus (threading.Thread):
   def __init__(self):
      super(BarStatus , self).__init__(name="BarStatus thread")

   def run(self):
      files = [f for f in os.listdir('.') if os.path.isfile(f)]
      length = "10"
      times = 1
      while 'Results1.csv' not in files and times <= 36:
         if len(files) > 20 and len(files) <= 24:
            length = "20:" + path
         elif len(files) > 24 and len(files) <= 27:
            length = "50:" + path
         elif len(files) > 27 and len(files) <= 30:
            length = "65:" + path
         elif len(files) >= 30:
            length = "85:" + path
         p1 = subprocess.Popen(['mosquitto_pub','-m',length,'-h','192.168.11.128','-t','simulations_status'])
         p1.wait()
         time.sleep(5)
         times = times + 1
         files = [f for f in os.listdir('.') if os.path.isfile(f)]

if __name__ == "__main__":

   parser = argparse.ArgumentParser()
   parser.add_argument("--path", required=True,
      help="Filepath to be send back to the Backend")
   args = vars(parser.parse_args())
   path = args['path']
   t1 = SimulationData()
   t2 = BarStatus()
   t1.start()
   t2.start()