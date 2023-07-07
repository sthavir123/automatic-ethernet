import React, { useState } from 'react'
import Container from './DropdownContainer';
import './App.css';
import {DisplayContainer,Collapsible1 } from './input';
import UploadFile from './UploadFile';
import axios from 'axios';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import ReactDOM from 'react-dom/client';
import sample from './sample.json'
import 'bootstrap/dist/css/bootstrap.css';
import {ToggleSidebar} from './sidebar'
import { ToggleSidebar2 } from './sidebar2';
let api = 'http://127.0.0.1:8000/arxml/parse'

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

const node = document.createElement("div");
const popup = (message, {type, timeout}) => {
  document.body.appendChild(node);
  const PopupContent = () => {
    return (
      
        <button
          onClick={clear}
        >Close</button>
      

    );
  };

  const clear = () => {
    ReactDOM.unmountComponentAtNode(node);
    node.remove();
  }
  
  ReactDOM.render(<PopupContent/>, node);
};



export function Tree() {
  // state variables
  const [selected,setSelected] = useState([]);
  const [selected2,setSelected2] = useState([]);
  const [filename,setFilename] = useState("");
  const [rx,setRx] = useState({});
  const [tx,setTx] = useState({});
  const [submit_values,setSubmit_values] = useState({});
  

  //setState function : selected
  const onChange = (currentNode, selectedNodes) => {
    console.log(selectedNodes)
    setSelected(selectedNodes);
   
  }

  const onChange2 = (currentNode , selectedNodes)=>{

    // console.log(selectedNodes)
    // selectedNodes.map((item)=>{
    //   if(item._depth !=2)
    //     console.log(item)
    // })
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

  


 

  

  const get_parsed_arxml = async (filename) => {
    await axios.get(api , {params:{file:filename}}).then(
      response =>{
          var data = response.data.data
          var k = {"label":"root",'children':[]}
          Object.keys(data).map(async(key)=>{
            
            let elem = await transformJson(data[key],key)
            
            k['children'].push(elem)
          })
          //setTransform(k);
          
          //console.log(transform)
          //setFiles(response.data)
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
  
     
    return (
      <div >

        <div >
          <div>
            
            <UploadFile filename={filename} setFilename = {setFilename} parse={get_parsed_arxml2}/>
            {/* <button onClick={(e)=>get_parsed_arxml2(filename.name)}>Parse</button>
            <Proto/> */}
            {/*** Tabbed veiw for RX AND TX  */ }
            
            <Tabs forceRenderTabPanel>
              <TabList>
                <Tab> Rx Tab </Tab>
                <Tab> Tx Tab </Tab>
              </TabList>

            <TabPanel >
              {/* <div className='child1'>
                <Container data={rx} onChange={onChange} />
              </div>
              
              <div className='child2'>  
              {
                selected && selected.map(item=>(
                  <div className='toogleable'>  
                  
                  <Collapsible1 pdu = {item.label} data={Array.isArray(
                    item["I-SIGNAL-TO-I-PDU-MAPPING"]) ? item["I-SIGNAL-TO-I-PDU-MAPPING"] : [item["I-SIGNAL-TO-I-PDU-MAPPING"]]}/>
                  </div>  
                ))
              }
              </div> */}

            <ToggleSidebar tx={rx} onChange={onChange}/>
            <ToggleSidebar2 selected2={selected} setSelectData= {setRxValues}/> 
            <DisplayContainer selected2={selected} submit_values={submit_values} handleInpChange={handleInpChange} type="rx" setSelected2={setRxValues}/>

            </TabPanel>
                     
            <TabPanel >
            
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






