import subprocess
import os
import threading

class SimulationData (threading.Thread):
   def __init__(self):
      super(SimulationData , self).__init__(name="SimulationData thread")

   def run(self):
      proc = subprocess.Popen(['mosquitto_sub','-h','160.40.49.244','-t','simulations_results'],stdout=subprocess.PIPE)
      for msg in iter(proc.stdout.readline,''):
         msg = msg.decode("utf-8")
         messages = msg.split('\n')
         matching = [pattern for pattern in messages if "./public/files" in pattern]
         if len(matching) != 0:
            path = matching[0]
         for line in messages:
            lineLength = len(line.split(','))
            if lineLength >= 24:
               with open (os.path.join(os.getcwd(),'../../',str(path).rstrip(),'Results1.csv'), 'a') as f:
                  f.write("%s\n" % line)
            elif lineLength == 3:
               with open (os.path.join(os.getcwd(),'../../',str(path).rstrip(),'Results2.csv'), 'a') as f:
                  f.write("%s\n" % line)
            elif lineLength == 1 and line != '' and line != '"' and "./public/files" not in line:
               with open (os.path.join(os.getcwd(),'../../',str(path).rstrip(),'simulationStatus.txt'), 'a') as f:
                  f.write("%s\n" % line)


class BarStatus (threading.Thread):
   def __init__(self):
      super(BarStatus , self).__init__(name="BarStatus thread")

   def run(self):
      proc = subprocess.Popen(['mosquitto_sub','-h','160.40.49.244','-t','simulations_status'],stdout=subprocess.PIPE)
      for msg in iter(proc.stdout.readline,''):
         msg = msg.decode("utf-8")
         try:
            path = msg.split(":")[1].rstrip()
            with open (os.path.join(os.getcwd(),'../../',str(path),'barStatus.txt'), 'w') as f:
               f.write("%s\n" % msg.split(":")[0])
         except(IndexError):
            pass

if __name__ == "__main__":

   t1 = SimulationData()
   t2 = BarStatus()
   t1.start()
   t2.start()
