import logo from './logo.svg';
import './App.css';
import React , {Component, ChangeEvent,useState } from 'react';

function App() {
  
  const [text, setText] = useState([]);
  const [search,setSearch] = useState("");
  //[selected,setSelected] = useState([]);
  
  const showFile = async (e) => {
    
    
    var count = 0;
    const reader = new FileReader();
    reader.onload = async (e) => {
      var temp = e.target.result.split('\n');
      var temp_lst = [];
      temp.map(data=>{
        
       temp_lst = [...temp_lst,{val:data,line:count,checked:false,props:{}}];
       count++; 
      });
      //console.log(temp_lst);
      setText(temp_lst);
      
    };
    reader.readAsText(e.target.files[0]);
  }

  const handleChange =  async (e,data) => {
    //do this to get around refrences
    const temp = text.slice(0);
    temp.map(content=>{
      if(content.line === data.line){
        content.checked = e.target.checked;
      }
    });
    setText(temp);
    console.log(text);
  }

  return (
    <div className="App">

      <body>
        <input type="file" onChange={(e) => showFile(e)}/>
        <div className='rowA'>
          <div>
          <input type='text' onChange = {(e)=>{setSearch(e.target.value)}}/>  
          <div className='scrollView'>
            {
              
              text.filter(e=>e.val.includes(search)).map(data=>(
                <>
                
                <input type='checkbox' onChange={(e)=> handleChange(e,data)}/>
                <label>
                  {data.line+ "\t"+ data.val} 
                </label>
                <br/>
                </>
              ))
            }
            
          </div>
          <div>
          {
          text.filter(e => e.checked).map(data =>(
              <>
                <p>{data.val}</p>
                <br/>
              </>
                
            ))}
          </div>
          </div> 
          <div>

          </div>
        </div>
      </body>

    </div>
  );
}

export default App;
