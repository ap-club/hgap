let blockSize = 50;
let total_row = 12;
let total_col = 12;
let board;
let context;

let snakeX;
let snakeY;

let speedX = 0;
let speedY = 0;

let snakeBody = [];

let foodX;
let foodY;

let score = 0;

let gameOver = false;

let foodImages = [];
let selectedImage; 

let popupShown = {};
let intervalId;

window.onload = function () {
    preloadImages();
    initializeGame();
    document.addEventListener("keyup", changeDirection);
    intervalId = setInterval(update, 1000 / 7);

    const infoButton = document.getElementById("infoButton");
    infoButton.addEventListener("click", showInfoPopup);
}

function preloadImages() {
    const imagePaths = [
        "images/candy.jpg",
        "images/dimsum.jpg",
        "images/decor.jpg",
        "images/fish.jpg",
        "images/nuts.jpg",
        "images/orange.jpg",
        "images/redenvelope.jpg",
        "images/springrolls.jpg"
    ];

    imagePaths.forEach((path) => {
        let img = new Image();
        img.src = path;
        foodImages.push(img);
    });
}

function initializeGame() {
    board = document.getElementById("board");
    board.height = total_row * blockSize;
    board.width = total_col * blockSize;
    context = board.getContext("2d");

    snakeX = Math.floor(Math.random() * total_col) * blockSize;
    snakeY = Math.floor(Math.random() * total_row) * blockSize;

    snakeBody = [];
    score = 0;

    placeFood();
    gameOver = false;
}

function update() {
    if (gameOver) {
        return;
    }

    context.fillStyle = "#F8F8F8";
    context.fillRect(0, 0, board.width, board.height);

    drawFood();

    if (snakeX == foodX && snakeY == foodY) {
        let randomIndex = Math.floor(Math.random() * foodImages.length);
        let selectedImageSrc = selectedImage.src;
    
        let relativeImagePath = "images/" + getRelativePath(selectedImageSrc);
    
        if (!popupShown[relativeImagePath]) {
            showPopup(relativeImagePath, function () {
                popupShown[relativeImagePath] = true;
            });
        }
    
        snakeBody.push([foodX, foodY]);
        score++;
        selectedImage = foodImages[randomIndex];
    
        placeFood();
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }

    context.fillStyle = "#FF0000";
    snakeX += speedX * blockSize;
    snakeY += speedY * blockSize;

    if (
        snakeX < 0 ||
        snakeX >= total_col * blockSize ||
        snakeY < 0 ||
        snakeY >= total_row * blockSize
    ) {
        gameOver = true;
        showGameOverPopup();
        return;
    }

    context.fillRect(snakeX, snakeY, blockSize, blockSize);
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }

    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
            gameOver = true;
            showGameOverPopup();
            return;
        }
    }
}

function drawFood() {
    context.drawImage(selectedImage, foodX, foodY, blockSize, blockSize);
}

function showGameOverPopup(callback) {
    pauseGame();
    
    let popup = document.createElement("div");
    popup.style.position = "fixed";
    popup.style.bottom = "0";
    popup.style.left = "0";
    popup.style.width = "100vw";
    popup.style.backgroundColor = "#ffe8d0";
    popup.style.padding = "40px";
    popup.style.textAlign = "center";

    let characterImage = new Image();
    characterImage.src = "images/emperor.jpg";
    characterImage.style.width = "70px";

    let scoreText = document.createElement("p");
    scoreText.innerHTML = "Score: " + score;
    scoreText.style.fontSize = "18px";
    scoreText.style.fontWeight = "bold";

    let continueButton = document.createElement("button");
    continueButton.innerHTML = "Continue";
    continueButton.style.backgroundColor = "#FFD700";
    continueButton.style.color = "#FF0000";
    continueButton.style.border = "none";
    continueButton.style.padding = "10px";
    continueButton.style.cursor = "pointer";
    continueButton.onclick = function () {
        popup.remove();
        initializeGame();
        resumeGame();
        if (callback) {
            callback();
        }
    };

    popup.appendChild(characterImage);
    popup.appendChild(document.createElement("br"));
    popup.appendChild(scoreText);
    popup.appendChild(document.createElement("br"));
    popup.appendChild(continueButton);
    document.body.appendChild(popup);
}

function changeDirection(e) {
    if (e.code == "ArrowUp" && speedY != 1) {
        speedX = 0;
        speedY = -1;
    } else if (e.code == "ArrowDown" && speedY != -1) {
        speedX = 0;
        speedY = 1;
    } else if (e.code == "ArrowLeft" && speedX != 1) {
        speedX = -1;
        speedY = 0;
    } else if (e.code == "ArrowRight" && speedX != -1) {
        speedX = 1;
        speedY = 0;
    }
}

function placeFood() {
    const randomIndex = Math.floor(Math.random() * foodImages.length);
    selectedImage = foodImages[randomIndex];

    foodX = Math.floor(Math.random() * total_col) * blockSize;
    foodY = Math.floor(Math.random() * total_row) * blockSize;
}

function showPopup(imageSrc, callback) {
    pauseGame();

    let popup = document.createElement("div");
    popup.style.position = "fixed";
    popup.style.bottom = "0";
    popup.style.left = "0";
    popup.style.width = "100vw";
    popup.style.backgroundColor = "#ffe8d0";
    popup.style.padding = "40px";
    popup.style.textAlign = "center";

    let popupImage = new Image();
    popupImage.src = imageSrc;
    popupImage.style.width = "100px"; 

    let explanationText = document.createElement("p");
    explanationText.innerHTML = getExplanation(getRelativePath(imageSrc));
    explanationText.style.fontSize = "18px";
    explanationText.style.fontWeight = "bold";

    let continueButton = document.createElement("button");
    continueButton.innerHTML = "Continue";
    continueButton.style.backgroundColor = "#FFD700";
    continueButton.style.color = "#FF0000";
    continueButton.style.border = "none";
    continueButton.style.padding = "10px";
    continueButton.style.cursor = "pointer";
    continueButton.onclick = function () {
        popup.remove();
        resumeGame();
        if (callback) {
            callback();
        }
    };

    popup.appendChild(popupImage);
    popup.appendChild(document.createElement("br"));
    popup.appendChild(explanationText);
    popup.appendChild(document.createElement("br"));
    popup.appendChild(continueButton);
    
    document.body.appendChild(popup);
}

function showInfoPopup() {
    let popup = document.createElement("div");
    popup.style.position = "fixed";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.width = "50vw";
    popup.style.backgroundColor = "#ffe8d0";
    popup.style.padding = "20px";
    popup.style.textAlign = "left";
    popup.style.overflowY = "auto";
    popup.style.border = "7px solid #E54F13";

    let titleText = document.createElement("h1");
    titleText.innerHTML = "Lunar New Year Dragon Minigame";
    titleText.style.fontSize = "36px";
    titleText.style.fontWeight = "bold";

    let infoText = document.createElement("p");
    infoText.innerHTML = "Play a Lunar New Year version of the popular Google Snake game. Applied Programming + Fun with Arts";
    infoText.innerHTML = "Applied Programming + Fun with Arts"
    infoText.style.fontSize = "18px";
    infoText.style.fontWeight = "bold";
    infoText.style.marginBottom = "10px";

    let sectionContainer = document.createElement("div");
    sectionContainer.style.display = "flex";
    sectionContainer.style.justifyContent = "space-between";

    let howToPlayText = document.createElement("div");
    howToPlayText.innerHTML = "How to Play: Use up, down, left, right arrows to move. There is a popup detailing importance of object in the Lunar New Year the first time it is eaten. Have fun!";
    howToPlayText.style.width = "48%";

    let developmentText = document.createElement("div");
    developmentText.innerHTML = "Development: Ryan Zhang, Daniel Kim. <br><br>Game created with HTML, CSS, and JS.";
    developmentText.style.width = "48%";

    let closeButton = document.createElement("button");
    closeButton.innerHTML = "Close";
    closeButton.style.backgroundColor = "#FFD700";
    closeButton.style.color = "#FF0000";
    closeButton.style.border = "none";
    closeButton.style.padding = "10px";
    closeButton.style.cursor = "pointer";
    closeButton.onclick = function () {
        popup.remove();
    };

    popup.appendChild(titleText);
    popup.appendChild(document.createElement("br"));
    popup.appendChild(infoText);
    popup.appendChild(document.createElement("br"));
    popup.appendChild(sectionContainer);
    sectionContainer.appendChild(howToPlayText);
    sectionContainer.appendChild(developmentText);
    popup.appendChild(document.createElement("br"));
    popup.appendChild(closeButton);

    document.body.appendChild(popup);
}



function pauseGame() {
    clearInterval(intervalId);
}

function resumeGame() {
    let countdownElement = document.getElementById("countdown");
    countdownElement.style.display = "block";

    let countdownSeconds = 3;

    let countdownInterval = setInterval(function () {
        if (countdownSeconds > 0) {
            context.clearRect(0, 0, board.width, board.height);
            drawFood();

            context.fillStyle = "#FF0000";
            for (let i = 0; i < snakeBody.length; i++) {
                context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
            }

            context.fillRect(snakeX, snakeY, blockSize, blockSize);

            countdownElement.innerText = countdownSeconds;
            countdownSeconds--;
        } else {
            clearInterval(countdownInterval);
            countdownElement.style.display = "none";
            countdownElement.innerText = "";
            countdownSeconds = 3;
            intervalId = setInterval(update, 1000 / 7);
        }
    }, 1000);
}

function getExplanation(imageSrc) {
    switch (imageSrc) {
        case "candy.jpg":
            return "Sugar coated haws on a stick(糖葫芦 - Tánghúlu) symbolize sweetness and joy, bringing good luck for the New Year.";
        case "dimsum.jpg":
            return "Dim Sum(点心 - Diǎnxīn) represents wealth and prosperity in the Lunar New Year.";
        case "decor.jpg":
            return "Firecracker wall hangings (鞭炮壁挂 - Biānpào bìguà) are used to create a festive atmosphere during Lunar New Year celebrations.";
        case "fish.jpg":
            return "Fish(鱼 - Yú) is associated with surplus and prosperity in Chinese culture.";
        case "nuts.jpg":
            return "Nuts(坚果 - Jiānguǒ) symbolize longevity and good health in Chinese traditions.";
        case "orange.jpg":
            return "Oranges(柑橘 - Gānjú) represent good luck and wealth in the Lunar New Year.";
        case "redenvelope.jpg":
            return "Red envelopes (红包 - Hóngbāo) are given for good luck and blessings during the New Year.";
        case "springrolls.jpg":
            return "Spring rolls (春卷 - Chūnjuǎn) are eaten for wealth and prosperity in the coming year.";
        default:
            return "This food item holds significance in the Lunar New Year celebration.";
    }
}

function getRelativePath(absolutePath) {
    let segments = absolutePath.split("/");
    return segments[segments.length - 1];
}