class PeerSerive {
  constructor() {
    if (!this.peer) {
      this.peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      });
    }
  }

  async getOffer(){
    if(this.peer){
      const offer = await this.peer.createOffer()
      await this.peer.setLocalDescription(new RTCSessionDescription(offer))
      return offer;

    }
  }



  async getAnswer(offer) {
  if (this.peer) {
    await this.peer.setRemoteDescription(new RTCSessionDescription(offer)); 
    const ans = await this.peer.createAnswer();
    await this.peer.setLocalDescription(new RTCSessionDescription(ans));
    return ans;
  }
}


  async setRemoteDescription(ans){
    if(this.peer){
      await this.peer.setRemoteDescription(new RTCSessionDescription(ans))
      return;
    }
  }
}

export default new PeerSerive()