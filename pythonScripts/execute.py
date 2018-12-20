""" Script that uses the Python API of OpalRT to execute a model
The script will make a connection to a current loaded model. If the model is not loaded it will
load the model and execute it.
Notes:
   Before runinng this script, verify that the model is compiled
"""

import matlab.engine
import subprocess
import numpy as np
import argparse
import scipy.io as sio

if __name__ == "__main__":
   # Parse the filename passed from the wrapper script
   parser = argparse.ArgumentParser()
   parser.add_argument("fileName", help="Save the fileName that will be simulated",
                     type=str)
   args = parser.parse_args()

   # Start the matlab workspace
   eng = matlab.engine.start_matlab()
   # Initialize the fileName as matlab workspace variable
   eng.workspace['file'] = args.fileName
   eng.eval("load_system(file)",nargout=0)
   simResults = np.asarray(eng.eval("sim(file)"))

   # Process to produce a CSV file per scope and send back to the Host machine
   eng.save('test.mat', 'ScopeSPS',nargout=0)
   mat_contents = sio.loadmat("test.mat")
   for keys in mat_contents.keys():
      if not "__" in keys:
         for attr in mat_contents[keys].dtype.names:
            if "time" in attr:
               times = mat_contents[keys][attr][0][0]
               np.savetxt("times.csv", times, delimiter=",", fmt="%.5f", header="TIME", comments='')
            if "signal" in attr:
               signal = mat_contents[keys][attr][0][0]
               for idx,label in enumerate(signal['label'][0]):
                  sig = signal['values'][0][idx]
                  np.savetxt(str(label[0]) + ".csv", sig, delimiter=",", fmt="%.5f", header=label[0], comments='')

   subprocess.Popen(['pscp','-pw','7156471564','*.csv','sitewhere@192.168.42.128:/home/sitewhere/uploadedFiles'])
   subprocess.Popen(['mosquitto_pub','-m','Simulation File','-h','192.168.42.128','-t','simulate'])