function makeDriver() {

    function addInputKeyListeners() {
        var inputs = document.querySelectorAll('input.python');
        var ctrlStatus = false;
        var altStatus = false;
        for (let i = 0; i < inputs.length; i += 1) {
            var input = inputs[i];
            input.onkeydown = function(event) {
                var key = event.keyCode || evnt.which;
                if (key == 17) 
                    ctrlStatus = true;
                if (key == 18)
                    altStatus = true;
                if (key == 13 && (ctrlStatus || altStatus)) {
                    var xhr = new XMLHttpRequest();
                    xhr.open('POST', '/python', true);
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.onreadystatechange = function() {
                        console.log(xhr.responseText);
                    }
                    var msg = {code: input.value,
                               kernel: input.kernel};
                    xhr.send(JSON.stringify(msg));
                }
            };
            input.onkeyup = function(event) {
                var key = event.keyCode || evnt.which;
                if (key == 17) 
                    ctrlStatus = false;
                if (key == 18)
                    altStatus = false;
            };
        };
    }

    addInputKeyListeners();
    
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
    
    if (window.location.href.indexOf('print') !== -1) {
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
        //console.log("Unicode KEY code: " + key);
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
        var slides = getSlides();
        for (let i = 1; i < slides.length; i += 1)
            slides[i].appendChild(slideDiv(i))
    }

    setVisibility();
    addSlideNumbers();
    return uniKeyCode;
}

window.onload = function() {
    document.onkeydown = makeDriver();
};
