'use strict';

var gPopWords = {};
var gMemeUrl;
var gCanvas = document.querySelector('.canvas');
var gCtx = gCanvas.getContext('2d');
var gImg;
var gTopTxt = {
    align: 'center',
    anchor: {
        x: gCanvas.width / 2,
        y: 80
    },
    size: 60,
    text: '',
    font: 'impact',
    color: 'white',
    shadow: ''
}

var gBottomTxt = {
    align: 'center',
    anchor: {
        x: gCanvas.width / 2,
        y: gCanvas.height - 120
    },
    size: 60,
    text: '',
    font: 'impact',
    color: 'white',
    shadow: ''
}
var gMemes = [
    { id: 1, url: '/assets/img/1.jpg', keywords: ['sean', 'bean', 'lord of the rings'] },
    { id: 2, url: '/assets/img/2.jpg', keywords: ['animal', 'awkward', 'seal'] },
    { id: 3, url: '/assets/img/3.jpg', keywords: ['fry', 'cartoon', 'futurama'] },
    { id: 4, url: '/assets/img/4.jpg', keywords: ['crazy', 'cartoon'] },
    { id: 5, url: '/assets/img/5.jpg', keywords: ['buzz', 'cartoon', 'space'] },
    { id: 6, url: '/assets/img/6.jpg', keywords: ['winter is coming', 'person', 'game of thrones'] },
    { id: 7, url: '/assets/img/7.jpg', keywords: ['person', 'cartoon', 'first world problems'] },
    { id: 8, url: '/assets/img/8.jpg', keywords: ['person', 'bad luck'] },
    { id: 9, url: '/assets/img/9.jpg', keywords: ['kermit', 'cartoon'] },
    { id: 10, url: '/assets/img/10.jpg', keywords: ['baby', 'success'] },
    { id: 11, url: '/assets/img/11.jpg', keywords: ['kid', 'you tell me'] },
    { id: 12, url: '/assets/img/12.jpg', keywords: ['star trek', 'picard'] }];


function appInit() {
    renderImgPreviews();
    waitForInput();
    // popSearch();
}


function burgerMenu() {
    var nav = document.getElementById('nav');
    if (nav.className === 'main-nav') {
        nav.className += ' responsive';
    } else {
        nav.className = 'main-nav';
    }
}

// renders meme gallery
function renderImgPreviews() {
    var strHtml = '';
    var elGallery = document.querySelector('.innerGallery');
    gMemes.forEach(function (meme) {
        // strHtml += '<div class="meme"><div class="hexagon meme' + meme.id
        //     + '" onclick="memePicked(' + meme.id + ')"><div class="hexTop"></div><div class="hexBottom"></div></div></div>';
        strHtml += '<li class="hex"><a class="hexIn" onclick="memePicked(' + meme.id + ')" href="#editor">' +
            '<img class="meme' + meme.id + '" /></a></li>';

    });
    //     <li class="hex">
    //     <a class="hexIn" href="#">
    //       <img src="https://farm9.staticflickr.com/8461/8048823381_0fbc2d8efb.jpg" alt="" />
    //       <h1>This is a title</h1>
    //       <p>Some sample text about the article this hexagon leads to</p>
    //     </a>
    //   </li>

    elGallery.innerHTML = strHtml;
    gMemes.forEach(function (meme) {
        var elMeme = document.querySelector('.meme' + meme.id);
        elMeme.src = meme.url;
    })
}

// filters meme gallery by search input
function filterImg() {
    var x = document.getElementById('search');
    var text = '';
    text += x.elements[0].value;

    var strHtml2 = '';
    var elGallery = document.querySelector('.innerGallery');
    var filterdImg = [];

    if (text === '') renderImgPreviews()
    else {
        gMemes.forEach(function (mem) {
            mem.keywords.forEach(function (element) {
                if (element === text) {
                    filterdImg.push(mem);
                }
            });

        });

        filterdImg.forEach(function (meme) {
            strHtml2 += '<div class="meme"><div class="hexagon meme' + meme.id
                + '" onclick="memePicked(' + meme.id + ')"><div class="hexTop"></div><div class="hexBottom"></div></div></div>';
        });

        elGallery.innerHTML = strHtml2;
        filterdImg.forEach(function (meme) {
            var elMeme = document.querySelector('.meme' + meme.id);
            elMeme.style.backgroundImage = 'url(' + meme.url + ')';
        })
    }
}
// to do: seperate top and bottom text while still keeping code DRY
function alignText(input, alignment, placement) {
    if (input === 'top') {
        gTopTxt.align = alignment;
        gTopTxt.anchor.x = placement;
    }
    else {
        gBottomTxt.align = alignment;
        gBottomTxt.anchor.x = placement;
    }
    drawOnCanvas();
}

function changeFontSize(input, modifier) {
    var increment = 5
    if (input === 'top') {
        if (modifier === '+') gTopTxt.size += increment
        else gTopTxt.size -= increment
    }
    else {
        if (modifier === '+') gBottomTxt.size += increment
        else gBottomTxt.size -= increment
    }
    drawOnCanvas();
}

function changeFontColor(input, color) {
    if (input === 'top') gTopTxt.color = color;
    else gBottomTxt.color = color;
    drawOnCanvas();
}

function changeFont(input, font) {
    if (input === 'top') gTopTxt.font = font;
    else gBottomTxt.font = font;
    drawOnCanvas();
}


function memePicked(memeId) {
    var elGallery = document.querySelector('.gallery');
    var elEditor = document.querySelector('.meme-editor');
    gMemes.forEach(function (meme) {
        if (memeId === meme.id) {
            gMemeUrl = meme.url;
            gImg = new Image();
            gImg.src = gMemeUrl;
        }
    });
    elEditor.style.visibility = 'visible';
    elEditor.style.height = 'auto'
    // elEditor.style.height = 400 + 'px'
    elEditor.style.marginBottom = '10px'
    drawOnCanvas();
}


// catches input in the meme editor text inputs
function waitForInput() {
    document.querySelector('.top-text-input').addEventListener('input', function () {
        gTopTxt.text = document.querySelector('.top-text-input').value.toUpperCase();
        drawOnCanvas();
    });
    document.querySelector('.bottom-text-input').addEventListener('input', function () {
        gBottomTxt.text = document.querySelector('.bottom-text-input').value.toUpperCase();
        drawOnCanvas();
    });
}

// sets image on canvas
function drawOnCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
    gImg = new Image();
    gImg.src = gMemeUrl;
    gImg.onload = function () {
        gCtx.drawImage(gImg, 0, 0, gCanvas.width, gCanvas.height);
        // writeText(gTopTxt);
        // writeText(gBottomTxt);
        wrapText(gTopTxt, 'top');
        wrapText(gBottomTxt, 'bottom');
    }
}

function wrapText(text, loc) {
    gCtx.font = text.size + 'px ' + text.font;
    gCtx.textAlign = text.align;
    gCtx.fillStyle = text.color;
    var y = text.anchor.y
    var words = text.text.split(' ');
    var line = '';

    for (var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = gCtx.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > gCanvas.width - 50 && n > 0) {
            gCtx.fillText(line, text.anchor.x, y);
            line = words[n] + ' ';
            y += text.size + 1;
        }
        else {
            line = testLine;
        }
    }
    gCtx.fillText(line, text.anchor.x, y);

}


// writes text on canvas
function writeText(txt) {
    gCtx.font = txt.size + 'px ' + txt.font;
    gCtx.textAlign = txt.align;
    gCtx.fillStyle = txt.color;
    gCtx.fillText(txt.text, txt.anchor.x, txt.anchor.y);
}

function downloadImg(elLink) {
    elLink.href = gCanvas.toDataURL();
    elLink.download = 'Meme.jpg';
}

// function backToGallery() {
//     var elGallery = document.querySelector('.gallery');
//     var elEditor = document.querySelector('.meme-editor');
//     elGallery.style.visibility = 'visible';
//     elEditor.style.visibility = 'hidden';
//     elEditor.style.height = '0px';
// }

function sendLocalStorage() {

    var elConatacForm = document.getElementById('contact');
    var cnt = [
    ];
    cnt.name = elConatacForm.elements[0].value;
    cnt.email = elConatacForm.elements[1].value;
    cnt.subject = elConatacForm.elements[2].value;
    cnt.text = elConatacForm.elements[3].value;


    console.log(cnt);
    localStorage.setItem(cnt.name, JSON.stringify(cnt.name) + JSON.stringify(cnt.email)
        + JSON.stringify(cnt.subject) + JSON.stringify(cnt.text));
    elConatacForm.elements[0].value = '';
    elConatacForm.elements[1].value = '';
    elConatacForm.elements[2].value = '';
    elConatacForm.elements[3].value = '';

}
