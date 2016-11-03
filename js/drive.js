function parseUrl() {
    var urlparts = window.location.href.split("?");
    return { base: urlparts[0],
             slide: parseInt(urlparts[1] || "0") };
}

function uniKeyCode(event) {
    var key = event.keyCode || event.which;
    console.log("Unicode KEY code: " + key);
    var func = {"39": nextSlide,
                "37": previousSlide}[key];
    func();
}

function getSlides() {
    return document.getElementById("outer")
        .getElementsByClassName("slide");
}

function setVisibility() {
    var urlInfo = parseUrl();
    var slides = getSlides();
    for (var i = 0; i < slides.length; i += 1){
        if (i != urlInfo.slide) {
            slides[i].style.display = "none";
        }
    }
}

function nextSlide() {
    var urlInfo = parseUrl();
    var next = urlInfo.slide + 1;
    if (next < getSlides().length)
        window.location.href = urlInfo.base + "?" + next.toString();
}

function previousSlide() {
    var urlInfo = parseUrl();
    var prev = urlInfo.slide - 1;
    if (prev >= 0)
        window.location.href = urlInfo.base + "?" + prev.toString();
}

window.onload = function() {
    document.onkeypress = uniKeyCode;
    setVisibility();
};
