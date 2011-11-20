import logging
import urllib2
from datetime import datetime
from lxml import html
from urllib import urlretrieve
from tempfile import mkstemp
from mailbox import mbox
import gzip

from common import make_activity

log = logging.getLogger(__name__)


def gather_pipermail(database, source, config, how_many_months=1):
    '''Gather mailman archives info.

    :param how_many_months: how many months back to go in the archives. Set to
        <= 0 for unlimited.
    '''
    url = source.url
    log.info(url)
    if 'mailman/listinfo' in url:
        url = url.replace('mailman/listinfo', 'pipermail')
    table = database['activity']
    for message in get_messages(url, how_many_months):
        subjects = message.get_all('Subject')
        subject = subjects[-1] if subjects else '(No Subject)'
        
        dates = message.get_all('Date')
        date = dates[-1] if dates else '(No date)'
        date = date.rsplit(' +', 1)[0].rsplit(' -', 1)[0].strip()
        date = datetime.strptime(date, '%a, %d %b %Y %H:%M:%S')
        # do not save description here as large
        # description =  message.get_payload()
        description = None
        data = {
            'author': message.get_from().split('  ')[0],
            'title': subject,
            'description': description,
            'source_url': url
            }
        data = make_activity(data, date, source)
        table.writerow(data, unique_columns=['author', 'title', 'datetime'])


def get_messages(url, how_many_months=1):
    try:
        index = html.parse(url)
    except IOError, io:
        return
    count = 0
    for anchor in index.findall('//a'):
        if how_many_months > 0 and count >= how_many_months:
            break
        try:
            ref = anchor.get('href')
            if ref.endswith('.gz'):
                count += 1
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
