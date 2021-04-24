const gameInfo = {
  score: 0,
  shownPairs: [],
  openedCards: [],
  level: 2,
  pairsRemain: 0,
  health: 3
};

const records = [];

const gameField = document.getElementById("game");
const levelCounter = document.getElementById("level");
const scoreCounter = document.getElementById("score");
const healthCounter = document.getElementById("health");
const recordsButton = document.getElementById("records");

recordsButton.addEventListener("click", () => {
  let msg = "No records yet =(";
  if (records.length) {
    msg = records
      .map((r) => `Name: ${r.name}  Level: ${r.level}  Score: ${r.score}`)
      .join("\n");
  }
  alert(msg);
});

generateLevel(gameInfo.level);

// =============================================================================

function generateLevel(level) {
  gameField.innerHTML = "";
  levelCounter.innerHTML = level;
  scoreCounter.innerHTML = gameInfo.score;
  healthCounter.innerHTML = gameInfo.health;

  for (let i = 0; i < 64; i++) {
    const flipCard = document.createElement("div");
    flipCard.className = "flip-card";

    const sideFront = document.createElement("div");
    sideFront.className = "flip-card-front";
    const sideFrontImg = document.createElement("img");
    sideFrontImg.setAttribute("src", "./img/jpg/solid.jpg");
    sideFrontImg.setAttribute("alt", "avatar");
    sideFront.appendChild(sideFrontImg);

    const sideBack = document.createElement("div");
    sideBack.className = "flip-card-back";
    const sideBackImg = document.createElement("img");
    sideBackImg.setAttribute("alt", "avatar");
    sideBack.appendChild(sideBackImg);

    flipCard.appendChild(sideFront);
    flipCard.appendChild(sideBack);
    flipCard.classList.add("invisible");
    flipCard.setAttribute("id", i);

    gameField.appendChild(flipCard);
  }

  const cards = Array.from(document.getElementsByClassName("flip-card"));

  shuffle(cards);

  const pairedCards = [];
  const imgNames = Array.from(new Array(32)).map((_, idx) => idx + 1);

  for (let i = 0; i < 64; i += 2) {
    const pair = [cards[i], cards[i + 1]];
    const imgName = getFreeImgName(imgNames);
    pair[0].lastElementChild.firstElementChild.setAttribute(
      "src",
      `./img/svg/${imgName}.svg`
    );
    pair[1].lastElementChild.firstElementChild.setAttribute(
      "src",
      `./img/svg/${imgName}.svg`
    );
    pairedCards.push(pair);
  }

  for (let i = 0; i < level; i++) {
    const firstCard = pairedCards[i][0];
    const secondCard = pairedCards[i][1];
    gameInfo.shownPairs.push([firstCard, secondCard]);

    firstCard.classList.remove("invisible");
    firstCard.classList.add("visible");
    firstCard.addEventListener("click", handleClick);

    secondCard.classList.remove("invisible");
    secondCard.classList.add("visible");
    secondCard.addEventListener("click", handleClick);

    setTimeout(() => {
      secondCard.classList.add("flip");
      firstCard.classList.add("flip");

      setTimeout(() => {
        secondCard.classList.remove("flip");
        firstCard.classList.remove("flip");
      }, 500 * level);
    }, 300);
  }

  gameInfo.pairsRemain = gameInfo.shownPairs.length;
}

function handleClick(event) {
  const card = event.currentTarget;

  if (isSameCardClicked(card.getAttribute("id"))) {
    return;
  }

  if (gameInfo.openedCards.length === 2) {
    return;
  }

  card.classList.add("flip");
  gameInfo.openedCards.push(card);

  if (gameInfo.openedCards.length === 2) {
    setTimeout(() => {
      if (isPairedCards()) {
        hideGuessedCards();
      } else {
        closeBackCards();
      }
    }, 800);
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function isSameCardClicked(clickedCardId) {
  return !!gameInfo.openedCards.find(
    (c) => c.getAttribute("id") === clickedCardId
  );
}

function isPairedCards() {
  for (let pair of gameInfo.shownPairs) {
    if (
      pair.includes(gameInfo.openedCards[0]) &&
      pair.includes(gameInfo.openedCards[1])
    ) {
      return true;
    }
  }
  return false;
}

function closeBackCards() {
  gameInfo.openedCards.forEach((c) => {
    c.classList.remove("flip");
  });
  gameInfo.openedCards = [];
  gameInfo.health -= 1;
  healthCounter.innerHTML = gameInfo.health;
  checkEndGame();
}

function hideGuessedCards() {
  gameInfo.openedCards.forEach((c) => {
    c.classList.remove("flip");
    c.removeEventListener("click", handleClick);
    setTimeout(() => {
      c.classList.remove("visible");
      c.classList.add("invisible");
    }, 400);
  });
  gameInfo.openedCards = [];
  gameInfo.score += 1;
  gameInfo.pairsRemain -= 1;
  scoreCounter.innerHTML = gameInfo.score;

  checkWin();
}

function getFreeImgName(names) {
  let rand = Math.floor(0 + Math.random() * (names.length - 0));
  const imgName = names[rand];
  names.splice(rand, 1);
  return imgName;
}

function checkEndGame() {
  if (gameInfo.health === 0) {
    writeRecord();
    gameInfo.score = 0;
    gameInfo.shownPairs = [];
    gameInfo.openedCards = [];
    gameInfo.level = 1;
    gameInfo.pairsRemain = 0;
    gameInfo.health = 3;
    generateLevel(gameInfo.level);
  }
}

function checkWin() {
  if (gameInfo.score === 527) {
    writeRecord();
    alert("Congratulations! You have won!");
  } else {
    setTimeout(() => {
      if (gameInfo.pairsRemain === 0) {
        gameInfo.level += 1;
        gameInfo.shownPairs = [];
        generateLevel(gameInfo.level);
      }
    }, 1500);
  }
}

function writeRecord() {
  const name = prompt("Enter your name", "");
  if (name) {
    const index = records.findIndex((r) => r.name === name);
    if (index > -1) {
      const existingRecord = records[index];
      if (existingRecord.score < gameInfo.score) {
        existingRecord.level = gameInfo.level;
        existingRecord.score = gameInfo.score;
      }
    } else {
      records.push({ name, level: gameInfo.level, score: gameInfo.score });
    }
  }
}
