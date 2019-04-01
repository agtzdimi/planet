# -----------------------------------------------------------------------------
# This example shows how to use the Python API to make a connection
# to a new model. It also shows how to load and then execute this model
# When the execution is completed the model is resetted and disconnect
#
# WARNING: Before runinng this script, verify that the model is compiled, assigned 
# and not loaded.
# -----------------------------------------------------------------------------


# -----------------------------------------------------------------------------
#  Import modules
# -----------------------------------------------------------------------------
## Import OpalApi module for Python
import RtlabApi
import glob
import sys
import os
from time import sleep


# -----------------------------------------------------------------------------
#  Script core
# -----------------------------------------------------------------------------
## if the script is executed (not imported)
if __name__ == "__main__":

    ## Create a new connection with the project
    projectName = os.path.abspath(str(glob.glob('.\\..\\*.llp')[0]))
    RtlabApi.OpenProject(projectName)
    
    print "The connection with '%s' is completed." % projectName
    
    try:
        ## Load the current model
        realTimeMode = RtlabApi.HARD_SYNC_MODE  # Also possible to use SIM_MODE, SOFT_SIM_MODE, SIM_W_NO_DATA_LOSS_MODE or SIM_W_LOW_PRIO_MODE
        timeFactor   = 1
        RtlabApi.Load(realTimeMode, timeFactor)
        print "- The model is loaded."

        try:
            ## Execute the model
            RtlabApi.Execute(1)

            ## The model is executed 5 seconds
            sleepTime = 5
            sleep(sleepTime)
            print "- The model is executed during %f seconds." % sleepTime

        except:
            pass

        ## If the load is completed, reset the model
        RtlabApi.Reset()
        print "- The model is reseted."

    finally:
        ## Always disconnect from the model when the connection
        ## is completed
        RtlabApi.Disconnect()
        print "The connection is closed."