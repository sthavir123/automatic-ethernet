import axios from "axios";
import React from "react";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

const baseURL = "http://127.0.0.1:8000/proto";
const baseURL2 = "http://127.0.0.1:8000/proto/set"

export default function Proto() {
  const [post, setPost] = React.useState(null);
  
  const [inputs, setInputs] = React.useState({});
  const [filename, setFilename] = React.useState('')
  
  function handleChange (event,type) {
    
    const name = event.target.name;
    const value = type === "bool" ? event.target.checked : event.target.value;
    console.log(event.target.checked , event.target.value);
    setInputs(values => ({ ...values, [name]: value }))
  }
  function handleChange2 (option,name){
    const value = option.value;
    setInputs(values => ({ ...values, [name]: value }))
  }
  

  // similar to upload in UploadFile.json 
  const saveFile = () => {
    console.log('Button clicked')

    let formData = new FormData();
    formData.append("file", filename)

    let axiosConfig = {
      headers: {
        'Content-Type': 'multpart/form-data'
      }
    }

    console.log(formData)
    axios.post(baseURL, formData, axiosConfig).then(
      response => {
        console.log(response)
        setPost(response.data)
      }
    ).catch(error => {
      console.log(error)
    })

  }


  return (
    <div>

      <form >
        <div className="form-group">
          <label htmlFor="exampleFormControlFile1" className="float-left">Browse A Proto File To Upload</label>
          <p></p>
          <input type="file" onChange={e => setFilename(e.target.files[0])} className="form-control" />
          
        </div>

        <button type="button" onClick={saveFile} className="btn btn-primary float-left mt-2">Submit</button>
        <br />
        <br />
        <br />



      </form>
      {post &&
        Object.keys(post.messages).map((keyName, keyIndex) => {
          // use keyName to get current key's name
          // and a[keyName] to get its value

          return (
            <div>
              <h2>{keyName}</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                let data1 = { name: keyName, input: inputs }
                // post form data to generate payload at backend
                axios.post(baseURL2, data1).then(
                  response => {
                    console.log(response)

                  },
                  //setInputs({})
                ).catch(error => {
                  console.log(error)
                })
              }}>
                {
                   <table>
                    
                  { 
                  post.messages[keyName].fields.map((field => {
                    return (
                     
                      <label>
                        <tr>
                        <td>{field.name}</td> 
                        <td>({field.type})</td>
                        
                        
                        <td><input type={(field.type === 'bool') ? "checkbox" : "text"} name={field.name} inp_type={field.type}
                          value={inputs[field.name] || ""}
                          onChange={(e)=> handleChange (e,field.type)}
                        /></td>
                        
                        <td>{post.enums[field.type] && 
                        <Dropdown onChange={(op)=>handleChange2(op,field.name)} options={post.enums[field.type].fields.map((obj)=>{
                          return({label:obj.name,value:obj.number})
                        })}/>}</td>
                        </tr>
                        <br/>
                      </label>
                      
                    );
                  }))}
                  </table>}


                <input type="submit" />
              </form>
            </div>
          )
        })
      }

    </div>
  );
}