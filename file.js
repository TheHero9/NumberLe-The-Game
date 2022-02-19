const targetNumbers = [];

const allPossibleNumbers=[];
var digits = ['0', '1', '2', '3', '4', '5', '6', '7'];
const NUMBER_LENGTH = 7
const FLIP_ANIMATION_DURATION = 500
const DANCE_ANIMATION_DURATION = 500
const keyboard = document.querySelector("[data-keyboard]")
const alertContainer = document.querySelector("[data-alert-container]")
const guessGrid = document.querySelector("[data-guess-grid]")
var sound1 = new Audio("sounds/click.mp3");


var arr = generatePermutations(digits, 7);
arr.forEach(e => allPossibleNumbers.push(e.join('')));


var targetNumber = allPossibleNumbers[Math.floor(Math.random()*30240)]
while (targetNumber[0]==="0"){
  targetNumber = allPossibleNumbers[Math.floor(Math.random()*30240)]
}



startInteraction()

function generatePermutations(list, size) {
  if (size > list.length) return [];
  else if (size == 1) return list.map(d => [d]);
  return list.flatMap(d =>
    generatePermutations(
      list.filter(a => a !== d),
      size - 1
    ).map(item => [d, ...item])
  );
}


function startInteraction() {
  document.addEventListener("click", handleMouseClick)
  document.addEventListener("keydown", handleKeyPress)
}

function stopInteraction() {
  document.removeEventListener("click", handleMouseClick)
  document.removeEventListener("keydown", handleKeyPress)
}

function handleMouseClick(e) {
  if (e.target.matches("[data-key]")) {
    pressKey(e.target.dataset.key)
    return
  }

  if (e.target.matches("[data-enter]")) {
    submitGuess()
    return
  }

  if (e.target.matches("[data-delete]")) {
    deleteKey()
    return
  }

  if (e.target.matches("[data-info]")) {
    showAlert("Guess the 7-digit number.                           You'll have 5 attempts.The numbers are not repeated.\
         🟩=CORRECT | 🟨=WRONG POSITION | ⬛=WRONG ", duration=4000)
    return
  }

  if (e.target.matches("[data-credits]")) {
    showAlert("Designed by Demetrios Vlassis. Special thanks to Yavor Borissov!")
    return
  }

}

function handleKeyPress(e) {
  if (e.key === "Enter") {
    submitGuess()
    return
  }

  if (e.key === "DEL" || e.key === "Backspace") {
    deleteKey()
    return
  }

  if (e.key.match(/^[0-9]$/)) {
    pressKey(e.key)
    return
  }


}

function pressKey(key) {
  const activeTiles = getActiveTiles()
  if (activeTiles.length >= NUMBER_LENGTH) return
  const nextTile = guessGrid.querySelector(":not([data-letter])")
  nextTile.dataset.letter = key.toLowerCase()
  nextTile.textContent = key
  nextTile.dataset.state = "active"
}

function deleteKey() {
  const activeTiles = getActiveTiles()
  const lastTile = activeTiles[activeTiles.length - 1]
  if (lastTile == null) return
  lastTile.textContent = ""
  delete lastTile.dataset.state
  delete lastTile.dataset.letter
}

function submitGuess() {
  const activeTiles = [...getActiveTiles()]
  if (activeTiles.length !== NUMBER_LENGTH) {
    showAlert("Not enough numbers")
    shakeTiles(activeTiles)
    wrongSound()
    return
  }

  const guess = activeTiles.reduce((word, tile) => {
    return word + tile.dataset.letter
  }, "")


  stopInteraction()
  activeTiles.forEach((...params) => flipTile(...params, guess))
}

function flipTile(tile, index, array, guess) {
  const letter = tile.dataset.letter
  const key = keyboard.querySelector(`[data-key="${letter}"i]`)
  setTimeout(() => {
    tile.classList.add("flip")
  }, (index * FLIP_ANIMATION_DURATION) / 2)

  tile.addEventListener(
    "transitionend",
    () => {
      tile.classList.remove("flip")
      if (targetNumber[index] === letter) {
        tile.dataset.state = "correct"
        key.classList.add("correct")
      } else if (targetNumber.includes(letter)) {
        tile.dataset.state = "wrong-location"
        key.classList.add("wrong-location")
      } else {
        tile.dataset.state = "wrong"
        key.classList.add("wrong")
      }

      if (index === array.length - 1) {
        tile.addEventListener(
          "transitionend",
          () => {
            startInteraction()
            checkWinLose(guess, array)
          },
          { once: true }
        )
      }
    },
    { once: true }
  )
}

function getActiveTiles() {
  return guessGrid.querySelectorAll('[data-state="active"]')
}

function showAlert(message, duration = 1000) {
  const alert = document.createElement("div")
  alert.textContent = message
  alert.classList.add("alert")
  alertContainer.prepend(alert)
  if (duration == null) return

  setTimeout(() => {
    alert.classList.add("hide")
    alert.addEventListener("transitionend", () => {
      alert.remove()
    })
  }, duration)
}

function shakeTiles(tiles) {
  tiles.forEach(tile => {
    tile.classList.add("shake")
    tile.addEventListener(
      "animationend",
      () => {
        tile.classList.remove("shake")
      },
      { once: true }
    )
  })
}

function checkWinLose(guess, tiles) {
  if (guess === targetNumber) {
    showAlert("You Win! Thank you for playing. <3", 5000)
    danceTiles(tiles)
    stopInteraction()
    winSound()
    return
  }

  const remainingTiles = guessGrid.querySelectorAll(":not([data-letter])")
  if (remainingTiles.length === 0) {
    showAlert("Your number was: "+targetNumber, null)
    stopInteraction()
    loseSound()

  }
}

function danceTiles(tiles) {
  tiles.forEach((tile, index) => {
    setTimeout(() => {
      tile.classList.add("dance")
      tile.addEventListener(
        "animationend",
        () => {
          tile.classList.remove("dance")
        },
        { once: true }
      )
    }, (index * DANCE_ANIMATION_DURATION) / 5)
  })
}

function restartGame(){
   window.location.reload();
}


function makeSound(key){
  switch (key) {
    case "0":
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
    var sound1 = new Audio("sounds/click.mp3");
          sound1.play();
      break;

  }
}
function winSound(key){
  var sound2=  new Audio("sounds/enter.mp3")
  sound2.play();
}
function loseSound(key){
  var sound3= new Audio("sounds/lose.mp3")
  sound3.play();
}
function wrongSound(){
  var wrong = new Audio("sounds/wrong.mp3")
  wrong.play()
}

// Key Sound
$(".s").click(function(){
  var buttonInnerHTML = this.innerHTML;
  makeSound(buttonInnerHTML);
})
$(document).keydown(function(e){
  makeSound(e.key);
})

// Restart Game
$(".restart-button").click(function(){
  restartGame()
})
