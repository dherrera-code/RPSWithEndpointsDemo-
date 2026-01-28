
//need varibales for our MODE, Score!
//MODE: "cpu" , "Pvp";
let aMode = 'cpu';

//IN PVP mode, Player 1 picks first,
// We temporarily store player 1's choice until Player 2 makes their choice!

let aPendingChoice = "";
//Track P1's total wins
let aP1Score = 0;
//Track p2's total wins
let aP2Score = 0;
//tracks how many tie rounds occurred
let aTies = 0;

// ----API Configuration! -------------------------- //
// Change this to our API endpoint that will return a random moveas a string
// Example options your API should return 'rock' , 'paper', and 'scissors'
// Create a variable to hold our url
const aCpuApiUrl = "https://rps-endpoint-demodh-a7d6gmg6f3c4cwgj.westus3-01.azurewebsites.net/api/cpuchoice";

/// --------------- DOM References --------------------------///

// Gets the CPU mode button from the HTML
const aBtnModeCpu = document.getElementById("btnModeCpu");

// Gets the PVP mode button from the HTML
const aBtnModePvp = document.getElementById("btnModePvp");

// Gets the text element that explains the current mode
const aModeHint = document.getElementById("modeHint");

// Gets the element that displays Player 1's choice
const aP1PickEl = document.getElementById("p1Pick");

// Gets the element that displays Player 2's choice
const aP2PickEl = document.getElementById("p2Pick");

// Gets the element that displays the result of the round
const aRoundResultEl = document.getElementById("roundResult");

// Gets the entire Player 2 section (hidden in CPU mode)
const aP2Section = document.getElementById("p2Section");

// Gets the hint text shown to Player 2
const aP2Hint = document.getElementById("p2Hint");

// Gets the element that displays Player 1's score
const aP1ScoreEl = document.getElementById("p1Score");

// Gets the element that displays Player 2's score
const aP2ScoreEl = document.getElementById("p2Score");

// Gets the element that displays tie count
const aTiesEl = document.getElementById("ties");

// Gets the "Play Again" button
const aBtnPlayAgain = document.getElementById("btnPlayAgain");

// Gets the "Reset Game" button
const aBtnReset = document.getElementById("btnReset");

// Player 1 choice buttons
const aBtnP1Rock = document.getElementById("btnP1Rock");
const aBtnP1Paper = document.getElementById("btnP1Paper");
const aBtnP1Scissors = document.getElementById("btnP1Scissors");

// Player 2 choice buttons (only used in PVP mode)
const aBtnP2Rock = document.getElementById("btnP2Rock");
const aBtnP2Paper = document.getElementById("btnP2Paper");
const aBtnP2Scissors = document.getElementById("btnP2Scissors");

/// * Helper functions-------------------------------------------------

//Function switches the game mode btwn CPU and pvp mode!
// * This function will also reset values and update UI.

function aSetMode(aNewMode){
    //Update the global gamemode 
    aMode = aNewMode;

    //clear any stored Player 1 Choices
    aPendingChoice = "";

    //Reset the UI pick display //!(We have not created this yet)
    aClearPicksUI();

    //If CPU mode is selected???
    if(aMode === "cpu"){
        //Highlight the CPU Btn
        aBtnModeCpu.classList.add("active");

        aBtnModePvp.classList.remove("active");


        aP2Section.style.display = "none";
        //Update teh instructions
        aModeHint.textContent = "Pick your move. The CPU will pick automatically."
    }
    else{
        // Highlight the PVP button
    aBtnModePvp.classList.add("active");

    // Remove highlight from CPU button
    aBtnModeCpu.classList.remove("active");

    // Show Player 2 controls
    aP2Section.style.display = "block";

    // Update instructions
    aModeHint.textContent = "Player 1 picks first, then Player 2 picks.";

    // Tell Player 2 to wait
    aP2Hint.textContent = "Waiting for Player 1...";
    }
}

//? Clear the visual display of the current round.
// ! IMPORTANT: this does not reset the score!
function aClearPicksUI(){
    //reset Player 1 Pick display 
    aP1PickEl.textContent = "_";
    //reset p2 pick display
    aP2PickEl.textContent = "_";

    //reset the round message
    aRoundResultEl.textContent = "Make a pick to start!";
}

//Update the score numbers on teh screen to match the internal score variables

function aUpdateScoreUI(){
    aP1ScoreEl.textContent = aP1Score;
    aP2ScoreEl.textContent = aP2Score;
    aTiesEl.textContent = aTies;
}

//generate a Rand CPU Choice
function aRandomCpuChoice() {
    //generate a random 0,1,2
    let aNum = Math.floor(Math.random() * 3);
    //Map number to a choice
    if(aNum === 0) return "rock";
    if(aNum === 1)  return 'paper';
    return "scissors";
}

// --------- Get CPU choice from our external API,
//Expectations:
//API to return either:
// 1 Plain text: 'rock',
// 1 JSON {"choice: rock"}

function aGetCpuChoiceFromApi(){
    return fetch(aCpuApiUrl).then(function (response){
        return response.text();
    }).then(function (data) {
        return data.trim().toLocaleLowerCase(); // trims whitespaces and toLowers all chars
    })
}


aGetCpuChoiceFromApi()

//determine the winner of a round
function aGetWinner(aP1,aP2){
    //First check if its a tie if they both picked the same choice
    if(aP1 === aP2) return "tie";

    // Player1 win conditions
    if(aP1 === "rock" && aP2 === "scissors") return "p1";
    if(aP1 === "paper" && aP2 === "rock") return 'p1';
    if(aP1 === "scissors" && aP2 === "paper") return 'p1';

    return 'p2';
}

//execute a full round of the game 

function aPlayRound(aP1Choice, aP2Choice){
    //display Player 1's choice
    aP1PickEl.textContent = aP1Choice;
    //display Player 2's choice
    aP2PickEl.textContent = aP2Choice;
    //Determine who won!
    let aWinner = aGetWinner(aP1Choice, aP2Choice);

    //Handle tie case
    if(aWinner === "tie") {
        aTies++;
        aRoundResultEl.textContent = "Tie!";
    } //Handle player 1 win
    else if(aWinner ==="p1"){
        aP1Score++;
        aRoundResultEl.textContent = "Player 1 wins the round!"
    }
    else{  //handle p2 or cpu win
        aP2Score++;
        if(aMode === 'cpu'){
            aRoundResultEl.textContent = "CPU wins the round!";
        }else{
            aRoundResultEl.textContent = "Player 2 wins the round!"
        }
    }
 
    //refresh the score and display
    aUpdateScoreUI();
}

//-------------------- Click Handlers--------------------
// These functions run when players
function aHandleP1Pick(aChoice) {
  // This function runs when Player 1 picks rock, paper, or scissors
  // aChoice is the string passed in ("rock", "paper", or "scissors")

  // Check if the game is in CPU mode
  if (aMode === "cpu") {

    //Show quick status while waiting for API Call
    aP1PickEl.textContent = aChoice;
    aP2PickEl.textContent = "...";
    aRoundResultEl.textContent = "CPU is thinking about cheating (API) ...";

    // Get a random choice for the computer
    // let aCpuChoice = aRandomCpuChoice(); //getting replaced

    //Get CPU Move from our API then play the round! THIS is replacing the random function in our javascript!
    aGetCpuChoiceFromApi().then(function (aCpuChoice) {
        // Play the round immediately using Player 1's choice and CPU's choice
        aPlayRound(aChoice, aCpuChoice);
    })

    // Stop the function so PVP logic does NOT run
    return;
  }

  // ----- PVP MODE LOGIC -----

  // Store Player 1's choice temporarily
  // Player 2 has not picked yet
  aPendingChoice = aChoice;

  // Show Player 1's choice on the screen
  aP1PickEl.textContent = aChoice;

  // Hide Player 2's choice until they pick
  aP2PickEl.textContent = "?";

  // Update the round message to tell Player 2 to pick
  aRoundResultEl.textContent = "Player 2, make your pick!";

  // Update Player 2 hint text
  aP2Hint.textContent = "Your turn!";
}

function aHandleP2Pick(aChoice) {
  // This function runs when Player 2 clicks a button
  // aChoice is Player 2's selection

  // If Player 1 has NOT picked yet, do nothing
  if (aPendingChoice === "") {
    return;
  }

  // Both players have picked, so play the round
  aPlayRound(aPendingChoice, aChoice);

  // Clear Player 1's stored choice for the next round
  aPendingChoice = "";

  // If still in PVP mode, update the hint text
  if (aMode === "pvp") {
    aP2Hint.textContent = "Waiting for Player 1...";
  }
}




aBtnModeCpu.addEventListener("click",() => {
    aSetMode('cpu');
})
aBtnModePvp.addEventListener("click", () =>{
    aSetMode('pvp');
})
//* ---------Player 1 Buttons
aBtnP1Rock.addEventListener("click", () => {
    aHandleP1Pick("rock");
})
aBtnP1Paper.addEventListener("click", () => {
    aHandleP1Pick("paper")
})
aBtnP1Scissors.addEventListener("click", () => {
    aHandleP1Pick("scissors")
})
// * ----------- Player 2 Buttons
aBtnP2Rock.addEventListener("click", () => {
    aHandleP2Pick("rock")
})
aBtnP2Paper.addEventListener("click", () => {
    aHandleP2Pick("paper")
})
aBtnP2Scissors.addEventListener("click", ()=> {
    aHandleP2Pick("scissors")
})

aBtnReset.addEventListener("click" ,() =>{
    aTies = 0;
    aP1Score = 0;
    aP2Score = 0;
    aPendingChoice = "";

    aClearPicksUI();
    aUpdateScoreUI();

    if(aMode.textContent = "Waiting for Player 1...");
})
aBtnPlayAgain.addEventListener("click", () => {
    aPendingChoice = "";
    aClearPicksUI();
    if(aMode === "pvp"){
        aP2Hint.textContent = "Waiting for Player 1...";
    }
});

