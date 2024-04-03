audio = new Audio();
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
            let body_element = dom_document.querySelector("body");

            // Update head and body of the current page
            $('head').html(head_element.innerHTML);
            $('body').html(body_element.innerHTML);
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

function isplay(artist,track) {
    audio = new Audio("static/music/"+artist+"/"+track+".mp3");
    return audio.paused ? audio.play() : audio.pause();
}