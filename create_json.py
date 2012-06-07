import csv,sys,json,codecs

# Only works on UTF8 input
[infile,outfile] = sys.argv[1:3]

reader = csv.DictReader(open(infile,'r'),delimiter='\t')
out = [row for row in reader]
json.dump(out,open(outfile,'w'))

if len(sys.argv)>3:
    # Dump a jsonp file too
    jsonpfile = sys.argv[3]
    jsonp = '_jsonp_members('+json.dumps(out)+')'
    print >>open(jsonpfile,'w'),jsonp

