const socket = io('/')
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '443'
})

let myVideoStream
navigator.mediaDevices.getUserMedia({ // to get video and audio we use 
    video: true,
    audio: true
// promise is an event in the future it will be either resolved or rejected 
}).then(stream =>{
    myVideoStream = stream
    addVideoStream(myVideo, stream);

    peer.on('call', call =>{
        // And when the user calls us we answer it and we add it to the video stream
        call.answer(stream)
        const video = document.createElement('video')
        // this to add the videostream from the user 
        call.on('stream', userVideoStream =>{
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', (userId)=>{
        connectToNewUser(userId, stream);
    })

    let text = $('input')
    console.log(text)

    // this $ sign replaces JQuery as JQuery is not supported in bootstrap 5
    $('html').keydown((e) =>{
        // every key has a specific no and for enter it is 13 
        // So this if cond. means that if the user press enter and the 
        // the text value is not greater than equal to zero
        if(e.which == 13 && text.val.length !==0 ){
            // Emit will send the message on will recieve the message
            socket.emit('message', text.val());
            text.val('')
        }
    })

    socket.on('createMessage', message =>{
        console.log("Create message", message)
        // When any message comes it will be pass through li tag whic will have a class called message
        $("ul").append(`<li class="message"><b>user</b><br/>${message}</li>`);
        scrollToBottom()
    })
})

// This id is automatically generated by this peer
// userId is unique to every user 
peer.on('open', id =>{
    socket.emit('join-room', ROOM_ID, id);
})

const connectToNewUser = (userId, stream) =>{
    // We call the user
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream =>{
        addVideoStream(video, userVideoStream)
    })
}

// Doing this as we want to get video on the screen 
const addVideoStream = (video, stream) =>{
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () =>{
        video.play();
    })
    videoGrid.append(video);
}

const scrollToBottom = () => {
    let d = $('.main__chat_window');
    d.scrollTop(d.prop("scrollHeight"));
}

// this to mute our video
const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) 
    {
      myVideoStream.getAudioTracks()[0].enabled = false;
      setUnmuteButton();
    } 
    else 
    {
      setMuteButton();
      myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

const setMuteButton = () => {
    const html = `
    <i class="fa-solid fa-microphone-lines"></i>
    <span>Mute</span>
    `
document.querySelector('.main__mute_button').innerHTML = html;
}
  
const setUnmuteButton = () => {
const html = `
    <i class=" unmute fa-solid fa-microphone-lines-slash"></i>
    <span>Unmute</span>
    `
document.querySelector('.main__mute_button').innerHTML = html;
}

const playStop = () => {
    console.log('object')
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) 
    {
      myVideoStream.getVideoTracks()[0].enabled = false;
      setPlayVideo()
    } 
    else 
    {
      setStopVideo()
      myVideoStream.getVideoTracks()[0].enabled = true;
    }
  }
  
const setStopVideo = () => {
const html = `
    <i class="fa-solid fa-video"></i>
    <span>Stop Video</span>
    `
document.querySelector('.main__video_button').innerHTML = html;
}

const setPlayVideo = () => {
const html = `
    <i class="stop fa-solid fa-video-slash"></i>
    <span>Play Video</span>
    `
document.querySelector('.main__video_button').innerHTML = html;
}
  