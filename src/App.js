            
            


import logo from './logo.svg';
import './App.css';
import React , {Component, ChangeEvent,useState } from 'react';

function App() {
  
  const [text, setText] = useState([]);
  const [search,setSearch] = useState("");
  const [search1,setSearch1] = useState("");
  //[selected,setSelected] = useState([]);
  
  const showFile = async (e) => {
    
    
    var count = 0;
    const reader = new FileReader();
    reader.onload = async (e) => {
      var temp = e.target.result.split('\n');
      var temp_lst = [];
      temp.map(data=>{
        
       temp_lst = [...temp_lst,{val:data,line:count,checked:false,props_keys:[""],props_results:[""]}];
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
    
    temp[data.line].checked = e.target.checked;
    //Object.entries
    setText(temp);
    
  }



  return (
    <div className="App">

      <body>
        <input type="file" onChange={(e) => showFile(e)}/>
        <div className='rowA'>
          <div className='child'>
          <input type='text' onChange = {(e)=>{setSearch(e.target.value)}}/>  
          <div className='scrollView'>
            {
              
              text.filter(e=>e.val.toLowerCase().includes(search)).map(data=>(
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
                
                {
                  
                  data.props_results.map((key,index)=>
                    <>
                    <p><input type="text" onChange={async (e)=>{data.props_keys[index] = e.target.value;
                      
                    }}/>
                    <input type="text" onChange={async (e)=>{data.props_results[index] = e.target.value;
                      console.log(data);
                    }}/>
 
                    <button onClick={async(e)=>{
                      const temp = text.splice(0);

                      temp[data.line].props_keys = temp[data.line].props_keys.concat([""]);
                      temp[data.line].props_results = temp[data.line].props_results.concat([""]);
                      setText(temp);
                      console.log(temp);
                    }}>Add</button></p>
                    </>
                  )
                }
                {
                  <button onClick={async (e)=> {
                      
                      const temp = text.splice(0);
                      temp[data.line].props_keys = data.props_keys;
                      temp[data.line].props_results = data.props_results;
                      setText(temp); 
                      console.log(temp); 
                    }}>Submit</button>
                }


              </>
                
            ))}
          </div>
          </div> 
          <div className='child'>
          <input type='text' onChange = {(e)=>{setSearch(e.target.value)}}/> 
          <div className='scrollView'>
            {
              
              text.filter(e=>e.val.includes("")).map(data=>(
                <>
                
                
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
                
                {
                  
                  data.props_results.map((key,index)=>
                    <>
                    <p>{data.props_keys[index]} {data.props_results[index]}
                      
 
                    {/* <button onClick={async(e)=>{
                      const temp = text.splice(0);

                      temp[data.line].props_keys = temp[data.line].props_keys.concat([""]);
                      temp[data.line].props_results = temp[data.line].props_results.concat([""]);
                      setText(temp);
                      console.log(temp);
                    }}>Add</button> */}
                    </p>
                    </>
                  )
                }
                {
                  // <button onClick={async (e)=> {
                      
                  //     const temp = text.splice(0);
                  //     temp[data.line].props_keys = data.props_keys;
                  //     temp[data.line].props_results = data.props_results;
                  //     setText(temp); 
                  //     //console.log(temp); 
                  //   }}>Submit</button>
                }


              </>
                
            ))}
          </div>
          </div>       
        </div>
      </body>

    </div>
  );
}

export default App;
