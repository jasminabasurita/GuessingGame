function generateWinningNumber(){
  var num = Math.floor(Math.random()*100 + 1);
  return num;
}

function shuffle(arr){
  var m = arr.length,
  t,
  i;

  while(m){
    i = Math.floor(Math.random() * m--);

    t = arr[i];
    arr[i] = arr[m];
    arr[m] = t;
  }
  return arr;
}

function Game(){
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function(){
  return Math.abs(this.winningNumber - this.playersGuess);
}

Game.prototype.isLower = function(){
  if(this.playersGuess < this.winningNumber){
    return true;
  }
  return false;
}

Game.prototype.playersGuessSubmission = function(guess){
  if(guess < 1 || guess > 100 || typeof(guess) !== "number"){
    throw("That is an invalid guess.");
  }
  this.playersGuess = guess;
  return this.checkGuess();
}

Game.prototype.checkGuess = function(){
  if(this.pastGuesses.indexOf(this.playersGuess) > -1) {
    return "You have already guessed that number.";
  }
  this.pastGuesses.push(this.playersGuess);

  if(this.playersGuess === this.winningNumber){
    return "You Win!";
  }
  if(this.pastGuesses.length === 5){
    return "You Lose.";
  }
  if(Math.abs(this.playersGuess-this.winningNumber) < 10){
    return "You\'re burning up!"
  }
  if(Math.abs(this.playersGuess-this.winningNumber) < 25){
    return "You\'re lukewarm."
  }
  if(Math.abs(this.playersGuess-this.winningNumber) < 50){
    return "You\'re a bit chilly."
  }
  if(Math.abs(this.playersGuess-this.winningNumber) < 100){
    return "You\'re ice cold!"
  }
}

Game.prototype.provideHint = function(){
  var hint = [];
  hint.push(this.winningNumber);
  hint.push(generateWinningNumber());
  hint.push(generateWinningNumber());
  return shuffle(hint);
}

function newGame(){
  return new Game;
}

function submit(game){
  var guess = +$('#player-input').val();
  var response = game.playersGuessSubmission(guess);
  $('#title').text(response);
  $('#player-input').val('');
  if(response === 'You have already guessed that number.'){
    $('#subtitle').text('Guess Again');
  } else {
    $('#guess-list li:nth-child('+ game.pastGuesses.length +')').text(guess);
    if(response === 'You Win!' || response === 'You Lose.'){
      $('#subtitle').text('Click reset to play again.');
      $('#hint, #submit').prop('disabled', true);
    } else if(game.isLower()){
      $('#subtitle').text('Guess Higher!');
    } else {
      $('#subtitle').text('Guess Lower!');
    }
  }
}

$(document).ready(function(){
  var game = newGame();

  $('#submit').click(function(){submit(game);})

  $('#player-input').keypress(function(event){
    if(event.keyCode === 13){submit(game);}
  });

  $('#reset').click(function(){
    game = newGame();
    $('#title').text('Play the Guessing Game!');
    $('#subtitle').text('Guess a number between 1-100!');
    $('.guess').text('-');
    $('#player-input').val('');
    $('#hint, #submit').prop('disabled', false);
  })

  $('#hint').click(function(){
    var hintArr = game.provideHint();
    $('#title').text(`The winning number is ${hintArr[0]}, ${hintArr[1]}, or ${hintArr[2]}`);
  })
})
