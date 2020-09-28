var WALL = 1;
var BLOCK = 2;
var SILVER = 7;
var GOLD = 8;


// global button list 
var buttons = [];

// --------------------------------------------------
// colors 
// MayaBlue = '#55cdfc'
// AmaranthPink = '#f7a8b8'

pink = '#F06292';
blue = '#42A5F5';
cyan = '#26C6DA';
gree = '#66BB6A';
lime = '#D4E157';
ambe = '#FFCA28';
deor = '#FF7043';

teal = '#E0F2F1';

topBarColor = teal;
resultsColor = teal;
cardColor = teal;
continueColor = cyan;
replayColor = lime;
returnColor = blue;
mainmenuColor = blue;

endlessColor = cyan;
missionsColor = ambe;
practiceColor = deor;
settingsColor = pink;
controlsColor = gree;

var clear = 'black';
menuColor = teal;

var pieces = [
  [I, cyan],
  [J, blue],
  [L, deor],
  [O, lime],
  [S, gree],
  [T, ambe],
  [Z, pink]
];
/*old
var pieces = [
  [I, 'cyan'],
  [J, 'purple'],
  [L, 'PaleVioletRed'],
  [O, 'gray'],
  [S, 'green'],
  [T, 'yellow'],
  [Z, 'red']
];
*/
/* alt colors
 var pieces = [
  [I, 'white'],
  [J, MayaBlue],
  [L, AmaranthPink],
  [O, 'white'],
  [S, MayaBlue],
  [T, 'white'],
  [Z, AmaranthPink]
 ];
*/
var done;
var gdone;

var piece = null;

var keydownIntervals = {};

var board = [];
var bag = [];
var bagText = document.getElementById('bagsize');

// --------------------------------------------------
// For sizing and graphics
var canvas = document.getElementById('board');
var context = canvas.getContext('2d');
//var clear = window.getComputedStyle(canvas).getPropertyValue('background-color');
var gridChoice = document.getElementsByName('grids');
var gridsOn = 1;

var BOARDWIDTH = 10;
var BOARDHEIGHT = 20;
var LEFTSPACE = 2;
var RIGHTSPACE = 5;
var TOPSPACE = 4;
var BOARDPERCENT = 0.7;
var PREVIEW = 5;
var BOTTOMSPACE = 1;
var sideBarX;
var boardX;
var tilesz;
var wHeight;
var wWidth;
var thinLine;
var thickLine;
var wideButton;
var wideButtonX;
var halfButton;
var halfButtonFarX;

var fontSize;
var fontSizeSmall;

var SMALLBUTTON = 2.5;
var BIGBUTTON   = 4;

context.lineWidth = 1;
context.sRect = function (x, y, w, h, l) {
  l = parseInt(l);
  x = parseInt(x + l / 2);
  y = parseInt(y + l / 2);
  context.strokeRect(x, y, w - l, h - l);
};

context.fRect = function (x, y, w, h) {
  x = parseInt(x);
  y = parseInt(y);
  context.fillRect(x, y, w, h);
};

function initCanvas() {
  wHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  wWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  tilesz = parseInt(wHeight * BOARDPERCENT / BOARDHEIGHT);
  fontSize      = '' + tilesz + 'px Arial';
  fontSizeSmall = '' + tilesz * .6 + 'px Arial';
  thinLine = 0.0125;
  thickLine = 0.25;
  boardX = LEFTSPACE + 1 * thickLine;
  sideBarX = LEFTSPACE + BOARDWIDTH + 2 * thickLine;
  canvas.width = (sideBarX + RIGHTSPACE) * tilesz;
  canvas.height = (TOPSPACE + BOARDHEIGHT + BOTTOMSPACE) * tilesz;
  wideButton = canvas.width - tilesz;
  wideButtonX = .5 * tilesz;
  halfButton = (canvas.width - tilesz) / 2;
  halfButtonFarX = canvas.width/2;
  for (let i = 0; i < gridChoice.length; i++) {
    if (gridChoice[i].checked) {
      gridsOn = parseInt(gridChoice[i].value);
    }
  }
}

function setColor(color) {
  context.fillStyle = color;
  if (color !== clear) {
    context.strokeStyle = 'black';
  } else {
    context.strokeStyle = 'dimGray';
  }
}

/**
 * From stackoverflow:
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} [radius = 5] The corner radius; It can also be an object 
 *                 to specify different radii for corners
 * @param {Number} [radius.tl = 0] Top left
 * @param {Number} [radius.tr = 0] Top right
 * @param {Number} [radius.br = 0] Bottom right
 * @param {Number} [radius.bl = 0] Bottom left
 * @param {Boolean} [fill = false] Whether to fill the rectangle.
 * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
 */
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke === 'undefined') {
    stroke = true;
  }
  if (typeof radius === 'undefined') {
    radius = 5;
  }
  if (typeof radius === 'number') {
    radius = {tl: radius, tr: radius, br: radius, bl: radius};
  } else {
    var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }

}



// --------------------------------------------------
// For Piece Hold
var heldPiece;
var heldPieceNumber = -1; // is initialized as -1 to mean nothing held, MIGHT NOT BE USING
var currentPieceNumber;
var isPieceHeld;

// --------------------------------------------------
// For Starting and Ending of Games
document.getElementById('newGame').onclick = reset;
var WIN   = 1;
var LOSE  = 0;


var gameScreen;
var INPLAY    = 0;
var GAMEOVER  = 1;
var MAINMENU  = 2;
var CONTROLS  = 3;
var SETTINGS  = 4;

function reset() {
  buttons = [];
  gamesCount += 1;
  initGame();
  drawBoard();
  main();
}

function clearScreen() {
  setColor('black');
  context.fRect(0,
          TOPSPACE * tilesz,
          canvas.width,
          canvas.height-TOPSPACE * tilesz);
}

function gameOver(result) {
  var message = '';
  gameScreen = GAMEOVER;
  if (result === WIN) {
    message = 'Success!'
  } else {
    message = 'GAME OVER'
  }
  context.globalAlpha = 0.6;
  clearScreen();

  setColor(menuColor);
  context.globalAlpha = 1;

  // draw results card background
  context.fRect(0.5 * tilesz,
        canvas.height / 2.5 - 1.5*tilesz,
        canvas.width - (tilesz),
        5.5 * tilesz);

  // write results
  context.font = fontSize;
  setColor('black');
  context.textAlign = 'center';
  context.fillText(message,
        canvas.width / 2,
        canvas.height / 2.5);
  context.fillText('(press r to play agian)',
        canvas.width/2,
        canvas.height / 2.5 + 2.5 * tilesz);

  gdone = true;
  drawContinueOptions(result);
}

function drawContinueOptions(result) {
  var buttonSpacing = (SMALLBUTTON + 0.5) * tilesz;

  var continueStart = (TOPSPACE + 12) * tilesz;
  var replayStart   = continueStart + buttonSpacing;
  var mainmenuStart   = replayStart + buttonSpacing;

  var continueText = "Play Again";
  var replayText = "Replay Mission";
  var mainmenuText = "Main Menu";
  if (gameMode === MS) {
    continueText = "Play Next Mission";
  }

  //continue button
  if ( gameMode !== MS || result === WIN ) {
  buttons.push(new Button(wideButtonX,
    continueStart,
    wideButton,
    SMALLBUTTON,
    continueText,
    continueColor,
    function() {
      continuePlaying();
    }));
  } else {
    // draw 'fake' button with no functionality
    drawButton(wideButtonX,continueStart,
      wideButton,
      SMALLBUTTON,
      continueColor, 
      continueText,
      true,
      true);
    //shade out continue button  
    context.globalAlpha = 0.4;
    setColor('black');
    context.fRect(0.5 * tilesz,
      continueStart,
      canvas.width - (tilesz),
      SMALLBUTTON * tilesz);
    context.globalAlpha = 1;
  }

  //replay button
  if (gameMode === MS) {
    buttons.push(new Button(wideButtonX,
      replayStart,
      wideButton,
      SMALLBUTTON,
      replayText,
      replayColor,
      function() {
   //     replayMission();
      }));
  }

  //main menu button
  buttons.push(new Button(wideButtonX,
    mainmenuStart,
    wideButton,
    SMALLBUTTON,
    mainmenuText,
    mainmenuColor,
    function() {
    //  gotoMainMenu();
    },
    false));

}

// this draws a rectangle with text
function drawButton(  x,y,
                      width,
                      height,
                      color,
                      text,
                      filled,
                      rounded) {

  if (typeof filled === 'undefined') {
    filled = true;
  }
  if (typeof rounded === 'undefined') {
    rounded = true;
  }
  
  var radius = rounded ? tilesz / 3 : 0;

  // make black rectangle (done to add opacity)
  // invisible for filled buttons 
  context.globalAlpha = .5;
  setColor('black');
  roundRect(context,
    x,
    y,
    width,
    height * tilesz,
    radius,
    true,
    true);

  //draw button's rectangle
  setColor(color);
  context.globalAlpha = 1;
  context.strokeStyle = color;
  context.lineWidth = tilesz / 10;
  roundRect(context,
    x,
    y,
    width,
    height * tilesz,
    radius,
    filled,
    !filled);

  if (filled) {
    // text color
    setColor('black');

  } else {
    // text color
    setColor(color);
  }

  //write button text
  context.font = fontSize;
  context.textAlign = 'center';
  context.fillText(text,
    width / 2 + x,
    y + (height / 2 + .25)*tilesz);
  setColor('black');
  context.strokeStyle = 'black';
  context.lineWidth = "2";

}

// --------------------------------------------------
// For Managing Randomness
var jsf;
var gameSeed    = document.getElementById('theSeed');
var seedConfirm = document.getElementById("seedCheck");

jsf = Math.random; // default for unseeded games

// Bob Jenkins' JSF
function JSF(seed) {
    function jsf() {
        var e = s[0] - (s[1]<<27 | s[1]>>>5);
         s[0] = s[1] ^ (s[2]<<17 | s[2]>>>15),
         s[1] = s[2] + s[3],
         s[2] = s[3] + e, s[3] = s[0] + e;
        return (s[3] >>> 0) / 4294967296; // 2^32
    }
    seed >>>= 0;
    var s = [0xf1ea5eed, seed, seed, seed];
    for(var i=0;i<20;i++) jsf();
    return jsf;
}

function seedRandom() {
  if (!!gameSeed && !!seedConfirm) {
    var seed  = document.getElementById("theSeed").value;
    if (!parseInt(seed)){ // not a valid seed 
      seedConfirm.innerHTML = "&#10062";
    } else { // valid seed
      jsf = JSF(seed);
      seedConfirm.innerHTML = "&#9989";
      reset();
    }
  }
}


function continuePlaying() {
  if ( gameMode === EB || gameMode === PP ) {
    reset();
  } else if ( gameMode === MS ) {
    currentMission += 1;
    currentMission %= missions.length;
    reset();
  }
}

function clearButtons() {
  console.log('Number of buttons: '+ buttons.length);
  buttons = [];
  
}


// --------------------------------------------------
// For Game Modes
var EB = 1 // everything bagel
var AC = 2 // all clear mode
var MS = 3 // play missions
var PP = 4 // play practice

var gameMode = EB; 

// --------------------------------------------------
// For Scoring
var lines = 0;
var combo = 0;
var bcombo = 0;
var squares = 0;
var numpieces = 0;
var acCount = 0;
var gamesCount = 0;

function initScores() {
  lines = 0;
  combo = 0;
  bcombo = 0;
  squares = 0;
  numpieces = 0;
}

function drawScoreBar() {
  setColor(menuColor);
  context.fRect(0, 0,
    canvas.width,
    TOPSPACE*tilesz-1);
  setColor('black');
  if(gameMode === AC) {
    context.font = '' + 1.25 * tilesz + 'px Arial';
    context.fillText('All Clears: ' + acCount,
            tilesz,
            2.5 * tilesz);
    context.fillText(' Games: ' + gamesCount,
            canvas.width/2 + tilesz,
            2.5 * tilesz);
  } else if (gameMode === EB) {
    context.font = '' + 1.25 * tilesz + 'px Arial';
    context.fillText('Lines: ' + lines,
            tilesz,
            1.5 * tilesz);
    context.fillText(' Pieces: ' + numpieces,
            canvas.width/2 + tilesz,
            1.5 * tilesz);
    context.fillText('Combo: ' + combo,
            tilesz,
            3.5 * tilesz);
    context.fillText(' Best: ' + bcombo,
            canvas.width/2 + tilesz,
            3.5 * tilesz);
  }
}

// --------------------------------------------------
// For Piece Preview
function updatePreview() {
  if (bag.length < PREVIEW) {
    makeAndShuffleBag();
  }

  drawPreview();
}

function drawPreview() {
  setColor('Black');
  context.fRect((sideBarX) * tilesz + 1,
    TOPSPACE * tilesz,
    RIGHTSPACE * tilesz,
    (BOARDHEIGHT - 5.1) * tilesz);
  for (let previewX = 0; previewX < PREVIEW; previewX++) {
    var nextToComeNumber = bag[bag.length - (1 + previewX)];
    var nextToComePiece = pieces[nextToComeNumber];
    setColor(nextToComePiece[1]);
    var size = nextToComePiece[0][0].length;

    var wAdjustment = 1;
    var hAdjustment = 0.5;
    if (nextToComeNumber === 0) {
      wAdjustment = 0.5;
      hAdjustment = -1;
    } else if (nextToComeNumber === 3) {
      wAdjustment = 0.5;
      hAdjustment = -0.5;
    } else if (nextToComeNumber === 4 || nextToComeNumber === 6) {
      hAdjustment = -0.5;
    }

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (nextToComePiece[0][0][y][x] !== 0) {
          // draw preview to the right
          drawSquare(sideBarX + x + wAdjustment,
            TOPSPACE + y + hAdjustment + 3 * previewX);
        }
      }
    }
  }
}

// --------------------------------------------------
// For Randomizer
var bagSize; // this should change based on what randomizer is chosen
function getRandomInt(max) {
  return Math.floor(jsf() * Math.floor(max));
}

function shuffle(array) {
  var currentIndex = array.length;
  var temporaryValue;
  var randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(jsf() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function makeAndShuffleBag() {
  var tempBag = [];
  if (bagSize > 0) {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < bagSize; j++) {
        tempBag.push(i);
      }
    }

    tempBag = shuffle(tempBag);
  } else {
    for (let i = 0; i < 7; i++) {
      tempBag.push(getRandomInt(pieces.length));
    }
  }

  // next piece is bag.pop(), meaning order of pieces is read from end of bag
  // to start. This means we need to add future pieces to the beginning of the bag
  // rather than end.
  bag = tempBag.concat(bag);
}

function newPieceDet(blockNumber) {
  var p = pieces[blockNumber];
  currentPieceNumber = blockNumber;
  updateStats(blockNumber);
  updatePreview();
  drawScoreBar();
  return new Piece(p[0], p[1], blockNumber);
}

function nextPiece() {
  updatePieceCount();
  if (bag.length === 0) { // with preview, I don't think this is ever called
    makeAndShuffleBag();
    return newPieceDet(bag.pop());
  } else {
    return newPieceDet(bag.pop());
  }
}

function updatePieceCount() {
  numpieces++;
  speedUp();
}

var possibleRandomizer = document.getElementsByName('randomizer');
bagSize = 0;
function initRandomizer() {
  bag = [];
  for (let i = 0; i < possibleRandomizer.length; i++) {
    if (possibleRandomizer[i].checked) {
      bagSize = possibleRandomizer[i].value;
    }
  }

  bagText.textContent = 'Current Bag Size: ' + bagSize;
}

// --------------------------------------------------
// For speeding up blocks falling
var dropStart;
var GRAVITY = 400;
var SPEEDCHANGE = 50;
var TRANSITION = 25;
var TRANSITIONSTART = 125;
var speed = 0;
var numspeedchanges = 0;

function speedUp() {
  if (numpieces - TRANSITION * numspeedchanges > TRANSITIONSTART &&
     speed + SPEEDCHANGE < GRAVITY) {
    // after TRANSITIONSTART many pieces, every additonal TRANSITION
    // number of pieces triggers speed up of SPEEDCHANGE
    numspeedchanges += 1;
    speed = numspeedchanges * SPEEDCHANGE;
  }
}

// --------------------------------------------------
// For Piece Statistics (needed for checking square mode)
var pieceStatistics = [0, 0, 0, 0, 0, 0, 0];

function initStats() {
  pieceStatistics = [0, 0, 0, 0, 0, 0, 0];
}

function updateStats(blockNumber) {
  pieceStatistics[blockNumber] += 1;
}

// --------------------------------------------------
// For square mode
function checkSquare(row, col, type) {
  var piecesPresent = [];
  var shapesPresent = [];
  var currentId;
  var currentShape;
  var transform = false;
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      currentId = board[row + r][col + c][1];
      if (currentId === -1) {
        return 0; // the square is not filled in
      } else {
        currentShape = currentId % 10;
        if (currentShape === GOLD || currentShape === SILVER) {
          return 0;
        }

        if (!piecesPresent.includes(currentId)) {
          piecesPresent.push(currentId);
        }

        if (!shapesPresent.includes(currentShape)) {
          shapesPresent.push(currentShape);
        }
      }
    }
  }

  if (piecesPresent.length !== 4) {
    return 0; // a perfect square uses exactly 4 pieces
  } else if (shapesPresent.length > 1 && type === SILVER) {
    transform = true;
  } else if (shapesPresent.length === 1 && type === GOLD) {
    transform = true;
  } else {
    return 0;
  }

  if (transform) {
    transformSquare(row, col, type);
    return type;
  }
}

function transformSquare(row, col, type) {
  var newId = '' + squares + type;
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (type === GOLD) {
        board[row + r][col + c] = ['DarkGoldenRod', newId];
      } else if (type === SILVER) {
        board[row + r][col + c] = ['LightSteelBlue', newId];
      }
    }
  }

  drawBoard();
}

function checkForSquares() {
  var outcome = 0;
  var nsquares = 0;

  // to make sure gold squares have priority,
  // check for golds then for silvers
  for (let r = 0; r < BOARDHEIGHT - 3; r++) {
    for (let c = 0; c < BOARDWIDTH - 3; c++) {
      outcome = checkSquare(r, c, GOLD);
      nsquares += outcome - 6;
    }
  }

  for (let r = 0; r < BOARDHEIGHT - 3; r++) {
    for (let c = 0; c < BOARDWIDTH - 3; c++) {
      outcome = checkSquare(r, c, SILVER);
      if (outcome) {
        nsquares += outcome - 6;
      }
    }
  }

  if (nsquares > 0) {
    squares += nsquares;
  }
}

// --------------------------------------------------
// For checking for all clears

function checkForAllClear() {
  // I think empty bottom row is equivalent to an all clear
  var empty = true;
  for (let c = 0; c < BOARDWIDTH; c++) {
    if (board[BOARDHEIGHT-1][c][0]) {
      empty = false;
    }
  }
  if (empty) {
    acCount += 1;
    drawScoreBar();
    gameOver(WIN);
  }
}

// --------------------------------------------------

function initBoard() {
  for (let r = 0; r < BOARDHEIGHT; r++) {
    board[r] = [];
    for (let c = 0; c < BOARDWIDTH; c++) {
      board[r][c] = ['', -1];
    }
  }
}

function holdPiece() {
  if (!piece.recentlyHeld) {
    if (isPieceHeld === 0) { // ie no piece held
      isPieceHeld = 1;
      heldPieceNumber = currentPieceNumber;
      heldPiece = pieces[heldPieceNumber];
      piece.undraw();
      piece.undrawGhost();
      piece = nextPiece();
      piece.heldRecently();
    } else { // assuming hold isnt locked
      var oldHeldPieceNumber = heldPieceNumber;
      heldPieceNumber = currentPieceNumber;
      heldPiece = pieces[heldPieceNumber];
      currentPieceNumber = oldHeldPieceNumber;
      piece.undraw();
      piece.undrawGhost();
      piece = newPieceDet(currentPieceNumber);
      piece.heldRecently();
    }

    drawHold();
  }
}

function drawHold() {
  setColor('black');
  context.fRect(sideBarX * tilesz + 1,
    (TOPSPACE + BOARDHEIGHT - 4) * tilesz,
    RIGHTSPACE * tilesz,
    4.5 * tilesz);
  setColor(heldPiece[1]);
  var size = heldPiece[0][0].length;
  var hAdjustment = 1 - 4;
  var wAdjustment = 1;
  if (heldPieceNumber === 0) {
    hAdjustment = -0.5 - 4.5;
    wAdjustment = 0.5;
  } else if (heldPieceNumber === 3) {
    hAdjustment -= 1;
    wAdjustment = 0.5;
  } else if (heldPieceNumber === 4 || heldPieceNumber === 6) {
    hAdjustment -= 1;
  }

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (heldPiece[0][0][y][x] !== 0) {
        drawSquare(sideBarX + x + wAdjustment,
          TOPSPACE + y + BOARDHEIGHT + hAdjustment);
      }
    }
  }
}

function drawSquare(x, y) {
  context.fRect(x * tilesz, y * tilesz, tilesz, tilesz);
  if (gridsOn === 1) {
    context.sRect(x * tilesz, y * tilesz, tilesz, tilesz, thinLine * tilesz);
  }
}



// --------------------------------------------------
// Defining the Button prototype

var Button = function(x, y, width, height, text, color, fn, filled, rounded) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.text = text;
  this.color = color;
  //this.img = new Image();
  //this.img.src = imgurl;
  this.fn = fn; //pass the button's click function

  drawButton(this.x, this.y, this.width, height, this.color, this.text, filled, rounded);
//  this.draw();
};

Button.prototype.mouse_down = function(mouseX, mouseY) {
//y > CHButtonY && y < CHButtonY + BIGBUTTON*tilesz
//  var hit = ( mouseX > canvas.width / 2 ) ? true : false;
  var hit = ( mouseY > this.y && 
    mouseY < this.y + this.height*tilesz &&
    mouseX > this.x &&
    mouseX < this.x + this.width
        ) ? true : false;
  if (hit == true) {
    console.log('mouseX: ' + mouseX + ', x: '+this.x);
    console.log('mouseY: ' + mouseY + ', y: '+this.y);
    console.log(this.text + ' button pressed');
    clearButtons();
    drawScoreBar();
    this.fn(); //run the button's function
  }
  return hit;
};


// --------------------------------------------------
// Defining the Piece object
function Piece(patterns, color, shapeNumber, startY) {

  if (typeof startY === 'undefined') {
    startY = -4;
  }

  this.pattern = patterns[0];
  this.patterns = patterns;
  this.patterni = 0;
  this.recentlyHeld = 0;
  this.number = shapeNumber;
  this.id = '' + pieceStatistics[shapeNumber] + shapeNumber;

  this.color = color;
  var centerX = (BOARDWIDTH % 2 === 0 ) ? 
    BOARDWIDTH / 2 :
    ( BOARDWIDTH + 1 ) / 2;
  this.x = centerX - parseInt(Math.ceil(this.pattern.length / 2), 10);
  this.y = startY;
  this.ghosty;
}

Piece.prototype.heldRecently = function () {
  this.recentlyHeld = 1;
};

Piece.prototype.rotate = function (amount) {
  var nextpat = this.patterns[(this.patterni + amount) % this.patterns.length];
  var kicks = [[0, 0], [1, 0], [0, 1], [-1, 0], [0, -1]];
  var wk = [0, 0];
  if (this.number === 0) {
    kicks = [[0, 0], [1, 0], [2, 0], [0, 1], [-1, 0], [-2, 0], [0, -1]];
  }

  if (amount === 1) { // clockwise
    for (let i = 0; i < kicks.length; i++) {
      if (!this._collides(kicks[i][0], kicks[i][1], nextpat)) {
        wk = kicks[i];
        break;
      }
    }
  } else if (amount === 3) { // counter clockwise
    for (let i = 0; i < kicks.length; i++) {
      if (!this._collides(-kicks[i][0], kicks[i][1], nextpat)) {
        wk = kicks[i];
        wk[0] = -kicks[i][0];
        break;
      }
    };
  }

  if (!this._collides(wk[0], wk[1], nextpat)) {
    this.undraw();
    this.undrawGhost();
    this.x += wk[0];
    this.y += wk[1];
    this.patterni = (this.patterni + amount) % this.patterns.length;
    this.pattern = this.patterns[this.patterni];
    this.updateGhost();
    this.draw();
  }
};

Piece.prototype._collides = function (dx, dy, pat) {
  for (let ix = 0; ix < this.pattern.length; ix++) {
    for (let iy = 0; iy < this.pattern.length; iy++) {
      if (!pat[iy][ix]) {
        continue;
      }

      var x = this.x + ix + dx;
      var y = this.y + iy + dy;
      if (y >= BOARDHEIGHT || x < 0 || x >= BOARDWIDTH) {
        return WALL;
      }

      if (y < 0) {
        // Ignore negative space rows
        continue;
      }

      if (board[y][x][0] !== '') {
        return BLOCK;
      }
    }
  }

  return 0;
};

Piece.prototype.down = function () {
  if (this.y === -4) {
    // this should be the first call to updateGhost
    // ie no ghost to undraw
    this.updateGhost();
  }

  if (this._collides(0, 1, this.pattern)) {
    this.lock();
    if(!gdone) {
      piece = nextPiece();
    }
    return 1;
  } else {
    this.undraw();
    this.y++;
    this.draw();
    return 0;
  }
};

Piece.prototype.moveRight = function () {
  if (!this._collides(1, 0, this.pattern)) {
    this.undraw();
    this.undrawGhost();
    this.x++;
    this.updateGhost();
    this.draw();
  }
};

Piece.prototype.moveLeft = function () {
  if (!this._collides(-1, 0, this.pattern)) {
    this.undraw();
    this.undrawGhost();
    this.x--;
    this.updateGhost();
    this.draw();
  }
};

Piece.prototype.lock = function () {
  for (let ix = 0; ix < this.pattern.length; ix++) {
    for (let iy = 0; iy < this.pattern.length; iy++) {
      if (!this.pattern[iy][ix]) {
        continue;
      }

      if (this.y + iy < 0) {
        // Game ends!
        gameOver(LOSE);
        return;
      }

      board[this.y + iy][this.x + ix] = [this.color, this.id];
    }
  }
  if (gameMode === EB) {
    checkForSquares();
  }
  var gsBonus = 0;
  var nlines = 0;
  for (let y = 0; y < BOARDHEIGHT; y++) {
    var line = true;
    var golds = [];
    var silvers = [];
    // check if row at height y is full
    for (let x = 0; x < BOARDWIDTH; x++) {
      line = line && board[y][x][0] !== '';
    }

    if (line) {
      for (let x = 0; x < BOARDWIDTH; x++) {
        var currentId = board[y][x][1];
        var pieceType = currentId % 10;
        if (pieceType === GOLD) {
          if (!golds.includes(currentId)) {
            golds.push(currentId);
          }
        } else if (pieceType === SILVER) {
          if (!silvers.includes(currentId)) {
            silvers.push(currentId);
          }
        }

        line = line && board[y][x][0] !== '';
      }

      for (let y2 = y; y2 > 0; y2--) {
        for (let x = 0; x < BOARDWIDTH; x++) {
          board[y2][x] = board[y2 - 1][x];
        }
      }

      for (let x = 0; x < BOARDWIDTH; x++) {
        board[0][x] = ['', -1];
      }

      nlines++;
      gsBonus += 5 * silvers.length + 10 * golds.length;
    }
  }

  if (nlines > 0) {
    if (nlines === 4) {
      // in the new tetris, if you cleared 4 lines at once there was a bonus of +1
      nlines++;
    }

    lines += nlines + gsBonus;
    combo += 1;
    if (combo > bcombo) {
      bcombo = combo;
    }

    drawBoard();
    if (gameMode === AC) {
      checkForAllClear();
    }
  } else {
    combo = 0;
  }
};

Piece.prototype.updateGhost = function () {
  var oldy = this.y;
  for (let i = 1; i < BOARDHEIGHT + 3; i++) {
    if (this._collides(0, 1, this.pattern)) {
      break;
    }

    this.y++;
  }

  this.ghosty = this.y;
  this.y = oldy;
  this.drawGhost();
};

Piece.prototype._fill = function (color) {
  setColor(color);
  var x = this.x;
  var y = this.y;
  var patlength = this.pattern.length;
  for (let ix = 0; ix < patlength; ix++) {
    for (let iy = 0; iy < patlength; iy++) {
      if (this.pattern[iy][ix] && y + iy >= 0) {
        drawSquare(boardX + x + ix, TOPSPACE + y + iy);
      }
    }
  }
};

Piece.prototype._fillGhost = function (color) {
  setColor(color);
  var x = this.x;
  var y = this.ghosty;
  var patlength = this.pattern.length;
  for (let ix = 0; ix < patlength; ix++) {
    for (let iy = 0; iy < patlength; iy++) {
      if (this.pattern[iy][ix] && y + iy >= 0) {
        drawSquare(boardX + x + ix, TOPSPACE + y + iy);
      }
    }
  }
};

Piece.prototype.undraw = function (context) {
  this._fill(clear);
};

Piece.prototype.draw = function (context) {
  this._fill(this.color);
};

Piece.prototype.drawGhost = function () {
  context.globalAlpha = 0.5;
  this._fillGhost(this.color);
  context.globalAlpha = 1.0;
};

Piece.prototype.undrawGhost = function () {
  this._fillGhost(clear);
};

// --------------------------------------------------
var repeatableKeys = [37, 39, 40];
document.body.addEventListener('keydown', function (e) {
  if (repeatableKeys.includes(e.keyCode)) {
    if (keydownIntervals[e.keyCode] !== null) {
      clearInterval(keydownIntervals[e.keyCode]);
    }
    keydownIntervals[e.keyCode] = setInterval(key.bind(this, e.keyCode), 150);
  }

  key(e.keyCode);
}, false);

document.body.addEventListener('keyup', function (e) {
  if (repeatableKeys.includes(e.keyCode)) {
    if (keydownIntervals[e.keyCode] !== null) {
      clearInterval(keydownIntervals[e.keyCode]);
    }
    keydownIntervals[e.keyCode] = null;
  }
}, false);

// --------------------------------------------------
// Recognizing swipes
document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;
var yDown = null;

function getTouches(evt) {
  return evt.touches || // browser API
         evt.originalEvent.touches; // jQuery
}

function handleTouchStart(evt) {
  const firstTouch = getTouches(evt)[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
};

function handleTouchMove(evt) {
  if (!xDown || !yDown) {
    return;
  }
  if (gdone) {
    return;
  }

  var xUp = evt.touches[0].clientX;
  var yUp = evt.touches[0].clientY;

  var xDiff = xDown - xUp;
  var yDiff = yDown - yUp;

  if (Math.abs(xDiff) > Math.abs(yDiff)) { /* most significant */
    if (xDiff > 0) {
      /* left swipe */
      piece.moveLeft();
    } else {
      /* right swipe */
      piece.moveRight();
    }
  } else {
    if (yDiff > 0) {
      /* up swipe */
      holdPiece();
    } else {
      /* down swipe */
      while (piece.down() == 0) {}
    }
  }
  /* reset values */
  xDown = null;
  yDown = null;
};
// --------------------------------------------------
// Recognizing taps/touches/clicks
document.addEventListener('click', handleClick, false);

function handleClick(evt) {
  var x = evt.offsetX;
  var cx = evt.clientX;
  var y = evt.offsetY; 

  console.log('offestX: '+x+ ' offestY: '+y);
  var button_was_clicked = buttons.some(function(b) {
    return b.mouse_down(x, y);
  });

  if (button_was_clicked) return; //return early because button was clicked

  if (gdone) {
    //reset();

  }
   else if (cx < wWidth / 2) {
    piece.rotate(3);
  } else {
    piece.rotate(1);
  }
};

// --------------------------------------------------
function key(k) {
  if (k === 82) { // Player pressed r
    reset();
  } else if (k === 86) { // Player pressed v
    seedRandom();
  } else if (k === 80) { // Player pressed p
    gdone = !gdone;
  }
  if (gdone) {
    return;
  }

  if (k === 38) { // Player pressed up
    piece.rotate(3);
    dropStart = Date.now();
  } else if (k === 40) { // Player holding down
    piece.down();
  } else if (k === 37) { // Player holding left
    piece.moveLeft();
  } else if (k === 39) { // Player holding right
    piece.moveRight();
  } else if (k === 83) { // Player pressed s
    piece.rotate(3);
    dropStart = Date.now();
  } else if (k === 68) { // Player pressed d
    piece.rotate(1);
    dropStart = Date.now();
  } else if (k === 70) { // Player pressed f
    piece.rotate(2);
    dropStart = Date.now();
  } else if (k === 65) { // Player pressed a
    holdPiece();
  } else if (k === 32) { // Player pressed space
    while (piece.down() === 0) {
      continue;
    }
  }
}

function drawBoard() {
  for (let y = 0; y < BOARDHEIGHT; y++) {
    for (let x = 0; x < BOARDWIDTH; x++) {
      if (!board[y][x][0]) {
        setColor(clear);
        drawSquare(boardX + x, TOPSPACE + y);
      }
    }
  }

  for (let y = 0; y < BOARDHEIGHT; y++) {
    for (let x = 0; x < BOARDWIDTH; x++) {
      if (board[y][x][0]) {
        setColor(board[y][x][0]);
        drawSquare(boardX + x, TOPSPACE + y);
      }
    }
  }
}

function drawBorders() {
  context.fillStyle = menuColor;
  context.fRect((sideBarX + 0.5) * tilesz,
    (TOPSPACE + BOARDHEIGHT - 4.5) * tilesz,
    (RIGHTSPACE - 1) * tilesz,
    thickLine * tilesz);

  // make boundry around game board
  context.fRect(LEFTSPACE * tilesz - 1,
    TOPSPACE * tilesz,
    thickLine * tilesz,
    (BOARDHEIGHT + thickLine) * tilesz - 1);
  context.fRect((sideBarX - thickLine) * tilesz + 1,
    TOPSPACE * tilesz,
    thickLine * tilesz,
    (BOARDHEIGHT + thickLine) * tilesz - 1);
  context.fRect(LEFTSPACE * tilesz,
    (TOPSPACE + BOARDHEIGHT) * tilesz,
    (sideBarX - LEFTSPACE) * tilesz,
    (thickLine) * tilesz);
};

function initSideBoard() {
  // draw all canvas black
  setColor('black');
  context.fRect(0, 0,
    canvas.width,
    canvas.height);
  
  drawBorders( '#99D3DF' );
  drawScoreBar();
  // line seperating preview from hold
  //context.fillStyle = '#99D3DF';
}

function main() {
  if (!gdone) {
    var now = Date.now();
    var delta = now - dropStart;
    if (piece === null) {
      piece = nextPiece();
    }

    if (delta > GRAVITY - speed) {
      piece.down();
      dropStart = now;
    }
  }

  if (!done) {
    requestAnimationFrame(main);
  }
}

function initGame() {
  initCanvas();
  initScores();
  initBoard();
  initStats();
  initSideBoard();
  initRandomizer();
  isPieceHeld = 0;
  done = false;
  gdone = false;
  speed = 0;
  dropStart = Date.now();
  piece = null;
}

function playEB() {
  BOARDWIDTH = 10;
  BOARDHEIGHT = 20;
  LEFTSPACE = 2;
  RIGHTSPACE = 5;
  TOPSPACE = 4;
  BOARDPERCENT = 0.7;
  PREVIEW = 5;
  BOTTOMSPACE = 1;

  gameMode = EB;
  initGame();
  drawBoard();
  main();
}

function playAC() {
  BOARDWIDTH = 10;
  BOARDHEIGHT = 14;
  LEFTSPACE = 2;
  RIGHTSPACE = 5;
  TOPSPACE = 4;
  BOARDPERCENT = 0.6;
  PREVIEW = 3;

  gameMode = AC;
  initGame();
  drawBoard();
  main();
}
