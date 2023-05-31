import React, { Component } from 'react';
import DropdownTreeSelect from 'react-dropdown-tree-select';

export default class Container extends Component {
  constructor(props){
    super(props)
    this.state = { data: props.data }
  }


  uncheckAll = () => {
    const data = this.state.data
    data[0].checked = false
    this.setState({data})
  }

  checkAll = () => {
    const data = this.state.data
    data[0].checked = true
    this.setState({ data })
  }

  render() {
    return (
    <div>
      <DropdownTreeSelect data={this.state.data} />
      <button onClick={this.checkAll}>Check all</button>
      <button onClick={this.uncheckAll}>Uncheck all</button>
    </div>
    )
  }
}
