function makeDriver() {

    function mkBlack() {
        var b = document.createElement('div');
        b.setAttribute('style',
                       'width: 100vw; height: 100vh; background-color: black;'
                       + 'position: absolute; top: 0; left: 0');
        b.style.display = 'none';
        document.body.prepend(b);
        return b;
    }

    var blackoutSlide = mkBlack();

    function toogleBlack() {
        if (blackoutSlide.style.display === 'none')
            blackoutSlide.style.display = 'block';
        else
            blackoutSlide.style.display = 'none';
    }
    
    function returnEmptyIfPrintMode() {
        if (window.location.href.indexOf('print') !== -1) {
            return function() { };
        }
    }

    returnEmptyIfPrintMode();

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
                    "34": nextSlide,
                    "37": previousSlide,
                    "33": previousSlide,
                    "190": toogleBlack}[key];
        if (func)
            func();
    }

    function getSlides() {
        return document.getElementById("outer")
            .getElementsByClassName("slide");
    }

    function setBrowserAddressForReload() {
        var title = window.document.title + " (" + currentSlide.toString() + ")";
        window.history.pushState("", title, parseUrl().base + "?" + currentSlide.toString());
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
            setBrowserAddressForReload();
        }
    }

    function previousSlide() {
        var prev = currentSlide - 1;
        if (prev >= 0){
            currentSlide = prev;
            setVisibility();
            setBrowserAddressForReload();
        }
    }

    function slideDiv(i) {
        var div = document.createElement('div');
        div.className = 'slidenum';
        div.appendChild(document.createTextNode(i.toString()));
        return div;
    }
    
    function addSlideNumbers() {
        console.log("Adding slide numbers!");
        var slides = getSlides();
        for (let i = 1; i < slides.length; i += 1) {
            slides[i].appendChild(slideDiv(i))
            console.log(slideDiv(i));
        }
    }

    setVisibility();
    addSlideNumbers();
    return uniKeyCode;
}

window.onload = function() {
    document.onkeydown = makeDriver();
};
