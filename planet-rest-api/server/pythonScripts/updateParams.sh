#!/bin/bash

planet="$1"
sitewhere="$2"
planetRESTPort="$3"
sitewhereUIPort="$4"
sitewhereMQTTPort="$5"
mongoIP="$6"
mongoPort="$7"
mongoUser="$8"
mongoPassword="$9"
mongoAuthDB="${10}"
simulationMachine="${11}"
planetUIPort="${12}"
simulationMachinePort="${14}"
simulationMachineTopic="${13}"

sed -i "s/PLANET = .*/PLANET = '"$planet"'/" ./.env
sed -i "s/PLANET_PORT = .*/PLANET_PORT = '"$planetUIPort"'/" ./.env
sed -i "s/PLANET_REST_PORT = .*/PLANET_REST_PORT = '"$planetRESTPort"'/" ./.env
sed -i "s/MONGO_IP = .*/MONGO_IP = '"$mongoIP"'/" ./.env
sed -i "s/MONGO_PORT = .*/MONGO_PORT = '"$mongoPort"'/" ./.env
sed -i "s/MONGO_USER = .*/MONGO_USER = '"$mongoUser"'/" ./.env
sed -i "s/MONGO_PASSWORD = .*/MONGO_PASSWORD = '"$mongoPassword"'/" ./.env
sed -i "s/MONGO_AUTH_DB = .*/MONGO_AUTH_DB = '"$mongoAuthDB"'/" ./.env
sed -i "s/SIMULATION_MACHINE = .*/SIMULATION_MACHINE = '"$simulationMachine"'/" ./.env
sed -i "s/SIMULATION_PORT = .*/SIMULATION_PORT = '"$simulationMachinePort"'/" ./.env
sed -i "s/SIMULATION_TOPIC = .*/SIMULATION_TOPIC = '"$simulationMachineTopic"'/" ./.env
sed -i "s/SITEWHERE_PORT = .*/SITEWHERE_PORT = '"$sitewhereMQTTPort"'/" ./.env
sed -i "s/SITEWHERE_IP = .*/SITEWHERE_IP = '"$sitewhere"'/" ./.env

sed -i "s/window\.__env.planet = .*/window\.__env.planet = '"$planet"';/" ../planet/src/env.js
sed -i "s/window\.__env.sitewhere = .*/window\.__env.sitewhere = '"$sitewhere"';/" ../planet/src/env.js
sed -i "s/window\.__env.planetRESTPort = .*/window\.__env.planetRESTPort = "$planetRESTPort";/" ../planet/src/env.js
sed -i "s/window\.__env.sitewhereUIPort = .*/window\.__env.sitewhereUIPort = "$sitewhereUIPort";/" ../planet/src/env.js
sed -i "s/window\.__env.mongoPort = .*/window\.__env.mongoPort = "$mongoPort";/" ../planet/src/env.js
sed -i "s/window\.__env.mongoUser = .*/window\.__env.mongoUser = '"$mongoUser"';/" ../planet/src/env.js
sed -i "s/window\.__env.mongoPassword = .*/window\.__env.mongoPassword = '"$mongoPassword"';/" ../planet/src/env.js
sed -i "s/window\.__env.mongoAuthDB = .*/window\.__env.mongoAuthDB = '"$mongoAuthDB"';/" ../planet/src/env.js
sed -i "s/window\.__env.simulationMachine = .*/window\.__env.simulationMachine = '"$simulationMachine"';/" ../planet/src/env.js
sed -i "s/window\.__env.simulationMachinePort = .*/window\.__env.simulationMachinePort = '"$simulationMachinePort"';/" ../planet/src/env.js
sed -i "s/window\.__env.simulationMachineTopic = .*/window\.__env.simulationMachineTopic = '"$simulationMachineTopic"';/" ../planet/src/env.js

nodePID=$(ps aux|grep '/server/bin/www' | grep -v 'grep' | sed -E 's/[[:space:]]+/ /' | cut -d ' ' -f2)
kill $nodePID