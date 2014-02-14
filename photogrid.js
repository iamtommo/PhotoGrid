var imageSources = ["images/b00000338_21i40a_20130625_093646e.jpg",
		    "images/b00000343_21i40a_20130625_093847e.jpg",
		    "images/b00000353_21i40a_20130625_094249e.jpg",
		    "images/b00000422_21i40a_20130625_101031e.jpg",
		    "images/b00000425_21i40a_20130625_101142e.jpg",
		    "images/b00000470_21i40a_20130625_102945e.jpg",
		    "images/b00000564_21i40a_20130625_110813e.jpg",
		    "images/b00000578_21i40a_20130625_111352e.jpg",
		    "images/b00000641_21i40a_20130625_113912e.jpg",
		    "images/b00000730_21i40a_20130625_121521e.jpg",
		    "images/b00000730_21i40a_20130625_121521e.jpg",
		    "images/b00000730_21i40a_20130625_121521e.jpg",
		    "images/b00000892_21i40a_20130625_131807e.jpg",
		    "images/b00000988_21i40a_20130625_135700e.jpg",
		    "images/b00001002_21i40a_20130625_140240e.jpg",
		    "images/b00001145_21i40a_20130625_150022e.jpg",
		    "images/b00001542_21i40a_20130625_174622e.jpg",
		    "images/b00001641_21i40a_20130625_184934e.jpg",
		    "images/b00001671_21i40a_20130625_195846e.jpg",
		    "images/b00001685_21i40a_20130625_202209e.jpg",
		    "images/b00001744_21i40a_20130625_212824e.jpg"];
var imageObjects = [];
var imageGrid = [new Array(3), new Array(3), new Array(3)];

var canvas;

function loadImages(callback) {
    var loadedImages = 0;
    var numImages = 0;

    for(var src in imageSources) {
	numImages++;
    }
    for(var src in imageSources) {
	imageObjects[src] = new Image();
	imageObjects[src].onload = function() {
	    if(++loadedImages >= numImages) {
		callback();
	    }
	};
	imageObjects[src].src = imageSources[src];
    }
}

function randomize_images(callback) {
    loadImages(function() {
	for (var x = 0; x < 3; x++) {
	    for (var y = 0; y < 3; y++ ) {
		imageGrid[x][y] = imageObjects[Math.floor(Math.random() * imageObjects.length)];
	    }
        }
	callback();
    });
}

function resize_canvas() {
    canvas.width = canvas.parentNode.offsetWidth;
    canvas.height = canvas.parentNode.offsetHeight;
}

function layout_images() {
    canvas = document.getElementById("canvas");
    var ctx = canvas.getContext('2d');

    resize_canvas();

    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    var imagePadding = 4;
    var imageWidth = (canvas.width / 3) - (imagePadding * 3);
    var imageHeight = (canvas.height / 3) - (imagePadding * 3);

    for (var x = 0; x < 3; x++) {
	for (var y = 0; y < 3; y++ ) {
	    var imageX = x * (imageWidth + imagePadding) + imagePadding;
	    var imageY = y * (imageHeight + imagePadding) + imagePadding;
	    ctx.drawImage(imageGrid[x][y], imageX, imageY, imageWidth, imageHeight);
	}
    }
}

function download_canvas(link) {
    link.href = document.getElementById('canvas').toDataURL();
    link.download = 'images.png';
}

function init() {
    randomize_images(layout_images);

    window.onresize = function() {
	resize_canvas();
	layout_images();
    };

    document.getElementById('download-button').addEventListener('click', function() {
	download_canvas(this);
    }, false);

    document.getElementById('reroll-button').addEventListener('click', function() {
	randomize_images(layout_images);
    }, false);
}
