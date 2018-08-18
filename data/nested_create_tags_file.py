import os
import csv
import sys
import pandas as pd
from tqdm import tqdm

r = pd.read_csv('ratings.csv')
tr = pd.read_csv('to_read.csv')
b = pd.read_csv('books.csv')
t = pd.read_csv('tags.csv')
bt = pd.read_csv('book_tags.csv')

# Let us merge tag names into tag applications.
bt = bt.merge( t, on = 'tag_id' )
# Why don't we merge book titles for good measure.
bt = bt.merge( b[[ 'goodreads_book_id', 'title']], on = 'goodreads_book_id' )
# fix negative tag counts
bt.loc[ bt['count'] < 0, 'count'] = 0

print("Collecting tags from book_tags.csv")
book_tags = {}
tags_hash = {}
with tqdm(total=len(bt)) as pbar:
    for index, row in bt.iterrows():
        if row['goodreads_book_id'] not in book_tags:
            book_tags[row['goodreads_book_id']] = []
        book_tags[row['goodreads_book_id']].append(row['tag_id'])
        tags_hash[row['tag_id']] = row['tag_name']
        pbar.update(1)

print("Creating new CSV file")
with open('new_nested_tags.csv', 'w', newline='') as csvfile:
    writer = csv.writer(csvfile, delimiter=',')
    with tqdm(total=len(b)) as pbar:
        for index, row in b.iterrows():
            book_tag_id_list = book_tags[row['goodreads_book_id']]
            
            book_tag_hash = {}
            for tag_id in book_tag_id_list:
                book_tag_hash[tag_id] = tags_hash[tag_id]
            
            tag_string_pair = ['_'.join([str(key), value]) for key, value in book_tag_hash.items()]
            tag_string = '|'.join(tag_string_pair)
            writer.writerow([row['goodreads_book_id'], row['title'], tag_string])
            
            pbar.update(1)

