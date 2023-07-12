import React, { Component } from 'react';
import DropdownTreeSelect from 'react-dropdown-tree-select';
import isEqual from 'lodash/isEqual'

// Conatiner for DropdownTreeSelect component
export default class Container extends Component {
  constructor(props){
    super(props)
    this.state = { data: props.data }
    
  }

  // bug fix mentioned in react-dropdown-tree-select 
  // reference : https://dowjones.github.io/react-dropdown-tree-select/#/story/prevent-re-render-on-parent-render-hoc
  componentWillReceiveProps = (nextProps) => {
   
    if(!isEqual(nextProps.data, this.state.data)) {
      this.setState({ data: nextProps.data })
    }
  }

  shouldComponentUpdate = (nextProps) => {
    // reload only if label,children data is changed
    // Due to using this have to set Rx,Tx to {} before updating them so that this component re-renders
    var k = !isEqual(nextProps.data, this.state.data) 
    return k; 
  }

  // can add a searchPredicate to DropdownTreeSelect for custom search logic    
  searchPredicate = (node, searchTerm) => {
    var  k = (node.level != 4) && (node.label.toLowerCase().includes(searchTerm.toLowerCase()))
    return k
  }

  render() {
    const { data, ...rest } = this.props
    return(
        //DropdownTreeSelect component from library to visualize arxml 
        <DropdownTreeSelect data={this.state.data} searchPredicate={this.searchPredicate} keepTreeOnSearch={true}  {...rest}  />
      
    )
  }
}
