import subprocess
import os

if __name__ == "__main__":
   proc = subprocess.Popen(['mosquitto_sub','-h','localhost','-t','simulations_results'],stdout=subprocess.PIPE)
   for msg in iter(proc.stdout.readline,''):
      msg = msg.decode("utf-8")
      for line in msg.split('\n'):
          lineLength = len(line.split(','))
          if lineLength == 22:
              with open (os.path.join(os.getcwd(),'../../public/files','Results1.csv'), 'a') as f:
                  f.write("%s\n" % line)
          elif lineLength == 3:
              with open (os.path.join(os.getcwd(),'../../public/files','Results2.csv'), 'a') as f:
                  f.write("%s\n" % line)
          elif lineLength == 1 and line != '' and line != '"':
              with open (os.path.join(os.getcwd(),'../../public/files','simulationStatus.txt'), 'a') as f:
                  f.write("%s\n" % line)