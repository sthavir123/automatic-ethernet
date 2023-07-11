import React, { useState,useEffect } from 'react'

import './App.css';
import {DisplayContainer,Collapsible1 } from './input';
import UploadFile from './UploadFile';
import axios from 'axios';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import sample from './sample.json'
import 'bootstrap/dist/css/bootstrap.css';
import {ToggleSidebar} from './sidebar'
import { ToggleSidebar2 } from './sidebar2';
import FileSaver from 'file-saver'
// import configjson from './sample1.json'
let api = 'http://127.0.0.1:8000/arxml/parse'

function useForceUpdate(){
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => value + 1); // update state to force render
  // A function that increment 👆🏻 the previous state like here 
  // is better than directly setting `setValue(value + 1)`
}

const transformJson = async (obj = {},e1 = null) =>{
  
  if(obj && typeof obj == 'object'){
    
    if(e1.includes("Element")){
    
      obj["children"] = await transformJson(obj["I-SIGNAL-I-PDUS"],"I-SIGNAL-I-PDUS");
    }
    else if(e1 === "I-SIGNAL-I-PDUS"){
      
    if(!Array.isArray(obj)){
      obj = [obj];
    }
     obj.map(async (child)=>{
       
        let k = await transformJson(child["I-SIGNAL-TO-I-PDU-MAPPING"],"I-SIGNAL-TO-I-PDU-MAPPING");
        child['children'] = (Array.isArray(k)) ? k : [k];
      });
    
    
  }
    else if(e1 === "I-SIGNAL-TO-I-PDU-MAPPING"){
      if(!Array.isArray(obj)){
        obj = [obj];
      }
      await obj.map(async (child)=>{
        
        if(child["I-SIGNAL-REF"]){
          let k = await transformJson(child["I-SIGNAL-REF"],"I-SIGNAL-REF");
          child['children'] = (Array.isArray(k)) ? k : [k];
        }
        
      });
    }
    else if(e1 === "I-SIGNAL-GROUP-REF"){
     let k = await obj["I-SIGNAL-REFS"]['I-SIGNAL-REF'];

     obj['children'] =  (Array.isArray(k))?  k : [k]; 
      
    }
    
    return obj;

    
  }
}



const transformobj2 = async(obj = {},level = 0) => {
  // Adding level info for identifing the signal (level=4) info
  obj['level'] = level;
  
  if(level > 2){
    obj.disabled = true;
  }
  
  if(level==3){
    obj.selected = false;
  }
  if(obj['children']){
    obj['children2'] = []
    obj['children'].map(
      async (child) => {
        var k = await transformobj2(child,level+1);
        obj['children2'] = [...obj['children2'],k]
      }
    )
  }
  return obj;
}



export function Tree() {
  // state variables
  const [selected,setSelected] = useState([]);
  const [selected2,setSelected2] = useState([]);
  const [filename,setFilename] = useState("");
  const [rx,setRx] = useState({});
  const [tx,setTx] = useState({});
  const [submit_values,setSubmit_values] = useState({});
  const [configFile,setConfigFile] = useState(null);
  const force = useForceUpdate()
  const [forceset,setForceSet] = useState(false)
  useEffect(() => {
    console.count("Component Rendered ");
  }, []);
  //setState function : selected
  const onChange = (currentNode, selectedNodes) => {
    
    setSelected(selectedNodes);
   
  }

  const onChange2 = (currentNode , selectedNodes)=>{
    setSelected2(selectedNodes)
    }

  const setRxValues = (newval)=>{
    setSelected(newval);
  }
  const setTxValues = (newval)=>{
    setSelected2(newval);
  }

  const handleInpChange = (e,parent,inp) => {
    
    setSubmit_values(
      {...submit_values , [parent]:inp}
    )
    console.log(submit_values)
    
  };

  const setRX = async (newrx)=>{
    setRx(newrx)
  }
  const setTX = async (newtx)=>{
    setTx(newtx)
  }


 

  

  const get_parsed_arxml = async (filename) => {
    await axios.get(api , {params:{file:filename}}).then(
      response =>{
          var data = response.data.data
          var k = {"label":"root",'children':[]}
          Object.keys(data).map(async(key)=>{
            
            let elem = await transformJson(data[key],key)
            
            k['children'].push(elem)
          })
         
      }
      ).catch(error =>{
      console.log(error)
      })
  }

  const get_parsed_arxml2 = async (filename)=>{
    var Rx = sample.filter((item)=>{
      return item.label.startsWith('Rx')
    })
    var Tx = sample.filter((item)=>{
      return item.label.startsWith('Tx')
    })
    var r = await transformobj2({"label":"root",'children':Rx},0)
    var t = await transformobj2({"label":"root",'children':Tx},0)
    console.log(r)
    console.log(t)
    setRx(r);
    setTx(t);
    
    
  }
  
  const saveConfig = (data) =>{
    const json=JSON.stringify(data);
    const blob=new Blob([json],{type:'application/json'})
    FileSaver.saveAs(blob, "config.json");
  }
  
  const loadConfig = async (e) =>{
    var reader = new FileReader();
    var k;
    var z = {...rx};
    setRx({})
    reader.onload  =  async function (){
      k = JSON.parse(reader.result)
      
      
      k.map((item,index)=>{
        var indices = item['_id'].split('-').splice(2)
        
        
          /** Harcoded for Pdu Level */
        z['children'][parseInt(indices[0])]['children'][parseInt(indices[1])]['children'] = item['children2']
        z['children'][parseInt(indices[0])]['children'][parseInt(indices[1])]['checked'] = true
        z['children2'][parseInt(indices[0])]['children2'][parseInt(indices[1])]['children2'] = item['children2']
        
        
        
      })
      
      console.log(z)
      
      await setRX(z)
      setSelected(k)
      
    }
    reader.readAsText(configFile);
    
    
    
    
  }

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
            
            <UploadFile filename={filename} setFilename = {setFilename} parse={get_parsed_arxml2}/>
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
              

            <ToggleSidebar tx={rx} onChange={onChange} forceset= {forceset} setForceSet={setForceSet}/>
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

            <ToggleSidebar tx={tx} onChange={onChange2}/>
            <ToggleSidebar2 selected2={selected2} setSelectData= {setTxValues}/> 
            <DisplayContainer selected2={selected2} submit_values={submit_values} handleInpChange={handleInpChange} type="tx"  setSelected2={setTxValues}/>
              

            </TabPanel>
           
            </Tabs>
          </div>
          
        </div>
      </div>
      
    );
  }






