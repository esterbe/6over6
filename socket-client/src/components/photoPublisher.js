import React, { Component } from 'react';
import autoBind             from 'auto-bind';
import io                   from 'socket.io-client';
import FileSelector         from './fileSelector';

import './photoPublisher.css'

const SOCKET_URL = "http://192.168.0.15:3231";
export default class PhotoPublisher extends Component {

    constructor(){
        super();
        autoBind(this);

        this.state = {
            selectedFile: null,
            socket: null
        };
    }

    componentWillMount() {
        this._initSocket();
    }

    _initSocket() {
        const socket = io(SOCKET_URL);
        socket.on('connect', () => {
            console.log("Connected");
        });
        this.setState({socket});
    }

    _selectPhoto(e) {
        this.setState({
            selectedFile: e.target.files[0]
        });
    }

    _uploadPhoto() {
        console.log(this.state.selectedFile);
        //TODO: divide to 4 parts and send to server
        //TODO: update css to syncing and done
    }


    render() {

        let fileName = this.state.selectedFile ? this.state.selectedFile.name : "Select file to upload";
        return (
            <div className="container">
                <div className="bar"></div>
                <FileSelector fileName={fileName} onSelectPhoto={this._selectPhoto}/>
                <img alt='' src="http://100dayscss.com/codepen/syncing.svg" className="syncing" />
                <img alt='' src="http://100dayscss.com/codepen/checkmark.svg" className="done" />
                <div className="upload-btn" onClick={this._uploadPhoto}>Upload file</div>
            </div>
        );
    }
}
