var gamePattern = [];
var userClickedPattern = [];
var buttonColours = ["red", "blue", "green", "yellow"];

var level = 0;
var started = false;
var playerTurn = false;
let score = 0;
let highScore = loadHighScore();

showHighScore();

$(document).keypress(function() {

    if (!started) {
        started = true;
        score = 0;
        level = 0;
        nextSequence();
    }
});

$(".btn").click(function() {

    if (!started || !playerTurn) {
        return;
    }

    var userChosenColour = $(this).attr("id");
    userClickedPattern.push(userChosenColour);

    playSound(userChosenColour);
    animatePress(userChosenColour);

    checkAnswer(userClickedPattern.length - 1);
});

function checkAnswer(currentLevel) {

    if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
        if (userClickedPattern.length === gamePattern.length) {
            playerTurn = false;
            score = level;
            setTimeout(function() {
                nextSequence();
            }, 1000);
        }
    } else {
        playSound("wrong");
        $("body").addClass("game-over");

        var isNewHighScore = score > highScore;
        if (isNewHighScore) {
            highScore = score;
            saveHighScore(highScore);
            showHighScore();
        }
        var message = `Your Score : ${score}`;
        if (isNewHighScore) {
            message += " (New High Score!)";
        }
        $("#level-title").text(message + " (Press Any Key To Restart)");

        setTimeout(function() {
            $("body").removeClass("game-over");
        }, 200);

        startOver();
    }
}

function nextSequence() {
    userClickedPattern = [];
    playerTurn = false;
    level++;
    $("#level-title").text("Level " + level);
    toggleTurn(false);

    var randomNumber = Math.floor(Math.random() * 4);
    gamePattern.push(buttonColours[randomNumber]);

    playPattern();
}

// Replays the whole pattern, then hands the turn to the player.
function playPattern() {
    var step = 600;
    gamePattern.forEach(function(colour, i) {
        setTimeout(function() {
            if (!started) {
                return;
            }
            playSound(colour);
            animatePress(colour);
        }, 500 + i * step);
    });
    setTimeout(function() {
        if (started) {
            playerTurn = true;
            toggleTurn(true);
        }
    }, 500 + gamePattern.length * step);
}

function animatePress(currentColor) {
    $("#" + currentColor).addClass("pressed");
    setTimeout(function() {
        $("#" + currentColor).removeClass("pressed");
    }, 100);
}

function playSound(name) {
    var audio = new Audio("sounds/" + name + ".mp3");
    audio.play();
}

function startOver() {
    level = 0;
    score = 0;
    gamePattern = [];
    started = false;
    playerTurn = false;
    $('#turn-indicator').hide();
}

function toggleTurn(player = true) {
    let text = "Memorize the pattern";
    if (player) {
        text = "Your turn";
    }
    $("#turn-indicator").text(text).show();
}

function loadHighScore() {
    try {
        return parseInt(localStorage.getItem("simonHighScore"), 10) || 0;
    } catch (e) {
        return 0;
    }
}

function saveHighScore(value) {
    try {
        localStorage.setItem("simonHighScore", value);
    } catch (e) {
        // storage unavailable; high score lasts for this session only
    }
}

function showHighScore() {
    $("#high-score").text("High Score : " + highScore);
}
