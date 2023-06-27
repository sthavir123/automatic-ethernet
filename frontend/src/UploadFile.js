import React, {useState,useEffect} from 'react'
import axios from 'axios'


function UploadFile({filename,setFilename}) {
    //const [filename, setFilename] = useState('')
    //var filename = ''
    const [files, setFiles] = useState([{}])
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
                
            },
               
        ).catch(error =>{
            console.log(error)
        })
    }

    

    const getFiles = () =>{

        axios.get(api + '/files/').then(
            response =>{
                //console.log(response.data)
                setFiles(response.data)
            }
        ).catch(error =>{
            console.log(error)
        })

    }

    const forceDownload = (response, title) =>{
        console.log(response)
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', title+'.pdf')
        document.body.appendChild(link)
        link.click()


    }

    const downloadWithAxios = (url, title)=>{
        axios({
            method: 'get',
            url,
            responseType: 'arraybuffer'
        }).then((response)=>{
            forceDownload(response, title)
        }).catch((error)=> console.log(error))

    }


    useEffect (() =>{
        getFiles()
        console.log(files)
    }, [])



return (
    <div className="container-fluid">

    

    <div className="row">
        <div className="col-md-4">
            <h2 className="alert alert-success">ArXML Tool</h2>

<form >
<div className="form-group">
<label htmlFor="exampleFormControlFile1" className="float-left"></label>
<input type="file" onChange={e => setFilename(e.target.files[0])} className="form-control" />
</div>

<button type="button" onClick={saveFile} className="btn btn-primary float-left mt-2">Submit</button>

<br/>

<br/>
<br/>




</form>


    </div>

    </div>
</div>

    )
}

export default UploadFile
