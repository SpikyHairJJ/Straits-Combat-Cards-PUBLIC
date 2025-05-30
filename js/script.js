// --- HTML Vars Declaration ---
let drawPack1 = document.getElementById("drawPack1");
let drawPack2 = document.getElementById("drawPack2");
let drawPack3 = document.getElementById("drawPack3");
let drawPack4 = document.getElementById("drawPack4");
let drawPowerup = document.getElementById("drawPowerup");
let viewCards = document.getElementById("viewCards");
let saveCards = document.getElementById("saveCards");
let deleteCards = document.getElementById("deleteCards");
let importDeck = document.getElementById("importData");
let fileInput = document.getElementById("fileInput");
let deletedRepeated = document.getElementById("deleteRepeated")

// --- Event Listensers---
drawPack1.addEventListener("click", function() {
    drawPackFunc(1); // Now this function is called only when the click event happens
});
drawPack2.addEventListener("click", function() {
    drawPackFunc(2);
});
drawPack3.addEventListener("click", function() {
    drawPackFunc(3); 
});
drawPack4.addEventListener("click", function() {
    drawPackFunc(4);
});

drawPowerup.addEventListener("click", drawPowerupFunc);
viewCards.addEventListener("click", viewCardsFunc);
deletedRepeated.addEventListener("click", deduplicateCards);
deleteCards.addEventListener("click", deleteCardsFunc);

saveCards.addEventListener("click", function() {
    downloadPacks("StraitsCards"); 
});
importDeck.addEventListener('click', () => {
    fileInput.click(); // Programmatically click the hidden file input
});

// --- Variable Declaration ---
let lastDrawnCard = null;
// Default Cards Settings Vars 

let playerProfile = {
    // --- Basic Player Identity ---
    playerName: "Default Player", // The name they type in or choose
    lastLogin: null, // Optional: for tracking activity

    // --- Core Progression Stats (Persistent) ---
    coins: 1000, // Accumulated currency for upgrades (persists across games)
    xp: 0, // Accumulated experience (persists across games)
    level: 1, // Derived from XP, or direct level

    // --- Player Base Stats (Affected by upgrades/XP, applies to all games they play) ---
    TotalHealth: 320, // Their overall TLHP starting point for any game
    TotalEnergy: 55,   // Their overall TLEP starting point for any game
    Luckiness: 80,     // Their overall TLCK starting point for any game

    // --- Card Collection (All cards they OWN, not just in a single deck) ---
    // This is where ALL their character card objects reside.
    // They would then build a 7-card deck for a specific game session from this collection.
    characterCards: 0,
    allCharCards: [

    ],

    // --- Powerup Inventory (All powerups they OWN) ---
    // These are the raw powerup items they've acquired.
    // They would then "apply" some to their cards, or choose defend powerups for a game.
    allPowerups: [
        
    ],

    // --- Overall Game Statistics (Fun Facts!) ---
    totalGamesPlayed: 0,
    totalGamesWon: 0,
    totalGamesLost: 0,
    totalCardsKilled: 0, // all cards killed all time
    mostCardsKilled: 0, // most cards killed in one game
    totalEnergySpent: 0,
    mostEnergySpent: 0, // most Energy spent in one game
    quickestWin: 0, //least number of turns to win a game
    totalPowerupsApplied: 0,
    totalDamageDealtAcrossAllGames: 0,
    totalHealingDoneAcrossAllGames: 0,
    
};

/* P11NA3FA: CardId Guide
First 2 digits is Pack Number (P1, P2)
Third Char is order in pack (1, 2, 3, 4)
Fourth Char is first letter of house (N, H, B, R)
Fifth Char is first letter of class (A for Attack, S Surpport, D for Defense H for Hybrid (like zinnie got a and s abilities))
Sixth Char is number of abilities (1, 2, 3, 4)
Seventh and Eigth Char is first two letters of name (FA, XI)
*/

/* DSDR+40,1-5///: abilityIdGuide
First Letter is Ability Class (A, D, S Attack, Defense, Surpport)
Next Three Letters is What is Does (SDR means Self DR, ADR maeans All DR, ATK means Attack, AKD means all s attack damage multiplier, HEL means Heal, ATR means all strength, SHP means self hp, STR is for self strength)
Next Three Characters is How Much (+40 means adds 40 to a stat, 050 maybe may mean 50 attack damage or 50 heal for each, operators can be + or x
After the comma is how many rounds this lasts or during attack (1 For all atk abilities)
After the dash is how many energy points it takes (1,2,3 etc)
After the energy points is remarks (RSO means RUSA ONLY (the r means rusa) D(unqiueId) is duo ability, ONE means can be used one time only /// means no remarks)
After AND there might be another part to the ability and damage points will be at the very end

The Max is always 210 for HP UNLESS IT IS +Percantage HP and 100 for STR and 90 for DR
*/

/* RR-THP/+020-MAX210  OR  EP-S0001/////////: Powerup id explanation
First two letters is Rarity (CC for Common, RR for Rare, EP for Epic, LG for Legendary)
After the dash 1 letter is Stat(T) Powerup or Special Ability(P) Powerup
IF IT IS STAT POWERUP
Next three chars is what stat (HP/ for HP, STR for STR, DR/ for DR. the / is to make it 3 char)
Next four chars is add how much (+020 is add 20, +110 is add 110)
After the dash is maximum of how much (if it is MAX210, and a +080 goes over 210, it will set it to 210)

IF IT IS SPECIAL ABILITY POWERUP
After the dash if the code for special ability, each one has a unqiue number code, regardless of rarity
The slashes is to makke it the same length as a Stat Powerip
*/
const FayyadhDCard = {
	cardId: "P11NA2FA",
	uniqueId: "01",
	name: "Fayyadh",
	hp: 150,
	str: 55,
	dr: 20,
	powerupsApplied: 0,
	powerup1: "",
	powerup2: "",
	powerup3: "",
	ability1: "DSDR+040,1-05///", //DR for this card +40 for 1 round, -5EP
	ability2: "SADR+050,1-07///", //DR all cards including self +50 for 1 round, -7EP
	ability3: "",
	ability4: "",
};
const XilinDCard = {
	cardId: "P12RS3XI",
	uniqueId: "02",
	name: "Xilin",
	hp: 140,
	str: 60,
	dr: 50,
	powerupsApplied: 0,
	powerup1: "",
	powerup2: "",
	powerup3: "",
	ability1: "DADR+030,1///N//.AND.SHEL+5,5-08///", //DR +30 for all in-play cards including self for NEXT ROUND and heal +5 each round for 5 rounds, -8EP
	ability2: "SHEL+020,2-06RSO", //Heal 20HP for each round for 2 rounds including self for RUSA cards only, -6EP
	ability3: "SAKDx002,1-10N//", //Attack Damage Multiplier for NEXT ROUND x2 for all, -10EP
	ability4: "",
};
const EricaDCard = {
	cardId: "P13NA3ER",
	uniqueId: "03",
	name: "Erica",
	hp: 160,
	str: 60,
	dr: 45,
	powerupsApplied: 0,
	powerup1: "",
	powerup2: "",
	powerup3: "",
	ability1: "AATK-080,1-06///", //Attack 80 Damage 1 round, -6EP
	ability2: "AATK-060,1-04///", //Attack 60 Damage 1 round, -4EP
	ability3: "DSHP+030,1-03///", //HP increased for self by 30 1 round, -3EP
	ability4: "",
};
const KaiYueDCard = { //TBD!!
	cardId: "P14BA3KA",
	uniqueId: "04",
	name: "Kai Yue",
	hp: 155,
	str: 65,
	dr: 30,
	powerupsApplied: 0,
	powerup1: "",
	powerup2: "",
	powerup3: "",
	ability1: "AATK-110,1-08///", //Attack 110 Damage 1 round, -8EP
	ability2: "", //
	ability3: "", //
	ability4: "",
};
const KenjiDCard = { 
	cardId: "P21RA2KE",
	uniqueId: "05",
	name: "Kenji",
	hp: 195,
	str: 30,
	dr: 75,
	powerupsApplied: 0,
	powerup1: "",
	powerup2: "",
	powerup3: "",
	ability1: "AATK-120,1-10///", //Attack 120 Damage 1 round, -10EP
	ability2: "AATK-090,1-07///", //Attack 90 Damage 1 round, -7EP
	ability3: "", 
	ability4: "",
};
const AllyssaDCard = { 
	cardId: "P22HA3AL",
	uniqueId: "06",
	name: "Allyssa",
	hp: 150,
	str: 55,
	dr: 45,
	powerupsApplied: 0,
	powerup1: "",
	powerup2: "",
	powerup3: "",
	ability1: "DSTR+040,1-04N//", //+40 Strength for NEXT ROUND
	ability2: "AATK-080,1-05///", //Attack 80 Damage 1 round, -5EP
	ability3: "AATK-145,1///D03.AND.SATR+70,1-16N//",  //Duo ability with Erica, 145 Damage 1 round AND +70 STR all cards 1 round, -16EP
	ability4: "",
};
const LucasDCard = { 
	cardId: "P23RA2LU",
	uniqueId: "07",
	name: "Lucas",
	hp: 205,
	str: 83,
	dr: 60,
	powerupsApplied: 0,
	powerup1: "",
	powerup2: "",
	powerup3: "",
	ability1: "AATK-100,1-07///", //100 Damage, -7EP
	ability2: "AATK-210,1-40ONE", //Attack 210 Damage 1 round, -40EP
	ability3: "",  
	ability4: "",
};
const NicoleDCard = { 
	cardId: "P24BA2NI",
	uniqueId: "08",
	name: "Nicole",
	hp: 150,
	str: 55,
	dr: 25,
	powerupsApplied: 0,
	powerup1: "",
	powerup2: "",
	powerup3: "",
	ability1: "AATK-065,1-05///", //65 Damage, -5EP
	ability2: "AATK-040,1-02///", //Attack 40 Damage 1 round, -2EP
	ability3: "",  
	ability4: "",
};
const NivritiDCard = { 
	cardId: "P31BH3NI",
	uniqueId: "09",
	name: "Nivriti",
	hp: 150,
	str: 50,
	dr: 35,
	powerupsApplied: 0,
	powerup1: "",
	powerup2: "",
	powerup3: "",
	ability1: "SADR+020,1-06///", //+20 All DR, -6EP
	ability2: "DSDR+100,1-09///", //make self invincible 1 round, -9EP
	ability3: "AATK-070,1///D03.AND.SATR+030,1-11N//", //damage -70 1 round and all str +30 1 round for next round, duo ability with erica, -11EP  
	ability4: "",
};
const AnnaDCard = { 
	cardId: "P32AA3AN",
	uniqueId: "10",
	name: "Anna",
	hp: 150,
	str: 50,
	dr: 25,
	powerupsApplied: 0,
	powerup1: "",
	powerup2: "",
	powerup3: "",
	ability1: "AATK-090,1-07", //90 damage, -7EP
	ability2: "AATK-130,1-01///", //130 damage 1 round, -1EP
	ability3: "DSTR+40,1-05N//", //add 40 str next round, -5EP
	ability4: "",
};

// ------------------------

// --- Draw a Char Card ---
function drawPackFunc(packNumber) {
    console.log(`drawPackFunc called with Pack${packNumber}`);
	if (packNumber == 1) {
        cardsInPack = [FayyadhDCard, XilinDCard, EricaDCard, KaiYueDCard];
    } else if (packNumber == 2) {
        cardsInPack = [KenjiDCard, AllyssaDCard, LucasDCard, NicoleDCard];
    } else if (packNumber == 3) {
        cardsInPack = ['Nivriti', 'Joe', 'Anna', 'Zinnie'];
    } else if (packNumber == 4) {
		cardsInPack = ['Arvin', 'Wen Jay', 'Ji Hyo', 'Nicole'];
    }
	
    let randomCard; // Declare randomCard outside the loop
	let drawTries = 0;
    // Use a do-while loop to ensure we draw at least once
    // and keep drawing if the card is the same as the last one
    do {
        const cardsInPacksRandomIndex = Math.floor(Math.random() * cardsInPack.length);
        randomCard = cardsInPack[cardsInPacksRandomIndex];
		drawTries++
        console.log(`Attempted to draw: ${randomCard.name} from Pack${packNumber}. Last drawn: ${lastDrawnCard ? lastDrawnCard.name : 'None'}}`); // For debugging
    } while (randomCard === lastDrawnCard); // Repeat if the new card is the same as the last

    // Once a different card is chosen, update the global variable
    lastDrawnCard = randomCard;

    console.log(`Successfully drew: ${randomCard.name} from Pack${packNumber}. Tries: ${drawTries}`);
    playerProfile.allCharCards.push({...randomCard});
    playerProfile.characterCards++
}

// --- Draw a Powerup ---
function drawPowerupFunc() {
	console.log("drawPowerupFunc called")
  const rarityChance = Math.random();
  if (rarityChance < 0.01) {
    console.log("Result: Legendary"); // 1% chance
	playerProfile.allPowerups.push('Legendary');
  } else if (rarityChance  < 0.05) {
    console.log("Result: Epic"); // 4% chance
	playerProfile.allPowerups.push('Epic');
  } else if (rarityChance < 0.35) {
    console.log ("Result: Rare"); // 15% chance
	playerProfile.allPowerups.push('Rare');
  } else {
    console.log("Result: Common"); // 80% chance
	playerProfile.allPowerups.push('Common');
  }
}

// --- View cards ---
function viewCardsFunc() {
	console.log(`All Character Cards: ${playerProfile.allCharCards}`);
	console.log(`All Powerups: ${playerProfile.allPowerups}`);
}

// --- Save Data ---
function downloadPacks(filename) {
    const playerProfileCore = {
        playerName: playerProfile.playerName,
        lastLogin: playerProfile.lastLogin,
        coins: playerProfile.coins,
        xp: playerProfile.xp,
        level: playerProfile.level,
        TotalHealth: playerProfile.TotalHealth,
        TotalEnergy: playerProfile.TotalEnergy,
        Luckiness: playerProfile.Luckiness,
        characterCards: playerProfile.characterCards, // This count can stay here
        totalGamesPlayed: playerProfile.totalGamesPlayed,
        totalGamesWon: playerProfile.totalGamesWon,
        totalGamesLost: playerProfile.totalGamesLost,
        totalCardsKilled: playerProfile.totalCardsKilled,
        mostCardsKilled: playerProfile.mostCardsKilled,
        totalEnergySpent: playerProfile.totalEnergySpent,
        mostEnergySpent: playerProfile.mostEnergySpent,
        quickestWin: playerProfile.quickestWin,
        totalPowerupsApplied: playerProfile.totalPowerupsApplied,
        totalDamageDealtAcrossAllGames: playerProfile.totalDamageDealtAcrossAllGames,
        totalHealingDoneAcrossAllGames: playerProfile.totalHealingDoneAcrossAllGames,
    };

    // Stringify and Base64 encode the core player profile data
    const encodedPlayerProfileCore = encodeBase64(JSON.stringify(playerProfileCore));

    const encodedCards = playerProfile.playerProfile.allCharCards.map(function(card) {
        const cardJsonString = JSON.stringify(card);
        return encodeBase64(cardJsonString)
    });
    const cardsMultilineString = encodedCards.join('\n'); // make a new line for each function
    
    const encodedPowerups = playerProfile.playerProfile.allPowerups.map(function(card) {
        const cardJsonString = JSON.stringify(card);
        return encodeBase64(cardJsonString)
    });

    const powerupsMultilineString = encodedPowerups = encodedCards.join('\n');
    const allContent = `${encodedPlayerProfileCore}\nsub\n${encodedCards}\nsubscribe\n${encodedPowerups}`;

    // 7. Create and download the Blob
    const blob = new Blob([allContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || "my-encrypted-data.txt"; // Changed default filename to reflect encryption
    a.click();
    URL.revokeObjectURL(url);

    // Log the original and encrypted data for debugging TBD
}


// --- Import Data ---
fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0]; // Get the first (and only) selected file

    if (file) { // If a file was chosen
        const reader = new FileReader(); // Create a new FileReader object

        // This function will run when the file has been successfully read
        reader.onload = function(e) {
            const fileContent = e.target.result; // Get the content of the file as a string
            console.log("--- File Content Loaded ---");
            console.log(fileContent); // Display the full file content in the console
            const lines = fileContent.split('\n').map(line => line.trim()); // lines is array containing each line as an item
            console.log("\n--- Processed Lines ---");
            lines.forEach((line, index) => { // for each line
                console.log(`Line ${index + 1}: "${line}"`);
                if (index===0) {
					playerProfile.allCharCards = line.split(',').map(line => line.trim());
					console.log(playerProfile.allCharCards);
				} else if (index===1) {
					playerProfile.allPowerups = line.split(',').map(line => line.trim());
					console.log(playerProfile.allPowerups);
				}
            });
            
            console.log("\n--- File Processing Complete ---");
			event.target.value = '';
        };

        // This function will run if there's an error reading the file
        reader.onerror = function(e) {
            console.error("Error reading file:", e);
        };

        // Start reading the file as plain text
        reader.readAsText(file);
    } else {
        console.log("No file selected.");
    }
});

// --- Delete Duplicate Cards ---
function deduplicateCards() {
	console.log("deduplicateCards Function Called");
	console.log(`Before deduplcation: ${playerProfile.allCharCards}`);
	const uniqueChars = new Set(playerProfile.allCharCards);
	playerProfile.allCharCards = Array.from(uniqueChars);
	console.log(`After deduplication: ${playerProfile.allCharCards}`)
}

// --- Delete Specific Cards ---
function deleteCardsFunc() {
    console.log("--- Deleting Specific Card Instance ---");
    viewCardsFunc(); // Show current cards first for user reference

    if (playerProfile.allCharCards.length === 0) {
        alert("Your character card collection is empty. Nothing to delete!");
        console.log("Collection empty. No cards to delete.");
        return;
    }

    // Prompt 1: Which card to delete?
    const cardToDeleteNameUnformatted = prompt("Enter the name of the character card you want to delete (not case or space-sensitive):");
    const cardToDeleteName = cardToDeleteNameUnformatted.toLowerCase().replace(/\s/g, '');

    if (cardToDeleteName === null || cardToDeleteName.trim() === "") {
        alert("Deletion cancelled. No card name entered.");
        console.log("Deletion cancelled by user.");
        return;
    }

    // Count occurrences of the specified card (this part is already correct)
    const occurrences = playerProfile.allCharCards.filter(card => {
        const transformedCard = card.toLowerCase().replace(/\s/g, '');
        return transformedCard === cardToDeleteName;
    }).length;

    if (occurrences === 0) {
        alert(`You don't have any '${cardToDeleteNameUnformatted}' cards.`); // Use unformatted here for user-friendliness
        console.log(`'${cardToDeleteNameUnformatted}' not found.`);
        return;
    }

    // Prompt 2: How many instances to delete?
    const numToDeleteStr = prompt(`You have ${occurrences} instance(s) of '${cardToDeleteNameUnformatted}'.\nHow many do you want to delete? (Enter a number)`); // Use unformatted here

    if (numToDeleteStr === null || numToDeleteStr.trim() === "") {
        alert("Deletion cancelled. No number of instances specified.");
        console.log("Deletion cancelled by user.");
        return;
    }

    const numToDelete = parseInt(numToDeleteStr, 10); // Convert input to an integer

    if (isNaN(numToDelete) || numToDelete <= 0) {
        alert("Invalid number. Please enter a positive number.");
        console.log("Invalid number of instances entered.");
        return;
    }

    if (numToDelete > occurrences) {
        alert(`You only have ${occurrences} instance(s) of '${cardToDeleteNameUnformatted}'. Cannot delete ${numToDelete}.`);
        console.log(`Attempted to delete ${numToDelete}, but only ${occurrences} exist.`);
        return;
    }

    let deletedCount = 0;
    while (deletedCount < numToDelete) {
        // *** This is the key change: Use findIndex for case- and space-insensitive search ***
        const index = playerProfile.allCharCards.findIndex(card => {
            const transformedCard = card.toLowerCase().replace(/\s/g, '');
            return transformedCard === cardToDeleteName;
        });

        if (index > -1) { // If the card is found
            playerProfile.allCharCards.splice(index, 1); // Remove one instance at that index
            deletedCount++;
            console.log(`Deleted one instance of '${cardToDeleteNameUnformatted}'. Remaining to delete: ${numToDelete - deletedCount}`);
        } else {
            // This case should ideally not be hit if numToDelete <= occurrences,
            // but it's good as a safeguard.
            console.warn(`Could not find '${cardToDeleteNameUnformatted}' to delete despite expecting more. Remaining: ${numToDelete - deletedCount}`);
            break; // Exit loop if card unexpectedly not found
        }
    }

    alert(`Successfully deleted ${deletedCount} instance(s) of '${cardToDeleteNameUnformatted}'.`);
    console.log("After deletion:", playerProfile.allCharCards);
    viewCardsFunc(); // Show updated cards
}

// --- Encrypt Base64 ---
function encodeBase64(str) {
    // 1. Encode the string to a Uint8Array (UTF-8 bytes)
    const utf8Bytes = new TextEncoder().encode(str);

    // 2. Convert the Uint8Array to a binary string (each byte as a character)
    //    This is needed because btoa() expects a string of characters (0-255)
    const binaryString = String.fromCharCode(...utf8Bytes);

    // 3. Base64 encode the binary string
    return btoa(binaryString);
}


// --- Decrypt Ceaser Cipher ---
function decodeCaesarCipher(cipherText, shift) {
    let decryptedText = '';
    const alphabetSize = 26; // Number of letters in the English alphabet

    for (let i = 0; i < cipherText.length; i++) {
        const char = cipherText[i];

        // Handle uppercase letters
        if (char >= 'A' && char <= 'Z') {
            const charCode = char.charCodeAt(0); // Get ASCII value
            const shiftedCharCode = ((charCode - 'A'.charCodeAt(0) - shift + alphabetSize) % alphabetSize) + 'A'.charCodeAt(0);
            decryptedText += String.fromCharCode(shiftedCharCode);
        }
        // Handle lowercase letters
        else if (char >= 'a' && char <= 'z') {
            const charCode = char.charCodeAt(0); // Get ASCII value
            const shiftedCharCode = ((charCode - 'a'.charCodeAt(0) - shift + alphabetSize) % alphabetSize) + 'a'.charCodeAt(0);
            decryptedText += String.fromCharCode(shiftedCharCode);
        }
        // Keep non-alphabetic characters as they are (spaces, punctuation, numbers)
        else {
            decryptedText += char;
        }
    }
    return decryptedText;
}

