import logging
import urllib2
from datetime import datetime
from lxml import html
from urllib import urlretrieve
from tempfile import mkstemp
from mailbox import mbox
import gzip

log = logging.getLogger(__name__)

def gather_listinfo(database, url=None):
    fh = urllib2.urlopen(url)
    data = fh.read().replace('us-ascii', '')
    fh.close()
    doc = html.fromstring(data)
    for link in doc.findall('.//tr//a'):
        if not 'mailman/listinfo' in link.get('href'):
            continue
        url = link.get('href').replace('mailman/listinfo', 
                                       'pipermail')
        try:
            gather_pipermail(database, url=url)
        except IOError, io:
            log.exception(io)

def gather_pipermail(database, url=None):
    log.info(url)
    table = database['activity']
    for message in get_messages(url):
        subjects = message.get_all('Subject')
        subject = subjects[-1] if subjects else '(No Subject)'
        
        dates = message.get_all('Date')
        date = dates[-1] if dates else '(No date)'
        date = date.rsplit(' +', 1)[0].rsplit(' -', 1)[0].strip()
        date = datetime.strptime(date, '%a, %d %b %Y %H:%M:%S')

        table.writerow({
            'author': message.get_from().split('  ')[0],
            'title': subject,
            'description': message.get_payload(),
            'type': 'mailinglist',
            'source_url': url,
            'datetime': date.isoformat()
            }, unique_columns=['author', 'title', 'datetime'])

def get_messages(url):
    try:
        index = html.parse(url)
    except IOError, io:
        return
    for anchor in index.findall('//a'):
        try:
            ref = anchor.get('href')
            if ref.endswith('.gz'):
                log.info('Archive: %s' % ref.split('.')[0])
                ref = url + '/' + ref
                filename, headers = urlretrieve(ref)
                gzfh = gzip.open(filename, 'r')
                fh, mboxtmp = mkstemp()
                mboxfh = open(mboxtmp, 'w')
                mboxfh.write(gzfh.read())
                mboxfh.close()
                gzfh.close()
                _mbox = mbox(mboxtmp)
                for message in _mbox:
                    yield message
        except IOError, io:
            log.exception(io)
