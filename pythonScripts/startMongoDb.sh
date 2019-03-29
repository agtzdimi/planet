#!/bin/bash

sudo mongod --dbpath /var/lib/mongo --config /etc/mongod.conf --bind_ip_all
