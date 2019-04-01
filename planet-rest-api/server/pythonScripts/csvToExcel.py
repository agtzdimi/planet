import argparse
import pandas as pd

parser = argparse.ArgumentParser()
parser.add_argument("--source", required=True,
   help="source file")
parser.add_argument("--dest", required=True,
        help="destination file")
parser.add_argument("--type", required=True,
        help="CSV or XLSX")
args = vars(parser.parse_args())

print(args["source"])
if args["type"] == "xlsx":
   pd.read_csv(args["source"]).to_excel(args["dest"], index=False)
else:
   pd.read_excel(args["source"]).to_csv(args["dest"], index=False)
