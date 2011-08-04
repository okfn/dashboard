from datautil.normalization.table_based import Normalizer

from pprint import pprint

def People(username, password):
    doc_id = '0AplklDf0nYxWdDdvcm9HUTNhNTNnaFNpR0J4OXZzT1E'
    return Normalizer(username, password, doc_id, 'People', 'original')


def normalize(database, config):
    normalizer = People(config.get('db', 'google.user'),
                        config.get('db', 'google.password'))
    table = database['activity']
    for author in table.distinct('author'):
        name = author.get('author').strip()
        if not len(name):
            continue
        data = normalizer.get(name)
        login = data.get('login') or name
        row = {'author': name, 'login': login}
        pprint(row)
        table.writerow(row, unique_columns=['author'])
