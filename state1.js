//The actual shooting game

//Variables
var keyW, keyA, keyS, keyD; //WASD Controls
var click, clickX, clickY; //Mouse clicks
var gravity = 850; //World Properties
var score = 0, scoreText; //Score keeping
var sky, platforms, ground, ledge; //BG
var player, playerSpeed = 150, playerJump = 450; //Player
var enemyNum = 10, enemyJump = 300, enemySpeed = 50; //Enemies
var muOne, muTwo, muThree; //Music
var bulletSpeed = 600, nextFire = 0, fireRate = 400; //Gun
//Rifle, handgun, etc.
var pistol = 
{
    damage: 30,
    range: 500,
    gunImage: null,
    bulletImage: null,
    fireRate: 400,
    bulletsPerClip: 4,
    reloadTime: 2000
};
var jumpFlag = false, jumpTime; //For jumping
//Arrays
var bulletArr = new Array(); //Array for bullets
var enemyArr = new Array(); //Array for enemies


shooter.state1 = function(){};

shooter.state1.prototype = 
{
    preload: function()
    {
        game.load.image('sky', 'assets/sky.png');
    	game.load.image('ground', 'assets/platform.png');
    	game.load.image('star', 'assets/star.png');
    	game.load.image('firstaid', 'assets/firstaid.png');
    	game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    	game.load.spritesheet('baddie', 'assets/baddie.png', 32, 32);
    	game.load.audio('animalCrossingMP3', 'assets/animalCrossing.mp3');
    	game.load.audio('tobyFoxMP3', 'assets/dogBass.mp3');
    	game.load.audio('diddyKongMP3', 'assets/diddyKong.mp3');
    },
    
    create: function()
    {
    	//Music
    	muOne = game.add.audio('animalCrossingMP3');
    	muTwo = game.add.audio('tobyFoxMP3');
    	muThree = game.add.audio('diddyKongMP3');
    	//muThree.play();
    	
    	//Enables physics
    	game.physics.startSystem(Phaser.Physics.ARCADE);
    	//Create sky/background
    	sky = game.add.sprite(0, 0, 'sky');
    	sky.scale.setTo(1.5, 1.5);
    	//Platforms (includes ground and ledges)
    	platforms = game.add.group();
    	platforms.enableBody = true;
    	//Ground
    	ground = platforms.create(0, game.world.height - 60, 'ground');
    	ground.scale.setTo(3, 2);
    	ground.body.immovable = true;
    	//Ledges
    	ledge = platforms.create(300, 700, 'ground');
    	ledge.body.immovable = true;
    	ledge = platforms.create(1000, 700, 'ground');
    	ledge.body.immovable = true;
    	ledge = platforms.create(-200, 600, 'ground');
    	ledge.body.immovable = true;
    	
    	//Score Display
    	scoreText = game.add.text(20, 20, "Score: " + score, {fill: "#003366"}); 
    	scoreText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    	
    	//Player Sprites
    	player = game.add.sprite(game.width/2, game.height/2, 'dude');
    	//Player physics
    	game.physics.arcade.enable(player);
    	player.body.bounce.y = 0.2;
    	player.body.gravity.y = gravity;
    	player.body.bounce.x = 0.4;
    	player.body.collideWorldBounds = true;
    	//PlayerAnimations
    	player.animations.add('left', [0, 1, 2, 3], 10, true);
    	player.animations.add('right', [5, 6, 7, 8], 10, true);
    	player.direction = 0;
    	
    	//Enemy Sprites
    	for (var i = 0; i < enemyNum; i++)
    	{
    		//Find random number between screen range (that isnt close to player) and set it as x for enemy
    		do 
    		{
    			var randomX = Math.random() * game.width;
    		} 
    		while ((randomX > (game.width/2 - 100)) && (randomX < (game.width/2 + 100)));
    			
    		var enemy = game.add.sprite(randomX, 100, 'baddie');
    		//Enemy Physics
    		game.physics.arcade.enable(enemy);
    		enemy.body.bounce.y = 0.2;
    		enemy.body.gravity.y = gravity;
    		enemy.body.bounce.x = 0.4;
    		enemy.body.collideWorldBounds = true;
    		//Stores the enemy in the enemy array
    		enemyArr[i] = enemy;
    		//Sets a random enemy direction
    		enemyArr[i].direction = Math.round(Math.random());
    	}
    	
    	//Player controls
    	keyW = game.input.keyboard.addKey(Phaser.Keyboard.W);
    	keyA = game.input.keyboard.addKey(Phaser.Keyboard.A);
    	keyS = game.input.keyboard.addKey(Phaser.Keyboard.S);
    	keyD = game.input.keyboard.addKey(Phaser.Keyboard.D);
    	game.input.mouse.capture = true;
    },
    
    update: function()
    {
        //Mouse Click 
    	click = game.input.activePointer.isDown;
    	clickX = game.input.activePointer.x;
    	clickY = game.input.activePointer.y;
        
    	//Collision
    	game.physics.arcade.collide(player, platforms);
    	game.physics.arcade.collide(platforms, enemyArr);
    	game.physics.arcade.collide(player,enemyArr);

    	//Changes score and makes new box for score background.
    	scoreText.setText("Score: " + score);
    	
    	//Checks for player movement
    	this.playerMove();
    	//Checks for shooting of bullet
    	this.shootBullet();
    	//Checks for collision of bullet
    	this.bulletEnemyCollision();
    	//Moves the enemies
    	this.enemyMovement();
    	//Checks for dead enemies
    	this.deathSprite(); 
    },
    
    //Player movement for jump, left, and right
    playerMove: function()
    {
    	//Player movement for left or right
    	player.body.velocity.x = 0;
    	if (keyA.isDown)
    	{
    		player.body.velocity.x = -playerSpeed;
    		player.animations.play('left');
    		player.direction = 0;
    	}
    	else if (keyD.isDown)
    	{
    		player.body.velocity.x = playerSpeed;
    		player.animations.play('right');
    		player.direction = 1;
    	}
    	//When player stops moving, sets the sprite pic based on the direction they face
    	else 
    	{
    		player.animations.stop(0);
    		if (player.direction ===  0)
    		{
    			player.frame = 0;
    		}
    		else 
    		{
    			player.frame = 5;
    		}
    	}
        //Press w for jump or for double jump ** Double jump should only work when tapping twice. 
        if(keyW.isDown && player.body.touching.down)
    	{
    		player.body.velocity.y = -playerJump;
    		jumpFlag = true;
    		jumpTime = game.time.now
    	}
    	else if (keyW.isDown && jumpFlag === true && game.time.now > (jumpTime + 450))
    	{
    	    player.body.velocity.y = -playerJump;
    	    jumpFlag = false;
    	}
    },
    
    //Enemies move. If enemies are already moving in a direction, they are more likely to keep moving in that direction. At any point, they have a 1% chance of changing directions. 
    enemyMovement: function()
    {
    	for (var i = 0; i < enemyNum; i++)
    	{
    		//If enemy direction is 0, it moves to the left
    		if(enemyArr[i].direction === 0)
    		{
    			enemyArr[i].body.velocity.x = -enemySpeed;
    			if((Math.round(Math.random() + 0.49)) === 0)
    			{
    				enemyArr[i].direction = 1;
    			}
    		}
    		//If enemy direction is 1, it moves to the right
    		else if (enemyArr[i].direction === 1)
    		{
    			enemyArr[i].body.velocity.x = enemySpeed;
    			if((Math.round(Math.random() + 0.49)) === 0)
    			{
    				enemyArr[i].direction = 0;
    			}
    		}
    		if(Math.random() > 0.99)
    		{
    		    enemyArr[i].body.velocity.y = enemyJump;
    		}
    	}
    },
    
    //Clicking creates and shoots a bullet based on player direction and fire rate. 
    shootBullet: function()
    {
    	//Sets a delay to the firing of bullets based on the nextFire variable
    	if(game.time.now > nextFire)
    	{
    		if(click)
    		{
    			//Create and enable physics for bullets
    			var bullets = game.add.sprite(player.x, player.y, 'star');
    			game.physics.arcade.enable(bullets);
    			
    			//Adds bullet to the bulletArr array
    			bulletArr[bulletArr.length] = bullets;
    			
    			//** Inefficient code 
    			//Shoots bullet with bulletSpeed velocity and calculated angle
    			var angle = Math.atan((clickY - player.y) / (clickX - player.x));
    			bullets.body.velocity.x = Math.cos(angle) * bulletSpeed;
    			bullets.body.velocity.y = Math.sin(angle) * bulletSpeed;

    			//For angles between 91 degrees to 270 degrees, the x and y velocity is negative
    			if (clickX < player.x)
    			{
    			    bullets.body.velocity.x = -bullets.body.velocity.x;
    			    bullets.body.velocity.y = -bullets.body.velocity.y;
    			}
    			
    			/* This is for two dimensional shooting
    			if (player.direction === 1)
    			{
    				bullets.body.velocity.x = bulletSpeed;
    			}
    			else if (player.direction === 0)
    			{
    				bullets.body.velocity.x = -bulletSpeed;
    			}
    			*/
    			
    			//Sets the new nextFire time
    			nextFire = game.time.now + fireRate;
    		}
    	}
    },
    
    //When an enemy and a bullet collides, play death animation for enemy and destroy bullet. 
    bulletEnemyCollision: function()
    {
    	//Checks for each enemy and bullet
    	for (var enemyIndex = 0; enemyIndex < enemyArr.length; enemyIndex++)
    	{
    		for (var bulletIndex = 0; bulletIndex < bulletArr.length; bulletIndex++)
    		{
    			if(game.physics.arcade.collide(enemyArr[enemyIndex], bulletArr[bulletIndex]))
    			{
    				this.deathAnimation(enemyArr[enemyIndex]);
    				bulletArr[bulletIndex].destroy();
    			}
    		}
    	}
    },
    
    //Plays death animation for the sprite. 
    deathAnimation: function(sprite)
    {
        //Increases score **
    	score++; 
    	//Fades the sprite
    	game.add.tween(sprite).to( { alpha: 0 }, 150, Phaser.Easing.Linear.None, true);
    },
    
    //[Continuation of death] Completely kills off the sprite if it has already faded
    deathSprite: function()
    {
    	for (var i = 0; i < enemyNum; i++)
    	{
        	if(enemyArr[i].alpha < 0.1) 
        	{
        		enemyArr[i].destroy();
    
        	}
    	}
    },
    
    //Debugging purposes
    debugging: function(x)
    {
        console.log("Debug: " + x);
    }
};