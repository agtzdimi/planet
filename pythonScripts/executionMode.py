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

def load():
""" Function to be called when a user wants to load a simulink model

       This function will run the corresponding python script for load process of the simulink model
"""
   subprocess.Popen(['python','load.py'])

def execute():
""" Function to be called when a user wants to execute a simulink model

       This function will run the corresponding python script for executing a simulink model
"""
   subprocess.Popen(['python','execute.py'])

def reset():
""" Function to be called when a user wants to reset a simulink model

       This function will run the corresponding python script for reseting a simulink model
"""
   subprocess.Popen(['python','reset.py'])

def build():
""" Function to be called when a user wants to build a simulink model

       This function will run the corresponding python script for building a simulink model
"""
   subprocess.Popen(['python','build.py'])

def execMode(mode):
""" Function to be called when the user sends a message to execute a specific mode

       This function will initiate the process given in the recieved message
"""
   switcher = {
       "load": load,
       "execute": execute,
       "reset": reset,
       "build": build
   }
   func = switcher.get(mode.rstrip(), lambda: "Invalid Mode")
   # Execute the function
   func()


if __name__ == "__main__":
   proc = subprocess.Popen(['mosquitto_sub','-h','localhost','-t','test'],stdout=subprocess.PIPE)
   for msg in iter(proc.stdout.readline,''):
      msg, path, logInInfo = msg.decode("utf-8").split(",")
      destPath='C:\\Users\\Owner\\Documents'
      logInInfo = logInInfo.rstrip() + path
      subprocess.Popen(['pscp','-pw','password',logInInfo,destPath])
      execMode(msg)