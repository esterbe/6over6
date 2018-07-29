import React, { Component } from 'react';
import autoBind             from 'auto-bind';
import io                   from 'socket.io-client';
import FileSelector         from './fileSelector';
import Events from '../events';
import Clients from '../clients';

import './photoPublisher.css'

const SOCKET_URL = "http://192.168.0.15:3231";
const NUM_OF_PARTS = 4;
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
            socket.emit(Events.CLIENT_CONNECTED, {name: Clients.PUBLISHER});
        });
        this.setState({socket});
    }

    _selectPhoto(e) {
        this.setState({
            selectedFile: e.target.files[0]
        });
    }

    _uploadPhoto() {
        //console.log(this.state.selectedFile);
        this.state.socket.emit(Events.UPLOAD_STARTED, {numOfParts: NUM_OF_PARTS});
        //TODO: divide to 4 parts and send to server
        //TODO: update css to syncing and done
    }


    render() {
        let fileName = this.state.selectedFile ? this.state.selectedFile.name : "Select file to upload";
        return <div className="container">
            <div className="bar"></div>
            <FileSelector fileName={fileName} onSelectPhoto={this._selectPhoto}/>
            <img alt='' src="http://100dayscss.com/codepen/syncing.svg" className="syncing"/>
            <img alt='' src="http://100dayscss.com/codepen/checkmark.svg" className="done"/>
            <input type="button" className={"upload-btn " + (this.state.selectedFile ? "" : "disabled")}
                   disabled={!this.state.selectedFile} value="Upload file" onClick={this._uploadPhoto}/>
        </div>;
    }
}
