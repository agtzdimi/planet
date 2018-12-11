""" Script that uses the Python API of OpalRT to execute a model

The script will make a connection to a current loaded model. If the model is not loaded it will
load the model and execute it.

Notes:
   Before runinng this script, verify that the model is compiled
"""

# Import RtlabApi module for Python
import RtlabApi
import glob
import os

if __name__ == "__main__":

   # Connect to a running model using its name. The system
   # control is release
   projectName = os.path.abspath(str(glob.glob('.\\..\\*.llp')[0]))
   RtlabApi.OpenProject(projectName)

   print "The connection with '%s' is completed." % projectName

   try:
   # Get the model state and the real time mode
      modelState, realTimeMode = RtlabApi.GetModelState()

      # Print the model state
      print "- The model state is %s." % RtlabApi.OP_MODEL_STATE(modelState)

      # Get the system control before changing the state of the model
      systemControl = 1
      RtlabApi.GetSystemControl(systemControl)
      print "- The system control is acquired."

      # If the model is loaded
      if modelState == RtlabApi.MODEL_LOADED:
         ## Pause the model
         RtlabApi.Execute(1)

      # Get the model state and the real time mode
      modelState, realTimeMode = RtlabApi.GetModelState()

      # Print the model state
      print "- The model state is now %s." % RtlabApi.OP_MODEL_STATE(modelState)

      # Release the system control after changing the state of the model
      systemControl = 0
      RtlabApi.GetSystemControl(systemControl)
      print "- The system control is released."

   finally:
      # Always disconnect from the model when the connection
      # is completed
      RtlabApi.Disconnect()
      print "The connection is closed."
