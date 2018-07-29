import React, { Component } from 'react';
import autoBind             from 'auto-bind';
import io                   from 'socket.io-client';
import Events from '../events';
import Clients from '../clients';

const SOCKET_URL = "http://192.168.0.15:3231";
export default class PhotoReceiver extends Component {

    constructor(){
        super();
        autoBind(this);

        this.state = {
            socket: null,
            numOfPartsArriving: 0
        };
    }

    componentWillMount() {
        this._initSocket();
    }

    componentDidMount() {
        const { socket } = this.state;
        socket.on(Events.UPLOAD_STARTED, (data) => {
            this.setState({numOfPartsArriving: data.numOfParts});
        });
    }

    _initSocket() {
        const socket = io(SOCKET_URL);
        socket.on('connect', () => {
            socket.emit(Events.CLIENT_CONNECTED, {name: Clients.RECEIVER});
        });
        this.setState({socket});
    }


    render() {
        return (
            <div className="container">
                <span>number of parts arriving is:</span>
                <span>{ this.state.numOfPartsArriving }</span>
                </div>
        );
    }
}
