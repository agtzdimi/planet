import glob
import os
import paho.mqtt.client as paho
import sys
import time
import pandas as pd
import shutil
import subprocess

path = './public/files/single/*'
files = glob.glob(path)
broker='localhost'
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
   ret = client1.publish("/planet/GetData", file)
   i+=1
   with open (os.path.join(os.getcwd(),'./public/files','barStatus.txt'), 'w') as f:
      f.write("%s\n" % i)
   time.sleep(2)

ret = client1.publish("/planet/GetData", "END OF SIM")