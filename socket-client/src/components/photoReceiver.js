import React, { Component } from 'react';
import autoBind             from 'auto-bind';
import io                   from 'socket.io-client';

const SOCKET_URL = "http://192.168.0.15:3231";
export default class PhotoReceiver extends Component {

    constructor(){
        super();
        autoBind(this);

        this.state = {

        };
    }

    componentWillMount() {
        this._initSocket();
    }

    _initSocket() {
        // const socket = io(SOCKET_URL);
        // socket.on('connect', () => {
        //     console.log("Connected");
        // });
        // this.setState({socket});
    }


    render() {
        return (
            <div className="container">
                Ready to receive some photos!!
                {/*<div className="bar"></div>*/}
                {/*<FileSelector fileName={fileName} onSelectPhoto={this._selectPhoto}/>*/}
                {/*<img alt='' src="http://100dayscss.com/codepen/syncing.svg" className="syncing" />*/}
                {/*<img alt='' src="http://100dayscss.com/codepen/checkmark.svg" className="done" />*/}
                {/*<div className="upload-btn" onClick={this._uploadPhoto}>Upload file</div>*/}
            </div>
        );
    }
}
