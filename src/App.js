import React, { Component } from 'react';
import axios from 'axios';

import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';

import SimpleAppBar from './components/AppBar';
import SearchTextField from './components/SearchTextField';
import IntegrationReactSelect from './components/AutocompleteWithTags';
import SearchButton from './components/SearchButton';
import './App.css';

class App extends Component {

  constructor(props) {
    super();
    this.props = props;
    this.es_endpoint = props.host;

    this.state = {
      'tags': [],
      // TODO: title_search seems to not have effect at the start in the searchbox value?
      'title_search': '',
      'select_with': [],
      'select_without': [],
      'results': []
    };
  }

  componentDidMount() {
    this.loadTags();
  }

  fetchTags() {
    return {
      "aggs": {
        "byTag": {
          "terms": {
            "field": "tag_nested.name.keyword",
            "size": 1000
          }
        }
      },
      "size": 0
    };
  }

  buildElasticSearchQuery() {
    var with_list = [];
    var without_list = [];
    var query = {"query":{"bool": {}}};

    // if there are tags to be searched, add them to the query
    if(typeof this.state.select_with.map === "function") {
      this.state.select_with.map((item) => {
        with_list.push({"match": {"tag_nested.name.keyword": item.value}})
      })

      query['query']['bool']['must'] = with_list
    }

    // if there are tags to be ommited, add them to the query
    if(typeof this.state.select_without.map === "function") {
      this.state.select_without.map((item) => {
        without_list.push({"match": {"tag_nested.name.keyword": item.value}})
      })
      
      query['query']['bool']['must_not'] = without_list
    }

    // search by title
    if(this.state.title_search != '') {
      query['query']['bool']['filter'] = {
        "match" : {
          "title": {
            "query": this.state.title_search,
            "operator": "and"
          }
        }
      }
    }

    return query;
  }

  handleSearchButtonClick() {
    let query = this.buildElasticSearchQuery();
    console.log(query);
    var new_results = [];

    axios.post(this.es_endpoint, query).then((res) => {
      this.setState({'results': []})
      res.data.hits.hits.map((hit) => {
        new_results.push(hit._source);
      })
      this.setState({'results': new_results});
    }).catch((error) => {
      alert("There was a unexpected error, check console output.");
      console.log(error);
    })
  }

  handleSearchFieldChange(event) {
    this.setState({
      title_search: event.target.value
    });
  };

  // TODO: check if tag exists in the other select, refuse it if so.

  handleWithTagSelectChange(event) {
    this.setState({
      select_with: event
    })
  }

  handleWithoutTagSelectChange(event) {
    this.setState({
      select_without: event
    })
  }

  loadTags() {
    axios.get(this.es_endpoint, {
      params: {
        source: JSON.stringify(this.fetchTags()),
        source_content_type: 'application/json'
      }
    }).then((res) => {
      let newTags = []
      
      res.data.aggregations.byTag.buckets.map((bucket) => {
        newTags.push({label: bucket.key, value: bucket.key})
      });

      this.setState({'tags': newTags})
    });
  }

  render() {
    var cards = [];

    this.state.results.map((result) => {
      var tag_list = []

      result.tag_list.map((tag) => {
        tag_list.push(tag + " ");
      })

      cards.push(
      <Card key={result.id}>
        <CardContent>
          <Typography color="textSecondary">
            {result.title}
          </Typography>
          <Typography component="p">
            {tag_list}
          </Typography>
        </CardContent>
      </Card>)
    });

    return (
      <div className="App">
        <SimpleAppBar>
        </SimpleAppBar>
        <div className="search-area">
          <div className="search-field">
            <SearchTextField 
              value={this.state.title_search} 
              onChange={this.handleSearchFieldChange.bind(this)} >
            </SearchTextField>
          </div>
          <div className="search-field">
            <IntegrationReactSelect 
              label="Tags to include"
              placeholder="Select tags"
              value={this.state.select_with} 
              tags={this.state.tags}
              onChange={this.handleWithTagSelectChange.bind(this)} 
            > </IntegrationReactSelect>
          </div>
          <div className="search-field">
            <IntegrationReactSelect
              label="Tags to exclude"
              placeholder="Select tags"
              value={this.state.select_without} 
              tags={this.state.tags}
              onChange={this.handleWithoutTagSelectChange.bind(this)} 
            > </IntegrationReactSelect>
          </div>
          <SearchButton onClick={this.handleSearchButtonClick.bind(this)} />
        </div>
        <div>
          {cards}
        </div>
      </div>
    );
  }
}

export default App;
