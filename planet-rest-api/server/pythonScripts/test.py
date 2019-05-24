import glob
import os
import paho.mqtt.client as paho
import sys

path = '../../public/files/single/*'
files = glob.glob(path)
broker="130.192.180.234"
port=1883

client1 = paho.Client("control1")                           #create client object
client1.connect(broker,port)                                 #establish connection
msg = ""
sendMesg = ""
for name in files:
   try:
      with open(name) as f:
         msg = f.readlines()
         sendMesg = sendMesg + ("########" + os.path.basename(name) + "########") + ''.join(map(str, msg))
   except IOError as exc:
      if exc.errno != errno.EISDIR:
         raise
sendMesg = sendMesg.replace('\n','\\n').replace('"','\\"')
print(sendMesg)
ret = client1.publish("SiteWhere/Planet/input/json", '{"deviceToken": "Simulator","type": "DeviceMeasurement","originator": "device", "request": {"name": "Status","value": "1", "eventDate": "2019-05-22T07:46:32.000Z", "metadata": {"message": "'+sendMesg+'"}}}')
