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

def load():
   """ Function to be called when a user wants to load a simulink model
       This function will run the corresponding python script for load process of the simulink model
   """
   subprocess.Popen(['python','load.py'])

def execute(typ):
   """ Function to be called when a user wants to execute a simulink model
       This function will run the corresponding python script for executing a simulink model
   """
   p1 = subprocess.Popen(['python','execute.py','--type',typ])
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

def executeMode(mode,path,info,type):
   """ Function to be called when the user sends a message to execute a specific mode
       This function will initiate the process given in the recieved message
   """
   switcher = {
      "load": load,
      "execute": execute,
      "reset": reset,
      "edit" : edit
   }
   # Get the function from switcher dictionary
   func = switcher.get(mode.rstrip(), lambda: "Invalid Mode")
   timeStamp = time.time()
   os.makedirs("Simulation_" + str(timeStamp))
   destPath = "Simulation_" + str(timeStamp)
   p1 = subprocess.Popen(['pscp','-pw','7156471564',logInInfo,destPath])
   p1.wait()
   files = [f for f in os.listdir('.') if os.path.isfile(f)]
   for file in files:
      path_file = os.path.join("C:\\Users\\Owner\\Documents\\paiko",file)
      shutil.copy2(path_file,destPath)
   filesDest = [f for f in os.listdir(destPath)]
   while len(filesDest) != 15:
      len(filesDest)
      time.sleep(1)
   # Execute the function
   print ("Executing:", func)
   os.chdir("Simulation_" + str(timeStamp))
   func(type)
   os.chdir("..")
   time.sleep(5)
   shutil.rmtree(destPath)

if __name__ == "__main__":
   proc = subprocess.Popen(['mosquitto_sub','-h','localhost','-t','simulations'],stdout=subprocess.PIPE)
   for msg in iter(proc.stdout.readline,''):
      msg, path, logInInfo, simType = msg.decode("utf-8").split(",")
      simType = simType.rstrip()
      logInInfo = logInInfo.rstrip() + path
      executeMode(msg,path,logInInfo,simType)
