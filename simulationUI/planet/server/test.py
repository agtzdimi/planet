import sys, json
data = json.load(sys.stdin)
dir(data)
for v in data.values():
   print(v[0][0])
