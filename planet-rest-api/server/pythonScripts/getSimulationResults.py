import subprocess
import os
import threading

class SimulationData (threading.Thread):
   def __init__(self):
      super(SimulationData , self).__init__(name="SimulationData thread")

   def run(self):
      proc = subprocess.Popen(['mosquitto_sub','-h','localhost','-t','simulations_results'],stdout=subprocess.PIPE)
      for msg in iter(proc.stdout.readline,''):
         msg = msg.decode("utf-8")
         for line in msg.split('\n'):
            lineLength = len(line.split(','))
            if lineLength == 24:
               with open (os.path.join(os.getcwd(),'../../public/files','Results1.csv'), 'a') as f:
                  f.write("%s\n" % line)
            elif lineLength == 3:
               with open (os.path.join(os.getcwd(),'../../public/files','Results2.csv'), 'a') as f:
                  f.write("%s\n" % line)
            elif lineLength == 1 and line != '' and line != '"':
               with open (os.path.join(os.getcwd(),'../../public/files','simulationStatus.txt'), 'a') as f:
                  f.write("%s\n" % line)


class BarStatus (threading.Thread):
   def __init__(self):
      super(BarStatus , self).__init__(name="BarStatus thread")

   def run(self):
      proc = subprocess.Popen(['mosquitto_sub','-h','localhost','-t','simulations_status'],stdout=subprocess.PIPE)
      for msg in iter(proc.stdout.readline,''):
         msg = msg.decode("utf-8")
         with open (os.path.join(os.getcwd(),'../../public/files','barStatus.txt'), 'w') as f:
            f.write("%s\n" % msg)

if __name__ == "__main__":

   t1 = SimulationData()
   t2 = BarStatus()
   t1.start()
   t2.start()