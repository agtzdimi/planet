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

def load(flName):
   """ Function to be called when a user wants to load a simulink model
       This function will run the corresponding python script for load process of the simulink model
   """
   subprocess.Popen(['python','load.py',flName])

def execute(flName):
   """ Function to be called when a user wants to execute a simulink model
       This function will run the corresponding python script for executing a simulink model
   """
   subprocess.Popen(['python','execute.py',flName])

def reset(flName):
   """ Function to be called when a user wants to reset a simulink model
       This function will run the corresponding python script for reseting a simulink model
   """
   subprocess.Popen(['python','reset.py',flName])

def edit(flName):
   """ Function to be called when a user wants to build a simulink model
       This function will run the corresponding python script for building a simulink model
   """
   subprocess.Popen(['python','edit.py',flName])

def executeMode(mode,path):
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
   # Execute the function
   os.chdir('C:\\Users\\Owner\\Documents\\paiko')
   res = [f for f in glob.glob("*") if ".slx" in f or ".mdl" in f]
   for f in res:
      path = str(f)

   fileNameNoExt = os.path.splitext(path)[0]
   func(fileNameNoExt)

if __name__ == "__main__":
   proc = subprocess.Popen(['mosquitto_sub','-h','localhost','-t','test'],stdout=subprocess.PIPE)
   for msg in iter(proc.stdout.readline,''):
      msg, path, logInInfo = msg.decode("utf-8").split(",")
      destPath='C:\\Users\\Owner\\Documents\\paiko'
      logInInfo = logInInfo.rstrip() + path
      p1 = subprocess.Popen(['pscp','-pw','7156471564',logInInfo,destPath])
      p1.wait()
      executeMode(msg,path)