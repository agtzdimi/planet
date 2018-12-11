""" Script that uses the Python API of OpalRT to load a model

The script will make a connection to a current project and load the model.

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

      # If the model is loadable
      if modelState == RtlabApi.MODEL_LOADABLE:
         timeFactor = 1
         RtlabApi.Load(realTimeMode, timeFactor)
         print "- The model is loaded."

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
