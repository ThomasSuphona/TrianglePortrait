const photo = [
	//["portrait-2194457_1280.jpg",100],
	//["girl-3567600_1280.jpg",110],
	//["girl-388652_1280.jpg",70],
	//["cap-2923682_1280.jpg",150],
	//["adult-1850703_1280.jpg",100],
	//["adorable-20374_1280.jpg",70],
	["20161231_125333.jpg",70],
	["jaco.jpeg", 70], 
	["thomas1.jpg", 50]
]

let imgs = [];
let bg;

function preload()
{
	for(let i = 0; i <photo.length; i++)imgs[i] = loadImage(photo[i][0]);
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	bg = createGraphics(width, height);
  bg.noStroke();
  for (let i = 0; i < 300000; i++) {
    let x = random(width);
    let y = random(height);
    let s = noise(x*0.01, y*0.01)*2;
    bg.fill(240, 20);
    bg.rect(x, y, s, s);
  } 
	noLoop();
}

function mouseClicked()
{
	draw();
}


function draw()
{
	const index = int(random(imgs.length));
	
	let img = imgs[index];
	const ratio = min(width*0.9/img.width,height*0.9/img.height);
	img.resize(img.width*ratio, img.height*ratio);
	
	let points = getEdgePoints(img,max(img.width,img.height)*0.005,photo[index][1]);
	let triangles = Delaunay.triangulate(points);
	
	background(255);
	push();
	translate(width/2-img.width/2,height/2-img.height/2);
  for (let i = 0; i < triangles.length; i += 3) {
		noStroke();
		const cPosX = (points[triangles[i]][0] + points[triangles[i+1]][0] + points[triangles[i+2]][0])/3;
		const cPosY = (points[triangles[i]][1] + points[triangles[i+1]][1] + points[triangles[i+2]][1])/3;
		let c = img.get(cPosX,cPosY);
		fill(c);
		stroke(c);
    beginShape();
    vertex(points[triangles[i]][0], points[triangles[i]][1]);
    vertex(points[triangles[i+1]][0], points[triangles[i+1]][1]);
	  vertex(points[triangles[i+2]][0], points[triangles[i+2]][1]);
    endShape(CLOSE);
  }
	pop();
	image(bg,0,0);
}



function getEdgePoints(img,span,threshold)
{
	let points = [];
	points.push([0,0]);
	points.push([img.width,0]);
	points.push([img.width,img.height]);
	points.push([0,img.height]);
	for(let y = 0; y < img.height; y+=span)
	{
		for(let x = 0; x <img.width; x += span)
		{
			if(x > img.width-span || y > img.height-span)continue;
			let currentCol = img.get(x,y);
			let nextCol = img.get(x+span,y);
			let underCol = img.get(x,y+span);
			if(getColDist(currentCol,nextCol) > threshold || getColDist(currentCol,underCol) > threshold){
				points.push([x,y]);
			}
		}
	}
	return points;
}

function getColDist(col1,col2)
{
	return dist(col1[0],col1[1],col1[2],col2[0],col2[1],col2[2]);
}

