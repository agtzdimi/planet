import subprocess
import time
import threading
import datetime
import argparse
import matlab.engine
import pandas as pd
import os
import glob
import shutil

# Listener
class ThreadBrowser(threading.Thread):
   def __init__(self, token):
      super(ThreadBrowser, self).__init__()
      self.Token = token

   def createExcelFiles(self):
      pd.read_csv("Electricity.csv").to_excel("Electricity.xlsx", index=False)
      pd.read_csv("Heat.csv").to_excel("Heat.xlsx", index=False)
      pd.read_csv("Wind.csv").to_excel("Wind.xlsx", index=False)
      pd.read_csv("PV.csv").to_excel("PV.xlsx", index=False)

   def run(self):
      newSimulation = False
      eventTime = ''
      filesCreated = False
      proc = subprocess.Popen(['mosquitto_sub','-h','localhost','-t',self.Token],stdout=subprocess.PIPE)
      for msg in iter(proc.stdout.readline,''):
         if not filesCreated:
            filesCreated = False
         msg = msg.decode("utf-8")
         for line in msg.split('########'):
            line = line.rstrip()
            if line == '':
               continue
            elif line == 'Start':
               newSimulation = True
               continue
            elif line == 'Wind.csv' or line == 'PV.csv' or line == 'Heat.csv' or line == 'Electricity.csv':
               file = line
            elif line == 'End':
               filesCreated = True
               break
            elif line == 'Control_initialization.txt' or line == 'Economy_environment_initialization.txt' or line == 'Parameters_initialization.txt' :
               file = line
            else:
               file = 'Invalid Mode'
            if file != 'Invalid Mode':
               fileName = line
            else:
               if filesCreated:
                  eventTime = str(line)
               elif newSimulation:
                  with open(fileName, "a") as f:
                     f.write(line + "\n")
         if eventTime != '':
            pd.read_csv("Electricity.csv").to_excel("Electricity.xlsx", index=False)
            pd.read_csv("Heat.csv").to_excel("Heat.xlsx", index=False)
            pd.read_csv("Wind.csv").to_excel("Wind.xlsx", index=False)
            pd.read_csv("PV.csv").to_excel("PV.xlsx", index=False)
            print ("Starting Matlab engine...")
            eng = matlab.engine.start_matlab()
            eng.DEMO_PLANETm_POC3_model1(nargout=0)
            clearDirectory()
            filesCreated = False
            newSimulation = False
            p2g = eng.workspace['P2G_heat']
            date = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%fZ")
            message = '{"deviceToken": "P2G1","type": "DeviceMeasurement","originator": "device","request": {"name": "P2G_heat","value": "' +str(p2g[0][0])+'","updateState": true,"eventDate": "'+str(date)+'","metadata": {"eventTime": "'+ eventTime + '"}}}'
            proc = subprocess.Popen(['mosquitto_pub','-h','ip','-t','SiteWhere/planet/input/json','-m',message])
            eventTime = ''
            eng.quit()
   

def clearDirectory():
   files = glob.glob('*.csv')
   for f in files:
      os.remove(f)
   files = glob.glob('*.xlsx')
   for f in files:
      os.remove(f)
   files = glob.glob('*.txt')
   for f in files:
      os.remove(f)
   files = glob.glob('*.slxc')
   for f in files:
      os.remove(f)
   shutil.rmtree('slprj')

# Send Data Function
def sendData():
   electric_power = 100
   while True:
      date = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%fZ")
      message = '{"deviceToken": "P2G1","type": "DeviceMeasurement","originator": "device","request": {"name": "nominal_electric_power","value": "' +str(electric_power)+'","updateState": true,"eventDate": "'+str(date)+'","metadata": {}}}'
      proc = subprocess.Popen(['mosquitto_pub','-h','ip','-t','SiteWhere/planet/input/json','-m',message])
      time.sleep(60)
      electric_power = electric_power + 1

if __name__ == "__main__":
   
   parser = argparse.ArgumentParser()
   parser.add_argument('--deviceToken', help='Unique Token', required=True)
   args = parser.parse_args()
   token = args.deviceToken

   # Listener
   w = ThreadBrowser(token)
   w.start()
   # Sender
   #w2 = threading.Thread(name='sendData',target=sendData) # use default name
   #w2.start()