import React, { useEffect, useState } from 'react'
import './sidebar.css'
import { Collapsible2 } from './input';

function useForceUpdate(){
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update state to force render
    // A function that increment 👆🏻 the previous state like here 
    // is better than directly setting `setValue(value + 1)`
}

export function ToggleSidebar2 (props) {
    const [isOpen, setIsopen] = useState(false);
    const [searchInput,setSearchInput] = useState('')
    const handleChange = (e) =>{
        setSearchInput(e.target.value);
        force();
    }
    const ToggleSidebar = () => {
        isOpen === true ? setIsopen(false) : setIsopen(true);
    }
    const force = useForceUpdate();
    return (
        <>
            <div className="container-fluid mt-3" >
                
                    
                    <div className="btn btn-primary" onClick={ToggleSidebar} style={{position:"fixed",right:"11em",top:"8.9em"}}>
                                    Select Signals
                    </div>
                    


                    <div className={`sidebar ${isOpen == true ? 'active' : ''}`}>
                        <div className="sd-header" >
                            <h4 className="mb-0">Select Signals</h4>
                            <button class="close-button btn btn-primary" aria-label="Dismiss alert" type="button" onClick={ToggleSidebar} data-close>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="sd-body">
                        <input
                            type="text"
                            placeholder="Search here"
                            onChange={handleChange}
                            value={searchInput} />
                        {
                            props.selected2 && props.selected2.map((item,index)=>(
                            <Collapsible2 pdu={item.label} data={item['children2'].filter((item1)=>{
                                // console.log(item1.label ,searchInput, item1.label.includes(searchInput))
                                return item1['children2'][0].label.toLowerCase().includes(searchInput.toLowerCase());
                            })}
                            setSelect = {props.setSelectData} index={index} select = {props.selected2}
                            serchPreidicate = {searchInput}
                            />
                        ))}

                        </div>
                    </div>
                    <div className={`sidebar-overlay ${isOpen == true ? 'active' : ''}`} onClick={ToggleSidebar}></div>
           </div>
           
        </>
    )
}