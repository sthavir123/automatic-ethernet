import React, {Component} from 'react';
import sample from './sample.json'
export class Tree extends React.Component {

   

    processObject = (object) =>
        Object.keys(object).map((key, reactKey) => {
            return (
                <li key={reactKey + key}>
                    {this.buildNode(key)}
                    <ul className="nested">
                        {this.isPrimative(object[key]) ? this.buildLeaf(object[key]) :
                            this.isArray(object[key]) ? this.loopArray(object[key]) : this.processObject(object[key])}
                    </ul>
                </li>
            )
        })

    loopArray = (array) =>
        array.map((value, key) =>
            <div key={key + value}>
                {this.isPrimative(value) ? this.buildLeaf(value) :
                    this.isArray(value) ? this.loopArray(value) : this.processObject(value)}
            </div>
        )

    isArray = (value) =>
        Array.isArray(value)

    isPrimative = (value) => {
        return typeof (value) === 'string'
            || typeof (value) === 'number'
            || typeof (value) === 'boolean'
    }

    buildNode = (key) =>
        <span className="node"
              onClick={
                  (e) => {
                      this.toggle(e)
                  }}>
             {key}
            </span>

    buildLeaf = (value) =>
        <li className="leaf"
            onClick={
                (e) => {

                }}>
            {value}
        </li>

    toggle = (event) => {
        event.target.parentElement.querySelector(".nested").classList.toggle("active");
        event.target.classList.toggle("node-down");
    }

    render = () => <>
        <ul id="myUL">
            {this.processObject(sample)}
        </ul>
    </>
}

