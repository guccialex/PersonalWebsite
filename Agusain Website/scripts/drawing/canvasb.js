var canvas = document.querySelector('canvas');

canvas.height = 1500;
canvas.width = 2000;

//add the event listener for mouse and keyboard
canvas.addEventListener("mousedown", _MouseWasPressed, false);
//mouse down event
//mouse leaves event
canvas.addEventListener("mouseleave", _MouseUpOrOut, false);
//mouse released event
canvas.addEventListener("mouseup", _MouseUpOrOut, false);
//mouse moving over the frame event
window.addEventListener("mousemove", _MouseMoves, false);
//key pressed events
window.addEventListener("keydown", _KeyPressed, false);
//when a key is released
window.addEventListener("keyup", _KeyUnpressed, false);




//if the mouse is currently down or not
var mouseisdown = false;

//mouse's pos
var mouseX = -40;
var mouseY = -40;

// the offset of the mouse, to account for actual placement in the canvas
var mouseXoffset = 10;
var mouseYoffset = 10;

// the list of the keys that are currently held down
var currentlydown = [];


// 30 fps
var framespersecond = 1000 * (1 / 60)




function _MouseWasPressed(e) {
  _UpdateMousePos(e);
  mouseisdown = true;

  //run for the user to use
  WhenMousePressed();
}


//called when the function leaves the frame or is released
function _MouseUpOrOut(e) {
  _UpdateMousePos(e);

  //if the mouse was held down, release it and run the user's "when mouse released" function
  if (mouseisdown == true) {
    mouseisdown = false
    WhenMouseReleased();
  }
}


function _MouseMoves(e) {
  _UpdateMousePos(e);

  //update the mouse position here, so I can do non straight lines
  WhenMouseMoved();
}




function _KeyPressed(e) {

  var keypressed = e.key;

  //if the key is not currently in the list, push it in, else do nothing
  if (_GetPosInList(keypressed, currentlydown) == -1) {
    currentlydown.push(keypressed);
  }

  // The user function for when a key is pressed
  WhenKeyPressed(keypressed);
}


function _KeyUnpressed(e) {
  var keypressed = e.key;

  var indexifexists = _GetPosInList(keypressed, currentlydown)

  if (indexifexists != -1) {
    //splice to remove it from the list
    currentlydown.splice(indexifexists, 1)

    //user function if a key is released
    WhenKeyUnpressed();
  }
}


function _GetPosInList(object, list) {
  //a helper function for key pressed and anything that wants to know if an object is in a list
  //if its in the list, return the position of it in the list, otherwise return -1

  var posinlist = -1

  for (var listindex = 0; listindex < list.length; listindex++) {
    listitem = list[listindex]
    if (listitem == object) {
      posinlist = listindex;
      break;
    }
  }
  return (posinlist)
}




function _UpdateMousePos(e) {

    var x = e.clientX;
    var y = e.clientY;

    var cbounds = canvas.getBoundingClientRect();

    var scalerx = canvas.width / cbounds.width
    var scalery = canvas.height / cbounds.height

    mouseX = (x - cbounds.left) * scalerx
    mouseY = (y - cbounds.top) * scalery

}





var c = canvas.getContext('2d', {
  alpha: true
});


//pseudo anti-aliasing
c.translate(0.5, 0.5);

//set line width
c.lineWidth = 2 * canvas.width / 800;



//base drawing functions
function _DrawLine(x1, y1, x2, y2, colour) {
  //when called, draws a line from x1,y1 to x2,y2
  c.beginPath();
  c.strokeStyle = colour;
  c.moveTo(x1, y1);
  c.lineTo(x2, y2);
  c.stroke();
}

function _DrawRect(x1, y1, width, height, colour) {

  c.beginPath();
  c.fillStyle = colour;
  c.fillRect(x1, y1, width, height);
}

//image drawing not supported right now
function _DrawImage(imagenum) {

}

function _DrawBackground() {
  c.beginpPath();
  c.rect(0, 0, canvas.width, canvas.height);
  c.fillStyle = "yellow";
  c.fill();
}

function _ClearBackground() {
  c.clearRect(-1,-1, canvas.width, canvas.height);
}







//Objects holding lists of lines
class DrawingObject {
  constructor() {
    //just setting its x and y position as 0
    this.x = 0;
    this.y = 0;
    // a list of the images, lines and rects of this object stored here
    this.components = [];
    // if there is an image, it'd be stored in this a variable
    this.image = 0;
  }

  addimage(imagenum, x, y) {
    this.components.push([imagenum, x, y])
  }

  addline(x1, y1, x2, y2, colour) {
    this.components.push(['line', x1, y1, x2, y2, colour])
  }

  addrect(x1, y1, x2, y2, colour) {
    //colours probably probably hex string
    this.components.push(['rect', x1, y1, x2, y2, colour])
  }

  drawself() {
    //this.components is now just a big list of components , use the drawlistofthings function to draw it all
    drawlistofthings(this.components, this.x, this.y)
  }
}


//takes in a list of images, lines and rectangles and draws them relative to the x and y passed in
function drawlistofthings(listofthings, x, y) {

  //go over each line,image,or background in this thing to be drawn
  for (var currentthingnum = 0; currentthingnum < listofthings.length; currentthingnum++) {
    //the current component to be drawn
    currentthing = listofthings[currentthingnum]

    //looks at the identifying element of each thing to decide what to do with it
    if (currentthing[0] == "line") {
      // format passed in is x1,y1,x2,y2,color
      var x1 = currentthing[1] + x
      var y1 = currentthing[2] + y
      var x2 = currentthing[3] + x
      var y2 = currentthing[4] + y
      var colour = currentthing[5]

      _DrawLine(x1, y1, x2, y2, colour)
    }

    if (currentthing[0] == "rect") {
      // format passed in is x1,y1,x2,y2,color
      var x1 = currentthing[1] + x
      var y1 = currentthing[2] + y
      var x2 = currentthing[3] + x
      var y2 = currentthing[4] + y
      var colour = currentthing[5]

      _DrawRect(x1, y1, x2, y2, colour)
    }

    if (currentthing[0] == "image") {
      var x1 = x
      var y1 = y
      var image = currentthing[1]

      _DrawImage(x1, y1, image);
    } else {}

  }

}






//runs when mouse is clicked
function WhenMousePressed() {}

//when mouse is moved
function WhenMouseMoved() {}

//when the mouse is released or leaves the screen
function WhenMouseReleased() {}

//runs when key is pressed
function WhenKeyPressed(keypressed) {}

//when a key is released
function WhenKeyUnpressed(keyunpressed) {}








var framecount = 0

var oldmx = mouseX
var oldmy = mouseY

//sort of like the draw function in p5, the function that is called to be drawn
function main() {
  //_ClearBackground();

  framecount += 1

  //_ClearBackground()

  //_DrawLine(1, 2, canvas.width, canvas.height, "#ff0000")



  _DrawLine(mouseX,mouseY,oldmx,oldmy,"#00a0a0")

  oldmx = mouseX
  oldmy = mouseY

}




function drawmain() {
  main();
  setTimeout(drawmain, framespersecond);
}


drawmain();
