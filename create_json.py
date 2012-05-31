import csv,sys,json,codecs

# Only works on UTF8 input
[infile,outfile] = sys.argv[1:3]

reader = csv.DictReader(open(infile,'r'),delimiter='\t')
out = [row for row in reader]
json.dump(out,open(outfile,'w'),indent=4)
