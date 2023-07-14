
# Frontend React App

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Libraries used
### `axios` 
    Used for communicating with backend through POST/GET requests
### `protobufjs`
    Not Used in the working prototype but can be used to work with .proto files
### `react-collapsed`
    For the collapsible components for Pdu info display
### `react-dropdown`
    For various dropdowns in the App
### `react-tabs`
    For Rx/TX tabs 
### `bootstrap`
    To include bootstrap styling for the components 
### `file-saver`
    Saving Config files 
### `react-dropdown-tree-select` [GitRepo](https://github.com/dowjones/react-dropdown-tree-select)
    Used to display tree like multi-select component for displaying arxml components in a hierarchical fashion.
    Issues section of libraries gitRepo was very useful wile debugging 

## Components And API's

### `APP`
    Root Component passed to index.js for rendering.
#### State variables
```
    selected       :  selected pdu's for Rx 
    selected2      :  selected pdu's for Tx
    filename       :  filename of uploaded file
    rx             :  rx data object to be passd to the DropdownTreeSelect
    tx             :  tx data object to be passd to the DropdownTreeSelect
    submit_values  :  hold values to be submitted to the backend from Tx tab 
    configFile     :  config file to load data from
    ecuOptions     :  Ecu Options for the Ecu-list-dropdown
```
#### Functions
```javaScript
onChange(),onChange2(): 
    Overrides DropDownTreeSelect onChange to get the seelcted nodes

get_ecu_options(filename): 
    Axios.get request to fetch eculist given filename

get_parsed_arxml(filename,ecu):
    Axios.get request to fetch parsed data and set rx and tx variables accordingly 

saveConfig(data):
    Downloads json object as config.json

LoadConfig(),LoadConfig2():
    Loads json data from {configFile} and sets the variables accordingly
```
### `DropdownContainer.js`

Component that uses react-dropdown-tree-select to displays arxml parsed data in tree like structure.\
It returns 
```javaScript
    <DropdownTreeSelect data={this.state.data} searchPredicate={this.searchPredicate} keepTreeOnSearch={true}  {...rest}  />
```
#### `data`
The format of data prop is as follows : 
```javaScript
{
  label,          // Checkbox label
  value,          // Checkbox value
  children,       // Array of child objects (Changed when passes to library)
  checked,        // Initial state of checkbox. if true, checkbox is selected and corresponding pill is rendered.
  disabled,       // Selectable state of checkbox. if true, the checkbox is disabled and the node is not selectable.
  level,          // Depth of the node from root
  selected,       // On signal level to indicate if signal is selected
  children2,      // Copy of children feild       
}
```

#### `searchPredicate`
Can implement custom search logic for node search like
```javaScript
// don't display level 4 nodes on search     
  searchPredicate = (node, searchTerm) => {
    var  k = (node.level != 4) && (node.label.toLowerCase().includes(searchTerm.toLowerCase()))
    return k
  }

```

#### `Prevent Rerender on Parent Render` ([HOC](https://dowjones.github.io/react-dropdown-tree-select/#/story/prevent-re-render-on-parent-render-hoc)) 
Porps to prevent rerender each time parent is changed happen due to Onchange() in App Re-Rendering due to Setting of selected state variable

```javaScript
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
```

## `input.js`
This file has five components

### `Input`
The Component that give signals level info display and input interface for a given Pdu node

#### `Props`
```javaScript
{
    data,                           // children nodes of the selected pdu                       
    parent,                         // parent Pdu name
    values,                         // submitValues from App.js
    handleInpChange,                // HandleInpChange from App.js to set submit values
    type,                           // 'rx' or 'tx' to decide to input or just display
    setData,                        // funtion to set the it's data feild if required     
    index,                          // index of the signal in Pdu's children array         
    selected2,                      // selected/selected 2 variable of App.js        
    setSelected2                    // function to set the selected2 feild    
}
```

### `Temp2`
This component displays the signals checkbox shown in the select signal sidebar

#### `Props`
```javaScript
{
    data,              // children nodes of the selected Pdu 
    index,             // index of the signal in Pdu's children array 
    onChange,          // function to handle checkbox change 
    selectData,        // selected/selected2 variable of App.js 
    setSelected2,      // function to set the SelectData field 
    searchPredicate    // search term to filter the signals 
}
```

### `Collapsible` ,`Collapsible2` 
Collapsible components that have Input and Temp2 components

### `Sidebar.js`
SideBar Component toggled on Select Pdu Click 
```javaScript
   <ToggleSidebar data={rx} onChange={onChange}/> 
``` 
#### `Props`
```javaScript
{
    data,      // data to passed to the DropdownContainer 
    onChange,  // onChange to be passed to the DropDown Conatiner  
}
```
### `Sidebar2.js`
SideBar Component toggled on Select Signal Click 
```javaScript
   <ToggleSidebar2 selected2={selected} setSelectData= {setRxValues}/> 
``` 
#### `Props`
```javaScript
{
    selected2,           // Selected PDu nodes which will be passed to Collapsible2 for signal checkbox display
    setSelectData,       // Sunction to set selected state 
}
```

## `Bugs`
* Data inside Input component does not dynamically render on selected in Select Signal Sidebar
* Handle if Non Pdu Nodes are selected in Select Pdu option
* Clear submit_values after pdu submit

## `More features to be implemented`
*
# Django Backend

## urls.py
Url paths 
```pyhton
router.register('files', FilesViewSet, basename='files')


urlpatterns = [
    
    path('api/', include(router.urls)),                         # Upload .arxml files        
    path('proto', my_view, name='proto'),                       # Parse and compile .proto files 
    path('proto/set',protopost,name='protopost'),               # Set proto message feilds and generate payload to be transmitted
    re_path(r'arxml/ecu/$',arxml_ecu,name='arxml_ecu'),         # get ecuList given arxml file name   
    re_path(r'arxml/parse/$',arxml_parse,name='arxml_parse')    # get arxml parsed object given file name AND ECU
]

```

## veiws.py
    arxml_ecu(request)      : Get eculist given filename as query
    arxml_parse(request)    : Get parsed data given filename and ecu as query parameters
    my_view(request)        : Saves and compiles the uploaded .proto file as temp.proto and returns parsed .proto object for display on frontend
    protopost(request)      : Creates serialised payload with the data recieved from frontend 
