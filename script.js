const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
let localStream, remoteStream;
let pc;

// Function to start the call
async function startCall() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;

        const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
        pc = new RTCPeerConnection(configuration);

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                // Send the candidate to the remote peer
            }
        };

        pc.onaddstream = (event) => {
            remoteVideo.srcObject = event.stream;
        };

        pc.addStream(localStream);

        // Create an offer
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        // Send the offer to the remote peer
    } catch (error) {
        console.error('Error starting the call:', error);
    }
}

// Function to end the call
function endCall() {
    if (pc) {
        pc.close();
    }
    localStream.getTracks().forEach(track => track.stop());
    localVideo.srcObject = null;
    remoteVideo.srcObject = null;
    startButton.disabled = false;
    stopButton.disabled = true;
}

startButton.addEventListener('click', () => {
    startCall();
    startButton.disabled = true;
    stopButton.disabled = false;
});

stopButton.addEventListener('click', () => {
    endCall();
    startButton.disabled = false;
    stopButton.disabled = true;
});
