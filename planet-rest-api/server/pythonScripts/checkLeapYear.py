from datetime import date
import argparse

def checkLeap(startDate,endDate):
   start = startDate.split('-')
   end = endDate.split('-')
   d1 = date(int(start[0]),int(start[1]),int(start[2]))
   if start[0] != end[0]:
      if int(end[1]) >= 2:
         if(int(end[0]) % 4 == 0):
            d2 = date(int(end[0]), 2, 29)
         else:
            print("0")
            return
      else:
         if(int(start[0]) % 4 == 0):
            d2 = date(int(start[0]), 2, 29)
         else:
            print("0")
            return
   else:
      if(int(start[0]) % 4 == 0):
         d2 = date(int(start[0]), 2, 29)
      else:
         print("0")
         return
   d3 = date(int(end[0]),int(end[1]),int(end[2]))
   if d1 <= d2 <= d3:
      print ((d2-d1)*24)
   else:
      print("0")

parser = argparse.ArgumentParser()
parser.add_argument('--startDate', help='Starting Date')
parser.add_argument('--endDate', help='Ending Date')

args = parser.parse_args()
checkLeap(args.startDate,args.endDate)

