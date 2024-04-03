audio = new Audio();
trackName = document.querySelector('#titleoftrack')
artistName = document.querySelector('#authoroftrack')
albumimg = document.querySelector('#albumimg')

curr_time = document.querySelector('#currenttime')
total_duration = document.querySelector('#fulltime')
seek_slider = document.querySelector('#seekbar')

let updateTimer;

function profilepage() {
    console.log("profile page");
    $.ajax({
        url: "profile/", // url запроса
        method: 'GET',
        dataType: 'html',
        success: function (data) {
            let parser = new DOMParser();
            let dom_document = parser.parseFromString(data, "text/html");

            // Extract head and body elements
            let head_element = dom_document.querySelector("head");
            let body_element = dom_document.querySelector("body");

            // Update head and body of the current page
            $('head').html(head_element.innerHTML);
            $('#page').html(body_element.innerHTML);
        }
    });
}
function mainpage() {
    console.log("main page");
    $.ajax({
        url: "/", // url запроса
        method: 'GET',
        dataType: 'html',
        success: function (data) {
            let parser = new DOMParser();
            let dom_document = parser.parseFromString(data, "text/html");

            // Extract head and body elements
            let head_element = dom_document.querySelector("head");
            let body_element = dom_document.querySelector("#page");

            // Update head and body of the current page
            $('head').html(head_element.innerHTML);
            $('#page').html(body_element.innerHTML);
        }
    });
}

function artistpage(name) {
    console.log("artist page");
    $.ajax({
        url: "artist/" + name, // url запроса
        method: 'GET',
        dataType: 'html',
        success: function (data) {
            let parser = new DOMParser();
            let dom_document = parser.parseFromString(data, "text/html");

            // Extract head and body elements
            let head_element = dom_document.querySelector("head");
            let body_element = dom_document.querySelector("body");

            // Update head and body of the current page
            $('head').html(head_element.innerHTML);
            $('#page').html(body_element.innerHTML);
        }
    });
}

function albumpage(name) {
    console.log("album page");
    $.ajax({
        url: "album/" + name, // url запроса
        method: 'GET',
        dataType: 'html',
        success: function (data) {
            let parser = new DOMParser();
            let dom_document = parser.parseFromString(data, "text/html");

            // Extract head and body elements
            let head_element = dom_document.querySelector("head");
            let body_element = dom_document.querySelector("body");

            // Update head and body of the current page
            $('head').html(head_element.innerHTML);
            $('#page').html(body_element.innerHTML);
        }
    });
}

function play() {
    return audio.paused ? audio.play() : audio.pause();
}

function isplay(artist, track, image) {
    clearInterval(updateTimer);
    resetValues();
    audio.src = "static/music/" + artist + "/" + track + ".mp3";
    trackName.textContent = track;
    artistName.textContent = artist;
    albumimg.src = image;

    updateTimer = setInterval(seekUpdate, 1000);

    return audio.paused ? audio.play() : audio.pause();
}

function resetValues() {
    curr_time.textContent = "00:00";
    total_duration.textContent = "00:00";
    seek_slider.value = 0;
}


function seekTo() {
    // Calculate the seek position by the
    // percentage of the seek slider 
    // and get the relative duration to the track
    seekto = audio.duration * (seek_slider.value / 100);

    // Set the current track position to the calculated seek position
    audio.currentTime = seekto;
}

function seekUpdate() {
    let seekPosition = 0;

    // Check if the current track duration is a legible number
    if (!isNaN(audio.duration)) {
        seekPosition = audio.currentTime * (100 / audio.duration);
        seek_slider.value = seekPosition;

        // Calculate the time left and the total duration
        let currentMinutes = Math.floor(audio.currentTime / 60);
        let currentSeconds = Math.floor(audio.currentTime - currentMinutes * 60);
        let durationMinutes = Math.floor(audio.duration / 60);
        let durationSeconds = Math.floor(audio.duration - durationMinutes * 60);

        // Add a zero to the single digit time values
        if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
        if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
        if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
        if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

        // Display the updated duration
        curr_time.textContent = currentMinutes + ":" + currentSeconds;
        total_duration.textContent = durationMinutes + ":" + durationSeconds;
    }
}