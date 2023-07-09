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
var rope, rope2;
var fruit;
var fruit_con, fruit_con2;

var bg_img, rabbit, food;
var bunny;
var button, button2;

var eat, blink, sad;

var bg_sound, cut_sound, sad_sound, eat_sound, air_sound;

var blower;
var mute_btn;

var star_img, star, star2;
var empty_star, one_star, two_star, display_star;

function preload(){
  bg_img = loadImage("background.png");
  rabbit = loadImage("Rabbit-01.png");
  food = loadImage("melon.png");
  star_img = loadImage("star.png");

  bg_sound = loadSound("sound1.mp3");
  cut_sound = loadSound("rope_cut.mp3");
  sad_sound = loadSound("sad.wav");
  eat_sound = loadSound("eating_sound.mp3");
  air_sound = loadSound("air.wav");

  empty_star = loadAnimation("empty.png");
  one_star = loadAnimation("one_star.png");
  two_star = loadAnimation("stars.png");

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

  bunny = createSprite(200, 620, 100, 100);
  bunny.scale = 0.2;

  bunny.addAnimation("blinking", blink);
  bunny.addAnimation("eating", eat);
  bunny.addAnimation("crying", sad);

  bunny.changeAnimation("blinking");

  display_star = createSprite(50, 20, 30, 30);
  display_star.scale = 0.2;

  display_star.addAnimation("empty", empty_star);
  display_star.addAnimation("one", one_star);
  display_star.addAnimation("two", two_star);

  display_star.changeAnimation("empty");

  button = createImg("cut_btn.png");
  button.position(100, 90);
  button.size(50, 50);
  button.mouseClicked(drop);

  button2 = createImg("cut_btn.png");
  button2.position(450, 90);
  button2.size(50, 50);
  button2.mouseClicked(drop2);

  mute_btn = createImg("mute.png");
  mute_btn.position(450, 20);
  mute_btn.size(50, 50);
  mute_btn.mouseClicked(mute);

  blower = createImg("baloon2.png");
  blower.position(260, 370);
  blower.size(120, 120);
  blower.mouseClicked(airblow);

  var fruit_options = {
    density: 0.001
  };

  ground = new Ground(250, 690, 600, 20);

  rope = new Rope(7, {x: 120, y:90});
  rope2 = new Rope(7, {x: 490, y:90});

  fruit = Bodies.circle(300, 300, 15, fruit_options);
  Composite.add(rope.body, fruit);

  fruit_con = new Link(rope, fruit);
  fruit_con2 = new Link(rope2, fruit);

  star = createSprite(320, 50, 20, 20);
  star.addImage(star_img);
  star.scale = 0.02;

  star2 = createSprite(50, 320, 20, 20);
  star2.addImage(star_img);
  star2.scale = 0.02;

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

  if(fruit != null){
    image(food, fruit.position.x, fruit.position.y, 60, 60);
  }

  if(collide(fruit, bunny, 80) == true){
    World.remove(engine.world, fruit);
    fruit = null;
    bunny.changeAnimation("eating");
    eat_sound.play();
  }

  if(fruit != null && fruit.position.y >= 650){
    bunny.changeAnimation("crying");
    sad_sound.play();
    fruit = null;
  }

  if(collide(fruit, star, 20) == true){
    star.visible = false;
    display_star.changeAnimation("one");
  }

  if(collide(fruit, star2, 20) == true){
    star2.visible = false;
    display_star.changeAnimation("two");
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

function collide(body, sprite, x){
  if (body != null){
    var d = dist(body.position.x, body.position.y, sprite.position.x, sprite.position.y);
    if( d <= x){
      return true;
    } 
    else {
      return false;
    }
  }
}

function airblow(){
  Body.applyForce(fruit, {x:0, y:0}, {x:0, y:-0.03});
  air_sound.play();
}

function mute(){
  if(bg_sound.isPlaying()){
    bg_sound.stop();
  } else {
    bg_sound.play();
  }
}