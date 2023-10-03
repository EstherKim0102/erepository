let handpose;
let video;
let hands = [];
let dh;
let x1;
let y1;
let x2;
let y2;

var song;
var fft;
let bubbles = [];
let lights = [];
let a;
let c = 0;


function preload() {
  song = loadSound('underwater.wav');
}

function setup() {
  createCanvas(600, 400);	
  video = createCapture(VIDEO);
  video.size(width, height);
  handpose = ml5.handpose(video, modelReady);
  handpose.on("predict", function(results) { hands = results; });
  video.hide();
	
  fft = new p5.FFT();

  for (let i = 0; i < 15; i++) {
	  let x = random(width);
	  let y = random(height);
	  let r = random(20,60);
	  let b = new Bubble(x, y, r);
	  bubbles.push(b);
  }
}


function modelReady() {
  console.log("Model ready!");
}
 

function draw() {
background(255);

	push();
	fill(255, 0, 255);
	text('Right Key to start', 10, 30);
	text('Left Key to pause', 10, 50);
	text(dh, 10, 80);
	pop();

	translate(video.width, 0);
	scale(-1,1);

	  if (hands.length > 0) {
		let thumb = hands[0].annotations.thumb;
//			fill(0, 255, 0, 30);
//			noStroke();
			// The top of the thumb is index 3
		   // ellipse(thumb[3][0], thumb[3][1], 24);
		x1 = str(thumb[3][0]);
		y1 = str(thumb[3][1]);
		  
		let index = hands[0].annotations.indexFinger;
			fill(100, 0, 255);
			noStroke();
			// The top of the index finger is index 3
		   // ellipse(index[3][0], index[3][1], 24);
		x2 = str(index[3][0]);
		y2 = str(index[3][1]);

		  
//		dh = dist(thumb[3][0], thumb[3][1], index[3][0], index[3][1] );	 
		dh = dist (x1, y1, x2, y2); 
		  ellipse(x1, y1, dh);

				//	  point = (0, 0);
				//	  var vert = map(point, thumb[3][0], thumb[3][1], index[3][0], index[3][1]);
				//	  print("vert" + vert);
	  }

	 fft.analyze(); // audio data!!
	 amp = fft.getEnergy(20,500);	
	 var alpha = map(amp, 0, 200, 0, 5);
		print("amp = " + amp);
		print("alpha = " + alpha);
		a = str(alpha);
		print(a);


	
	if (dh < 40) {
		  for (let i = bubbles.length -1; i >= 0; i--) {
		    if(bubbles[i].contains(x1, y1)){
		       bubbles.splice(i,1);
		    }
		  }
		  for (let a = 0; a < 3; a++) {
		  let lr = random(10,60);
		  let l = new Light(x1, y1, lr);
		  lights.push(l);
		  }
	} else {
		
	}
//	  for (let i = 0; i < 5; i = 10) {
//		//  	  bubbles.push(b);
//	  }
	
	 for (let i = 0; i < bubbles.length; i++) {
		    if(bubbles[i].contains(x1, y1)) {
			//	if (dh < 50){
				bubbles[i].changeColor(240);
				ellipse(x1, y1,50);
			} else {
				bubbles[i].changeColor(0);
			}
	  bubbles[i].move();
	  bubbles[i].show();
	 }
  
	
  for (let a = 0; a < lights.length; a++) {
    	if(lights[a].contains(x1, y1)) {
		lights[a].changeColor(255);
    } else {
		lights[a].changeColor(50);
    }
	  lights[a].move();
	  lights[a].show();
  }
  
  	if (lights.length > 5) {
    lights.splice(0, 1);
  	}
  
}

function keyPressed () {
	if (keyCode === LEFT_ARROW){
	song.pause();
	noLoop();	
} else if (keyCode === RIGHT_ARROW){
	song.play();
	loop();
}
}

class Light {
  
  constructor (x, y, r) {    
  this.x = x;
  this.y = y;
  this.r = r;    
  this.col = random(255);
  }
  
  changeColor(col) {
    this.col = col;
  }
  
  contains(px, py) {
    let d = dist(this.x, this.y, px, py);
    if (d < this.r) {
	 return true; 
    } else {
      return false;
    }  
  }
  
  move() {
//    this.x = this.x + random(-5,5);
//    this.y = this.y + random(-5,5);   
	this.x = this.x + random(-a, a); 
    this.y = this.y + random(-a, a); 
  }
  
  show() {
    noStroke ();
    fill(this.col, 255, 255, 50);
    ellipse(this.x, this.y, this.r * 2);   
  }
}




class Bubble {
  
  constructor (x, y, r, col) {
  this.x = x;
  this.y = y;
  this.r = r;    
  this.col = random(255);
  }
  
  changeColor(col) {
    this.col = col;
  }
  
  contains(px, py) {
    let d = dist(this.x, this.y, px, py);
    if (d < this.r) {
      return true;
	//	a = a + 335;
		// stroke(255);
    } else {
      return false;
				//a = a - 5;
    }
  }
  
  move() {
	this.x = this.x + random(-a, a); 
    this.y = this.y + random(-a, a); 
  }
  
  show() {
    noStroke(); 
    fill(255, 0, this.col, 50);
    ellipse(this.x, this.y, this.r * 2);
    
  }
}



