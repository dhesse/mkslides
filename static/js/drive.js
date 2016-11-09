function makeDriver() {

    if (window.location.href.indexOf('print') !== -1) {
        console.log("Printing mode!");
        return function() { };
    }

    function parseUrl() {
        var urlparts = window.location.href.split("?");
        return { base: urlparts[0],
                 slide: parseInt(urlparts[1] || "0") };
    }

    var currentSlide = parseUrl().slide;

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
        var slides = getSlides();
        for (var i = 0; i < slides.length; i += 1){
            if (i != currentSlide)
                slides[i].style.display = "none";
            else
                slides[i].style.display = "block";
        }
    }

    function nextSlide() {
        var next = currentSlide + 1;
        if (next < getSlides().length){
            currentSlide = next;
            console.log(next);
            setVisibility();
        }
    }

    function previousSlide() {
        var prev = currentSlide - 1;
        if (prev >= 0){
            currentSlide = prev;
            setVisibility();
        }
    }

    setVisibility();
    return uniKeyCode
}

window.onload = function() {
    document.onkeypress = makeDriver();
};
