import sys, json
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('--node', help='Current Node')
parser.add_argument('--capacity', help='Current Capacity')
parser.add_argument('--turbine.model', help='Current Model')
parser.add_argument('--hub.height', help='Current Hub Height')
parser.add_argument('--year', help='Current Year')
parser.add_argument('--tracking', help='Current Tracking')
parser.add_argument('--tilt', help='Current Tilt')
parser.add_argument('--azimuth', help='Current Azimuth')
parser.add_argument('--system.loss', help='Current System Loss')
parser.add_argument('--lat', help='Current Lat')
parser.add_argument('--lon', help='Current Lon')
parser.add_argument('--formName', help='Current Form Name')

args = parser.parse_args()
for arg in vars(args):
   if getattr(args, arg) == "true":
      attribute = arg
      break;

data = json.load(sys.stdin)
if attribute == "lat" or attribute == "lon" or attribute == "formName":
   print(data['payload'][attribute])
else:
   print(data['payload'][args.node][attribute])
