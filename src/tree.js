import React, { Component, useState } from 'react'
import sample from './sample.json'
import transform from "./transform.json";
import Container from './DropdownContainer';
import './App.css';
import { Input } from './input';

const startkeys = ["<Element {http://autosar.org/schema/r4.0}I-SIGNAL-I-PDU-GROUP at 0x2c45e1cd340>","<Element {http://autosar.org/schema/r4.0}I-SIGNAL-I-PDU-GROUP at 0x2c45e1cd300>"];

const transformJson = async (obj = {},e1 = null) =>{
  
  if(obj && typeof obj == 'object'){
    obj['disabled'] = true;  
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
    obj['disabled'] = false;
    
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
  state = {
    
    selected : [],
  }

  onChange = (currentNode, selectedNodes) => {
    this.setState(
      { selected:selectedNodes}
      
    )
   
  }
  
  render() {    
    return (
      <div >

        <div className='rowA'>
          <div className='child'>
            <input type="file"/>
            {/* <button
        onClick={async (e)=>{
          console.log(JSON.stringify(await transformJson(sample["<Element {http://autosar.org/schema/r4.0}I-SIGNAL-I-PDU-GROUP at 0x2018c4a4480>"],"<Element {http://autosar.org/schema/r4.0}I-SIGNAL-I-PDU-GROUP at 0x2018c4a4480>")));
          //console.log(selected);
        }}
      
        >get Json</button> */}
            <Container data={transform} onChange={this.onChange} />
           
          </div>
          <div className='child'>
          {
              this.state.selected && this.state.selected.map(item=>(
                
                <Input data={item["I-SIGNAL-TO-I-PDU-MAPPING"]}/>
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

