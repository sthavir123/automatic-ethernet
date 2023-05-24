import logo from './logo.svg';
import './App.css';
import React , {Component, ChangeEvent,useState } from 'react';
//export var text,selected,setText,setSelected;

// export function useArrayState(initial = []) {
//   const array = useMemo(() => initial, [])
//   const [refresh, setRefresh] = useState(0)
//   const cb = useCallback((f) => {
//     f(array)
//     setRefresh(it => ++it)
//   }, [])

//   return [array, cb]
// }

function App() {
  
  // function push(data) {
  //   updateItems(it => it.push(data))
  // }
  // function remove(index) {
  //   updateItems(it => it.splice(index, 1))
  // }

  // function clear() {
  //   updateItems(it => it.length = 0)
  // }


  const [text, setText] = useState([]);
  //[selected,setSelected] = useState([]);
  
  const showFile = async (e) => {
    
    
    var count = 0;
    const reader = new FileReader();
    reader.onload = async (e) => {
      var temp = e.target.result.split('\n');
      var temp_lst = [];
      temp.map(data=>{
        
       temp_lst = [...temp_lst,{val:data,line:count,checked:false}];
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
          <div className='scrollView'>
            {
              
              text.map(data=>(
                <>
                
                <input type='checkbox' onChange={(e)=> handleChange(e,data)}/>
                <label>
                  {data.line+ "  "+ data.val} 
                </label>
                <br/>
                </>
              ))
            }
            
          </div>
          <div>
          {
          text.filter(e=>e.checked).map(data =>(
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
