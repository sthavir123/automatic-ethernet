import React, { Component, useState } from 'react';
import {useCollapse} from 'react-collapsed';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css'
export function Input(props){
    
        
        const data = props.data;
        const parent = props.parent;
        const values1 = props.values;
        const handleInpChange = props.handleInpChange
        const [values,setValues] = useState(props.value)

    
    const onValChange = (event) => {
        
        
        setValues(
            {
                ...values,
                [event.target.name] : event.target.value,
            }
        );

      }

    
        return(
            <div>
            {/* <button onClick={(e)=>{console.log(this.state.data)}}>get_data</button> */}
            <form onSubmit={(e)=>{e.preventDefault();handleInpChange(e,parent,values);
                //props.close()
                }} >
            <table>
                <tbody>
                <tr>
                    <th>SIGNAL-NAME</th>
                    <th>Input</th>
                    <th>unit</th>
                </tr>
                
                
                {
                        
                   data && data.map(item=>
                    {
                        try {
                            const signal = item["I-SIGNAL-REF"];
                            console.log(item)
                            const type = new String(signal["SW-DATA-DEF-PROPS-CONDITIONAL"]["BASE-TYPE-REF"].label);
                            const num = new String(2**parseInt(type.substring(4))-1);
                            const unit = (signal["SW-DATA-DEF-PROPS-CONDITIONAL"]["COMPU-METHOD-REF"]["UNIT-REF"]!=undefined) ?signal["SW-DATA-DEF-PROPS-CONDITIONAL"]["COMPU-METHOD-REF"]["UNIT-REF"].label : "";
                            var val;
                            try{
                                console.log(values1);
                                val = values1[parent][signal.label];
                                console.log(val)
                            }catch(error){
                                //console.log(error)
                            }

                            return(
                                <tr>
                                    <td>
                                        <label for={signal.label}>{signal.label}</label>
                                        
                                    </td>
                                    <td>
                                        <input name = {signal.label} type="number" min="0" defaultValue={val} onChange={onValChange}/> 
                                        
                                    </td>
                                    <td>{unit}</td>
                                </tr>
                            )
                          //ignoring errors in backend pasrse function  
                        } catch (error) {
                           // console.log(error)
                            
                        }
                        return(<></>)
                        //console.log()
                        
                    }
                    )
                }
                
                
            
            </tbody>
            </table>
            <input type="submit"/>
            </form>
            </div>
        );
    
}

export function Collapsible(props) {
    const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();
    
return (
    <div className="collapsible">
        <div className="header" {...getToggleProps()}>
            {props.pdu}
        </div>
        <div {...getCollapseProps()}>
            <div className="content">
                < Input data = {props.data} 
                    parent = {props.item.label} 
                    values = {props.submit_values}
                    handleInpChange = {props.handleInpChange}
                />
            </div>
        </div>
    </div>
    );
}


// export function Pop(props){
//     console.log(props.submit_values)
//     return(
//         <Popup trigger=
//                 {<h1> {props.item.label} </h1>}
//                 modal nested>
//                 {
//                     close => (
//                         <div className='modal'>
//                             <div className='content'>
//                               <Input data={Array.isArray(
//                                   props.item["I-SIGNAL-TO-I-PDU-MAPPING"]) ? props.item["I-SIGNAL-TO-I-PDU-MAPPING"] : [props.item["I-SIGNAL-TO-I-PDU-MAPPING"]]} 
//                                   parent = {props.item.label}
//                                   values = {props.submit_values}
//                                   handleInpChange = {props.handleInpChange}
//                                   close = {() => close()}
//                               />
//                             </div>
                            
//                         </div>
//                     )
//                 }
//               </Popup>
//     );
// }