let word = "";
let guessAttempt = 0;
const letterButtons = document.querySelectorAll(".letterGuess");

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

async function getWordList() {
  const response = await fetch("../data/hangman.txt");
  if (!response.ok) {
    throw new Error("Failed to find word list.");
  }
  const words = await response.text();
  return words.split("\n");
}

async function pickRandomWord() {
  const words = await getWordList();
  let word = words[getRandomInt(words.length)];
  let underscoreWord = replaceWithUnderScores(word);
  document.getElementById("word").innerHTML = underscoreWord;
  return word;
}

document.addEventListener("DOMContentLoaded", () => {
  let getWord = new Promise((resolve, reject) => {
    resolve(pickRandomWord());
  });
  getWord.then((randomWord) => {
    word = addSpaceBetweenLetters(randomWord);
  });
  letterButtons.forEach((letterGuess) =>
    letterGuess.addEventListener("click", handleGuess)
  );
  document
    .getElementById("restartButton")
    .addEventListener("click", restartGame);
});

function restartGame() {
  let getWord = new Promise((resolve, reject) => {
    resolve(pickRandomWord());
  });
  getWord.then((randomWord) => {
    word = addSpaceBetweenLetters(randomWord);
  });
  document.getElementById("word").innerHTML = "";
  let underscoreWord = replaceWithUnderScores(word);
  document.getElementById("word").innerHTML = underscoreWord;
  letterButtons.forEach((button) => (button.disabled = false));
  guessAttempt = 0;
  updateHangmanImg(guessAttempt);
  let status = document.getElementById("status");
  status.innerHTML = "Number of guesses: 6";
}

function handleGuess(clickedButtonEvent) {
  const clickedButton = clickedButtonEvent.target;
  const guess = clickedButton.getAttribute("char-letter");
  clickedButton.disabled = true;
  let newGuess = document.getElementById("word").innerHTML;
  let charArray = newGuess.split("");
  if (word.includes(guess)) {
    for (let i = 0; i < word.length; i++) {
      if (word[i] === guess) {
        charArray[i] = guess;
      }
    }
  } else {
    guessAttempt++;
    updateHangmanImg(guessAttempt);
  }
  newGuess = charArray.join("");
  document.getElementById("word").innerHTML = newGuess;
  updateStatusHTML(guessAttempt, word);
}

function updateHangmanImg(guessAttempt) {
  let newImage = document.createElement("img");
  newImage.src = "../img/hangman/hang" + guessAttempt + ".png";
  newImage.alt = "hangman" + guessAttempt;
  newImage.id = "hangman";
  let parent = document.getElementById("hangman").parentNode;
  parent = parent.replaceChild(newImage, document.getElementById("hangman"));
}

function addSpaceBetweenLetters(word) {
  let spacedWord = "";
  for (let i = 0; i < word.length; i++) {
    if (i < word.length - 1) {
      spacedWord += word[i];
      spacedWord += " ";
    } else if (i === word.length - 1) {
      spacedWord += word[i];
    }
  }
  return spacedWord;
}

function replaceWithUnderScores(word) {
  let underscoreWord = "";
  for (let i = 0; i < word.length; i++) {
    if (i < word.length - 1) {
      underscoreWord += "_";
      underscoreWord += " ";
    }
    if (i === word.length - 1) {
      underscoreWord += "_";
    }
  }
  return underscoreWord;
}

function updateStatusHTML(guesses, word) {
  if (word === document.getElementById("word").innerHTML) {
    document.getElementById("status").innerHTML = "You win! The word was:";
    letterButtons.forEach((button) => (button.disabled = true));
  } else if (guesses < 6) {
    document.getElementById("status").innerHTML =
      "Number of guesses: " + guesses;
  } else if (guesses === 6) {
    document.getElementById("status").innerHTML = "You lose! The word was:";
    document.getElementById("word").innerHTML = word;
    letterButtons.forEach((button) => (button.disabled = true));
  }
}
