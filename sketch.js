var SERVE =2;
var PLAY = 1;
var END = 0;
var gameState = SERVE;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;


function preload(){
  trex_running =   loadAnimation("trex0.png","trex01.png","trex02.png");
  trex_collided = loadAnimation("trex.collided.png");
  
  groundImage = loadImage("ground.1.png");
  
  
  cloudImage = loadImage("cloud.1.png");
  
  obstacle1 = loadImage("obstacle0.png");
  obstacle2 = loadImage("obstacle01.png");
  obstacle3 = loadImage("obstacle02.png");
  obstacle4 = loadImage("obstacle03.png");
  obstacle5 = loadImage("obstacle04.png");
  obstacle6 = loadImage("obstacle05.png");
  
  gameOverImg = loadImage("game_over.png");
  restartImg = loadImage("restart.0.png");
  
  serveImg=loadImage("serve_image.png");
  playImg=loadImage("play_image.jfif");
}

function setup() {
  createCanvas(windowWidth, windowHeight); 
 
  trex = createSprite(50,height-180,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.7;
  trex.visible=false;
  
  ground = createSprite(width-200,height-20,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  ground.visible=false;
  
  gameOver = createSprite(width/2,height/2);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,gameOver.y-40);
  restart.addImage(restartImg);
  
  
  gameOver.scale = 0.7;
  restart.scale = 0.7;
  
  serve=createSprite(width/2,height/2);
  serve.addImage(serveImg);
  serve.visible=false;
  play=createSprite(serve.x,serve.y+200);
  play.addImage(playImg);

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(width/2,height-20,width,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  background("lightgreen")
// trex.debug = true;
 trex.setCollider("circle",0,0,40)
 
  textSize(30)
  fill("black");
  text("Score: "+ score, width-200,height/10);
  
  restart.depth=cloudsGroup.depth+1;
  gameOver.depth=cloudsGroup.depth+1;
  
  if(gameState===SERVE){
    serve.visible=true;
    background.visible=false;
    obstaclesGroup.visible=false;
    cloudsGroup.visible=false;
    if(touches.length > 0 ){
       reset();
       }
  if(mousePressedOver(play)) {
      reset();
    }
  }
  
  else if (gameState===PLAY){
    text.visible=true;
    trex.visible=true;
    ground.visible=true;
    obstaclesGroup.visible=true;
    cloudsGroup.visible=true;
    serve.visible=false;
    play.visible=false;
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
   background.velocityX = -3
    if (background.x < 0) {
      background.x = background.width / 2;
    }
    if((touches.length > 0 || keyDown("SPACE")) && trex.y >= height-120) {
      trex.velocityY=-12
      touches=[]
    }
  
    trex.velocityY = trex.velocityY +0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
     background.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width,120,40,10);
    cloud.y = Math.round(random(height-500,height-200));
    cloud.addImage(cloudImage);
    cloud.scale = 1;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = width;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(width-200,height-40,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 2*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.7;
    obstacle.lifetime = width;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  
  score = 0;
  
}