//The actual shooting game

//Variables
var keyW, keyA, keyS, keyD; //WASD Controls
var click, clickX, clickY; //Mouse clicks
var gravity = 850; //World Properties
var score = 0, scoreText; //Score keeping
var sky, platforms, ground, ledge; //BG
//Player
var player;
var playerData = 
{
    speed: 150,
    jump: 450,
    jumpCount: 0,
    deathSpeed: 450,
    guns: 
    {
        pistol: 
        {
            damage: 20,
            range: 500,
            gunImage: null,
            bulletImage: null,
            fireRate: 400,
            bulletSpeed: 1000,
            bulletsPerClip: 6,
            reloadTime: 2000
        },
        sniper: 
        {
            damage: 80,
            range: 800, 
            gunImage: null,
            bulletImage: null,
            fireRate: 900,
            bulletSpeed: 1500,
            bulletsPerClip: 2,
            reloadTime: 4000
        },
        rifle:
        {
            damage: 40, 
            range: 500,
            gunImage: null,
            bulletImage: null, 
            fireRate: 100,
            bulletSpeed: 1000,
            bulletsPerClip: 30,
            reloadTime: 2000
        }
    }
};
//Enemy
var enemy = 
{
    basic: 
    {
        spawnPos: 150, //Units away from the player
        number: 3,
        jump: 200,
        speed: 50,
        health: 100,
        deathSpeed: 200,
        //Chances range from 0 to 1
        chanceOfDirectionChange: 0.01,
        chanceOfJump: 0.01
    },
    power:
    {
        
    },
    flying:
    {
        
    }

};
var muOne, muTwo, muThree; //Music
var bulletSpeed = 1000, nextFire = 0, fireRate = 400; //Gun
//Rifle, handgun, etc.
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
    	ledge = platforms.create(300, 600, 'ground');
    	ledge.body.immovable = true;
    	ledge = platforms.create(1000, 650, 'ground');
    	ledge.body.immovable = true;
    	ledge = platforms.create(-200, 700, 'ground');
    	ledge.body.immovable = true;
    	
    	//Score Display
    	scoreText = game.add.text(20, 20, "Score: " + score, {fill: "#003366"}); 
    	scoreText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    	
    	//Player Sprites
    	player = game.add.sprite(game.width/2, game.height/2, 'dude');
    	player.anchor.set(0.5);
    	//Player physics
    	game.physics.arcade.enable(player);
    	player.body.bounce.y = 0.2;
    	player.body.gravity.y = gravity;
    	player.body.bounce.x = 0.4;
    	player.body.collideWorldBounds = true;
    	player.alive = true;
    	//PlayerAnimations
    	player.animations.add('left', [0, 1, 2, 3], 10, true);
    	player.animations.add('right', [5, 6, 7, 8], 10, true);
    	player.direction = 0;
    	
    	//Enemy Sprites
    	for (var i = 0; i < enemy.number; i++)
    	{
    		//Find random number between screen range (that isnt close to player) and set it as x for enemy
    		do 
    		{
    			var randomX = Math.random() * game.width;
    		} 
    		while ((randomX > (game.width/2 - enemy.spawnPos)) && (randomX < (game.width/2 + enemy.spawnPos)));
    			
    		var tempEnemy = game.add.sprite(randomX, 100, 'baddie');
    		//Enemy Physics
    		game.physics.arcade.enable(tempEnemy);
    		tempEnemy.body.bounce.y = 0.2;
    		tempEnemy.body.gravity.y = gravity;
    		tempEnemy.body.bounce.x = 0.4;
    		tempEnemy.body.collideWorldBounds = true;
    		//Stores the enemy in the enemy array
    		enemyArr[i] = tempEnemy;
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
    	game.physics.arcade.collide(platforms, player);
    	game.physics.arcade.collide(platforms, enemyArr);

    	//Changes score and makes new box for score background.
    	scoreText.setText("Score: " + score);
    	
    	if(player.alpha === 1)
    	{
    	    //Checks for player movement
        	this.playerMove();
        	//Checks for shooting of bullet
        	this.shootBullet();
        	//Checks for collision of bullet
        	this.playerBulletCollision();
    	}

    	//Moves the enemies
    	this.enemyMovement();
    	//Checks for dead player
    	this.playerDeath();
    	//Checks for dead enemies
    	for (var i = 0; i < enemy.number; i++)
    	{
    	    this.deathSprite(enemyArr[i]); 
    	}
    	this.deathSprite(player, playerData.deathSpeed);
    	//Checks for game over (all enemies dead or player dead)
    	this.gameOver();
    	
    },
    
    //** Create dash by double tapping in a direction.
    //Player movement for jump, left, and right
    playerMove: function()
    {
    	//Player movement for left or right
    	player.body.velocity.x = 0;
    	if (keyA.isDown)
    	{
    		player.body.velocity.x = -playerData.speed;
    		player.animations.play('left');
    		player.direction = 0;
    	}
    	else if (keyD.isDown)
    	{
    		player.body.velocity.x = playerData.speed;
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
        //Press w for jump or double jump
        if (player.body.touching.down)
        {
            player.jumpCount = 0;
        }
        keyW.onDown.add(this.jumpCheck, this);
    },
    //Checks for jumping/double jumping
    jumpCheck: function()
    {
        //Players can only double jump once
        if(player.jumpCount < 2)
        {
            player.body.velocity.y = -playerData.jump;
            player.jumpCount++;
        }
    },
    //** Enemies sometimes dashes in a direction. 
    //Enemies move. If enemies are already moving in a direction, they are more likely to keep moving in that direction. At any point, they have a 1% chance of changing directions. 
    enemyMovement: function()
    {
    	for (var i = 0; i < enemy.number; i++)
    	{
    		//If enemy direction is 0, it moves to the left
    		if(enemyArr[i].direction === 0)
    		{
    			enemyArr[i].body.velocity.x = -enemy.speed;
    			if(Math.random() > (1 - enemy.chanceOfDirectionChange))
    			{
    				enemyArr[i].direction = 1;
    			}
    		}
    		//If enemy direction is 1, it moves to the right
    		else if (enemyArr[i].direction === 1)
    		{
    			enemyArr[i].body.velocity.x = enemy.speed;
    			if(Math.random() > (1 - enemy.chanceOfDirectionChange))
    			{
    				enemyArr[i].direction = 0;
    			}
    		}
    		//Enemy Jumps
    		if(Math.random() > (1 - enemy.chanceOfJump))
    		{
    		    enemyArr[i].body.velocity.y = -enemy.jump;
    		}
    	}
    },
    
    //Player death
    playerDeath: function()
    {
        for (var i = 0; i < enemy.number; i++)
        {
            if(enemyArr[i].alpha === 1)
            {
                if (game.physics.arcade.collide(player, enemyArr[i]))
                {
                    this.deathAnimation(player);
                }
            }
        }
    },
    
    //Game over
    gameOver: function()
    {
          if ((score === enemy.number) || !player.alive)
          {
              game.state.start('state2');
          }
    },
    
    
    //** Enemies shoot bullets. 
    enemyShootBullet: function()
    {
        
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
    			
    			//Sets the new nextFire time
    			nextFire = game.time.now + fireRate;
    		}
    	}
    },
    
    //When an enemy and a bullet collides, play death animation for enemy and destroy bullet. 
    //When bullet and terrain collides, bullet is detroyed.
    playerBulletCollision: function()
    {
    	//Checks for each enemy and bullet
    	for (var enemyIndex = 0; enemyIndex < enemyArr.length; enemyIndex++)
    	{
    		for (var bulletIndex = 0; bulletIndex < bulletArr.length; bulletIndex++)
    		{
    		    //Collision in bewteen enemy and bullet
    			if(game.physics.arcade.collide(enemyArr[enemyIndex], bulletArr[bulletIndex]))
    			{
    			    //Starts death animation for enemy
    				this.deathAnimation(enemyArr[enemyIndex], enemy.deathSpeed);
    				//Kills bullets
    				bulletArr[bulletIndex].destroy();
    				//Increases score
    				score++; 
    			}
    			//Collision in between bullet and terrain
    			if(game.physics.arcade.collide(bulletArr[bulletIndex], platforms))
    			{
    			    bulletArr[bulletIndex].destroy();
    			}
    		}
    	}
    },
    
    //Plays death animation for the sprite. 
    deathAnimation: function(sprite, time)
    {
    	//Fades the sprite
    	game.add.tween(sprite).to( { alpha: 0 }, time, Phaser.Easing.Linear.None, true);
    	sprite.body.velocity.x = 0;
    	sprite.body.velocity.y = 0;
    },
    
    //Completely kills off the sprite if it has already faded
    deathSprite: function(sprite)
    {
    	if(sprite.alpha < 0.1) 
    	{
    	    sprite.destroy();
    	    sprite.alive = false;
    	}
    },
    
    //Debugging purposes
    debug: function(x)
    {
        console.log("Debug: " + x);
    }
};