/*SHOOTER GAME
 * "**" is for incomplete or broken code. 
 */

var game = new Phaser.Game(1200, 1000, Phaser.AUTO);
game.state.add('state0', shooter.state0); //Main Menu
game.state.add('state1', shooter.state1); //The actual game
game.state.add('state2', shooter.state2); //Score screen

game.state.start('state1');	