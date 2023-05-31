import React, { Component } from 'react'

import sample from './sample.json'
import Container from "./DropdownContainer";
import transform from "./transform.json";


// const transformObject= (obj = {}) => {
//     if (obj && typeof obj === 'object') {
      
//        return Object.keys(obj).map((el) => {
//           let children = transformObject(obj[el]); return children ? {
//               label: el, children: children } : {
//              label: el
//           };
//        });
//     };
//  };

//const childkeys = ["<Element {http://autosar.org/schema/r4.0}I-SIGNAL-I-PDU-GROUP at 0x2c45e1cd340>","I-SIGNAL-I-PDU","I-SIGNAL-TO-I-PDU-MAPPING","<Element {http://autosar.org/schema/r4.0}I-SIGNAL-I-PDU-GROUP at 0x2c45e1cd300>"];
const startkeys = ["<Element {http://autosar.org/schema/r4.0}I-SIGNAL-I-PDU-GROUP at 0x2c45e1cd340>","<Element {http://autosar.org/schema/r4.0}I-SIGNAL-I-PDU-GROUP at 0x2c45e1cd300>"];

const transformObject = async (obj = {},e1 = null) =>{
  
  if(obj && typeof obj == 'object'){
    console.log(obj);
    if(startkeys.includes(e1)){
      obj['label'] = obj["SHORT-NAME"];
      obj["children"] = await transformObject(obj["I-SIGNAL-I-PDU"],"I-SIGNAL-I-PDU");
    }
    else if(e1 === "I-SIGNAL-I-PDU"){
      obj.map(async (child)=>{
        child['label'] = child["SHORT-NAME"];
        child['children'] =await transformObject(child["I-SIGNAL-TO-I-PDU-MAPPING"],"I-SIGNAL-TO-I-PDU-MAPPING");
      });
    }
    else if(e1 === "I-SIGNAL-TO-I-PDU-MAPPING"){
      obj.map(async (child)=>{
        child['label'] = child["SHORT-NAME"];
        child['children'] = [await transformObject(child["I-SIGNAL-REF"],"I-SIGNAL-REF")];
      });
    }
    else if(e1==="I-SIGNAL-REF"){
      obj['label'] =await obj["SHORT-NAME"];
    }
    return obj;

    
  }
}



export class Tree1 extends Component {

  constructor(props) {
    
      super(props);
      this.state = {
        data: transform
      };
  }

  
 

  render() {
    //const k = transformObject(sample1["<Element {http://autosar.org/schema/r4.0}I-SIGNAL-I-PDU-GROUP at 0x2c45e1cd340>"],"<Element {http://autosar.org/schema/r4.0}I-SIGNAL-I-PDU-GROUP at 0x2c45e1cd340>");
    return (<div>
        <p> This </p>
      <button
        onClick={async (e)=>{
          console.log(JSON.stringify(await transformObject(sample["<Element {http://autosar.org/schema/r4.0}I-SIGNAL-I-PDU-GROUP at 0x2c45e1cd340>"],"<Element {http://autosar.org/schema/r4.0}I-SIGNAL-I-PDU-GROUP at 0x2c45e1cd340>")));
          
        }}
      
        />
       <div>
          <Container data={this.state.data} />
      </div>                      
    </div>)
  }
}



//render(<App />, document.getElementById("root"));

//export default Tree1;