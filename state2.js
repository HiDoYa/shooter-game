//The score screen
shooter.state2 = function(){};

//Variables
var titleText, scoreText;

shooter.state2.prototype =
{
    preload: function()
    {
        
    },
    create: function()
    {
        //Outputs text.
        titleText = game.add.text(game.width/2, game.height/4, "Game Over!", 
        {
            fill: "#e6e6ff",
            font: "65px Arial"
        }); 
        scoreText = game.add.text(game.width/2, game.height/2, "Your score: " + score, 
        {
            fill: "#e6e6ff",
            font: "65px Arial"
        }); 
        //The center of text becomes the anchor.
        titleText.anchor.set(0.5);
        scoreText.anchor.set(0.5);
    },
    update: function()
    {
        
    }
};