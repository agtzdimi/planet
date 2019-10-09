import glob
import os
import paho.mqtt.client as paho
import sys
import time
import pandas as pd
import shutil
import subprocess
import argparse
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument("--path", required=True,
   help="path directory")
args = vars(parser.parse_args())

path = args["path"] + '/single/*'
files = glob.glob(path)
broker='160.40.49.244'
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

my_file = Path("sendMesg.lock")
while my_file.is_file():
   time.sleep(2)

with open("sendMesg.lock","w") as f:
   pass

for file in sendMesg:
   ret = client1.publish("SendSimulator", file)
   time.sleep(2)

ret = client1.publish("SendSimulator", "END OF SIM:" + args['path'])
os.remove("sendMesg.lock")
