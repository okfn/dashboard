import ConfigParser
import os
import UserDict

from datastore.client import DatastoreClient

config_file = os.path.join(
        os.path.dirname(os.path.dirname(__file__)),
        'dashboard.cfg')

config = ConfigParser.SafeConfigParser()
config.read([config_file])

table_activity = DatastoreClient(config.get('db', 'datastore.activity'))

database = {
    'activity': table_activity
}

def make_activity(indict, date, source):
    outdict = dict(indict)
    outdict.update({
            'source_id': source.id,
            'channel': source.channel,
            'project_id': source.project_id,
            'datetime': date.isoformat(),
            'datetime_year_month_day': date.isoformat()[:10],
    	    'datetime_year_month': date.isoformat()[:7],
            'datetime_year': date.isoformat()[:4]
        })
    return outdict

class Source(UserDict.IterableUserDict):
    '''Readonly source object'''
    
    def __init__(self, dict_):
        UserDict.IterableUserDict.__init__(self, dict_)
        for key, value in dict_.items():
            setattr(self, key, value)

