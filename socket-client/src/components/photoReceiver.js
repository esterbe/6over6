import React, { Component } from 'react';
import autoBind             from 'auto-bind';
import io                   from 'socket.io-client';
import Events               from '../events';
import {Clients,Status}     from "../common";

import '../styles/photoReceiver.css'
import '../styles/app.css'


const SOCKET_URL = "http://192.168.0.15:3231";
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

            //var res = this._spliceBuffers(self.state.slices);
            //var blob = new Blob(res, {type: 'image/jpeg'} );
            //var newBlob = new Blob(self.state.slices, {type: 'image/jpeg'});
            //var objectURL = URL.createObjectURL(newBlob);
            var objectURL = '';
            self.setState({transferStatus: Status.DONE, totalChunksArriving: 0, chunksReceived: 0, slices: [], objectURL:objectURL});

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
                [<img alt='' className="syncing syncing-active"/>,
                    <span>a photo is on it's way...</span>]
                )
                break;
            case Status.DONE:
                status = (
                    <img alt='' className="done done-active"/>
                )
                break;
            default:
                status = (
                    <span>Waiting for a photo</span>
                )
                break;
        }

        return status;
    }

    render() {
        return (
            <div className="container">
                <div className="status">
                    { this._renderStatus() }
                </div>
                <div>
                    {
                        (this.state.objectURL) ?  <img alt="" src={this.state.objectURL}></img> : null
                    }
                </div>
            </div>
        );
    }
}
