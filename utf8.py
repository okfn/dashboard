import sys

# Turns MySQL's ISO-8859-1 junk into UTF8
filename = sys.argv[1]
sourceEncoding = "iso-8859-1"
targetEncoding = "utf-8"
content = open(filename).read()
target = open(filename, "w")

target.write(unicode(content, sourceEncoding).encode(targetEncoding))
