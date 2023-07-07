import React, { useEffect, useState } from 'react'
import './sidebar.css'
import { Collapsible2 } from './input';

export function ToggleSidebar2 (props) {
    const [isOpen, setIsopen] = useState(false);
    

    const ToggleSidebar = () => {
        isOpen === true ? setIsopen(false) : setIsopen(true);
    }
    
    return (
        <>
            <div className="container-fluid mt-3" >
                
                    
                    <div className="btn btn-primary" onClick={ToggleSidebar} style={{position:"fixed",right:"175px"}}>
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
                        {
                            props.selected2 && props.selected2.map((item,index)=>(
                            <Collapsible2 pdu={item.label} data={Array.isArray(
                            item["children2"]) ? item["children2"] : [item["children2"]]}
                            setSelect = {props.setSelectData} index={index} select = {props.selected2}
                            
                            />
                        ))}

                        </div>
                    </div>
                    <div className={`sidebar-overlay ${isOpen == true ? 'active' : ''}`} onClick={ToggleSidebar}></div>
           </div>
           
        </>
    )
}