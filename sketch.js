class Seed{
  constructor(pos,seedtype,angle){
    this.pos = pos;
    this.seedtype = seedtype
    this.angle=angle

    this.age = 0
    this.c = color(234,130,150);
    
    if (this.seedtype=='flower1'){
      this.startcolor = color('#5e5a74')
      this.endcolor = color('#322e4c')
      if (crazymode==1){
        this.startcolor = color('#868879')
        this.endcolor = color('#b0aa9d')

      }
      else if (crazymode==2)
      {
        this.startcolor = color('#c7b3bb')
        this.endcolor = color('#c29190')

      }
      this.deathcolor = this.endcolor
      this.fdiv = 3
      this.sddiv = 2;
      this.maxage = 200;
      this.strokecolor = this.startcolor
    }
    else if (this.seedtype=='flower2'){
      this.startcolor = color('#d2d4ae')
      this.endcolor = color('#b1ab60')

      if (crazymode==1){
        this.startcolor = color('#b35eb0')
        this.endcolor = color('#c085ab')

      }
      else if (crazymode==2)
      {

        this.startcolor = color('#ccb9b7')
        this.endcolor = color('#b39499')
        
      }
      this.deathcolor = this.endcolor 
      this.fdiv = 9
      this.sddiv = 2;
      this.maxage = 200;
      this.strokecolor = this.startcolor
    }
    else if (this.seedtype=='flower3'){
      this.startcolor = color('#80b0af')
      this.endcolor = color('#256a77')
      if (crazymode==2)
      {

        this.startcolor = color('#ebbd9c')
        this.endcolor = color('#efc0b6')
        
      }

      this.deathcolor = this.endcolor 
      this.fdiv = 1.5
      this.sddiv = .7;
      this.maxage = 200;
      this.strokecolor = this.startcolor
    }

  }
  show(){
    let seedsize = sqrt(this.age+1);

    push()
    translate(this.pos.x,this.pos.y)
    rotate(this.angle)
    let curcolor = lerpColor(this.startcolor,this.endcolor,this.age/this.maxage)
    if (this.age>this.maxage){
      curcolor = this.deathcolor
    }
    fill(curcolor)
    stroke(this.strokecolor)
    // noStroke();
    beginShape()

    let fdiv = this.fdiv;
    let sdiv = this.sddiv;
    vertex(0,0-seedsize/fdiv) //topmiddle
    vertex(seedsize/sdiv,-seedsize/sdiv) //topright

    vertex(seedsize/fdiv,0) // mid right

    vertex(seedsize/sdiv,seedsize/sdiv) //bottom right)

    vertex(0,seedsize/fdiv) //bottom middle

    vertex(-seedsize/sdiv,seedsize/sdiv) //bottom left
    
    vertex(-seedsize/fdiv,0) // mid left
    endShape(CLOSE)
    pop();

    
    
  }
  incrementAge(howmany=1){
    this.age=this.age+howmany;
  }
}
class SeedThrower{
  constructor(pos,speed,armstrength,framebuffer=20,seedstritbution,nf=1,noisedis=5,hm=3)
  {
    this.pos=pos;
    this.vel=createVector(3,3);
    this.acc=createVector(0,0);
    this.nf = nf;
    this.noisedis = noisedis;
    this.speed = speed
    this.armstrength=armstrength
    this.framebuffer = framebuffer
    this.seedistribution = seedstritbution;
    this.myseeds = [];
    this.hm=hm
    this.age=0;
    this.maxage=300;

  }

  throwSeeds(startangle=0){
    let hm=this.hm;

    let currentSeedType = random(this.seedistribution)

    for (let i=0;i<hm;i++){
      let curarmstr = this.armstrength * random(.9,1.1)
      let nx = cos(i*this.speed+startangle) *curarmstr + this.pos.x
      let ny = sin(i*this.speed+startangle) * curarmstr + this.pos.y
      this.myseeds.push ( new Seed(createVector(nx,ny),currentSeedType,i*this.speed+startangle))


    }

  }

  show(){
    let trailcolor = color('#b8b6b9')

    trailcolor.setAlpha(50)
    if (crazymode==1)
    {
      trailcolor = color('#efa9a6')
    }
    else if (crazymode==2)
    {
      trailcolor = color('#e5d7ba')
    }
    fill(trailcolor)
    noStroke();
    circle(this.pos.x,this.pos.y,3)
    
    for (let i=0;i<this.myseeds.length;i++){
      this.myseeds[i].show();
     
    }
  }
  move(){
    let nf =this.nf
    let noisedis = this.noisedis

    let nx = this.vel.x + map(noise(this.pos.x*nf),0,1,-noisedis/2,noisedis/2)
    let ny = this.vel.y+ map(noise(this.pos.y*nf),0,1,-noisedis/2,noisedis/2)

    this.vel = createVector(nx,ny)
    
    this.update()
  }
  update(){
    this.age = this.age+1;
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.edges()
  }
  edges(){
    if (this.pos.x < this.framebuffer){
      this.vel = createVector(0-this.vel.x,this.vel.y*random(1.1))
      // this.throwSeeds(0)
    }
    else if (this.pos.x > width - this.framebuffer){
      this.vel = createVector(0-this.vel.x,this.vel.y*random(1.1))
      // this.throwSeeds(0)
    }

    if (this.pos.y < this.framebuffer){
      this.vel = createVector(this.vel.x*random(1.1),0-this.vel.y)
      // this.throwSeeds(0)
    }
    else if (this.pos.y > height - this.framebuffer){
      this.vel = createVector(this.vel.x*random(1.1),0-this.vel.y)
      // this.throwSeeds(0)
    }

  }

  
  incrementAllAges(){
    let newseeds = []
      for (let i=0;i<this.myseeds.length;i++){
        this.myseeds[i].incrementAge()
        if (this.myseeds[i].age < this.myseeds[i].maxage)
        {
          newseeds.push(this.myseeds[i])
        }
      }
    this.myseeds = newseeds;
  }

}

let seedthrowers = [];
let frames = 0;
let crazymode=0;
function setup() {

  createCanvas(400, 900);
  angleMode(DEGREES);
  pixelDensity(1);
  let bgcolor = color('#f4efe2');
  let rando = random();
  if (rando > .67)
  {
    crazymode=1
    bgcolor = color('#dc615d');
  }
  else if (rando>.33)
  {
    crazymode = 2
    bgcolor = color('#f1e9d9');
  }
  background(bgcolor);
  
  


  seedthrowers.push(new SeedThrower(createVector(random(100,100),random(200,300)),120,2,20,['flower1','flower2','flower2','flower3','flower3','flower3','flower3'],.01,.5,3))
  seedthrowers.push(new SeedThrower(createVector(random(200,101),random(250,300)),120,2,20,['flower1'],.01,.5,3))
  if (crazymode==1)
  {
    seedthrowers.push(new SeedThrower(createVector(random(200,500),random(200,600)),120,5,50,['flower1','flower2','flower2','flower2','flower3'],.1,.05,3))
    seedthrowers.push(new SeedThrower(createVector(random(200,500),random(200,600)),72,8,50,['flower1','flower2','flower2','flower2','flower2','flower3'],.1,.05,5))
  }
  else if (crazymode==2)
  {
    let mmm = 10;
    for (let kk=0;kk<mmm;kk++)
    {
      seedthrowers.push(seedthrowers[0])
    }
  }
  

  let earlyloops =5;
  for (let j=0;j<earlyloops;j++){

  
    for (let i=0;i<seedthrowers.length;i++){
      
    seedthrowers[i].show()
    seedthrowers[i].move()
    // seedthrowers[i].age()
    if (random(1) > .8 && frames<1000){
      seedthrowers[i].throwSeeds(random(0,360))
    }
  }


}


}

function draw() {
  // background(255,3);
  
  frames++;
  let newseeders = []
  for (let i=0;i<seedthrowers.length;i++){
    
    seedthrowers[i].show()
    seedthrowers[i].move()
    if (frames>100)
    {
      seedthrowers[i].incrementAllAges()
    }
    if (frames<300 && frames%13==0)
    {
      seedthrowers[i].throwSeeds(random(0,360))

    }
    if (seedthrowers[i].age < seedthrowers[i].maxage){
      newseeders.push(seedthrowers[i])
    }
    else{
      let thebuf = 20;
      seedthrowers.push(new SeedThrower(createVector(random(thebuf,width-thebuf),random(thebuf,height-thebuf)),120,2,20,seedthrowers[i].seedistribution,.01,.5,3))
      frames = 0
    }
  }
  seedthrowers = newseeders;


  if (frames>1000){
    noLoop();
  }
  


}
