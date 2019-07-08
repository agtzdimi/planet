import subprocess
import os
import psutil

if __name__ == "__main__":
   p2 = subprocess.Popen(['docker','run','-p','8082:8082','linksmart/sc'])
   p1 = subprocess.Popen(['./device-gateway-linux-amd64'])
   proc = subprocess.Popen(['mosquitto_sub','-h','localhost','-t','middleware_restart'],stdout=subprocess.PIPE)
   for msg in iter(proc.stdout.readline,''):
      msg = msg.decode("utf-8")
      if msg.rstrip() == 'Start':
         os.remove("./conf/devices/mqtt-switch.json")
      elif msg.rstrip() == 'End':
         for proc in psutil.process_iter():
            try:
               pinfo = proc.as_dict(attrs=['pid', 'name', 'username'])
            except psutil.NoSuchProcess:
               pass
            else:
               if(pinfo['name'] == 'device-gateway-linux-amd64'):
                  process = psutil.Process(pinfo['pid'])
                  process.kill()
                  p = subprocess.Popen(['./device-gateway-linux-amd64'])
      else:
         with open (os.path.join(os.getcwd(),'./conf/devices','mqtt-switch.json'), 'a') as f:
            f.write("%s\n" % msg.rstrip())
