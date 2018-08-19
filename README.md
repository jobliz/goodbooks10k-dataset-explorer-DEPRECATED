Goodbooks10K dataset search tool
================================

A simple React Elasticsearch tool to explore the 
[Goodbooks10k dataset](https://github.com/zygmuntz/goodbooks-10k/) 
allowing filtering by book title and user tags.

Installation
------------

* Run `npm install`

Data loading
------------

Currently the way to load the data to an elasticsearch instance is through
the `nested_create_es_index.py` script in the `data` directory. You will 
need to install the `elasticsearch-py` package for it to work.

Gotchas
-------

* react-select package is fixed at version 1.2.1 in package.json due to 
[this issue](https://github.com/JedWatson/react-select/issues/2452),
from reading
[this other issue](https://github.com/JedWatson/react-select/issues/1324).