import React, { Component } from 'react';
import axios from 'axios';

import SimpleAppBar from './components/AppBar';
import SearchTextField from './components/SearchTextField';
import IntegrationReactSelect from './components/AutocompleteWithTags';
import SearchButton from './components/SearchButton';
import './App.css';

class App extends Component {

  constructor(props) {
    super();
    this.props = props;
    this.es_endpoint = 'http://localhost:9200/babelcodex_test_nested/media/_search';

    this.state = {
      'tags': [],
      // TODO: title_search seems to not have effect at the start in the searchbox value?
      'title_search': ''
    };
  }

  componentDidMount() {
    this.loadTags();
  }

  /**
   * The aggregation query to list existing tags.
   */
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
    var something = [];

    return {
      "query": {
        "bool": {
          "must": [
            {"match": {"tag_nested.name.keyword": "magic-realism"}}
          ],
          "must_not": [
            {"match": {"tag_nested.name.keyword": "colombia"}}
          ]
        }
      }
    };
  }

  handleSearchButtonClick() {
    console.log(this.state);
  }

  handleSearchFieldChange(event) {
    this.setState({
      title_search: event.target.value
    });
  };

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
    return (
      <div className="App">
        <SimpleAppBar>
        </SimpleAppBar>
        <div className="content">
          <SearchTextField 
            value={this.state.title_search} 
            onChange={this.handleSearchFieldChange.bind(this)} >
          </SearchTextField>
          <IntegrationReactSelect></IntegrationReactSelect>
          <SearchButton onClick={this.handleSearchButtonClick.bind(this)} />
        </div>
      </div>
    );
  }
}

export default App;
