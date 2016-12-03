//The main menu
var shooter = {};

shooter.state0 = function(){};

var button;
var click;

shooter.state0.prototype =
{
    preload: function()
    {
        //Temp placeholder image
        game.load.image("startButton", "assets/start.png");
    },
    create: function()
    {
        button = game.add.button((game.width-300)/2, (game.height-300)/2, "startButton");
        
        //Captures mouse input
        game.input.mouse.capture = true;
    },
    update: function()
    {
        click = game.input.activePointer.isDown;
        button.onInputDown.add(this.startGame, this)
    },
    startGame: function()
    {
        game.state.start("state1");
    }
};