import json
import argparse

parser = argparse.ArgumentParser()
parser.add_argument("--dir", required=True,
   help="Filepath to load and send the output file")
args = vars(parser.parse_args())
path = args['dir']

with open(path + "/nodeFiles/Weather1", "r") as read_file:
   weather = read_file.read().splitlines()

del weather[0]
weather = list(map(float, weather))

with open(path + "/Parameters_initialization.txt", "r") as read_file:
   data = json.load(read_file)

valuesLength = data['payload']['simulation']['simulation.time']

nodes = 43

finalWeather = []
for val in range(int(valuesLength)):
   finalWeather.append(weather[val])

for node in range(nodes):
   nodeName = 'node.' + str(node+1)
   data['payload']['electric.grid'][nodeName]['VES']['parameters']['tOutForecast'] = finalWeather
with open(path + "/Parameters_initialization.txt", "w") as read_file:
   read_file.write(json.dumps(data))
