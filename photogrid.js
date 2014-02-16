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
var imagesHorizontal = 3;
var imagesVertical = 3;

var canvas;
var imagePadding;
var imageWidth;
var imageHeight;

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

function get_random(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function randomize_images(callback) {
    var allowDuplicates = document.getElementById('allow-duplicates').checked;

    loadImages(function() {
	//Clone the image objects array so we don't
	//need to remove cached objects from the original
	//if we don't want duplicates
	var imagePool = imageObjects.splice(0);

	for (var x = 0; x < imagesHorizontal; x++) {
	    for (var y = 0; y < imagesVertical; y++ ) {
		var chosenImage = get_random(imagePool);

		if (!allowDuplicates) {
		    imagePool.splice(imagePool.indexOf(chosenImage), 1);
		}

		imageGrid[x][y] = chosenImage;
	    }
        }
	callback();
    });
}

function resize_canvas() {
    canvas.width = canvas.parentNode.offsetWidth;
    canvas.height = canvas.parentNode.offsetHeight;

    imagePadding = parseInt(document.getElementById('border').value);

    if (document.getElementById('maintain-aspect-ratio').checked) {
	var imageAspectRatio = imageGrid[0][0].width / imageGrid[0][0].height;
	var canvasAspectRatio = canvas.width / canvas.height;

	imageWidth = (canvas.width / imagesHorizontal) - (imagePadding * imagesHorizontal);
	imageHeight = imageWidth / imageAspectRatio;

	var totalImagesHeight = imagesVertical * (imageHeight + imagePadding) + imagePadding;
	var realToCanvasScale = totalImagesHeight / canvas.height;

	if (realToCanvasScale > 1) {
	    imageHeight = (canvas.height / imagesVertical) - (imagePadding * imagesVertical);
	    imageWidth = imageWidth / realToCanvasScale;
	}
    } else {
	imageWidth = (canvas.width / imagesHorizontal) - (imagePadding * imagesHorizontal);
	imageHeight = (canvas.height / imagesVertical) - (imagePadding * imagesVertical);
    }
}

function layout_images() {
    canvas = document.getElementById("canvas");
    var ctx = canvas.getContext('2d');

    resize_canvas();

    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    var offsetX = (canvas.width - (imagesHorizontal * (imageWidth + imagePadding) + imagePadding)) / 2;
    var offsetY = (canvas.height - (imagesVertical * (imageHeight + imagePadding) + imagePadding)) / 2;
    for (var x = 0; x < imagesHorizontal; x++) {
	for (var y = 0; y < imagesVertical; y++ ) {
	    var imageX = offsetX + (x * (imageWidth + imagePadding) + imagePadding);
	    var imageY = offsetY + (y * (imageHeight + imagePadding) + imagePadding);
	    ctx.drawImage(imageGrid[x][y], imageX, imageY, imageWidth, imageHeight);
	}
    }
}

function download_canvas(link) {
    link.href = document.getElementById('canvas').toDataURL();
    link.download = 'collage.png';
}

function init() {
    randomize_images(layout_images);

    window.onresize = function() {
	layout_images();
    };

    document.getElementById('download-button').addEventListener('click', function() {
	download_canvas(this);
    }, false);

    document.getElementById('reroll-button').addEventListener('click', function() {
	randomize_images(layout_images);
    }, false);

    document.getElementById('allow-duplicates').addEventListener('click', function() {
	randomize_images(layout_images);
    }, false);
}
