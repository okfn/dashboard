import logging
from lxml import html
from urlparse import urljoin
from urllib import urlretrieve
from tempfile import mkstemp
from mailbox import mbox
import gzip

URL_BASE = 'http://lists.okfn.org/pipermail/%s/'

log = logging.getLogger(__name__)

def gather(database, name='ckan-discuss'):
    url = URL_BASE % name
    log.info(name)
    table = database['activity']
    for message in get_messages(url):
        subjects = message.get_all('Subject')
        subject = subjects[-1] if subjects else '(No Subject)'
        
        dates = message.get_all('Date')
        date = dates[-1] if dates else '(No date)'

        table.writerow({
            'author': message.get_from().split('  ')[0],
            'title': subject,
            'description': message.get_payload(),
            'type': 'mailinglist',
            'source_url': url,
            'datetime': date
            }, unique_columns=['author', 'title', 'datetime'])

def get_messages(url):
    index = html.parse(url)
    for anchor in index.findall('//a'):
        ref = anchor.get('href')
        if ref.endswith('.gz'):
            log.info('Archive: %s' % ref.split('.')[0])
            ref = urljoin(url, ref)
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


