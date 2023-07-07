import React, { useEffect, useState } from 'react'
import './sidebar.css'
import Container from './DropdownContainer';
export function ToggleSidebar (props) {
    const [isOpen, setIsopen] = useState(false);
    const [data,setData] = useState({})

    const ToggleSidebar = () => {
        isOpen === true ? setIsopen(false) : setIsopen(true);
    }
    useEffect(()=>{setData(props.tx)},[props.tx])
    return (
        <>
            <div className="container-fluid mt-3" >
                
                    
                    <div className="btn btn-primary" onClick={ToggleSidebar} style={{position:"fixed",right:"50px"}}>
                            Select Pdu       
                    </div>
                    <div className={`sidebar ${isOpen == true ? 'active' : ''}`}>
                        <div className="sd-header">
                            <h4 className="mb-0">Select Pdu</h4>
                            <button class="close-button btn btn-primary" aria-label="Dismiss alert" type="button" onClick={ToggleSidebar} data-close>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="sd-body">
                            <Container data={data} onChange={props.onChange}/>
                        </div>
                    </div>
                    <div className={`sidebar-overlay ${isOpen == true ? 'active' : ''}`} onClick={ToggleSidebar}></div>
           </div>
           
        </>
    )
}