""" Script that uses the Python API of OpalRT to execute a model
The script will make a connection to a current loaded model. If the model is not loaded it will
load the model and execute it.
Notes:
   Before runinng this script, verify that the model is compiled
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
import time
import datetime
import requests

def csv_from_excel(filename):
   wb = xlrd.open_workbook(filename + ".xlsx")
   sh = wb.sheet_by_index(0)
   with open(filename + '.csv', 'w', newline='') as csvFile:
      wr = csv.writer(csvFile)
      for rownum in range(sh.nrows):
         wr.writerow(sh.row_values(rownum))
   return sh.nrows - 1

def sendFiles(msg,time):
   msg = msg + "########End########\n" + time
   p1 = subprocess.Popen(['mosquitto_pub','-m',msg,'-h','localhost','-t','P2G1'])
   p1.wait()

def generateCSVMessage(msg, rowNum,title):
   csv = pd.read_csv(title)
   if msg == "":
      msg = "########"+ title +"########\n"
   else:
      msg = msg + "########" + title + "########\n"
   firstItem = True
   for headers in csv.columns.values.tolist():
      if firstItem:
         msg = msg + headers
         firstItem = False
      else:
         msg = msg + "," + headers
   msg = msg + "\n"
   msg = msg + str(csv.iloc[rowNum,:].values.tolist()).replace('[', '').replace(']', '').replace(' ', '')
   msg = msg + "\n" + str(csv.iloc[rowNum + 1,:].values.tolist()).replace('[', '').replace(']', '').replace(' ', '')
   return msg + "\n"

def generateJSONMessage(msg, title,changeValue):
   msg = msg + "########" + title + "########\n"
   with open(title) as json_file:
      data = json.load(json_file)
   if title == 'Parameters_initialization.txt':
      data['payload']['simulation']['simulation.time'] = 2
      if changeValue:
         data['payload']['electric.grid']['node.1']['P2G']['nominal.electric.power'] = data['payload']['electric.grid']['node.1']['P2G']['nominal.electric.power'] + 200
   msg = msg + json.dumps(data) + "\n"
   return msg

def generatePayload(flag,row):
   message = "########Start########\n"
   message = generateCSVMessage(message,row,'Electricity.csv')
   message = generateCSVMessage(message,row,'Heat.csv')
   message = generateCSVMessage(message,row,'PV.csv')
   message = generateCSVMessage(message,row,'Wind.csv')
   message = generateJSONMessage(message,'Control_initialization.txt',False)
   message = generateJSONMessage(message,'Parameters_initialization.txt',flag)
   message = generateJSONMessage(message,'Economy_environment_initialization.txt',False)
   return message

def getEventValue():
   try:
      # Generate JWT Token for Sitewhere Requests
      url = 'http://IP:port/sitewhere/authapi/jwt'
      headers = {'authorization': 'Basic YWRtaW46cGFzc3dvcmQ='}
      r = requests.get(url,headers=headers)
      jwtToken = r.headers['X-Sitewhere-JWT']
      
      # Get the assignment Token assuming the deviceToken is available and has one assignment
      url = 'http://ip:port/sitewhere/api/assignments'
      params ={'deviceToken':'P2G1'}
      headers = {'authorization': 'Bearer '+ jwtToken, 'Content-Type': 'application/json',
'X-Requested-With': 'XMLHttpRequest', 'X-SiteWhere-Tenant-Id': 'Planet','X-SiteWhere-Tenant-Auth': 'Planet1234',
'Access-Control-Allow-Origin': '*',
'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
'Access-Control-Allow-Headers': 'Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization',
'Access-Control-Allow-Credentials': 'true',}
      
      r = requests.get(url,params=params,headers=headers)
      assignments = json.loads(r.text)
      assingToken = ''
      for assign in assignments['results']:
         assingToken = assign['token']
      
      # Get the events from the specific assignment and keep only the value we sent before (based on Time)
      url = 'http://ip:port/sitewhere/api/assignments/' + assingToken + '/measurements'
      params ={'token':assingToken}
      r = requests.get(url,params=params,headers=headers)
      events = json.loads(r.text)
      eventValue = ''
      for event in events['results']:
         if(event['metadata']['eventTime'] == eventTime):
            eventValue = event['value']
            break
      return eventValue
   except:
      return ''

if __name__ == "__main__":

   nrows = csv_from_excel("Electricity")
   csv_from_excel("Heat")
   csv_from_excel("PV")
   csv_from_excel("Wind")
   
   for row in range(0,nrows,2):
      if row == 0:
         finalMessage = generatePayload(False,row)
         eventTime = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%fZ")
         print(eventTime)
         sendFiles(finalMessage,eventTime)
         continue
      eventValue = ''
      while eventValue == '':
         eventValue = getEventValue()
         time.sleep(2)
      
      if eventValue < 5:
         finalMessage = generatePayload(True,row)
         eventTime = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%fZ")
         print(eventTime)
         sendFiles(finalMessage,eventTime)
   