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
        titleText = game.add.text((game.width - 353)/2, (game.height)/4, "Game Over!", 
        {
            fill: "#e6e6ff",
            font: "65px Arial"
        }); 
        scoreText = game.add.text((game.width - 353)/2, (game.height)/2, "Your score: " + score, 
        {
            fill: "#e6e6ff",
            font: "65px Arial"
        }); 
    },
    update: function()
    {
        
    }
};