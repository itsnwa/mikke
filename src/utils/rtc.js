// 1. Data
// currentRoom: null,
//       peerConnection: null,
//       localStream: null,
//       remoteStream: null,
//       roomDialog: null,
//       roomId: null,
//       configuration: {
//         iceServers: [
//           {
//             urls: [
//               "stun:stun1.l.google.com:19302",
//               "stun:stun2.l.google.com:19302"
//             ]
//           }
//         ],
//         iceCandidatePoolSize: 10
//       }

// 2. Create room function

// this.peerConnection = new RTCPeerConnection(this.configuration)
//       this.registerPeerConnectionListeners()

//       this.localStream.getTracks().forEach(track => {
//         this.peerConnection.addTrack(track, this.localStream)
//       })

//       // Code for collecting ICE candidates
//       const callerCandidatesCollection = roomRef.collection("callerCandidates")

//       this.peerConnection.addEventListener("icecandidate", event => {
//         if (!event.candidate) {
//           console.log("Got final candidate!")
//           return
//         }
//         console.log("Got candidate: ", event.candidate)
//         callerCandidatesCollection.add(event.candidate.toJSON())
//       })

//       // Code for creating a room
//       const offer = await this.peerConnection.createOffer()
//       await this.peerConnection.setLocalDescription(offer)
//       console.log("Created offer:", offer)

//       const roomWithOffer = {
//         offer: {
//           type: offer.type,
//           sdp: offer.sdp
//         }
//       }
//       await roomRef.set(roomWithOffer)
//       this.roomId = roomRef.id
//       console.log(`New room created with SDP offer. Room ID: ${roomRef.id}`)
//       this.currentRoom = roomRef.id

//       this.peerConnection.addEventListener("track", event => {
//         console.log("Got remote track:", event.streams[0])
//         event.streams[0].getTracks().forEach(track => {
//           console.log("Add a track to the remoteStream:", track)
//           this.remoteStream.addTrack(track)
//         })
//       })

//       // Listening for remote session description
//       roomRef.onSnapshot(async snapshot => {
//         const data = snapshot.data()
//         if (!this.peerConnection.currentRemoteDescription && data.answer) {
//           console.log("Got remote description: ", data.answer)
//           const rtcSessionDescription = new RTCSessionDescription(data.answer)
//           await this.peerConnection.setRemoteDescription(rtcSessionDescription)
//         }
//       })

//       // Listen for remote ICE candidates
//       roomRef.collection("calleeCandidates").onSnapshot(snapshot => {
//         snapshot.docChanges().forEach(async change => {
//           if (change.type === "added") {
//             let data = change.doc.data()
//             console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`)
//             await this.peerConnection.addIceCandidate(new RTCIceCandidate(data))
//           }
//         })
//       })
//     },

//     registerPeerConnectionListeners() {
//       this.peerConnection.addEventListener("icegatheringstatechange", () => {
//         console.log(
//           `ICE gathering state changed: ${this.peerConnection.iceGatheringState}`
//         )
//       })

//       this.peerConnection.addEventListener("connectionstatechange", () => {
//         console.log(
//           `Connection state change: ${this.peerConnection.connectionState}`
//         )
//       })

//       this.peerConnection.addEventListener("signalingstatechange", () => {
//         console.log(
//           `Signaling state change: ${this.peerConnection.signalingState}`
//         )
//       })

//       this.peerConnection.addEventListener("iceconnectionstatechange ", () => {
//         console.log(
//           `ICE connection state change: ${this.peerConnection.iceConnectionState}`
//         )
//       })
//     }

// Get user media
// const stream = await navigator.mediaDevices.getUserMedia({
//     video: true,
//     audio: true
//   })
//   this.localStream = stream
//   this.remoteStream = new MediaStream()
