import React, { Component } from 'react';

export class Input extends Component{
    constructor(props){
        super(props)
        this.state = { data : props.data }
    }
    render(){
        return(
            <div>
            {/* <button onClick={(e)=>{console.log(this.state.data)}}>get_data</button> */}
            <table>
                <tr>
                    <th>SIGNAL-NAME</th>
                    <th>Input</th>
                    <th>unit</th>
                </tr>
                {
                        
                   this.state.data && this.state.data.map(item=>
                    {
                        const signal = item["I-SIGNAL-REF"];
                        const type = new String(signal["SW-DATA-DEF-PROPS-CONDITIONAL"]["BASE-TYPE-REF"].label);
                        const num = new String(2**parseInt(type.substring(4))-1);
                        const unit = (signal["SW-DATA-DEF-PROPS-CONDITIONAL"]["COMPU-METHOD-REF"]["UNIT-REF"]!=undefined) ?signal["SW-DATA-DEF-PROPS-CONDITIONAL"]["COMPU-METHOD-REF"]["UNIT-REF"].label : "";
                        //console.log()
                        return(
                            <tr>
                                <td>
                                    {signal.label}
                                </td>
                                <td>
                                    <input type="number" id="quantity" name="quantity" min="0" max={num}/> 
                                    
                                </td>
                                <td>{unit}</td>
                            </tr>
                        )
                    }
                    )
                }
            </table>
            </div>
        )
    }
}

