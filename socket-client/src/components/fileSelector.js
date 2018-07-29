import React, { Component } from 'react';
import autoBind             from 'auto-bind';

import './fileSelector.css'

export default class FileSelector extends Component {

    constructor(){
        super();
        autoBind(this);
    }

    render() {
        return (
            <div className="file-selection">
                <div className="content">
                    <img alt='' className="upload"/>
                    <span className="filename">{this.props.fileName}</span>
                    <input type="file" className="input" onChange={this.props.onSelectPhoto}/>
                </div>
            </div>
        );
    }
}
