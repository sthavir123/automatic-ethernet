import React, {useState,useEffect} from 'react'
import axios from 'axios'
import './App.css'

function UploadFile({filename,setFilename,parse}) {

    const [files, setFiles] = useState([{}])
    //good for logging on screen
    const [status, setstatus] = useState('')
    let api = 'http://127.0.0.1:8000/api'


    const saveFile = () =>{
        console.log('Button clicked')

        let formData = new FormData();
        formData.append("file", filename)
        console.log(filename)
        let axiosConfig = {
            headers: {
                'Content-Type': 'multpart/form-data'
            }
        }

        console.log(formData)
        axios.post(api + '/files/', formData, axiosConfig).then(
            response =>{
                console.log(response)
                setstatus('File Uploaded Successfully')
                parse(filename.name)
            },
            
               
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
            <button class="btn btn-primary" type="button" id="button-addon1" data-mdb-ripple-color="dark" onClick={saveFile}>
                Submit
            </button>
        </div>
    </div>    

    </div>
    </div>
    );
}

export default UploadFile
