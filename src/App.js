import logo from './logo.svg';
import './App.css';
import React , {Component, ChangeEvent,useState } from 'react';
function App() {
  
  const [file,setFile] = useState();
  const [text, setText] = useState([]);
   const onChangeHandle = (e)=>{ 
    if(e.target.files){
      setFile(e.target.files[0]);  
    }
   };

  const showFile = async (e) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = async (e) => {
      var temp = e.target.result.split('\n');
      //console.log(temp.split('\n'));
      setText(temp);
      console.log(text);
    };
    reader.readAsText(e.target.files[0]);
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        
      </header>

      <body>
        <input type="file" onChange={(e) => showFile(e)}/>
        <div className=' left window '>
          
        </div>
      </body>

    </div>
  );
}

export default App;
