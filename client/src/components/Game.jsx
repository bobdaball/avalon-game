import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//import game from '../scripts/game.js';

import webSockets from '../util/socketEventListeners';

class Game extends React.Component {
  constructor() {
    super();
  }
  /*Disabled because everyone starts with same color aside from user
  componentWillMount() {
    webSockets.userInit(this.props.socket);
  }*/
  componentDidMount() {
    var socket = this.props.socket;
    webSockets.gameInit(socket);

    //const peer = new Peer (this.socket.id, {host: 'ancient-caverns-19863.herokuapp.com', port: '', secure: 'true'});
    
    //Connection for audio
    //peer.on('open', function(id) {
    //});
    //var peers = webSockets.gameInit(socket);

    var webrtc = new SimpleWebRTC({
      localVideoEl: '',
      remoteVideosEl: '',
      autoRequestMedia: true,
      enableDataChannels: false,
      media: {
        audio: true,
        video: false
      },
      receiveMedia: { // FIXME: remove old chrome <= 37 constraints format
          offerToReceiveAudio: 1,
          offerToReceiveVideo: 0
      }
    });
    webrtc.on('readyToCall', ()=> {
      webrtc.joinRoom(this.props.roomNumber);
      //webrtc.joinRoom('hahaha');
    });





    $('.loading').removeClass('hidden');
    socket.emit('startGame', this.props.roomNumber, socket.id.slice(2));
    
    setTimeout(()=>{
      $('.loading').addClass('hidden'); 
    }, 10);

    webSockets.allListeners(socket, this.props.roomNumber);
  }
  render() {
    return ( 
      <div id="gameContainer"></div>
    );
  }
}

function mapStateToProps(state) {
  return {
    roomNumber: state.room.roomNumber,
    vrSetting: state.vrSetting.vrSetting
  };
}
function mapDispatchToProps(dispatch) {
  return {
    //login: bindActionCreators(login, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);


