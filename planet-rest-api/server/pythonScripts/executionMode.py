"""Wrapper script to execute a python script corresponding to the message given from mosquitto.
This script is running as a windows service and starts the mosquitto_sub process waiting for
incoming messages
Example:
   Example usage is to register a task in "task scheduler" app on windows 10 to run this python script
        $ python executionMode.py
Attributes:
   execMode (string): Attribute to create a dictionary and execute the corresponding function based
      on the message recieved
   load (): Executes the corresponding python script for message "load"
   execute (): Executes the corresponding python script for message "execute"
   reset() : Executes the corresponding python script for message "reset"
   build() : Executes the corresponding python script for message "build"
Notes: In order for this script to run you have to install mosquitto MQTT and register it as
   a windows service. The mosquitto installation path should also be in %PATH% variable in order
   for this script to run mosquitto_sub.exe.
   
   The message that is expected from a remote machine should have the following format (CSV):
      - field1: the string message i.e <load|execute|reset|build>
      - field2: the path of the file as it is stored in the remote machine
      - field3: the "userName@IP:" of the remote server
"""
import subprocess
import glob, os
import time
import shutil
import pandas as pd
import json

def load():
   """ Function to be called when a user wants to load a simulink model
       This function will run the corresponding python script for load process of the simulink model
   """
   subprocess.Popen(['python','load.py'])

def execute(filesMessage):
   """ Function to be called when a user wants to execute a simulink model
       This function will run the corresponding python script for executing a simulink model
   """
   p1 = subprocess.Popen(['python','execute.py'])
   p1.wait()

def reset():
   """ Function to be called when a user wants to reset a simulink model
       This function will run the corresponding python script for reseting a simulink model
   """
   subprocess.Popen(['python','reset.py'])

def edit():
   """ Function to be called when a user wants to build a simulink model
       This function will run the corresponding python script for building a simulink model
   """
   subprocess.Popen(['python','edit.py'])

def createExcelFile(fileName,finalFileName):
   with open(fileName) as f:
      content = f.readlines()
   fileName="Final_"+fileName
   with open(fileName, 'w') as f:
      for value in content:
         if value != '':
            f.write("%s\n" % value)
   pd.read_csv(fileName).to_excel(finalFileName, index=False)

def executeMode(message):
   """ Function to be called when the user sends a message to execute a specific mode
       This function will initiate the process given in the recieved message
   """
   switcher = {
      "load": load,
      "execute": execute,
      "reset": reset,
      "edit" : edit
   }
   timeStamp = time.time()
   os.makedirs("Simulation_" + str(timeStamp))
   destPath = "Simulation_" + str(timeStamp)
   os.chdir(destPath)
   for line in message.split('########'):
      if line == '':
         continue
      file = switcher.get(line.rstrip(), "Invalid Mode")
      if line.rstrip() == 'Control_initialization.txt':
         file = line.rstrip()
      elif line.rstrip() == 'Economy_environment_initialization.txt':
         file = line.rstrip()
      elif line.rstrip() == 'Parameters_initialization.txt':
         file = line.rstrip()
      elif line.rstrip() == 'Heat.csv':
         file = line.rstrip()
      elif line.rstrip() == 'PV.csv':
         file = line.rstrip()
      elif line.rstrip() == 'Wind.csv':
         file = line.rstrip()
      elif line.rstrip() == 'Electricity.csv':
         file = line.rstrip()
      else:
         file = 'Invalid Mode'
      
      if file != 'Invalid Mode':
         fileName = line.rstrip()
      else:
         with open(fileName, "w") as f:
            f.write(line.rstrip())

   createExcelFile('Heat.csv','Heat.xlsx')
   createExcelFile('Electricity.csv','Electricity.xlsx')
   createExcelFile('PV.csv','PV.xlsx')
   createExcelFile('Wind.csv','Wind.xlsx')
   os.chdir("..")
   files = [f for f in os.listdir('.') if os.path.isfile(f)]
   for file in files:
      path_file = os.path.join(os.path.dirname(os.path.abspath(__file__)),file)
      shutil.copy2(path_file,destPath)
   filesDest = [f for f in os.listdir(destPath)]
   while len(filesDest) != 25:
      len(filesDest)
      time.sleep(1)
   os.chdir(destPath)
   execute(message)
   os.chdir("..")
   time.sleep(15)
   #shutil.rmtree(destPath, ignore_errors=True)

if __name__ == "__main__":
   proc = subprocess.Popen(['mosquitto_sub','-h','localhost','-t','SendSimulator'],stdout=subprocess.PIPE)
   for msg in iter(proc.stdout.readline,''):
      msg = msg.decode("utf-8")
      msg = json.loads(msg)
      if msg['name'] == 'Status' and msg['value'] == 1:
         executeMode(msg['metadata']['message'])
