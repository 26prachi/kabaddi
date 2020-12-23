var p1, database;
var position,position2;
var p2;
var p1animation,p2animation;
var gameState;
var p1Score;
var p2Score;

function preload(){
    p1animation =loadAnimation("assests/player1a.png","assests/player1b.png","assests/player1a.png");
    p2animation =loadAnimation("assests/player2a.png","assests/player2b.png","assests/player2a.png");
}

function setup(){
  database = firebase.database();
  //console.log(database);
  createCanvas(600,600);

  p1 = createSprite(300,250,10,10);
  p1.shapeColor = "red";
  p1.addAnimation("walking",p1animation);
  p1animation.frameDelay = 200
  p1.scale = 0.5
  p1.setCollider("circle", 0,0,60)
  
  var player1Position = database.ref('p1/position');
  player1Position.on("value", readPosition, showError); 

  p2 = createSprite(300,250,10,10);
  p2.shapeColor = "green";
  p2.addAnimation("walkin2",p2animation);
  p2animation.frameDelay = 200
  p2.scale = -0.5
  p2.setCollider("circle", 0,0,60)

  var player2Position = database.ref('p2/position');
  player2Position.on("value", readPosition2, showError);


  gameState = database.ref('gameState/');
  gameState.on("value", readGS, showError);

  p1Score = database.ref('p1Score/');
  p1Score.on("value", readScore1, showError);

  p2Score = database.ref('p2Score/');
  p2Score.on("value", readScore2, showError);
}

function draw(){
  background("white");

  if(gameState === 0){
    fill("black")
    text("Press space to start the toss",100,200);


    if(keyDown("space")){
      rand = Math.round(random(1,2))
      if(rand === 1){
        database.ref('/').update({
          'gameState': 1  
        })
        alert("RED RIDE")
      }
      if(rand === 2){
        database.ref('/').update({
          'gameState': 2  
        })
        alert("YELLOW RIDE")
      }
      database.ref('p1/position').update({
        'x': 150,
        'y': 300  
      })

      database.ref('p2/position').update({
        'x': 450,
        'y': 300  
      })

    }
    
  }





  if (gameState === 1){

    /*
    database.ref('/').update({
     'p1Score':0,
     'p2Score':0
    })
    */

    if(keyDown(LEFT_ARROW)){
      writePosition(-5,0);
    }
    else if(keyDown(RIGHT_ARROW)){
      writePosition(5,0);
    }
    else if(keyDown(UP_ARROW)){
      writePosition(0,-5);
    }
    else if(keyDown(DOWN_ARROW)){
      writePosition(0,+5);
    }
    else if(keyDown("w")){
      writePosition2(0,-5);
    }
    else if(keyDown("d")){
      writePosition2(0,+5);
    }

    if(p1.x > 500){
      database.ref('/').update({
        'p1Score': p1Score - 5 ,
        'p2Score': p2Score + 5 ,
        'gameState': 0  

      })
    
      
    }

    if(p1.isTouching(p2)){
      database.ref('/').update({
        'gameState': 0  ,
        'p1Score': p1Score + 5 ,
        'p2Score': p2Score - 5 
      })
      
      alert("RED LOST")
    }

    
  }

  if(gameState === 2){
   /*database.ref('/').update({
      'p1Score':0,
      'p2Score':0
     })
     */
    
 
    if(keyDown("a")){
      writePosition2(-5,0);
    }
    else if(keyDown("s")){
      writePosition2(5,0);
    }
    else if(keyDown("w")){
      writePosition2(0,-5);
    }
    else if(keyDown("d")){
      writePosition2(0,+5);
    }
    else if(keyDown(UP_ARROW)){
      writePosition(0,-5);
    }
    else if(keyDown(DOWN_ARROW)){
      writePosition(0,+5);
    }

    if(p2.x < 150){
      database.ref('/').update({
        'p1Score': p1Score + 5, 
        'gameState': 0,
        'p2Score': p2Score - 5   
      })
    
    }

    if(p1.isTouching(p2)){
      database.ref('/').update({
        'gameState': 0  ,
        'p1Score': p1Score - 5,
        'p2Score': p2Score + 5  
      })
      
      alert("YELLOW LOST")
    }
    
    
  }
    textSize(15)
    text("RED: "+p1Score,350,15);
    text("YELLOW: "+p2Score,150,15);
    

    drawline();
    drawline1();
    drawline2();
    console.log(gameState)

    drawSprites();
  
}

function writePosition(x,y){
  database.ref('p1/position').set({
    'x': position.x + x ,
    'y': position.y + y
  })
}

function writePosition2(x,y){
  database.ref('p2/position').set({
    'x': position2.x + x ,
    'y': position2.y + y
  })
}

function readPosition(data){
  position = data.val();
  //console.log(position.x);
  p1.x = position.x;
  p1.y = position.y;
}

function readPosition2(data){
  position2 = data.val();
  //console.log(position2.x);
  p2.x = position2.x;
  p2.y = position2.y;
}

function readGS(data){
  gameState = data.val();
}

function readScore1(data1){
  p1Score = data1.val();
}

function readScore2(data2){
  p2Score = data2.val();
}



function showError(){
  console.log("Error in writing to the database");
}

function drawline(){
  for(var i = 0; i<600; i=i+20){
    line (300,i,300,i+10)
  }
}

function drawline1(){
  for(var i = 0; i<600; i=i+20){
    stroke("yellow");
    strokeWeight(4)
    line (100,i,100,i+10)
  }
}

function drawline2(){
  for(var i = 0; i<600; i=i+20){
    stroke("red");
    strokeWeight(4);
    line (500,i,500,i+10)
  }
}
