"use strict";

// Global variables
var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
var images = ["../img/dog.jpg", "../img/elephant.jpg", null, "../img/operahouse.jpg", "../img/statue.jpg", 
    null];
var names = ["the dog", "the elephant", "the square", "the Sydney Opera House", "the statue", "the circle"];
var p = document.getElementById('prompt');
var currentImages = [];


// Constants
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const MAX_IMAGES = 3;
const MAX_PROMPTS = 9;
const DIMENSIONS = 100;

// Details about the game are stored as an object literal so we can change them through event listeners
const GAME = {clickedCorrectImage: false, points: 0, imagePointer: 0, numRounds: 0};

// To draw an image
function draw(xcoord, ycoord, src){
    var img = new Image();
    img.onload = function(){
        context.drawImage(img, xcoord, ycoord, DIMENSIONS, DIMENSIONS);
    }
    img.src = src;
}

function createShape(nameIn, randomX, randomY){
    if(nameIn == "the square"){
        var shape = {name: nameIn, filename: null, x: randomX, y: randomY};
    }
    else if(nameIn == "the circle"){
        var shape = {name: nameIn, filename: null, x: randomX, y: randomY, startX: randomX + DIMENSIONS/2,
        startY: randomY + DIMENSIONS/2};
    }
    return shape;
}

function drawShape(shape){
    if(shape.name == "the square"){
        context.fillStyle = "rgb(255,0,0)";
        context.beginPath();
            context.rect(shape.x, shape.y, DIMENSIONS, DIMENSIONS);
        context.fill();
    }
    else if(shape.name == "the circle"){
        context.fillStyle = "rgb(0,0,255)";
        context.beginPath();
            context.arc(shape.startX, shape.startY, DIMENSIONS/2, 0, Math.PI*2, true);
        context.fill();
    }
}

// Checks for any overlap between two images
function checkOverlap(x1, y1, x2, y2){
    // The two set coordinates that matter are the top left corner and the bottom right corner
    var topleft1 = {x: x1, y: y1 + DIMENSIONS};
    var topleft2 = {x: x2, y: y2 + DIMENSIONS};
    var bottomright1 = {x: x1 + DIMENSIONS, y: y1};
    var bottomright2 = {x: x2 + DIMENSIONS, y: y2};

    // So long as any one of these conditions are met then the two images are not overlapping
    if(topleft1.x > bottomright2.x || topleft2.x > bottomright1.x || topleft1.y < bottomright2.y || topleft2.y < bottomright1.y){
        return false;
    }
    else{
        return true;
    }
}

function checkSameImage(imgArray){
    if(imgArray[0].name == imgArray[1].name || imgArray[1].name == imgArray[2].name 
        || imgArray[0].name == imgArray[2].name){
        return true;
    }
    return false;
}

// Gets the x and y coord of the mouse and returns as object literal - needs referencing from slides????????? this is the only way to get the coords right??????
function getMouseXY(evt){
    var boundingRect = canvas.getBoundingClientRect();
    var offsetX = boundingRect.left;
    var offsetY = boundingRect.top;
    var w = (boundingRect.width-canvas.width)/2;
    var h = (boundingRect.height-canvas.height)/2;
    offsetX += w;
    offsetY += h;
    var mx = Math.round(evt.clientX-offsetX);
    var my = Math.round(evt.clientY-offsetY);
    return {x: mx, y: my}; 
}

// Checks whether an x and a y coord are within an image
function mouseInImage(x, y, img){
    return ((x >= img.x) && (x <= img.x + DIMENSIONS) && (y >= img.y) && (y <= img.y + DIMENSIONS))
}

// First function that will be called upon canvas click
function canvasClick(evt, currentImages){
    var pos = getMouseXY(evt);
    // If mouse is in an image - we only want to change things if an image has been clicked - nothing will happen if the canvas itself is clicked
    if(mouseInImage(pos.x, pos.y, currentImages[0]) || mouseInImage(pos.x, pos.y, currentImages[1]) || mouseInImage(pos.x, pos.y, currentImages[2])){
        // If mouse is in the correct image
        if(mouseInImage(pos.x, pos.y, currentImages[GAME.imagePointer])){
            GAME.clickedCorrectImage = true;
        }
        GAME.imagePointer++;
        GAME.numRounds++;
    }
}

// Clears the canvas and creates an array of images to be used in the current round.
function drawImages(){
    var randomX;
    var randomY;
    var randomIndex;
    context.clearRect(0, 0, WIDTH, HEIGHT);

    // Establish coordinates and images before drawing, making sure they don't overlap
    do{
        currentImages = []; // Should the loop repeat again we want to start all over again so clear the array
        for(let i = 0; i < MAX_IMAGES; i++){
            randomX = Math.round(Math.random()*(WIDTH - DIMENSIONS));
            randomY = Math.round(Math.random()*(HEIGHT - DIMENSIONS));
            randomIndex = Math.round(Math.random()*(images.length - 1));

            // Store the image as an object literal
            if(names[randomIndex] == "the square" || names[randomIndex] == "the circle"){
                var img = createShape(names[randomIndex], randomX, randomY);
            }
            else{
                var img = {name: names[randomIndex], filename: images[randomIndex], x: randomX, y: randomY};
            }
            currentImages.push(img);
        }
        var x1 = currentImages[0].x;
        var y1 = currentImages[0].y; 
        var x2 = currentImages[1].x; 
        var y2 = currentImages[1].y; 
        var x3 = currentImages[2].x; 
        var y3 = currentImages[2].y;  
    }while(checkOverlap(x1, y1, x2, y2) || checkOverlap(x1, y1, x3, y3) || checkOverlap(x2, y2, x3, y3) || checkSameImage(currentImages))

    // Draw all images and remove the ones already on the canvas from the images and names array
    for(let i = 0; i < MAX_IMAGES; i++){
        if(currentImages[i].filename != null){
            draw(currentImages[i].x, currentImages[i].y, currentImages[i].filename);
        }
        else{
            drawShape(currentImages[i]);
        }
    }
}

// What runs when the play button is pressed
function playGame(){
    var gameName = document.getElementById('inputName').value;
    // If name is empty or if user attempts to inject a script
    if(gameName == "" || gameName.includes("<") || gameName.includes("/>")){
        gameName = "Guest";
    }
    context.clearRect(0, 0, WIDTH, HEIGHT);
    drawImages();
    p.innerHTML = gameName + ", can you click on " + currentImages[GAME.imagePointer].name + "?";
    canvas.addEventListener('click', function(evt){
        canvasClick(evt, currentImages);

        // Because it checks for the end of the game first if the user gets the last image correct it will never update
        if(GAME.numRounds == MAX_PROMPTS && GAME.clickedCorrectImage){ 
            GAME.points++;
            p.innerHTML = "Well done " + gameName + "! You scored " + GAME.points + "/9 points! Press stop game to reset.";
        }
        else if(GAME.numRounds == MAX_PROMPTS){
            p.innerHTML = "Well done " + gameName + "! You scored " + GAME.points + "/9 points! Press stop game to reset.";
        }
        else{
            if(GAME.imagePointer == 3){
                if(GAME.clickedCorrectImage){
                    GAME.points++;
                }
                GAME.clickedCorrectImage = false;
                GAME.imagePointer = 0;
                drawImages();
                p.innerHTML = gameName + ", can you click on " + currentImages[GAME.imagePointer].name + "?";
            }
            else{
                if(GAME.clickedCorrectImage){
                    GAME.clickedCorrectImage = false;
                    GAME.points++;
                    p.innerHTML = "Well done, " + gameName + "! can you click on " + currentImages[GAME.imagePointer].name + "?";
                }
                else{
                    p.innerHTML = gameName + ", can you click on " + currentImages[GAME.imagePointer].name + "?";
                }
            }
        }
    });
}

// Button IDs
var playButton = document.getElementById('play');
var stopButton = document.getElementById('stop');


// Event listeners
playButton.addEventListener("click", playGame);

// Simply resetting all the variables relating to the game doesn't work so the best way to stop the game is by refreshing the page
stopButton.addEventListener("click", function(){location.reload()}); 