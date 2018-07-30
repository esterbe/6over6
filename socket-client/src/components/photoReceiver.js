import React, { Component } from 'react';
import autoBind             from 'auto-bind';
import io                   from 'socket.io-client';
import Events               from '../events';
import {Clients,Status}     from "../common";
import _                    from 'lodash';

import '../styles/photoReceiver.css'

const SOCKET_URL = "http://localhost:3231";
export default class PhotoReceiver extends Component {

    constructor(){
        super();
        autoBind(this);

        this.state = {
            socket: null,
            transferStatus: Status.IDLE,
            totalChunksArriving: 0,
            chunksReceived: 0,
            slices: [],
            objectURL: null
        };
    }

    componentWillMount() {
        this._initSocket();
    }

    componentDidMount() {
        const { socket } = this.state;
        let self = this;
        socket.on(Events.UPLOAD_STARTED, (data) => {
            self.setState({totalChunksArriving: data.numOfChunks, transferStatus: Status.SYNCING});
        });

        socket.on(Events.TRANSFERRING_DATA, (data) => {
            let chunksReceived = self.state.chunksReceived + 1;
            console.log("chunks received: " + chunksReceived);

            let slices = self.state.slices;
            slices.push(data);
            self.setState({transferStatus: Status.SYNCING, chunksReceived: chunksReceived, slices: slices});
        });

        socket.on(Events.TRANSFER_COMPLETED, () => {
            //TODO: join all slices into one image

            let sortedSlices = _.sortBy(self.state.slices, 'index').map(item => {
                return new Uint8Array(item.chunkData);
            });

            var newBlob = new Blob(sortedSlices, {type: 'image/jpeg'});
            var objectURL = URL.createObjectURL(newBlob);
            //var objectURL = '';
            self.setState({transferStatus: Status.DONE, totalChunksArriving: 0, chunksReceived: 0, slices: [], objectURL:objectURL});

            self.state.socket.emit(Events.PHOTO_RECEIVED);
        });
    }

    _initSocket() {
        const socket = io(SOCKET_URL);
        socket.on('connect', () => {
            socket.emit(Events.CLIENT_CONNECTED, {name: Clients.RECEIVER});
        });
        this.setState({socket});
    }

    _renderStatus() {
        let status;
        switch (this.state.transferStatus) {
            case Status.SYNCING:
                status = (
                    <div className="status">
                        <div className="syncing syncing-active"/>
                        <span>a photo is on it's way...</span>
                    </div>
                )
                break;
            case Status.DONE:
                break;
            default:
                status = (
                    <div className="status">
                        <span>Waiting for a photo</span>
                    </div>
                )
                break;
        }

        return status;
    }

    render() {
        return (
            <div className="container">
                { this._renderStatus() }
                <div className="displayPhoto">
                    {
                        (this.state.objectURL && this.state.transferStatus === Status.DONE) ?
                            <a target="_blank" href={this.state.objectURL}>
                                <img className='displayPhoto' src={this.state.objectURL} alt=""/>
                            </a>
                            : null
                    }
                </div>
            </div>
        );
    }
}
