import React, {useState,useEffect} from 'react'
import axios from 'axios'


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

    

    // const getFiles = () =>{

    //     axios.get(api + '/files/').then(
    //         response =>{
    //             //console.log(response.data)
    //             setFiles(response.data)
    //         }
    //     ).catch(error =>{
    //         console.log(error)
    //     })

    // }

    // useEffect (() =>{
    //     getFiles()
        
    // }, [])



    return (
    <div className="col-md-4">
        <h2 className="alert alert-success">ArXML Tool</h2>
        <form >
            <div className="form-group">
                <label htmlFor="exampleFormControlFile1" className="float-left"></label>
                <input type="file" onChange={e => setFilename(e.target.files[0])} className="form-control" />
                <button type="button" onClick={saveFile} className="btn btn-primary float-left mt-2">Submit</button>
            </div>
        </form>
    </div>
    );
}

export default UploadFile
