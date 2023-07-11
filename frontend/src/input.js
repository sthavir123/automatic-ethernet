import React, { Component, useEffect, useState } from 'react';
import {useCollapse} from 'react-collapsed';
//import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css'
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import './App.css'

// import {IoIosArrowUp,IoIosArrowDown  } from 'react-icons/io';

function useForceUpdate(){
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update state to force render
    // A function that increment 👆🏻 the previous state like here 
    // is better than directly setting `setValue(value + 1)`
}

export function Input(props){
 
        const [data1,setData1] = useState([])
        const parent = props.parent;
        const values1 = props.values;
        const handleInpChange = props.handleInpChange
        const [values,setValues] = useState(props.values)
        const type = props.type
        useEffect(()=>{setData1(props.data)},[props.data])        

    const onValChange = async (target) => {
        
        
        setValues(
            {
                ...values,
                [target.name] : target.value,
            }
        );
        
      }

    const remove = async (item) => {

        var k = [...data1]
        var index = k.indexOf(item)
        //k[index].selected = false;
        
        
        var t = [...props.selected2]
        var index2 = t[props.index]['children2'].indexOf(item);
        t[props.index]['children2'][index2].selected = false;
        
        props.setSelected2(t)
    }
        return(
            <div >
                <div>
            {/* <button onClick={(e)=>{console.log(this.state.data)}}>get_data</button> */}
            <form onSubmit={(e)=>{e.preventDefault();handleInpChange(e,parent,values);
                //props.close()
                }} >
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
                    
                    return item.selected;
                   }).map(item=>
                    {
                        try {
                            const signal = item["children2"][0];
                            
                            const unit = item["COMPU-METHOD"]["UNIT"] ?item["COMPU-METHOD"]["UNIT"] : "";
                            var scale = item["COMPU-METHOD"]["COMPU-SCALE"]  ?? undefined;
                            var val;
                            var min,max;
                            try {
                                
                                min = scale[0]["LOWER-LIMIT"]
                                max = scale[scale.length-1]["UPPER-LIMIT"]
                                   
                            } catch (error) {
                                if(scale) {
                                    // console.log(error)
                                }
                            }

                            
                            
                            try{
                                
                                val = values[signal.label];
                                
                            }catch(error){
                                
                            }

                            return(
                                <tr>
                                    <td>
                                        <button className='btn-xs' onClick={(e)=>{remove(item)}}>-</button>
                                        <label style={{marginLeft:"0.5em"}} for={signal.label}>{signal.label}</label>
                                        
                                    </td>
                                    <td>
                                        <input name = {signal.label} type="number" min={min} max={max} value={val} onChange={(e)=>onValChange(e.target)} style={{width:'100%'}} readOnly={type=="rx"}/> 
                                        
                                    </td>
                                    <td>{scale && type=="tx"&&
                                    <Dropdown
                                        
                                        value={val}
                                        options={
                                            scale.map((item) => {
                                                return ({label:item["VT"],value:item["LOWER-LIMIT"]})
                                        })}
                                        onChange={(op)=>{onValChange({name:signal.label,value:op.value})}}
                                    />}
                                    </td>
                                    <td><center>{unit}</center></td>
                                    <td><center>{signal.desc}</center></td>
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
            {type=="tx" && <input type="submit"/>}
            </form>
            </div>
              

            </div>
        );
    
}

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

export function Temp2(props){
    const [data,setData] = useState([])
    const [selectData,setSelect] = useState([])
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



export function Collapsible2(props){
    
    const forceUpdate = useForceUpdate();
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

