""" Script that uses the Python API of Matlab to execute a model
The script will make a connection to a current loaded model.
Notes:
   
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

      # Create a dictionary with possible models
      switcher = {
         1: "PLANETm_POC3_model1",
         2: "PLANETm_POC3_model2",
         3: "DEMO_PLANETm_POC3_model3",
         4: "DEMO_PLANETm_POC3_model4"
      }
      currentModel = ""

      # Start the matlab workspace
      eng = matlab.engine.start_matlab()

      # Lists with all the data that will be appended to the final csv files
      flexibilityBaseline = []
      flexibilityMin = []
      flexibilityModif = []
      flexibilityMax = []
      consumptionsCommercial = []
      consumptionsResidential = []

      try:
         # Get the data for the current scenario
         with open("Parameters_initialization.txt", "r") as read_file:
            data = json.load(read_file)
         
         # Get Scenario's name
         formName = data['payload']['formName']

         print ("Starting Matlab engine to simulate scenario: " + str(formName) + "...")

         # Get model's parameters
         model = data['payload']['model']
         # Get current Model
         currentModel = switcher.get(model, "Invalid Model")

         startDate = datetime.datetime.strptime(data['payload']['startDate'], '%Y-%m-%d').date()
         steps = data['payload']['simulation']['time.step']
         unixTimestamp = datetime.datetime.strptime(str(startDate), "%Y-%m-%d").timestamp()

         # Set number of nodes based on selected model
         if model == 2 or model == 4:
            nodes = 8
         else:
            nodes = 1
         
         # Initialize flexibility dictionary that will be sent to SCCE
         nodesFlexibility = {
            "nodes": {}
         }

         # Iterate through each node
         for node in range(nodes):
            # Get node's name
            nodeName = 'node.' + str(node+1)
            # Check if the node is not None
            if "name" in data['payload']['electric.grid'][nodeName]['VES']:
               # Append node's name to flexibility lists
               flexibilityBaseline.append(nodeName)
               flexibilityMin.append(nodeName)
               flexibilityMax.append(nodeName)
               flexibilityModif.append(nodeName)

               # Get VES node's attributes
               vesData = data['payload']['electric.grid'][nodeName]['VES'].copy()

               # Set URL for the node, based on VES unit parameters
               # URL = 'http://' + vesData['IP'] + ':' + vesData['Port'] + '/planet/VTES/api/v1.0/flexibility'

               # Set node's data
               vesData['publishTopic'] = '/planet/resres'
               vesName = vesData['name']
               #vesIp = vesData['IP']
               #vesPort = vesData['Port']
               del vesData['name']
               del vesData['IP']
               del vesData['Port']

               print("Requesting Flexibility from:" + vesName + ", for " + 'node.' + str(node+1) + " of scenario " + formName)
               # Set timeStamp
               vesData['parameters']['timeStamp'] = int(unixTimestamp)
               #URL = 'http://' + vesIp + ':' + vesPort + '/planet/VTES/api/v1.0/flexibility'
               #r = requests.post(url = URL, json = vesData)
               #r.encoding = 'utf-8'

               # TODO: SEND Request Flexibility
               print("Send Flexibility from:" + vesName + ", for " + 'node.' + str(node+1) + " of scenario " + formName)
               #p1 = subprocess.Popen(['mosquitto_pub','-m',json.dumps(vesData),'-h','localhost','-q','1','-t','/planet/units/vesData'])
               ##nodeRequestFlexibility = json.dumps(vesData)

               # TODO: RECEIVE Flexibility
               print("Receive Flexibility from:" + vesName + ", for " + 'node.' + str(node+1) + " of scenario " + formName)
               #p2 = subprocess.run(['mosquitto_sub','-C','1','-h','localhost','-t',vesData['publishTopic']],stdout=subprocess.PIPE)                 
               #flexibilityResponse = json.loads(p2.stdout.decode("utf-8"))
               # #flexibilityResponse = json.loads(r.text)              
               flexibilityResponse = json.loads(json.dumps(nodeResponseFlexibility))

               # Iterate through each step of node's flexibility array
               for step in flexibilityResponse['flexibility']:
                  # Get baseline, minumum and maximum values and create a dictionary
                  consumptionsInDict = {consumption['type']: consumption['total'] for consumption in step['consumptions']}
                  # Get baseline, minumum and maximum values from the dictionary
                  flexibilityBaseline.append(consumptionsInDict['BASELINE'])
                  flexibilityMin.append(consumptionsInDict['MINIMUM'])
                  flexibilityMax.append(consumptionsInDict['MAXIMUM'])
                  # Calulate flexibility Modification
                  min = consumptionsInDict['BASELINE'] + (consumptionsInDict['MINIMUM'] - consumptionsInDict['BASELINE'])
                  max = consumptionsInDict['BASELINE'] + (consumptionsInDict['MAXIMUM'] - consumptionsInDict['BASELINE'])
                  calcModif = random.uniform(min,max)
                  flexibilityModif.append(calcModif)

               # Create a temporary dictionary that holds the node's flexibility array 
               currentflexibilityResponse = {
                  flexibilityResponse['nodeID']: {
                     "flexibility": flexibilityResponse['flexibility']
                  }
               }
               # Append node's flexibility array to the final dictionary
               nodesFlexibility['nodes'].update(currentflexibilityResponse)

         # TODO: SEND Aggregated Flexibilies
         print("Send Aggregated Flexibilies")
         # <-- ADD HERE THE CODE TO SEND TAggregated Flexibilies

         # TODO: RECEIVE request Consumption 
         print("Receive Consumption request")
         # <-- ADD HERE THE CODE TO RECEIVE request Consumption 

         # TODO: SEND request Consumption
         print("Send Consumption request")
         # <-- ADD HERE THE CODE TO SEND request Consumption

         # TODO: RECEIVE response Consumption
         print("Receive Consumption response")
         nodesResponseConsumptions = {} # <-- ADD HERE THE CODE TO RECEIVE THE Consumption

         # Iterate through each node's Consumption
         for nodeName, nodeAttr in nodesResponseConsumptions['nodes'].items():
            # Append node's name and Final Commercial to the list
            consumptionsCommercial.append(nodeName)
            consumptionsCommercial.append(nodeAttr['tInFinalCommercial'])

            # Append node's name and Final Residential to the list
            consumptionsResidential.append(nodeName)
            consumptionsResidential.append(nodeAttr['tInFinalResidential'])

         horizonDays = round(24 /steps, 0)
         startDate = datetime.datetime.strptime(data['payload']['startDate'], '%Y-%m-%d')

         eng.run(currentModel,nargout=0)
         message='Simulation for scenario: ' + str(formName) + ' finished successfully'
      except Exception as e:
         message=str(e)
         lineMatch = re.search(' line (.*),', message)
         with open( currentModel + '.m' ) as file:
            for i, line in enumerate(file):
               index = i+1
               if lineMatch is not None:
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
         # Convert first excel file to csv
         csv_from_excel("Results1")
         # Append data to csv file
         csv_input = pd.read_csv('Results1.csv')
         csv_input['formName'] = formName
         csv_input['Hours'] = csv_input['Time']
         csv_input['FlexibilityBaseline'] = pd.Series(flexibilityBaseline)
         csv_input['FlexibilityMin'] = pd.Series(flexibilityMin)
         csv_input['FlexibilityMax'] = pd.Series(flexibilityMax)
         csv_input['FlexibilityModif'] = pd.Series(flexibilityModif)
         csv_input['IndoorTemp1'] = pd.Series(consumptionsCommercial)
         csv_input['IndoorTemp2'] = pd.Series(consumptionsResidential)
         # Update 'Hour' field
         i = 0
         for timestep in csv_input['Time']:
            if timestep % horizonDays == 0:
               csv_input['Hours'][i] = str(startDate.year) + "/" + str(startDate.month) + "/" + str(startDate.day)
            else:
               csv_input['Hours'][i] = "{:02d}".format(startDate.hour) + ":" + "{:02d}".format(startDate.minute)
            startDate = startDate + datetime.timedelta(steps / 24)
            i+=1
         # Override original csv file
         csv_input.to_csv('output.csv', index=False)
         os.remove("Results1.csv")
         os.rename("output.csv", "Results1.csv")
         
         # Convert second excel file to csv
         csv_from_excel("Results2")
         # Append data to csv file
         csv_input2 = pd.read_csv('Results2.csv')
         csv_input2['formName'] = formName
         # Override original csv file
         csv_input2.to_csv('output2.csv', index=False)
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
         p1 = subprocess.Popen(['mosquitto_pub','-m',msg,'-h','localhost','-t','simulations_results'])
         p1.wait()
         msg=""
      else:
         if line == 1:
            msg = msg + path + "\n"
         msg = msg + splitted[line] + "\n"
   p1 = subprocess.Popen(['mosquitto_pub','-m',msg,'-h','localhost','-t','simulations_results'])
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
         p1 = subprocess.Popen(['mosquitto_pub','-m',length,'-h','localhost','-t','simulations_status'])
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