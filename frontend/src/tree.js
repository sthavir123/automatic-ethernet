import React, { Component,useCallback, useState } from 'react'
import Container from './DropdownContainer';
import './App.css';
import { Input,Collapsible,Pop } from './input';
import UploadFile from './UploadFile';
import Proto from './proto';
import axios from 'axios';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Popup from 'reactjs-popup';
import ReactDOM from 'react-dom/client';
import 'reactjs-popup/dist/index.css'
import sample from './sample1.json'
import 'bootstrap/dist/css/bootstrap.min.css';

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



const transformobj2 = async(obj = {}) => {
  if(obj['children']){
    obj['children2'] = []
    obj['children'].map(
      async (child) => {
        var k = await transformobj2(child)
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
  const [transform,setTransform] = useState({});
  const [submit_values,setSubmit_values] = useState({});
  
  //setState function : selected
  const onChange = (currentNode, selectedNodes) => {
    //console.log(selectedNodes)
    setSelected(selectedNodes);
   
  }

  const onChange2 = (currentNode , selectedNodes)=>{
    setSelected2(selectedNodes);
  }

  
  const handleInpChange = (e,parent,inp) => {
    console.log(e.target.value,parent,inp);
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
          setTransform(k);
          
          console.log(transform)
          //setFiles(response.data)
      }
      ).catch(error =>{
      console.log(error)
      })
  }

  const get_parsed_arxml2 = async (filename)=>{
    
    var k = {"label":"root",'children':sample}
    //      Object.keys(sample).map(async (key)=>{
            
    //         let elem = await transformJson(sample[key],key)
    //         console.log(elem.label)  
    //         k['children']  = [...k['children'],elem]
            
    //       })
    //       console.log(k['children']);
          
          var l = await transformobj2(k)
          setTransform(l);
        
  }
  


    
        
    return (
      <div >

        <div >
          <div>
            {/* <button onClick={ popup("hello world" , {type:"info",timeout:1000})}>click me</button> */}
            <UploadFile filename={filename} setFilename = {setFilename} parse={get_parsed_arxml}/>
            <button onClick={(e)=>get_parsed_arxml(filename.name)}>Parse</button>
            {/* <Proto/> */}
            {/*** Tabbed veiw for RX AND TX  */ }
            <Tabs forceRenderTabPanel>
              <TabList>
                <Tab> Rx Tab </Tab>
                <Tab> Tx Tab </Tab>
              </TabList>

            <TabPanel>
              <div className='child1'>
                <Container data={transform} onChange={onChange} />
              </div>
              
              <div className='child2'>  
              {
                selected && selected.map(item=>(
                  <div className='toogleable'>  
                  
                  <Collapsible pdu = {item.label} data={Array.isArray(
                    item["I-SIGNAL-TO-I-PDU-MAPPING"]) ? item["I-SIGNAL-TO-I-PDU-MAPPING"] : [item["I-SIGNAL-TO-I-PDU-MAPPING"]]}/>
                  </div>  
                ))
              }
              </div>
            </TabPanel>
              
            <TabPanel>
              <div className='child1'>
                <Container data={transform} onChange={onChange2}/>
              </div>

              <div className='child2'>  
              {
                selected2 && selected2.map(item=>(
                  <div className='toogleable'>  
                    <Collapsible pdu = {item.label} data={Array.isArray(
                    item["I-SIGNAL-TO-I-PDU-MAPPING"]) ? item["I-SIGNAL-TO-I-PDU-MAPPING"] : [item["I-SIGNAL-TO-I-PDU-MAPPING"]]}
                    item={item} submit_values={submit_values} handleInpChange={handleInpChange}
                    />
                    
                    

                  </div>  
                ))
              }
              </div>
              

            </TabPanel>
            </Tabs>
          </div>
          
        </div>
      </div>
      
    );
  }







