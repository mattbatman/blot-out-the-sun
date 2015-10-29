// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

/*

appConfig.js contains JavaScript modified or written by Matt Batman
appConfig.js contains variables and methods used by app.js (the driver program)

*/



// GLOBAL VARIABLE DECLARATIONS



//DOM REFERENCE VARIABLES
// VARIABLES THAT REPRESENT THE DIV TO BE TOGGLED TO "DISPLY: ON" or "DISPLAY: OFF"
var landingPage = document.getElementById('landing-page-screen');
var secondPage = document.getElementById('second-title-screen');
var thirdPage = document.getElementById('third-title-screen');
var gamePage = document.getElementById('game-screen');
var lostPage = document.getElementById('lost-screen');
var winPage = document.getElementById('win-screen');
// END TOGGLE DIVS

// VARIABLES THAT ARE "PER SECTION OF DIV"
// USER CONFIRM BUTTONS
// buttons are frequently used to pause the page until the user clicks to continue
var htmlButtonOne = document.getElementById('user-confirm-button-one');
var htmlButtonTwo = document.getElementById('user-confirm-button-two');
var htmlButtonThree = document.getElementById('user-confirm-button-three');
var htmlButtonLost = document.getElementById('user-confirm-button-reset');
var htmlButtonWin = document.getElementById('user-confirm-button-win');
// END USER CONFIRM BUTTONS
// MISC VARIABLES
var speciesParagraph = document.getElementById('species-story-text');
var htmlGameHeader = document.getElementById('game-header-text'); //header text on page
var htmlBody = document.getElementById('body-id'); //full page
var htmlGameBorder = document.getElementById('main-game-box'); //div containg game
var moonPathBorder = document.getElementById('intro-moon-box'); //div moon intro similar to game
var htmlParagraphLost = document.getElementById('paragraph-lost-text'); //paragraph text on lost page
var htmlParagraphWin = document.getElementById('paragraph-win-text'); //paragraph text on win page
var cssCircle = document.getElementById('floating-circle-div'); //reference to CSS circle used as a moon or sun in the animation/gameplay
var htmlEarth = document.getElementById('earth');//reference to bottom portion of screen to represnet the ground during gameplay
// END MISC REFERENCE VARIABLES


// INITIALIZE TOGGLED DISPLAY VARIABLES
secondPage.style.display = 'none';
thirdPage.style.display = 'none';
gamePage.style.display = 'none';
lostPage.style.display = 'none';
winPage.style.display = 'none';
htmlEarth.style.display = 'none';
// END INITIALIZE TOGGLED DISPLAY VARIABLES
//END DOM REFERENCE VARIABLES



//GAME OBJECTS
var moon = new Circle('0%', null, 92, 175, true, false, 0);
var sun = new Circle('0%', null, 92, 99, false, true, 0);
//END GAME OBJECTS



//TEXT CONTENT VARIABLES
var textToDisplay = {
  speciesText: [
    'You have chosen to be a race notorious for romantically engaging high school companions despite having a mental age that is centuries old. Your undead life is comfortable (albeit dramatic). However, the sun is about to rise and burn you alive. Strike it down to continue preying on young humans.',
    'You are the beastly werewolf. You are a member of the choir of your werewolf church, and practice has gone too long. The sun is about to rise. Protect your pack. Strike down the sun.',
    "You are an archer in Xerxes the Great's Persian army. Some pesky Spartans are resisting your advances. Prepare your arrow and blot out the sun."
  ],
  countdownText: ['3', '2', '1', 'Go!'],
  resultText: ['Darkness Shall Reign', 'Game Over']
};

//END TEXT CONTENT VARIABLES



//TRACKER VARIABLES
var selectedSpecies = 0; //tracks which species the user selected from the radio form
var confirmButtonClickCounter = 0; //tracks the number of times the confirm button has been clicked
var score = 0; //tracks the user's score
//END TRACKER VARIABLES

/* 10.22.15 -- NEED TO CREATE TWO SETS OF THESE VARIABLES DEPENDING ON WHETHER THE CIRCLE IS FOR THE SUN OR MOON */
//CIRCULAR PATH VARIABLES
var centerX = window.innerWidth/2;
var centerY = window.innerHeight * 0.25;
//var duration = 4; // seconds
var radiusX = window.innerWidth/3; // pixels
var radiusY = window.innerHeight/2; //pixels
//var stretchFactor = 1.1;
var progress, x, y;

var screenSizeBreak = 550;
var screenWidth = window.innerWidth;

function adjustCenterOfPath() {
  centerX = window.innerWidth/2;
  centerY = window.innerHeight * 0.25;
  radiusX = window.innerWidth/3; // pixels
  radiusY = window.innerHeight/2; //pixels
  screenWidth = window.innerWidth;
}

//use onresize browers support with window.innerHeight > window.innerWidth
//END CIRCULAR PATH VARIABLES


//CIRCLE OBJECT
function Circle(distanceTraveled, startTime, endPosition, duration, animationRunning, forGame, score) {
  //PROPERTIES
  this.distanceTraveled = distanceTraveled;
  this.startTime = startTime;
  this.endPosition = endPosition;
  this.duration = duration; // in milliseconds
  this.animationRunning = animationRunning;
  this.forGame = forGame;
  this.score = score;

  //METHODS

  //reset() sets all properties back to the expected initial state
  this.reset = function() {
    this.distanceTraveled = '0%'; // initialize distanceTraveled to 0
    this.startTime = null;
    this.endPosition = 92; // in percent
    this.duration = this.duration * 0.555;
    this.animationRunning = true;
    this.forGame = true;
    cssCircle.style.visibility = 'initial';
    cssCircle.style.left = distanceTraveled;

  };//end reset()

  this.hardReset = function() {
    this.distanceTraveled = '0%'; // initialize distanceTraveled to 0
    this.startTime = null;
    this.endPosition = 92; // in percent
    this.duration = 99;
    this.animationRunning = false;
    this.forGame = true;
    this.score = 0;
    cssCircle.style.visibility = 'initial';
    cssCircle.style.left = distanceTraveled;
  };

  this.resetMoon = function() {
    this.distanceTraveled = '0%'; // initialize distanceTraveled to 0
    this.startTime = null;
    this.endPosition = 92; // in percent
    this.duration = 175;
    this.animationRunning = true;
    this.forGame = false;
    cssCircle.style.visibility = 'initial';
    cssCircle.style.left = distanceTraveled;
  };

  this.lost = function() {
    gamePage.style.display = 'none';
    lostPage.style.display = 'block';
    if (screenWidth < screenSizeBreak) {
      htmlEarth.removeAttribute('class');
      htmlEarth.setAttribute('class', 'lower-ground');
    }
    htmlParagraphLost.textContent = "You blotted the sun " + this.score + " times before failing your fellow creatures of the dark. You meditate on their screams as you all slowly burn to death.";
  };

  /*
  circular animation taken from http://www.the-art-of-web.com/javascript/animate-curved-path/
  and:
  // Original JavaScript code by Chirp Internet: www.chirp.com.au
// Please acknowledge use of this code by including this header.

/http://jsfiddle.net/AbdiasSoftware/F8x4p/
  */

  this.renderAnimationCircular = function(time) {

    if (time === undefined) {
      time = new Date().getTime();
    }
    if (this.startTime === null) {
      this.startTime = time;
    }

    progress = (time - this.startTime) / this.duration / 1000; // percent

    x = Math.sin( (progress * 2 * Math.PI) - (2 * Math.PI / 4) ); // x = ƒ(t)
    y = Math.cos( (progress * 2 * Math.PI) - (2 * Math.PI / 4) ); // y = ƒ(t)

    cssCircle.style.left = (centerX + (radiusX * x)) + "px";
    cssCircle.style.bottom = (centerY + (radiusY * y)) + "px";

    if (progress >= 0.5) {
      this.animationRunning = false;
      cssCircle.style.visibility = 'hidden';
      if (forGame) {
        this.lost();
      }
    }

  };

}//END CIRCLE OBJECT



//MISCELLANEOUS FUNCTIONS



//animateAndWatch() calls renderAnimation() and adds an event listener to the circle
function animateSun(){
  //watch sun circle for click when visible
  cssCircle.addEventListener('click', sunCircleClicked, false); //end initial page advancment via confirmation button
  sun.renderAnimationCircular();
  if (sun.animationRunning) {
    requestAnimationFrame(animateSun, cssCircle);
  }
}//use to call renderAnimation()

function animateMoon(){
  //watch sun circle for click when visible
  moon.renderAnimationCircular();
  if (moon.animationRunning) {
    requestAnimationFrame(animateMoon, cssCircle);
  }
}//use to call renderAnimation()



//function sunCircleClicked
function sunCircleClicked() {
  sun.score++;
  sun.animationRunning = false;
  gamePage.style.display = 'none';
  winPage.style.display = 'block';
  htmlEarth.style.display = 'none';
  htmlParagraphWin.textContent = "Such skill! You've restored the night " + sun.score + " times - but beware, for the sun always rises. It's peaking now. It seems stronger somehow...";
  cssCircle.style.visibility = 'hidden';
  htmlBody.setAttribute('class', 'night-body-settings');
  //used to hold event listern for button on this line
}
//end function sunCircleClicked



//COUNTDOWN FUNCTION AND VARIABLES
var countdownInterval = 1000; // in milliseconds
var countdownCallTracker = 0; // tracks the number of times countdown() has been called by setInterval()
var countdownIntervalCycle;

function startCountdown() {
  thirdPage.style.display = 'none';
  winPage.style.display = 'none';
  gamePage.style.display = 'block';
  countdownCallTracker = 0;
  htmlBody.setAttribute('class', 'day-body-settings'); //change the background color
  countdown(); //call countdown()
  countdownIntervalCycle = setInterval(countdown, countdownInterval);
}

function countdown() {
  switch (countdownCallTracker) {
    case 0:
      htmlEarth.style.display = 'block';
      htmlGameHeader.textContent = textToDisplay.countdownText[countdownCallTracker];
      break;
    case 1:
      htmlGameHeader.textContent = textToDisplay.countdownText[countdownCallTracker];
      break;
    case 2:
      htmlGameHeader.textContent = textToDisplay.countdownText[countdownCallTracker];
      break;
    case 3:
      htmlGameHeader.textContent = textToDisplay.countdownText[countdownCallTracker];
      break;
    default:
      htmlGameHeader.textContent = '';
      sun.reset();
      clearInterval(countdownIntervalCycle);
      animateSun();
    }

    countdownCallTracker++;

}
//END COUNTDOWN FUNCTION AND VARIABLES



//function to determine selected species
function determineSpecies() {
  if (document.getElementById("radio-choice-1").checked === true) {
    selectedSpecies = 0;
  } else if (document.getElementById("radio-choice-2").checked === true) {
    selectedSpecies = 1;
  } else if (document.getElementById("radio-choice-3").checked === true) {
    selectedSpecies = 2;
  } else {
    selectedSpecies = 3;
  }
}
//end function to determine selected species



//function to display story of selected species
function speciesStory() {
  switch (selectedSpecies) {
    case 0:
      speciesParagraph.textContent = textToDisplay.speciesText[selectedSpecies];
      break;
    case 1:
      speciesParagraph.textContent = textToDisplay.speciesText[selectedSpecies];
      break;
    case 2:
      speciesParagraph.textContent = textToDisplay.speciesText[selectedSpecies];
      break;
    default:
      speciesParagraph.textContent = "Something's wrong. It says you're a pikachu?";
  }
}
//end function to display story of selected species

/*

app.js contains JavaScript modified or written by Matt Batman.
app.js contains pageAdvancement(), which is meant to be "the driver program" of the game

*/
//function pageAdvancementOne
function pageAdvancementOne() {
  cssCircle.style.visibility = 'hidden'; //hide the moon circle
  moon.animationRunning = false;
  landingPage.style.display = 'none';
  secondPage.style.display = 'block';
}
//end function pageAdvancementOne

//function pageAdvancementTwo
function pageAdvancementTwo() {
  cssCircle.style.visibility = 'hidden'; //hide the moon circle
  cssCircle.removeAttribute('class'); //switch cssCircle class from moon to sun
  cssCircle.setAttribute('class', 'sun'); //switch cssCircle class from moon to sun
  determineSpecies(); //check which radio button was selected
  if (selectedSpecies < 3) {
  speciesStory(); //display story in paragraph div based on selectedSpecies
  secondPage.style.display = 'none';
  thirdPage.style.display = 'block';
  }
}
//end function pageAdvancementTwo

//function pageAdvancementThree
function pageAdvancementThree() {
  cssCircle.style.visibility = 'hidden';//start with the moon circle hidden
  startCountdown();
}
//end function pageAdvancementThree

//function to reset game
function resetGame() {
  sun.hardReset();
  cssCircle.removeEventListener('click', sunCircleClicked, false); //end initial page advancment via confirmation button
  lostPage.style.display = 'none';
  landingPage.style.display = 'block';
  htmlBody.setAttribute('class', 'night-body-settings');
  htmlEarth.style.display = 'none';
  htmlEarth.removeAttribute('class');
  htmlEarth.setAttribute('class', 'high-ground');
  cssCircle.removeAttribute('class'); //switch cssCircle class from moon to sun
  cssCircle.setAttribute('class', 'moon'); //switch cssCircle class from moon to sun
  cssCircle.style.visibility = 'hidden'; //hide the moon circle for phablet and smaller
  if (screenWidth > screenSizeBreak) {
//  cssCircle.style.visibility = 'initial'; //hide the moon circle
  moon.resetMoon();
  animateMoon();
  }
}
//end function to reset game



// EVENT HANDLERS FOR PAGE FLOW

//animate moon when page loads
cssCircle.style.visibility = 'hidden';

window.addEventListener('pageshow',
function() {
  adjustCenterOfPath();
  if (screenWidth > screenSizeBreak) {
    cssCircle.style.visibility = 'initial';
  }
  (function moonAnimation(){
    moon.renderAnimationCircular();
    if (moon.animationRunning) {
      requestAnimationFrame(moonAnimation, cssCircle);
    }
  })();
},
false);


//advance page when user confirmation button is clicked
htmlButtonOne.addEventListener('click', pageAdvancementOne, false);
htmlButtonTwo.addEventListener('click', pageAdvancementTwo, false);
htmlButtonThree.addEventListener('click', pageAdvancementThree, false);
htmlButtonWin.addEventListener('click', startCountdown, false);
htmlButtonLost.addEventListener('click', resetGame, false);
//watch for resize of browser and change center of cirle's path
window.onresize = adjustCenterOfPath;

// END EVENT HANDLERS FOR PAGE FLOW
