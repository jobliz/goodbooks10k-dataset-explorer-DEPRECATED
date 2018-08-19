import React, { Component } from 'react';
import Select from 'react-virtualized-select';

export default class VirtualizedTagSelect extends Component {
  
  constructor (props) {
    super(props)
    this.props = props;
  }

  render() {
    return <Select
      autofocus
      simpleValue
      valueKey='name'
      labelKey='name'
      multi={true}
      searchable={true}
      clearable={true}
      disabled={false}
      onChange={this.props.onChange}
      options={this.props.options}
      value={this.props.value}
    />
  }
}