import React, { Component, useState } from 'react'
import sample from './sample.json'

import Container from './DropdownContainer';
import './App.css';
import { Input } from './input';
import UploadFile from './UploadFile';
import Proto from './proto';
import axios from 'axios';

let api = 'http://127.0.0.1:8000/arxml/parse'

const startkeys = ["<Element {http://autosar.org/schema/r4.0}I-SIGNAL-I-PDU-GROUP at 0x2c45e1cd340>","<Element {http://autosar.org/schema/r4.0}I-SIGNAL-I-PDU-GROUP at 0x2c45e1cd300>"];

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



export class Tree extends Component {
  // state variables
  state = {
    
    selected : [],
    filename : '',
    transform : {},
  }
  //setState function : selected
  onChange = (currentNode, selectedNodes) => {
    console.log(selectedNodes)
    this.setState(
      { selected:selectedNodes}
    )
    
  }
  //setState function : filename
  setFilename = (name) =>{
    this.setState({filename:name})
  }

  get_parsed_arxml = async (filename) => {
    await axios.get(api , {params:{file:filename}}).then(
      response =>{
          var data = response.data.data
          var k = {"label":"root",'children':[]}
          Object.keys(data).map(async(key)=>{
            
            let elem = await transformJson(data[key],key)
            
            k['children'].push(elem)
          })
          this.setState({
            transform: k
          })
          
          //console.log(this.state.transform)
          //setFiles(response.data)
      }
      ).catch(error =>{
      console.log(error)
      })
  }

  render() {
    //const [filename, setFilename] = useState('');
        
    return (
      <div >

        <div className='rowA'>
          <div className='child'>

            <UploadFile filename={this.state.filename} setFilename = {this.setFilename}/>
            <button onClick={(e)=>this.get_parsed_arxml(this.state.filename.name)}>Parse</button>
            {/* <Proto/> */}
            {this.state.transform && <Container data={this.state.transform} onChange={this.onChange} />}

          </div>
          <div className='child'>
          {
              this.state.selected && this.state.selected.map(item=>(
                
                <Input data={Array.isArray(
                  item["I-SIGNAL-TO-I-PDU-MAPPING"]) ? item["I-SIGNAL-TO-I-PDU-MAPPING"] : [item["I-SIGNAL-TO-I-PDU-MAPPING"]]}/>
              ))
            }
          </div>
        </div>
      </div>
      
    )
  }
}




// export function Tree(){

//   const [selected,setSelected] = useState([]);
//   const [data,setData] = useState(transform);

//   // onchange = async (currentNode,selectedNodes) =>{
//   //   setSelected(selectedNodes);
//   //   console.log(selectedNodes);
//   // }

//   onchange = async (currentNode, selectedNodes) => {
//     let k = await selectedNodes;
//     setSelected(k);
//     //this.setState({ test: 'something else' })
//     console.log(selected);    
//   }


//   return(
//   <div>
//     <button
//         onClick={async (e)=>{
//           //console.log(JSON.stringify(await transformObject(sample["<Element {http://autosar.org/schema/r4.0}I-SIGNAL-I-PDU-GROUP at 0x2018c4a4480>"],"<Element {http://autosar.org/schema/r4.0}I-SIGNAL-I-PDU-GROUP at 0x2018c4a4480>")));
//           console.log(selected);
//         }}
      
//         >get Json</button>
//        <div>
//        <Container data={data} onChange={onchange} />
         
//       </div>
//       <div>
//         {
//         selected&&  
//         selected.map(data=>(
          
//           <p>{data.label}</p>
//         ))}
//       </div>   
//   </div>
//   );
// }

