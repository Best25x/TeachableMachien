// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Webcam Image Classification using a pre-trained customized model and p5.js
This example uses p5 preload function to create the classifier
=== */

// Classifier Variable
let classifier;
// Model URL
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/zkSfzjB2L/';

// Video
let vid;
let flippedVideo;
let rock_image, paper_image, scissors_image, computer_image;
let randomize;
let computer;
let winner, WINNER;
let player_score = 0;
let computer_score = 0;
// To store the classification
let label = "";

// Game State
const GAME_STATES = {
    INTRO : 0,
    DETECT_CAMERA : 1,
    SUBMIT_CAMERA : 2,
    END_SCREEN : 3
}
let game_state = 0;

// Load the model first
function preload() {
    classifier = ml5.imageClassifier(imageModelURL + 'model.json');
    rock_image = loadImage("static/images/rock.jpg");
    paper_image = loadImage("static/images/paper.jpg");
    scissors_image = loadImage("static/images/scissors.jpg");
}

function setup() {
    var canvas = createCanvas(320+450, 260+50+40+100);
    canvas.parent("sketch-holder");
    // Create the video
    vid = createCapture(VIDEO);
    vid.size(320, 240);
    vid.hide();

    flippedVideo = ml5.flipImage(vid)
    // Start classifying
    classifyVideo();
}

function keyPressed() {
    game_state++;
    if(game_state > 3) {
        game_state = 1;
    }
}

function draw() {
    background(255);
    if (game_state === GAME_STATES.INTRO) {
        fill(80);
        strokeWeight(0);
        rect((width/2)-(320/2),50,320,240);
        textSize(15);
        fill(255);
        textAlign(CENTER);
        text("Press [SPACE] to start video", width/2, (240/2)+50);
        fill(0);
        textSize(30);
        text("Your Webcam Feed",width/2,30);

        fontSize(20);
        let stringthing = player_score.toString()+"-"+computer_score.toString();
        text(stringthing,width/2,height-10);
    }
    if (game_state === GAME_STATES.DETECT_CAMERA) {
        // Draw video
        background(255);
        fill(0);
        rect((width/2)-(320/2),50,320,240);
        textSize(30);
        text("Your Webcam Feed",width/2,30);

        vid.play();
        image(flippedVideo, (width/2)-(320/2), 50);
        // Draw the label
        fill(0);
        textSize(16);
        textAlign(CENTER);
        text(label, width/2, 50+240+20);

        fontSize(20);
        let stringthing = player_score.toString()+"-"+computer_score.toString();
        text(stringthing,width/2,height-10);
    }
    if (game_state === GAME_STATES.SUBMIT_CAMERA) {

        // LOGIC

        if (label === "None") {
            game_state--;
        }
        randomize = 1;

        //DRAWING

        fill(0);
        textSize(30);
        text("Your Webcam Feed",320/2,30);
        text("Computer Decision",width-(320/2),30);
        vid.pause();
        image(flippedVideo,0,50);
        text(label, 320/2, 240-10+50+50);

        rect(width-320,50,320,240);
        textSize(15);
        fill(255);
        textAlign(CENTER);
        text("Press [SPACE] to reveal \ncomputer move", width-(320/2), (240/2)+50);


        fontSize(20);
        let stringthing = player_score.toString()+"-"+computer_score.toString();
        text(stringthing,width/2,height-10);
    }
    if (game_state === GAME_STATES.END_SCREEN) {

        // LOGIC

        let labels = ["Rock","Paper",'Scissors'];

        if (randomize === 1) {
            computer = labels[Math.floor(Math.random()*labels.length)];
            randomize = 0;
        }


        WINNER = {PLAYER : 1, COMPUTER : 2, TIE : 0}

        switch (label) {
            case "Rock":
                switch (computer) {
                    case "Rock":
                        computer_image = rock_image;
                        winner = WINNER.TIE;
                        break
                    case "Paper":
                        computer_image = paper_image;
                        winner = WINNER.COMPUTER;
                        break
                    case "Scissors":
                        computer_image = scissors_image;
                        winner = WINNER.PLAYER;
                        break
                }
                break
            case "Paper":
                switch (computer) {
                    case "Rock":
                        computer_image = rock_image;
                        winner = WINNER.PLAYER;
                        break
                    case "Paper":
                        computer_image = paper_image;
                        winner = WINNER.TIE;
                        break
                    case "Scissors":
                        computer_image = scissors_image;
                        winner = WINNER.COMPUTER;
                        break
                }
                break
            case "Scissors":
                switch (computer) {
                    case "Rock":
                        computer_image = rock_image;
                        winner = WINNER.COMPUTER;
                        break
                    case "Paper":
                        computer_image = paper_image;
                        winner = WINNER.PLAYER;
                        break
                    case "Scissors":
                        computer_image = scissors_image;
                        winner = WINNER.TIE;
                        break
                }
                break
        }

        // DRAWING

        fill(0);
        textSize(30);
        text("Your Webcam Feed",320/2,30);
        text("Computer Decision",width-(320/2),30);
        image(flippedVideo,0,50);
        text(label, 320/2, 240-10+50+50);

        image(computer_image,width-320,50);
        text(computer,width-(320/2),330);

        switch (winner) {
            case WINNER.COMPUTER:
                computer_score++;
                text("The computer wins. Press [SPACE] to try again.",width/2,height-25);
                break;
            case WINNER.PLAYER:
                player_score++;
                text("You won! Congratulations! Press [SPACE] to play again!",width/2,height-25);
                break;
            case WINNER.TIE:
                text("Wow! It's a tie! Press [SPACE] to play again!",width/2,height-25);
                break;

        fontSize(20);
        let stringthing = player_score.toString()+"-"+computer_score.toString();
        text(stringthing,width/2,height-10);
        }
    }

}

// Get a prediction for the current video frame
function classifyVideo() {
    flippedVideo = ml5.flipImage(vid)
    classifier.classify(flippedVideo, gotResult);
}

// When we get a result
function gotResult(error, results) {
    // If there is an error
    if (error) {
        console.error(error);
        return;
    }
    // The results are in an array ordered by confidence.
    // console.log(results[0]);
    label = results[0].label;
    // Classifiy again!
    classifyVideo();
}