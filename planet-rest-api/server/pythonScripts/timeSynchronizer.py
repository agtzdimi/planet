#import timeit
#code_to_test = """
import json
import requests
import subprocess
import datetime
import argparse
import os
import pandas as pd
import numpy as np

parser = argparse.ArgumentParser()
parser.add_argument("--dir", required=True,
   help="Filepath to be send back to the Backend")
args = vars(parser.parse_args())
path = args['dir']

params_file = path + "/Parameters_initialization.txt"
with open(params_file, "r") as read_file:
   data = json.load(read_file)

wind_file = path + "/Wind.csv"
windFile = pd.read_csv(wind_file)

pv_file = path + "/PV.csv"
pvFile = pd.read_csv(pv_file)

elec_file = path + "/Electricity.csv"
elecFile = pd.read_csv(elec_file)

nodes = []
for i in range(43):
   nodes.append('node'+ str(i+1))
nodes.append('Time')
pvFile.columns = nodes
windFile.columns = nodes
resProfiles = pvFile.add(windFile, fill_value=0)
del resProfiles['Time']

with open("./public/staticFiles/node_act_react.json", "r") as read_file:
   aggrPower = json.load(read_file)

print("################################################")
print("SCEE Initialization")

nodes = 8
data['pubTopicP2G'] = '/planet/P2G/simulation'
data['subTopicP2G'] = '/planet/P2G/simulation/data'
data['simulationID'] = data['payload']['formName']
timestep = data['payload']['simulation']['time.step']
endpoint = os.environ['SCCE_URL']
SCCE_IP   = os.environ['SCCE_IP']
SCCE_PORT = os.environ['SCCE_PORT']
url = 'http://{}:{}/{}'.format(SCCE_IP, SCCE_PORT, endpoint)
# headers definition
headers = {'content-type': 'application/json'}
response = requests.post(url = url, data = json.dumps(data), headers=headers)

print(response.text)
scceTopic = json.loads(json.dumps(response.text))
scceTopic = json.loads(scceTopic)
scceTopic = scceTopic['scceObject']['listeningBAS']
print("################################################")
# ################################################################################################################
# Initialize the Assets
# ################################################################################################################

print("################################################")
print("OPAL Initialization")

opalData = json.loads(json.dumps({}))
opalData['node_initialization'] = []
for node in data['payload']['electric.grid']:
   if data['payload']['electric.grid'][node]['activated'] == True:
      opalData['node_initialization'].append(1)
   else:
      opalData['node_initialization'].append(0)

opalData['simulation_horizon'] = data['payload']['simulation']['simulation.time']
opalData['Line_length']:[2.8010, 0.2330, 0.3570, 0.4090, 0.4160, 0.2870, 0.2800, 0.4140,2.8010, 0.2330, 0.3570, 0.4090, 0.4160, 0.2870, 0.2800, 0.4140,2.8010, 0.2330, 0.3570, 0.4090, 0.4160, 0.2870, 0.2800, 0.4140,2.8010, 0.2330, 0.3570, 0.4090, 0.4160, 0.2870, 0.2800, 0.4140,2.8010, 0.2330, 0.3570, 0.4090, 0.4160, 0.2870, 0.2800, 0.4140, 0.2870, 0.2800, 0.4140]
opalData['RES_profile'] = np.array2string(resProfiles.values, formatter={'float_kind':lambda x: "%.6f" % x})
opalData['LOAD_profile'] = np.array2string(elecFile.values, formatter={'float_kind':lambda x: "%.6f" % x})

# Initialize OPAL

p1 = subprocess.Popen(['mosquitto_pub','-m',json.dumps(opalData),'-h','localhost','-q','1','-t','/planet/opal/init'])
p2 = subprocess.run(['mosquitto_sub','-C','1','-h','localhost','-t','/planet/opal/init/status'],stdout=subprocess.PIPE)
print(p2.stdout)
print("################################################")

# Initialize P2G
#p1 = subprocess.Popen(['mosquitto_pub','-m',json.dumps(data),'-h','localhost','-q','1','-t','/planet/initialization'])
#print("Waiting for Initialization Response...")
#p2 = subprocess.run(['mosquitto_sub','-C','1','-h','localhost','-t','/planet/initialization/status', '-q', '1'],stdout=subprocess.PIPE)
#print(p2.stdout)

# Get all the nodes having an Asset attached
assetNodes = {
      "VES": {
         "nodes": []
      },
      "P2G": {
         "nodes": []
      },
      "P2H": {
         "nodes": []
      }
   }

for node in range(nodes):
   # Get node's name
   nodeName = 'node.' + str(node+1)
   # Check if the node has VES unit that is not None
   vesData = data['payload']['electric.grid'][nodeName]['VES']
   p2gData = data['payload']['electric.grid'][nodeName]['P2G']
   p2hData = data['payload']['electric.grid'][nodeName]['P2H']
   if "name" in vesData:
      assetNodes['VES']['nodes'].append(nodeName)
   if "name" in p2gData:
      assetNodes['P2G']['nodes'].append(nodeName)
   if "name" in p2hData:
      assetNodes['P2H']['nodes'].append(nodeName)

print("-------------------")
print(assetNodes)
print("-------------------")
counter = 1
print("Starting Simulation for " + str(data['payload']['simulation']['simulation.time']) + " Steps...")

vesData = []
p2hData = []
p2gData = []

with open("./public/staticFiles/ves_params.json", "r") as read_file:
   vesStructure = json.load(read_file)

with open("./public/staticFiles/p2h_params.json", "r") as read_file:
   p2hStructure = json.load(read_file)

with open("./public/staticFiles/p2g_params.json", "r") as read_file:
   p2gStructure = json.load(read_file)

vesFlex = []
p2hFlex = []
p2gFlex = []
p2hAssets = 0
nodesIDs = []

p2hSetpoints = []
p2hStorage = []
HPNominalPower = []
StorageVolume = []
BuildingsVolume = []
HighTemperatureHeat = []

for n in assetNodes['P2H']['nodes']:
   StorageVolume.append(data['payload']['electric.grid'][n]['P2H']['StorageVolume'])
   BuildingsVolume.append(data['payload']['electric.grid'][n]['P2H']['BuildingsVolume'])
   HighTemperatureHeat.append(400)
   HPNominalPower.append(data['payload']['electric.grid'][n]['P2H']['HPNominalPower'])
   p2hStorage.append(0.5)
   p2hSetpoints.append(700)

while counter <= data['payload']['simulation']['simulation.time']:
   unixTimestamp = datetime.datetime.strptime(str("2020-02-28"), "%Y-%m-%d").timestamp()
   for asset in assetNodes:
      for node in assetNodes[asset]['nodes']:
         if asset == 'VES':
            print("VES Flexibility")
            vesStructure['nodeID'] = str(node)
            vesStructure['simulationID'] = data['payload']['formName']
            vesStructure['publishTopic'] = "/planet/" + str(data['payload']['electric.grid'][node]['VES']['name'])
            vesStructure['parameters']['timeStamp'] = unixTimestamp
            vesStructure['parameters']['timeStep'] = timestep
            vesStructure['parameters']['noCommercialBuildings'] = data['payload']['electric.grid'][node]['VES']['parameters']['noCommercialBuildings']
            vesStructure['parameters']['noResidentialBuildings'] = data['payload']['electric.grid'][node]['VES']['parameters']['noResidentialBuildings']
            vesStructure['parameters']['CAPEX'] = data['payload']['electric.grid'][node]['VES']['parameters']['CAPEX']
            vesStructure['parameters']['OPEX'] = data['payload']['electric.grid'][node]['VES']['parameters']['OPEX']
            if counter == data['payload']['simulation']['simulation.time']:
               tempForecast = [data['payload']['electric.grid'][node]['VES']['parameters']['tOutForecast'][counter-1],data['payload']['electric.grid'][node]['VES']['parameters']['tOutForecast'][counter-1]]
            else:
               tempForecast = [data['payload']['electric.grid'][node]['VES']['parameters']['tOutForecast'][counter-1],data['payload']['electric.grid'][node]['VES']['parameters']['tOutForecast'][counter]]
            vesStructure['parameters']['tOutForecast'] = tempForecast
            vesData.append(vesStructure)
            
            p1 = subprocess.Popen(['mosquitto_pub','-m',json.dumps(vesData[len(vesData)-1]),'-h','localhost','-q','1','-t','/planet/units/vesData'])
            p2 = subprocess.run(['mosquitto_sub','-C','1','-h','localhost','-t',vesData[len(vesData)-1]['publishTopic']],stdout=subprocess.PIPE)
            print(p2.stdout)
            print("")
            vesFlex.append(p2.stdout.decode("utf-8"))
         
         if asset == 'P2H':
            p2hAssets = 0
            nodesIDs = []
            print("P2H Flexibility")
            if len(p2hData) == 0:
               nodesIDs.append(str(node))
               p2hStructure['pubTopicP2H'] = "/planet/" + str(data['payload']['electric.grid'][node]['P2H']['name'])
               p2hStructure['timeStep'] = timestep
               p2hStructure['simulationID'] = data['payload']['formName']
               p2hStructure['counter'] = counter
               p2hStructure['HPMaxTemperature'] = data['payload']['electric.grid'][node]['P2H']['HPMaxTemperature']
               p2hStructure['HPPowerFactor'] = data['payload']['electric.grid'][node]['P2H']['HPPowerFactor']
               p2hStructure['setpoint'] = p2hSetpoints
               p2hStructure['storage'] = p2hStorage
               p2hStructure['HPNominalPower'] = HPNominalPower
               p2hStructure['StorageVolume'] = StorageVolume
               p2hStructure['BuildingsVolume'] = BuildingsVolume
               p2hStructure['HighTemperatureHeat'] = HighTemperatureHeat
               p2hStructure['nodeID'] = nodesIDs
               p2hData.append(p2hStructure)
            else:
               p2hAssets += 1
               nodesIDs.append(str(node))
               p2hData[0]['setpoint'] = p2hSetpoints
               p2hData[0]['storage'] = p2hStorage
               p2hData[0]['HPNominalPower'] = HPNominalPower
               p2hData[0]['StorageVolume'] = StorageVolume
               p2hData[0]['BuildingsVolume'] = BuildingsVolume
               p2hData[0]['HighTemperatureHeat'] = HighTemperatureHeat
               p2hData[0]['nodeID'] = nodesIDs
         if asset == 'P2G':
            print("P2G Flexibility")
            p2gStructure['parameters']['timeStamp'] = unixTimestamp
            p2gStructure['simulationID'] = data['formName']
            p2gStructure['nodeID'] = nodesIDs
            p2gStructure['counter'] = counter
            p2gStructure['setpoint'] = p2hSetpoints
            p2gData.append(p2gStructure)
            p1 = subprocess.Popen(['mosquitto_pub','-m',json.dumps(p2gData[len(p2gData)-1]),'-h','localhost','-q','1','-t',data['subTopicP2G']])
            p2 = subprocess.run(['mosquitto_sub','-C','1','-h','localhost','-t',data['pubTopicP2G']],stdout=subprocess.PIPE)
            print(p2.stdout)
            print("")
            p2gFlex.append(p2.stdout.decode("utf-8"))
   
   # Gather P2H Flexibility
   print("STORAGE")
   print(p2hData)
   p1 = subprocess.Popen(['mosquitto_pub','-m',json.dumps(p2hData[len(p2hData)-1]),'-h','localhost','-q','1','-t','/planet/P2H/simulation_input'])
   p2 = subprocess.run(['mosquitto_sub','-C','1','-h','localhost','-t', p2hData[0]['pubTopicP2H']],stdout=subprocess.PIPE)
   print(p2.stdout)
   print("")
   p2hFlex = json.loads(p2.stdout.decode("utf-8"))
   
   print("Publish to OPAL RT")
   print("")
   p2hDat = json.loads(json.dumps(p2hData[0]))
   for ind, nod in enumerate(p2hDat['nodeID']):
      aggrPower[nod]['ActivePower'] = p2hFlex['ActivePowerConsumption'][ind]
      aggrPower[nod]['ReactivePower'] = p2hFlex['ReactivePowerConsumption'][ind]
   
   for ind in range(len(p2gFlex)):
      dat = json.loads(json.dumps(p2gFlex[ind]))
      dat = json.loads(dat)
      aggrPower[dat['nodeID']]['ActivePower'] = dat['previousStepActivePowerConsumption'] + aggrPower[dat['nodeID']]['ActivePower']
      aggrPower[dat['nodeID']]['ReactivePower'] = dat['previousStepReactivePowerConsumption'] + aggrPower[dat['nodeID']]['ReactivePower']
   
   for ind in range(len(vesFlex)):
      dat = json.loads(json.dumps(vesFlex[ind]))
      #dat = json.loads(dat)
      aggrPower[dat['nodeID']]['ActivePower'] = dat['previousStepActivePowerConsumption'] + aggrPower[dat['nodeID']]['ActivePower']
      aggrPower[dat['nodeID']]['ReactivePower'] = dat['previousStepReactivePowerConsumption'] + aggrPower[dat['nodeID']]['ReactivePower']
   
   opalVector = [counter, aggrPower]
   print(str(opalVector))
   p1 = subprocess.Popen(['mosquitto_pub','-m',str(opalVector),'-h','localhost','-q','2','-t','/planet/idoc_to_opal'])
   p2 = subprocess.run(['mosquitto_sub','-C','1','-h','localhost','-t','/planet/OPALToOrchestrator'],stdout=subprocess.PIPE)
   
   opalResponse = p2.stdout.decode("utf-8").rstrip().replace(";",",").strip('][').split(', ')
   opalResponse = json.loads(json.dumps(opalResponse))

   print("OPAL Response")
   print(str(opalResponse))
   print("")
   scceJSON = json.loads(json.dumps([{
      "nodes": {
         "VES": {},
         "P2G": {},
         "P2H": {}
         }
   }]))
   vesIndex = 0
   p2hIndex = 0
   p2gIndex = 0
   
   for asset in assetNodes:
      for node in assetNodes[asset]['nodes']:
         if asset == 'VES':
            scceJSON[0]['nodes']['VES'][node] = {}
            tempVesFlex = json.loads(json.dumps(vesFlex[vesIndex]))
            #tempVesFlex = json.loads(tempVesFlex)
            scceJSON[0]['nodes']['VES'][node] = tempVesFlex['flexibility']
            vesIndex += 1
         elif asset == 'P2H':
            scceJSON[0]['nodes']['P2H'][node] = {}
            scceJSON[0]['nodes']['P2H'][node]['flexibility'] = json.loads(json.dumps(p2hFlex['flexibility']))
            basel = scceJSON[0]['nodes']['P2H'][node]['flexibility']['consumptions'][0]['total'][p2hIndex]
            max = scceJSON[0]['nodes']['P2H'][node]['flexibility']['consumptions'][1]['total'][p2hIndex]
            min = scceJSON[0]['nodes']['P2H'][node]['flexibility']['consumptions'][2]['total'][p2hIndex]
            
            scceJSON[0]['nodes']['P2H'][node]['flexibility']['consumptions'][0]['total'] = basel
            print(p2hFlex['flexibility']['consumptions'][0]['total'])
            scceJSON[0]['nodes']['P2H'][node]['flexibility']['consumptions'][1]['total'] = max
            scceJSON[0]['nodes']['P2H'][node]['flexibility']['consumptions'][2]['total'] = min
            p2hIndex += 1
            
         elif asset == 'P2G':
            scceJSON[0]['nodes']['P2G'][node] = {}
            scceJSON[0]['nodes']['P2G'][node] = p2gFlex[p2gIndex]
            p2gIndex += 1
   scceJSON.append(opalResponse)
   print("Publish to SCCE")
   print(str(scceJSON))
   p1 = subprocess.Popen(['mosquitto_pub','-m',str(scceJSON),'-h','localhost','-t',scceTopic])
   p2 = subprocess.run(['mosquitto_sub','-C','1','-h','localhost','-t','planet/scce/api/v1.0/setpoints','-q','2'],stdout=subprocess.PIPE)
   
   print("SCCE Setpoints")
   print(p2.stdout)
   print("")
   scceSetpoints = json.loads(json.dumps(p2.stdout.decode("utf-8")))
   counter += 1
   vesUnit = 0
   p2hSetpoints = []
   for unit in scceSetpoints:
      for nod in scceSetpoints[unit]:
         if unit == 'VES':
            vesData[vesUnit]['consumptions'][0] = scceSetpoints['VES'][nod]['setpoints']
            vesUnit += 1
         elif unit == 'P2H':
            p2hSetpoints.append(scceSetpoints['P2H'][nod]['setpoints'])
         else:
            pass

   p2hStorage = p2hFlex['storage']
   print("Finish Iteration: " + str(counter))

#"""

#elapsed_time = timeit.timeit(code_to_test, number=100)/100
#print(elapsed_time)
