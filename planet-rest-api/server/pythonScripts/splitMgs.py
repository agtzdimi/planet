import glob
import os
import paho.mqtt.client as paho
import sys
import time
import pandas as pd
import shutil
import subprocess
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('--ip', help='Sitewhere IP')
parser.add_argument('--device', help='Current Device Token')
parser.add_argument('--mode', help='Current Mode')
parser.add_argument('--date', help='Current Date')

args = parser.parse_args()

path = './public/files/single/*'
files = glob.glob(path)
broker=args.ip
port=1883

client1 = paho.Client("control1")                           #create client object
client1.connect(broker,port)                                 #establish connection
msg = ""
sendMesg = []
for name in files:
   try:
      with open(name) as f:
         if os.path.basename(name) == "Electricity.csv" or os.path.basename(name) == "PV.csv" or os.path.basename(name) == "Wind.csv":
            filePath=os.path.dirname(name) + "/" + os.path.basename(name)
            p1 = subprocess.Popen(['split','--lines=2191',name,filePath])
            p1.wait()
            if os.path.exists(name):
               os.remove(name)
   except:
      continue

files = glob.glob(path)
for name in files:
   try:
      with open(name) as f:
         msg = f.readlines()
         sendMesg.append(("########" + os.path.basename(name) + "########") + ''.join(map(str, msg)))
   except IOError as exc:
      if exc.errno != errno.EISDIR:
         raise

i=0
for file in sendMesg:
   file = file.replace('\n','\\n').replace('"','\\"')
   ret = client1.publish("SiteWhere/planet/input/json", '{"deviceToken": "'+args.device+'","type": "DeviceMeasurement","originator": "device", "request": {"name": "Status","value": "'+args.mode+'", "eventDate": "'+args.date+'", "metadata": {"message": "'+file+'"}}}')
   i+=1
   time.sleep(2.5)

ret = client1.publish("SiteWhere/planet/input/json", '{"deviceToken": "'+args.device+'","type": "DeviceMeasurement","originator": "device", "request": {"name": "Status","value": "'+args.mode+'", "eventDate": "'+args.date+'", "metadata": {"message": "END OF SIM"}}}')