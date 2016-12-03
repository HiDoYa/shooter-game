//The score screen
shooter.state2 = function(){};

//Variables
var titleText, scoreText, hitRateText, instructionsText;

shooter.state2.prototype =
{
    preload: function()
    {
        
    },
    create: function()
    {
        game.stage.backgroundColor = '#00cc99';
        //Outputs text.
        titleText = game.add.text(game.width/2, game.height/4, "Game Over!", 
        {
            fill: "#e6e6ff",
            font: "75px Arial"
        }); 
        //** Game does not reset properly. Variables are not reset. (Scopes?)
        instructionsText = game.add.text(game.width/2, (game.height/4) + 80, "Click to go back to main menu.", 
        {
            fill: "#e6e6ff",
            font: "40px Arial"
        }); 
        scoreText = game.add.text(game.width/2, game.height/2, "Your final score: " + score, 
        {
            fill: "#e6e6ff",
            font: "60px Arial"
        }); 
        hitRateText = game.add.text(game.width/2, 3*game.height/4, "Your bullet hit rate was " + Math.round((score/bulletArr.length)*100) + "%.", 
        {
            fill: "#e6e6ff",
            font: "60px Arial"
        }); 
        //The center of text becomes the anchor.
        titleText.anchor.set(0.5);
        scoreText.anchor.set(0.5);
        hitRateText.anchor.set(0.5);
        instructionsText.anchor.set(0.5);
        
        //Captures mouse input
        game.input.mouse.capture = true;
    },
    update: function()
    {
        if (game.input.activePointer.isDown)
        {
            game.state.start("state0");
        }
    }
};