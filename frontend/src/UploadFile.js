import React, {useState,useEffect} from 'react'
import axios from 'axios'
import './App.css'
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
function UploadFile({filename,setFilename,parse,ecuOptions,get_ecu_optinos}) {

    const [ecu,setEcu] = useState("")
    // api to call for
    let api = 'http://127.0.0.1:8000/api'

    // function to upload .arxml file and call get_ecu_options to fetch the ecu list
    const saveFile = () =>{
        

        let formData = new FormData();
        formData.append("file", filename)
        console.log(filename)
        // seeting headers to send fileobject
        let axiosConfig = {
            headers: {
                'Content-Type': 'multpart/form-data'
            }
        }

        axios.post(api + '/files/', formData, axiosConfig).then(
            response =>{
                console.log(response)
                
                get_ecu_optinos(filename.name)
            }
            
               
        ).catch(error =>{
            console.log(error)
        })
    }

    
    return (
    <div>
        <div class="alert alert-success" style={{height :"10%"}} >
        <div class="d-flex justify-content-center">
        <div class="input-group w-auto">
            
            <input
            type="file"
            class="form-control"
            placeholder="Example input"
            aria-label="Example input"
            aria-describedby="button-addon1"
            onChange={e => setFilename(e.target.files[0])}
            />
            <button class="btn btn-primary" type="button" id="button-addon1" data-mdb-ripple-color="dark" onClick={saveFile} style={{marginRight:"20em"}}>
                Submit
            </button>
            
            <Dropdown
                options={ecuOptions}
                placeholder="Select ECU"
                onChange={(op)=>setEcu(op.label)} 
            />

            <button class="btn btn-primary" type="button" id="button-addon2" data-mdb-ripple-color="dark" onClick={(e)=>{parse(filename.name,ecu)}} >
                Submit
            </button>

        </div>
    </div>    

    </div>
    </div>
    );
}

export default UploadFile
