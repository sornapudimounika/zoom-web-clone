// javascript of the front end is going to live here.

const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
const socket = io('/');
// const closeButton = document.getElementById('leave_meeting');

myVideo.muted = true;

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3030'
});

let myVideoStream;

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video);
}

navigator.mediaDevices.getUserMedia({
    video : true,
    audio : true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream);
        })
    })

    socket.on('user-connected', (userId) => {
        // connecToNewUser(userId, stream);
        setTimeout(() => {
            connecToNewUser(userId, stream)
        }, 1000)
    })
    

    let text = $('input')

    $('html').keydown((e) => {
        if (e.which == 13 && text.val().length !== 0) {
            socket.emit('message', text.val());
            text.val('');
        }   
    });

    socket.on('createMessage', message => {
        // console.log("create a mssg", message);
        $('ul').append(`<li class="message"><b>user</b><br/>${message}</li>`)
        scrollToBottom()
    })

})


peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
})


const connecToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    })
}

const scrollToBottom = () => {
    let d = $('.main__chat_window');
    d.scrollTop(d.prop("scrollHeight"));
}

const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if(enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    }
    else {
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

const setMuteButton = () => {
    const html = `
        <i class="fa-solid fa-microphone"></i>
        <span> Mute </span>
        `;

    document.querySelector('.main__mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
    const html = `
        <i class="unmute fa-solid fa-microphone-slash"></i>
        <span> Unmute </span>
        `;
    document.querySelector('.main__mute_button').innerHTML = html;
}

const playStop = () => {
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if(enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo()
    }
    else {
        setStopVideo()
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}

const setStopVideo = () => {
    const html = `
        <i class="fa-solid fa-video"></i>
        <span> Stop Video </span>
    `;
    document.querySelector('.main__video_button').innerHTML = html;
}

const setPlayVideo = () => {
    const html = `
        <i class="stop fa-solid fa-video-slash"></i>
        <span> Play Video </span>
    `;
    document.querySelector('.main__video_button').innerHTML = html;
}


// const closeTab = () => {
//     closeButton.addEventListener('click', () => {
//     socket.emit('close-tab'); // Still emit the event for server-side awareness
//     window.location.href = 'https://www.google.com/'; // Replace with the desired URL to redirect to
//   });
// }