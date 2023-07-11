import React, { Component } from 'react';
import DropdownTreeSelect from 'react-dropdown-tree-select';
import isEqual from 'lodash/isEqual'

export default class Container extends Component {
  constructor(props){
    super(props)
    this.state = { data: props.data }
    this.forceset = props.forceset
    this.setForceSet = props.setForceSet
  }

  componentWillReceiveProps = (nextProps) => {
   
    if(!isEqual(nextProps.data, this.state.data)) {
      this.setState({ data: nextProps.data })
    }
  }

  shouldComponentUpdate = (nextProps) => {
   var k = !isEqual(nextProps.data, this.state.data) 
   
   
    return k; 
  }

  render() {
    const { data, ...rest } = this.props
    return (
      
        <DropdownTreeSelect data={this.state.data} {...rest} />
      
    )
  }
}
