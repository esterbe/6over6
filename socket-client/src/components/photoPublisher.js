import React, { Component } from 'react';
import autoBind             from 'auto-bind';
import io                   from 'socket.io-client';
import FileSelector         from './fileSelector';
import Events from '../events';
import {Clients,Status}     from "../common";

import '../styles/photoPublisher.css'

const SOCKET_URL = "http://localhost:3231";
const NUM_OF_CHUNKS = 2;
export default class PhotoPublisher extends Component {

    constructor(){
        super();
        autoBind(this);

        this.state = {
            selectedFile: null,
            socket: null,
            transferStatus: Status.IDLE
        };
    }

    componentWillMount() {
        this._initSocket();
    }

    componentDidMount() {
        const {socket} = this.state;
        let self = this;
        socket.on(Events.PHOTO_RECEIVED, () => {
            self.setState({transferStatus: Status.DONE});
        });
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

    //get the chunk size based on the number if chunks
    _getChunksSize(file, remainder) {
        if(remainder === 0) {
            return file.size / NUM_OF_CHUNKS;
        }
        else {
            return Math.ceil(file.size / NUM_OF_CHUNKS);
        }
    }

    //start uploading the selected file
    _uploadPhoto() {
        console.log(this.state.selectedFile);
        this.setState({transferStatus: Status.SYNCING});
        this.state.socket.emit(Events.UPLOAD_STARTED, {numOfChunks: NUM_OF_CHUNKS});

        let file = this.state.selectedFile, reader = new FileReader();
        var remainder = file.size % NUM_OF_CHUNKS;
        var chunksSize = this._getChunksSize(file, remainder), stop = chunksSize, start = 0, index = 0;

        if (!file) {
            return;
        }

        //after each chunk read
        reader.onload = function(event) {
            //notify server
            self.state.socket.emit(Events.TRANSFERRING_DATA, {chunkData: event.target.result, index: index});
            index++;
            console.log('chunks sent: ' + index);
            //if there is more data to read
            if(start < file.size) {
                if(stop < file.size) {
                    readNextChunk();
                }
                else
                {
                    stop = file.size;
                    readNextChunk()
                }
            }
            else {
                //finished reading the file
                self.state.socket.emit(Events.TRANSFER_COMPLETED);
            }
        };

        let self = this;
        function readNextChunk() {
            var blob = file.slice(start, stop);

            // reader.readAsDataURL(blob);
            reader.readAsArrayBuffer(blob);
            // reader.readAsBinaryString(blob);

            start+= chunksSize;
            stop = start+chunksSize;
        }

        readNextChunk();
    }

    _renderStatus() {
        let status = null;
        switch (this.state.transferStatus) {
            case Status.SYNCING:
                status = (
                    <div className="uploading"/>
                )
                break;
            case Status.DONE:
            case Status.IDLE:
                status = (
                    <div>
                        <input type="button" className={"upload-btn " + (this.state.selectedFile ? "" : "disabled")}
                           disabled={!this.state.selectedFile} value="Upload file" onClick={this._uploadPhoto}/>
                    </div>
                )
                break;
        }

        return status;
    }

    render() {
        let fileName = this.state.selectedFile ? this.state.selectedFile.name : "Select file to upload";
        return <div className="container">
            <FileSelector fileName={fileName} onSelectPhoto={this._selectPhoto}/>
            { this._renderStatus() }
        </div>
    }
}
