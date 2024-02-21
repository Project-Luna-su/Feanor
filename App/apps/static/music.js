let currentMusic = 0;

const music = document.getElementById('audio');
const seekBar = document.getElementById('seekbar');
const songName = document.getElementById('titleoftrack');
const artistName = document.getElementById('authoroftrack');
const disk = document.getElementById('albumimg');
const currentTime = document.getElementById('currenttime');
const musicDuration = document.getElementById('fulltime');
const playBtn = document.getElementById('playbtn');
const forwardBtn = document.getElementById('nextbtn');
const backwardBtn = document.getElementById('prevbtn');

playBtn.addEventListener('click', function () {
    this.classList.toggle('playing');
});

function play() {
    if (audio.paused || audio.ended) {
        playBtn.title = "Pause";
        audio.play()
     } else {
        playBtn.title = "Play";
        audio.pause();
     }
}

playBtn.addEventListener('click', () => {
    play()
})
