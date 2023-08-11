const answerList = ["apple","mango","tiger","happy","beach","house","music","pizza","sunny","earth","smile","chair","lemon","ocean","robot","cloud","ghost","mouse","sleep","water"]

const rating = {
    unknown :0,
    absent :1,
    present :2,
    correct :3,
};
function startGame(maxAttempt) {

    let {
        attemptCount,
        userAttempts,
        highlightedRows,
        keyboard,
        answer,
        status,
    } = loadOrStartGame() ;

    while (attemptCount <= round && status === "in-progress") {
        let currentGuess = prompt("Guess a five-letter word: ");
        if (isInputCorrect(currentGuess)) {
            console.log(currentGuess);
            userAttempts.push(currentGuess);
            attempt++;  
            const highlightedCharacters = getCharactersHighlight(
                currentGuess,
                answer
            );  
            highlightedRows.push(highlightedCharacters);
            keyboard = updateKeyboardHighights (
                keyboard,
                currentGuess,
                highlightedCharacters
            );
            status = updateGameStatus(
                currentGuess,
                answer,
                attemptCount,
                round -1
            );
            attemptCount++;
            saveGame({
                attemptCount,
                userAttempts,
                highlightedRows,
                keyboard,
                status,
            });
        }else {
            retry(currentGuess)
        }
    }
    if (status === "success") {
        alert("Congratulations");
    } else {
        alert(`The word is ${answer}`);
    }
}

function isInputCorrect(word) {
    return wordList.includes(word) || wordList.vaild.includes(word);
}
function retry(word) {  
    alert(`${word} is not in the word list`);
}

function getCharactersHighlight(word,answer){
    const wordSplit = word.split("");   
    const result = [];

    wordSplit.forEach((character, index) => {
        if (character === answer[index]) {
            result.push("Correct");
        } else if (answer.includes(character)) {
            result.push("Present");
        } else {
            result.push("Absent");
        }
    });
    return result;  
}

function getKeyboard() {
    const alphabets = "abcdefghijklmnopqrstuvwxyz".split("");
    const entries = [];
    for (const alphabet of alphabets) {
        entries.push([alphabet,"unknown"]);
    }
    return Object.fromEntries(entries)
}

function updateKeyboardHighights(keyboard, currentGuess, highlightedCharacters){
    const newkeyboard = Object.assign({}, keyboard);

    for ( let i = 0; i <highlightedCharacters.length; i++){
        const character = userInput[i];
        const nextStatus = highlightedCharacters[i];
        const nextRating = rating[nextStatus];
        const previousStatus = newKeyboard[character];
        const previousRating = rating[previousStatus];

        if (nextrating > previousRating) {
            newKeyboard[character] = nextStatus;
        }
    }
    return newKeyboard;
}

function updateGameStatus(currentGuess, answer, attemptCount, round){
    if(currentGuess === answer) {
        return "success";
    }
    if (attemptCount === round) {
        return "failure"
    }
    return "in-progress"
}

function saveGame (gameState) {
    window.localStorage.setItem("PREFACE_WORDLE", JSON.stringify(gameState));
}
function getTodaysAnswer () {
    const offsetFromDate = new Date(2023,0,1).getTime();
    const today = new Date().getTime();
    const msOffset = today - offsetFromDate;
    const dayOffset = msOffset /1000/60/60/24;
    const answerIndex = Math.floor(dayOffset);
    return wordList.playable[answerIndex];
}
function isToday (timestamp) {
    const today = new Date();
    const check = new Date(timestamp);
    return today.toDateString() === check.toDateString();
}

async function loadOrStartGame(debug){
    wordList = await fetch("./src/fixtures/words.json")
        .then(response => {
            return json();
        });
    let answer;
    if(debug) {
        answer = answerList[0];
    } else {
        answer = getTodaysAnswer();
    }
    const prevGame = JSON.parse(window.localStorage.getItem("PREFACE_WORDLE"));
    if (prevGame && isToday(prevGame.timestamp)) {
        return {
            ...prevGame,
            answer,
        };
    }
    return {
        attemptCount :0,
        userAttempts:[],
        highlightedRows : [],
        keyboard :getKeyboard(),
        answer,
        status: "in-progress",    
    };
}