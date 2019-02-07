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

def csv_from_excel(filename):
   wb = xlrd.open_workbook(filename + ".xlsx")
   sh = wb.sheet_by_index(0)
   with open(filename + '.csv', 'w', newline='') as csvFile:
      wr = csv.writer(csvFile)
      for rownum in range(sh.nrows):
         wr.writerow(sh.row_values(rownum))

if __name__ == "__main__":

   parser = argparse.ArgumentParser()
   parser.add_argument("--type", required=True,
   help="simulation type")
   args = vars(parser.parse_args())
   # Start the matlab workspace
   print ("Starting Matlab engine...")
   eng = matlab.engine.start_matlab()
   # Initialize the simulink file
   eng.PLANETm(nargout=0)
   print ("Simulation Finished!")

   csv_from_excel("Results1")
   csv_from_excel("Results2")
   if args["type"] != "single":
      os.rename("Results1.csv", args["type"] + "Results1.csv")
      os.rename("Results2.csv", args["type"] + "Results2.csv")

   p1 = subprocess.Popen(['pscp','-pw','7156471564','*.csv','sitewhere@192.168.42.128:/home/sitewhere'])
   p1.wait()