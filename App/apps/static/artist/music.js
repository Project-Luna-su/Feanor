let updateTimer;

audio = new Audio();
trackName = document.querySelector('#titleoftrack')
artistName = document.querySelector('#authoroftrack')
albumimg = document.querySelector('#albumimg')
playbtn = document.querySelector('#playbtn')
repeatbtn = document.querySelector('#repeatbtn')
likebtn = document.querySelector("#likebtn")

curr_time = document.querySelector('#currenttime')
total_duration = document.querySelector('#fulltime')
seek_slider = document.querySelector('#seekbar')

function profilepage() {
    console.log("load page");
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
            loadOwl();
        }
    });
}

function loadpage(url) {
    console.log("artist page");
    $.ajax({
        url: url, // url запроса
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
            loadOwl();
        },
        error: function (jqXHR, exception) {
            if (jqXHR.status === 0) {
                alert('Not connect. Verify Network.');
            } else if (jqXHR.status == 404) {
                alert('Requested page not found (404).');
            } else if (jqXHR.status == 500) {
                url = "/profile/" + url.split("/")[2]
                loadpage(url);
            } else if (exception === 'parsererror') {
                alert('Requested JSON parse failed.');
            } else if (exception === 'timeout') {
                alert('Time out error.');
            } else if (exception === 'abort') {
                alert('Ajax request aborted.');
            } else {
                alert('Uncaught Error. ' + jqXHR.responseText);
            }
        }
    });
}

function play() {
    if (audio.paused) {
        audio.play()
        playbtn.innerHTML = '<i class="bi bi-pause-fill"></i>'
    } else {
        audio.pause()
        playbtn.innerHTML = '<i class="bi bi-play-fill"></i>'
    }
}

function loop() {
    if (audio.loop) {
        audio.loop = false;
        repeatbtn.innerHTML = '<i class="bi bi-repeat"></i>'
    }
    else {
        audio.loop = true;
        repeatbtn.innerHTML = '<i class="bi bi-repeat-1"></i>'
    }
}

function like() {
    if (likebtn.innerHTML == '<i class="bi bi-star-fill"></i>') {
        likebtn.innerHTML = '<i class="bi bi-star"></i>'
    }
    else {
        likebtn.innerHTML = '<i class="bi bi-star-fill"></i>'
    }

}

function isplay(artist, track, image) {
    clearInterval(updateTimer);
    resetValues();
    audio.src = "/static/music/" + artist.toLowerCase() + "/" + track.toLowerCase() + ".mp3";
    trackName.textContent = track;
    artistName.textContent = artist;
    albumimg.src = image;

    updateTimer = setInterval(seekUpdate, 1000);

    if (audio.paused) {
        audio.play()
        playbtn.innerHTML = '<i class="bi bi-pause-fill"></i>'
    } else {
        audio.pause()
        playbtn.innerHTML = '<i class="bi bi-play-fill"></i>'
    }
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

function loadOwl() {
    var owl = $('#artistisowl');
    var owlu = $('#userisowl');
    $.ajaxSetup({ cache: false });
    $(document).ready(function () {
        if ($(window).width() < 1000) {
            if ($(window).width() < 700) {
                if ($(window).width() < 500) {
                    $(".owl-carousel").owlCarousel({
                        items: 2,
                        loop: true,
                    });
                } else {
                    $(".owl-carousel").owlCarousel({
                        items: 3,
                        loop: true,
                    });
                }
            }
            else {
                $(".owl-carousel").owlCarousel({
                    items: 3,
                    loop: true,
                });
            }
        }
        else {
            $(".owl-carousel").owlCarousel({
                items: 6,
                loop: true,
            });
        }
        owl.on('mousewheel', '.owl-stage', function (e) {
            if (e.deltaY > 0) {
                owl.trigger('next.owl');
            } else {
                owl.trigger('prev.owl');
            }
            e.preventDefault();
        });
        owlu.on('mousewheel', '.owl-stage', function (e) {
            if (e.deltaY > 0) {
                owlu.trigger('next.owl');
            } else {
                owlu.trigger('prev.owl');
            }
            e.preventDefault();
        });
    });
}

loadOwl();