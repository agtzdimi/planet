import subprocess
subprocess.Popen(['pscp','-pw','7156471564','graph.jpg','sitewhere@192.168.42.128:/home/sitewhere/'])
subprocess.Popen(['mosquitto_pub','-m','Simulate Image','-h','192.168.42.128','-t','simulate'])