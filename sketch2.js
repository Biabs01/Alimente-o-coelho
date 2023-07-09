const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;

var ground;
var rope, rope2, rope3;
var fruit;
var fruit_con, fruit_con2, fruit_con3;

var bg_img, rabbit, food;
var bunny;
var button, button2, button3;

var eat, blink, sad;

var bg_sound, cut_sound, sad_sound, eat_sound, air_sound;

var blower;
var mute_btn;

function preload(){
  bg_img = loadImage("background.png");
  rabbit = loadImage("Rabbit-01.png");
  food = loadImage("melon.png");

  bg_sound = loadSound("sound1.mp3");
  cut_sound = loadSound("rope_cut.mp3");
  sad_sound = loadSound("sad.wav");
  eat_sound = loadSound("eating_sound.mp3");
  air_sound = loadSound("air.wav");

  eat = loadAnimation("eat_0.png", "eat_1.png", "eat_2.png", "eat_3.png", "eat_4.png");
  blink = loadAnimation("blink_1.png", "blink_2.png", "blink_3.png");
  sad = loadAnimation("sad_1.png", "sad_2.png", "sad_3.png");

  blink.playing = true;
  eat.playing = true;
  sad.playing = true;

  eat.looping = false;
  sad.looping = false;
}

function setup() 
{
  createCanvas(500,700);

  bg_sound.play();
  bg_sound.setVolume(0.2);

  engine = Engine.create();
  world = engine.world;

  blink.frameDelay = 20;
  eat.frameDelay = 20;
  sad.frameDelay = 20;

  bunny = createSprite(420, 620, 100, 100);
  bunny.scale = 0.2;

  bunny.addAnimation("blinking", blink);
  bunny.addAnimation("eating", eat);
  bunny.addAnimation("crying", sad);

  bunny.changeAnimation("blinking");

  button = createImg("cut_btn.png");
  button.position(20, 30);
  button.size(50, 50);
  button.mouseClicked(drop);

  button2 = createImg("cut_btn.png");
  button2.position(330, 35);
  button2.size(50, 50);
  button2.mouseClicked(drop2);

  button3 = createImg("cut_btn.png");
  button3.position(360, 200);
  button3.size(50, 50);
  button3.mouseClicked(drop3);

  mute_btn = createImg("mute.png");
  mute_btn.position(450, 20);
  mute_btn.size(50, 50);
  mute_btn.mouseClicked(mute);

  var fruit_options = {
    density: 0.001
  };

  ground = new Ground(250, 690, 600, 20);

  rope = new Rope(8, {x: 40, y:30});
  rope2 = new Rope(7, {x: 370, y:40});
  rope3 = new Rope(4, {x: 400, y:225});

  fruit = Bodies.circle(300, 300, 15, fruit_options);
  Composite.add(rope.body, fruit);

  fruit_con = new Link(rope, fruit);
  fruit_con2 = new Link(rope2, fruit);
  fruit_con3 = new Link(rope3, fruit);

  rectMode(CENTER);
  imageMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50)
}

function draw() 
{
  background(51);
  image(bg_img, width/2, height/2, 500, 700);

  ground.show();

  rope.show();
  rope2.show();
  rope3.show();

  if(fruit != null){
    image(food, fruit.position.x, fruit.position.y, 60, 60);
  }

  if(collide(fruit, bunny) == true){
    bunny.changeAnimation("eating");
    eat_sound.play();
    window.location = "index3.html";
  }
  if(fruit != null && fruit.position.y >= 650){
    bunny.changeAnimation("crying");
    sad_sound.play();
    fruit = null;
  }

  Engine.update(engine);
  drawSprites();
}

function drop(){
  cut_sound.play();
  rope.break();
  fruit_con.detach();
  fruit_con = null;
}

function drop2(){
  cut_sound.play();
  rope2.break();
  fruit_con2.detach();
  fruit_con2 = null;
}

function drop3(){
  cut_sound.play();
  rope3.break();
  fruit_con3.detach();
  fruit_con3 = null;
}

function collide(body, sprite){
  if (body != null){
    var d = dist(body.position.x, body.position.y, sprite.position.x, sprite.position.y);
    if( d <= 80){
      World.remove(engine.world, fruit);
      fruit = null;
      return true;
    } 
    else {
      return false;
    }
  }
}

function airblow(){
  Body.applyForce(fruit, {x:0, y:0}, {x:0.01, y:0});
  air_sound.play();
}

function mute(){
  if(bg_sound.isPlaying()){
    bg_sound.stop();
  } else {
    bg_sound.play();
  }
}