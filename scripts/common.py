import ConfigParser
import os

from webstore.client import Database


config_file = os.path.join(
        os.path.dirname(os.path.dirname(__file__)),
        'dashboard.cfg')

config = ConfigParser.SafeConfigParser()
config.read([config_file])

webstore_host = config.get('db', 'webstore.host')
webstore_user = config.get('db', 'webstore.user')
webstore_password = config.get('db', 'webstore.password')
webstore_db = config.get('db', 'webstore.db')

database = Database(webstore_host, webstore_user, webstore_db,
       webstore_user, webstore_password)

