var dog,sadDog,happyDog,garden,washroom, database;
var foodS,foodStock;
var fedTime,lastFed,currentTime;
var feed,addFood;
var foodObj;
var gameState,readState;

function preload(){
sadDog=loadImage("Images/Dog.png");
happyDog=loadImage("Images/happy dog.png");
garden=loadImage("Images/Garden.png");
washroom=loadImage("Images/Wash Room.png");
bedroom=loadImage("Images/Bed Room.png");
}

function setup() {
  database=firebase.database();
  createCanvas(400,500);
  
  foodObj = new Food();

  foodStock=database.ref('FOOD');
  foodStock.on("value",readStock);

  fedTime=database.ref('FEEDTIME');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  //read game state from database
  readState=database.ref('GAMESTATE');
  readState.on("value",function(data){
    gameState=data.val();
  });
   
  dog=createSprite(200,400,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoodstock);
}

function draw() {
  currentTime=hour();
  if(currentTime==(lastFed)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(lastFed+1)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }
   
   if(gameState == "Hungry"){
     feed.show();
     addFood.show();
     dog.addImage(sadDog);
   }else{
    feed.hide();
    addFood.hide();
    dog.remove();
   }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    FOOD:foodObj.getFoodStock(),
    FEEDTIME:hour(),
    GAMESTATE:"Hungry"
  })
}

//function to add food in stock
function addFoodstock(){
  foodS++;
  database.ref('/').update({
    FOOD:foodS
  })
}

//update gameState
function update(state){
  database.ref('/').update({
    GAMESTATE:state
  })
}