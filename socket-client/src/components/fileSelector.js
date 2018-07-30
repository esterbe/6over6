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
                    <div className="upload"/>
                    <div className="fileName">{this.props.fileName}</div>
                    <input type="file" className="input" accept="image/*" onChange={this.props.onSelectPhoto}/>
                </div>
            </div>
        );
    }
}
