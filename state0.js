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
        game.stage.backgroundColor = '#00cc99';
        //Creates start game button
        button = game.add.button(game.width/2, game.height/2, "startButton");
        button.anchor.set(0.5);
        
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