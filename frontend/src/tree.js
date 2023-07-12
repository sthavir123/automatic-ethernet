import React, { useState} from 'react'
import './App.css';
import {DisplayContainer} from './input';
import UploadFile from './UploadFile';
import axios from 'axios';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import 'bootstrap/dist/css/bootstrap.css';
import {ToggleSidebar} from './sidebar'
import { ToggleSidebar2 } from './sidebar2';
import FileSaver from 'file-saver';
import sample from './sample.json';   // temproray load data from this json until backend integrated properly 
let api = 'http://127.0.0.1:8000/arxml/ecu'
let api2 = "http://127.0.0.1:8000/arxml/parse"


// function to perform forceUpdate of any component if rerender is required to be done
// mostly used in the code to quick fix for re-render issues/bugs

function useForceUpdate(){
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => value + 1); // update state to force render
}

// Adding some feilds to arxml parsed Object used in frontend 
// Can be done in backend also
const transformobj = async(obj = {},level = 0) => {
  // Adding level info
  // level 0 - root , 1 - TX/RX CCCM , 2 - PDU , 3 - SIGNAL-MAPPING 4 - SYSTEM-SIGNAL WITH DESC
  obj['level'] = level;
  if(level > 2){
    obj.disabled = true; //only select PDU here
  }
  if(level==3){
    obj.selected = false; //selected feild represnts if the signal is selected or not
  }
  if(obj['children']){
    obj['children2'] = []  // children2 feild to store children info inside the 'react-dropdown-tree-select' library as the data is changed
    obj['children'].map(
      async (child) => {
        var k = await transformobj(child,level+1);
        obj['children2'] = [...obj['children2'],k]
      }
    )
  }
  return obj;
}



export function Tree() {
  // state variables
  const [selected,setSelected] = useState([]);            //  selected pdu's for Rx 
  const [selected2,setSelected2] = useState([]);          //  selected pdu's for Tx
  const [filename,setFilename] = useState("");            //  filename of uploaded file
  const [rx,setRx] = useState({});                        //  rx data object to be passd to the DropdownTreeSelect
  const [tx,setTx] = useState({});                        //  tx data object to be passd to the DropdownTreeSelect
  const [submit_values,setSubmit_values] = useState({});  //  hold values to be submitted to the backend from Tx tab 
  const [configFile,setConfigFile] = useState(null);      //  config file to load data from
  const [ecuOptions,setEcuOptions] = useState([]);        //  Ecu Options for the Ecu-list-dropdown
  
  // onChange and onChange2 override DropDownTreeSelect 's onChange to get the seelcted nodes 
  const onChange = (currentNode, selectedNodes) => {
      setSelected(selectedNodes);
  }
  const onChange2 = (currentNode , selectedNodes)=>{
    setSelected2(selectedNodes)
  }


  // Calling setState in functions like this ensure element re-render   
  const setRxValues = (newval)=>{
    setSelected(newval);
  }
  const setTxValues = (newval)=>{
    setSelected2(newval);
  }
  const setRX = async (newrx)=>{
    setRx(newrx)
  }
  const setTX = async (newtx)=>{
    setTx(newtx)
  }

  // handler for Input Changes for Tx inputs
  const handleInpChange = (e,parent,inp) => {
    
    setSubmit_values(
      {...submit_values , [parent]:inp}
    )
    console.log(submit_values)
    
  };

  // api call to fetch ecu_options for arxml specified by filename
  const get_ecu_optinos = async(filename)=>{
    await axios.get(api , {params:{filename:filename}}).then(
      response =>{
          var data = response.data.data
          setEcuOptions(data.sort())
         
      }
      ).catch(error =>{
      console.log(error)
      });
  }

  //api call to fetch parsed_arxml specified by filename and given ecu
  const get_parsed_arxml = async (filename,ecu)=>{

    await axios.get(api2 , {params:{filename:filename,ecu:ecu}}).then(
      response =>{
          var data = response.data.data
          console.log(data)
         
      }
      ).catch(error =>{
      console.log(error)
      });
    //sample = response.data.data     
    var Rx = sample.filter((item)=>{
      return item.label.startsWith('Rx')
    })
    var Tx = sample.filter((item)=>{
      return item.label.startsWith('Tx')
    })
    var r = await transformobj({"label":"root",'children':Rx},0)
    var t = await transformobj({"label":"root",'children':Tx},0)
    setRx(r);
    setTx(t);
  }
  
 
  // Saves data passed to it as config.json
  const saveConfig = (data) =>{
    const json=JSON.stringify(data);
    const blob=new Blob([json],{type:'application/json'})
    FileSaver.saveAs(blob, "config.json");
  }
  
  // loads data from 
  const loadConfig = async (e) =>{
    var reader = new FileReader();
    var k;
    var z = {...rx};
    setRx({})
    reader.onload  =  async function (){
      k = JSON.parse(reader.result)
      // moddifing rx data according to config
      k.map((item,index)=>{
        var indices = item['_id'].split('-').splice(2)
        
        
          /** Harcoded for Pdu Level */
        z['children'][parseInt(indices[0])]['children'][parseInt(indices[1])]['children'] = item['children2']
        z['children'][parseInt(indices[0])]['children'][parseInt(indices[1])]['checked'] = true
        z['children2'][parseInt(indices[0])]['children2'][parseInt(indices[1])]['children2'] = item['children2']
      })
      
      console.log(z)
      // set Rx and selected nodes in rx according to config data
      await setRX(z)
      setSelected(k)
    }
    reader.readAsText(configFile);
  }

  // loadconfig for Tx
  const loadConfig2 = async (e) =>{
    var reader = new FileReader();
    var k;
    var z = {...tx}
    setTx({})
    reader.onload  = async function(){
      var k = JSON.parse(reader.result)
      
      
      
      k.map((item,index)=>{
        var indices = item['_id'].split('-').splice(2)
        
        
          /** Harcoded for Pdu Level */
        z['children'][parseInt(indices[0])]['children'][parseInt(indices[1])]['children'] = item['children2']
        z['children'][parseInt(indices[0])]['children'][parseInt(indices[1])]['checked'] = true
        z['children2'][parseInt(indices[0])]['children2'][parseInt(indices[1])]['children2'] = item['children2']
        
        
        
      })
      await setTX(z)
      setSelected2(k)
    }
    reader.readAsText(configFile);
  }

    return (
      <div >

        <div >
          <div>
            
            <UploadFile filename={filename} setFilename = {setFilename} parse={get_parsed_arxml} ecuOptions={ecuOptions} get_ecu_optinos={get_ecu_optinos}/>
            {/* 
            <Proto/> */}
            {/*** Tabbed veiw for RX AND TX  */ }
            
            <Tabs forceRenderTabPanel>
              <TabList>
                <Tab> Rx Tab </Tab>
                <Tab> Tx Tab </Tab>
              </TabList>

            <TabPanel >
             <h1></h1>

            <div class="input-group w-auto" style={{position:"fixed", right:"20em",top:"8.9em"}}>
              <input
                type="file"
                class="form-control"
                placeholder="Load Json"
                aria-label="Load Json"
                aria-describedby="button-addon2"
                onChange={(e)=> {setConfigFile(e.target.files[0])}}
              />
              <button class="btn btn-primary" type="button" id="button-addon2" data-mdb-ripple-color="dark" onClick={(e)=>{ loadConfig(e) ; console.log("Done")}} >
                Load Config
              </button>
            </div>
            <button class="btn btn-primary" type="button" data-mdb-ripple-color="dark" onClick={(e)=>saveConfig(selected)}  style={{position:"fixed", right:"49em",top:"8.9em"}} >
                Save Config
            </button>
              

            <ToggleSidebar data={rx} onChange={onChange}/>
            <ToggleSidebar2 selected2={selected} setSelectData= {setRxValues}/> 
            <DisplayContainer selected2={selected} submit_values={submit_values} handleInpChange={handleInpChange} type="rx" setSelected2={setRxValues}/>

            </TabPanel>
                     
            <TabPanel >
            
            <div class="input-group w-auto" style={{position:"fixed", right:"20em",top:"8.9em"}}>
              <input
                type="file"
                class="form-control"
                placeholder="Load Json"
                aria-label="Load Json"
                aria-describedby="button-addon3"
                onChange={(e)=> {setConfigFile(e.target.files[0])}}
              />
              <button class="btn btn-primary" type="button" id="button-addon3" data-mdb-ripple-color="dark" onClick={loadConfig2} >
                Load Config
              </button>
            </div>
            <button class="btn btn-primary" type="button" data-mdb-ripple-color="dark" onClick={(e)=>saveConfig(selected2)}  style={{position:"fixed", right:"49em",top:"8.9em"}} >
                Save Config
            </button>

            <ToggleSidebar data={tx} onChange={onChange2}/>
            <ToggleSidebar2 selected2={selected2} setSelectData= {setTxValues}/> 
            <DisplayContainer selected2={selected2} submit_values={submit_values} handleInpChange={handleInpChange} type="tx"  setSelected2={setTxValues}/>
              

            </TabPanel>
           
            </Tabs>
          </div>
          
        </div>
      </div>
      
    );
  }






