""" Script that uses the Python API of OpalRT to build a model

The script will make a connection to a current project and build the model.

"""

import RtlabApi
from time import sleep
import os
import sys
import glob

if __name__ == "__main__":

   # Get the current script directory
   currentFolder = os.path.abspath(sys.path[0])

   # Connect to a running model using its name. The system
   # control is release
   projectName = os.path.abspath(str(glob.glob('.\\..\\*.llp')[0]))
   RtlabApi.OpenProject(projectName)

   print "The connection with '%s' is completed." % projectName

   # Get path to model
   models = RtlabApi.GetActiveModels()
   mdlFileName, mdlFolder, _, _, _, _, _ = models[0]
   mdlPath = os.path.join(mdlFolder, mdlFileName)

   try:
      # Registering this thread to receive all messages from the controller
      # (used to display compilation log into python console)
      RtlabApi.RegisterDisplay(RtlabApi.DISPLAY_REGISTER_ALL)

      # Set attribute on project to force to recompile (optional)
      modelId = RtlabApi.FindObjectId(RtlabApi.OP_TYPE_MODEL, mdlPath)
      RtlabApi.SetAttribute(modelId, RtlabApi.ATT_FORCE_RECOMPILE, True)

      # Launch compilation
      compilationSteps = RtlabApi.OP_COMPIL_ALL_NT | RtlabApi.OP_COMPIL_ALL_LINUX
      RtlabApi.StartCompile2((("", compilationSteps), ), )
      print 'Compilation started.'

      # Wait until the end of the compilation
      status = RtlabApi.MODEL_COMPILING
      while status == RtlabApi.MODEL_COMPILING:
         try:
            # Check status every 0.5 second
            sleep(0.5)
            # Get new status
            # To be done before DisplayInformation because
            # DisplayInformation may generate an Exception when there is
            # nothing to read
            status, _ = RtlabApi.GetModelState()

            # Display compilation log into Python console
            _, _, msg = RtlabApi.DisplayInformation(1)
            while len(msg) > 0:
               print msg,
               _, _, msg = RtlabApi.DisplayInformation(1)

         except Exception, exc:
            # Ignore error 11 which is raised when
            # RtlabApi.DisplayInformation is called whereas there is no
            # pending message
            info = sys.exc_info()
            if info[1][0] <> 11:  # 'There is currently no data waiting.'
               # If a exception occur: stop waiting
               print "An error occured during compilation."
               raise

      # Because we use a comma after print when forward compilation log into
      # python log we have to ensure to write a carriage return when
      # finished.
      print ''

      # Get project status to check is compilation succed
      status, _ = RtlabApi.GetModelState()
      if status == RtlabApi.MODEL_LOADABLE:
         print 'Compilation success.'
      else:
         print 'Compilation failed.'
   finally:
      # Always disconnect from the model when the connection is completed
      RtlabApi.Disconnect()