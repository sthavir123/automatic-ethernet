import React, {useEffect, useState } from 'react';
import {useCollapse} from 'react-collapsed';

import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import './App.css'

//import Popup from 'reactjs-popup';  // for popup component
//import 'reactjs-popup/dist/index.css' 

function useForceUpdate(){
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update state to force render
}


// component that displays signals inside a particular pdu in tabular form

export function Input(props){
 
        const [data1,setData1] = useState([])             // Pdu information
        const parent = props.parent;                      // pdu label
        const handleInpChange = props.handleInpChange     // handle change in input values ttriggered in submit Pdu
        const [values,setValues] = useState(props.values) // input values to sent on pdu Submit
        const type = props.type                           // "rx" or "tx" (input or display)
        //update data1 when props.data is changed (triggers when selected either rx or tx is changed)
        useEffect(()=>{setData1(props.data)},[props.data])        
    
    // handle local value change
    const onValChange = async (target) => {
        setValues(
            {
                ...values,
                [target.name] : target.value,
            }
        );
        
      }
    
    // set selected=false to remove sigal from display on '-' click
    const remove = async (item) => {
        var t = [...props.selected2]
        var index2 = t[props.index]['children2'].indexOf(item);
        t[props.index]['children2'][index2].selected = false;
        
        props.setSelected2(t)
    }
        return(
            <div >
                <div>
            
                    <form onSubmit={(e)=>{
                        e.preventDefault();
                        handleInpChange(e,parent,values);
                    }}>

                    <table className='table-bordered table-sm' style={{}}> 
                        <colgroup>
                            <col span="1" style={{width: "10%"}}/>
                            <col span="1" style={{width: "2%"}}/>
                            <col span="1" style={{width: "30%"}}/>
                            <col span="1" style={{width: "10%"}}/>
                            <col span="1" style={{width: "48%"}}/>
                        </colgroup>
                        <tbody>
                            <tr>
                                <th><center>SIGNAL-NAME</center></th>
                                <th><center>{type=="tx" ? "INPUT" : "OUTPUT"}</center></th>
                                <th><center></center></th>
                                <th><center>UNIT</center></th>
                                <th><center>DESCRIPTION</center></th>

                            </tr>
                
                
                            {
                                data1 && data1.filter((item)=>{
                                    // filter-out signals that are not selected
                                    return item.selected;
                                }).map(item=>{
                                try {
                                    const signal = item["children2"][0];
                                    const unit = item["COMPU-METHOD"]["UNIT"] ?item["COMPU-METHOD"]["UNIT"] : "";
                                    var scale = item["COMPU-METHOD"]["COMPU-SCALE"]  ?? undefined; // undefined for non-enum signals
                                    var val;
                                    var min,max;
                                    try {
                                        // set max and min so that illegel values for feilds (specially enums) are not submitted 
                                        min = scale[0]["LOWER-LIMIT"]               
                                        max = scale[scale.length-1]["UPPER-LIMIT"]  
                                    } catch (error) {}
                       
                                    try{
                                        // try to get initial value for this signal, so that value persist even after collapsing its collapsible parent
                                        val = values[signal.label];
                                    }catch(error){}
                                    
                                    return(
                                    <tr>
                                        <td>
                                            <button className='btn-xs' onClick={(e)=>{remove(item)}}>-</button>
                                            <label style={{marginLeft:"0.5em"}} for={signal.label}>{signal.label}</label>
                                        
                                        </td>
                                        <td>
                                            <input name = {signal.label} type="number" min={min} max={max} value={val} onChange={(e)=>onValChange(e.target)} style={{width:'100%'}} readOnly={type=="rx"}/> 
                                        </td>
                                        <td>{
                                            // provide dropdown for enum
                                            scale && type=="tx"&&
                                                <Dropdown
                                                    value={val}
                                                options={
                                                    scale.map((item) => {
                                                        return ({label:item["VT"],value:item["LOWER-LIMIT"]})   
                                                    })}
                                                    onChange={(op)=>{onValChange({name:signal.label,value:op.value})}}
                                                />
                                            }
                                        </td>
                                        <td><center>{unit}</center></td>
                                        <td><center>{signal.desc}</center></td>
                                    </tr>
                                )
                          //ignoring errors in backend pasrse function  
                            } catch (error) {}
                           
                        return(<></>)
                        //console.log()
                        
                    }
                    )
                }
                </tbody>
            </table>
            {type=="tx" && <input type="submit"/> /** submit option only in tx tab*/}
            </form>
            </div>
              

            </div>
        );
    
}

// Pdu Info Collapsible
export function Collapsible1(props) {
    const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();
    
    const [data,setData] = useState([])
    useEffect(()=>{setData(props.data)},[props.data])
return (
    <div className="collapsible" style={{border:"1px solid black" ,marginBottom: "10px"}}>
        <div className="header" style ={{ display:"flex", justifyContent:'space-between',color:"purple"}} {...getToggleProps()}>
            
            <h5>{props.pdu}</h5>
            {/* {isExpanded ? <IoIosArrowDown/> : <IoIosArrowUp/> } */}
        </div>
        <div {...getCollapseProps()}>
            <div className="content" style={{backgroundColor:"white"}}>
                {/** props.data in save config */}
                < Input data = {data} 
                    parent = {props.item.label} 
                    values = {props.submit_values}
                    handleInpChange = {props.handleInpChange}
                    type = {props.type}
                    setData = {setData}
                    index={props.index} selected2={props.selected2} setSelected2={props.setSelected2}
                />
            </div>
        </div>
    </div>
    );
}

// Display signals in select signal sidebar
export function Temp2(props){
    const [data,setData] = useState([])     // the signals in a particular pdu
    const [selectData,setSelect] = useState([])  // the total selectedsignals data for modifying it as that is the variable displaye in (pdu-data collapsible)
    const force = useForceUpdate()
    useEffect(()=>{setData(props.data)},[props.data])
    useEffect(()=>{setSelect(props.selectData)},[props.selectData])
    
    return(
        <div>
        <ul style={{listStyleType:'none'}}>   
             {data.map((item,index)=>(
                <li style={{fontSize:"small"}} key={index}>
                    
                    <input type='checkbox' checked={ (selectData[props.index]) ? selectData[props.index]['children2'][index].selected : false} name={item.label} onClick={(e)=>{props.onChange(e,index,selectData[props.index]['children2'][index].selected); force()}} style={{marginRight:"1em"}} 
                    
                    />
                    <label for={item.label} >{item['children2'][0].label}</label>
                    
                </li>
             ))}
               </ul>
               </div>
    )
}


// Collapsible Pdu-signal for select signal side bar
export function Collapsible2(props){
    
    
    const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();
    
    const onChange = (e,index1,temp) =>{
        var k = props.select;
        k[props.index].children2[index1].selected = !k[props.index].children2[index1].selected;
        props.setSelect(k)    
       
    }
    const [selectData,setSelectData] = useState([])
    const [data,setData] = useState([])
    
    useEffect(()=>{setSelectData(props.select)},[props.select])
    useEffect(()=>{setData(props.data)},[props.data])
    
    return(
    <div className="collapsible">
        <div   {...getToggleProps()}>
            <h6>{props.pdu}</h6>
        </div>
        <div {...getCollapseProps()}>
            <div className="content">
            
             <Temp2 data = {data} index={props.index} onChange={onChange} selectData={selectData} setSelected2={props.setSelect} searchPredicate = {props.searchPredicate}/>  
            </div>
        </div>
        
    </div>    
    );
}

// conatiner for Pdu-data display
export function DisplayContainer(props){
    
    return(
        <div style={{display:"flex"}}>
        <div style={{width:"100%",padding:"5px",position:"fixed",left:"inherit",right:"inherit",top:"12em",bottom:0,overflowY:"scroll"}}>  
              {
                props.selected2 && props.selected2.map((item,index)=>(
                  <div className='toogleable'>
                    
                    <Collapsible1 pdu = {item.label} data={Array.isArray(
                        item["children2"]) ? item["children2"] : [item["children2"]]}
                        item={item} submit_values={props.submit_values} handleInpChange={props.handleInpChange}
                        type={props.type} index={index} selected2={props.selected2} setSelected2={props.setSelected2} 
                    />
                    
                    </div>  
                ))
              }
        </div>
        
        </div>
    )
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

