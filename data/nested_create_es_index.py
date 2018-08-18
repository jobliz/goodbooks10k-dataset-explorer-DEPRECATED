import sys
import csv

from elasticsearch_dsl.connections import connections
from elasticsearch_dsl import DocType, Text, Date, Search
from elasticsearch import Elasticsearch
from elasticsearch_dsl import DocType, Nested, Keyword, Integer
from elasticsearch_dsl import Index

connections.create_connection(hosts=['localhost'], timeout=20)
es = Elasticsearch()
ess = Search(using=es)

ES_MEDIA_INDEX = 'goodbooks10k'
ES_MEDIA_TYPE = 'books'
ES_MEDIA_ID_FIELD = 'id'

bulk_data = []

if es.indices.exists(ES_MEDIA_INDEX):
    print("deleting '%s' index..." % (ES_MEDIA_INDEX))
    res = es.indices.delete(index = ES_MEDIA_INDEX)
    print(" response: '%s'" % (res))

es.indices.create(index=ES_MEDIA_INDEX, body={
    "settings": {
        "number_of_shards": 1,
        "number_of_replicas": 0
    }
})

es.indices.put_mapping(
    index=ES_MEDIA_INDEX,
    doc_type=ES_MEDIA_TYPE,
    body={
        "properties": {  
            "title": {"type": "text"}
        }
    }
)

with open('new_nested_tags.csv', newline='') as csvfile:
    reader = csv.reader(csvfile, delimiter=',')
    for item in reader:
        tag_id_name_pairs = item[2].split("|")
        splitted = [pair.split('_') for pair in tag_id_name_pairs]
        
        tag_list = []
        tag_nested = []

        for pair in splitted:
            tag_list.append(pair[1])
            tag_nested.append({
                'id': pair[0],
                'name': pair[1]
            })

        data_dict = {
            'id': item[0],
            'title': item[1],
            'tag_list': tag_list,
            'tag_nested': tag_nested
        }

        op_dict = {
            "index": {
                "_index": ES_MEDIA_INDEX,
                "_type": ES_MEDIA_TYPE,
                "_id": data_dict[ES_MEDIA_ID_FIELD]
            }
        }

        bulk_data.append(op_dict)
        bulk_data.append(data_dict)

es.bulk(index=ES_MEDIA_INDEX, body=bulk_data, refresh=True, request_timeout=10000)
