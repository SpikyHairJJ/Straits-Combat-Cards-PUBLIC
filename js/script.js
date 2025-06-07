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

// --- Event Listensers ---
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
    TotalHealth: 165, // Their overall TLHP starting point for any game
    TotalEnergy: 50,   // Their overall TLEP starting point for any game
    Luckiness: 80,     // Their overall TLCK starting point for any game
    TotalHealthRegen: 5, // Their overall TLHR in HP/Turn starting point for any game
    powerupsApplied: [

    ],
    // --- Card Collection (All cards they OWN, not just in a single deck) ---
    // This is where ALL their character card objects reside.
    // They would then build a 7-card deck for a specific game session from this collection.
    characterCards: 0, // Number of cards they own, not the cards themself
    allCharCards: [

    ],

    // --- Powerup Inventory (All powerups they OWN) ---
    // These are the raw powerup items they've acquired.
    // They would then "apply" some to their cards, or choose defend powerups for a game.
    allPowerups: [ // Unapplied powerups
        
    ],

    // --- Decks ---
    cardDeck1: [],
    cardDeck2: [],
    cardDeck3: [],
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
Fifth Char is first letter of class (A for Attack, S Surpport, H for Hybrid (like zinnie got a and s abilities))
Sixth Char is number of abilities (1, 2, 3, 4)
Seventh and Eigth Char is first two letters of name (FA, XI)
*/

/* DSDR+40,1-5///: abilityIdGuide
First Letter is Ability Class (A, D, S Attack, Defense, Surpport)
Next Three Letters is What is Does (SDR means Self DR, DDR means duo ability both dr. DTR means duo bility both str ADR maeans All DR, ATK means Attack, AKD means all s attack damage multiplier, HEL means Heal, ATR means all strength, SHP means self hp, STR is for self strength)
Next Three Characters is How Much (+40 means adds 40 to a stat, 050 maybe may mean 50 attack damage or 50 heal for each, operators can be + or x
After the comma is how many rounds this lasts or during attack (1 For all atk abilities)
After the dash is how many energy points it takes (1,2,3 etc)
After the energy points is remarks (RSO means RUSA ONLY (the rs means rusa) D(unqiueId) is duo ability, ONE means can be used one time only /// means no remarks)
After AND there might be another part to the ability and damage points will be at the very end
If it has an N at the very end it also means next round but the three letter remark is alr filled

The Max is always 210 for HP UNLESS IT IS +Percantage HP and 100 for STR and 90 for DR
*/

/* CR-THP/+020-MAX210,2  OR  CE-S0001/////////,2: Powerup id explanation
First Letter if it is a card or defend powerup (C for card and P for player, d is for defend)
Second letter is Rarity (C for Common, R for Rare, E for Epic, L for Legendary)
After the dash 1 letter is Stat(T) Powerup or Special Ability(P) Powerup
IF IT IS STAT POWERUP
Next three chars is what stat (HP/ for HP, STR for STR, DR/ for DR, ALL for all stats, CEP is card abilities anergy usage, EXT is extra in-play card, PHP means TLHP, PEP means TLEP, PLK means TLCK, PHR means TLHR. XPB means XP boost, CNB means coin boost, EDS means extra deeck slot. PDR means player DR the / is to make it 3 char)
Next four chars is add how much (+020 is add 20, +110 is add 110, if it is a EXT type powerup, then it willb e the furst three letters of House or if no limititation is willl be NHR, This EXT ability only can be applied once per deck)
After the dash is maximum of how much (if it is MAX210, and a +080 goes over 210, it will set it to 210, if there is no MAX it will be MAX///, if max is just the card max it will be MAXcrd)
After the comma is how much TLEP it deducts

IF IT IS SPECIAL ABILITY POWERUP
After the dash if the code for special ability, each one has a unqiue number code, regardless of rarity
The slashes is to makke it the same length as a Stat Powerip
After the comma is how much TLEP it deducts
*/
const FayyadhDCard = {
	cardId: "P11NA2FA",
	uniqueId: "01",
	name: "Fayyadh",
    collectionId: "0",
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
	cardId: "P12RS4XI",
	uniqueId: "02",
	name: "Xilin",
    collectionId: "0",
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
	ability4: "SHEP+200,1-15///", //Heal player 200HP, -15EP
};
const EricaDCard = {
	cardId: "P13NA3ER",
	uniqueId: "03",
	name: "Erica",
    collectionId: "0",
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
    collectionId: "0",
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
    collectionId: "0",
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
    collectionId: "0",
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
    collectionId: "0",
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
    collectionId: "0",
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
    collectionId: "0",
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
    collectionId: "0",
	hp: 150,
	str: 50,
	dr: 25,
	powerupsApplied: 0,
	powerup1: "",
	powerup2: "",
	powerup3: "",
	ability1: "AATK-090,1-07", //90 damage, -7EP
	ability2: "AATK-130,1-01///", //130 damage 1 round, -1EP
	ability3: "DSTR+040,1-05N//", //add 40 str next round, -5EP
	ability4: "",
};
const JoeDCard = { 
	cardId: "P34HA4JO",
	uniqueId: "10",
	name: "Joe",
    collectionId: "0",
	hp: 150,
	str: 50,
	dr: 60,
	powerupsApplied: 0,
	powerup1: "",
	powerup2: "",
	powerup3: "",
	ability1: "DSDR+030,1-07///", //Self DR +50 1 round, -6EP
	ability2: "DSTR+040,1-06N//", //130 damage 1 round, -1EP
	ability3: "AATK-190,1-11///", //damage 220 1 round, -10EP
	ability4: "AATK-300,1-17///", //damage 300 1 round, -17EP
};
const ZinnieDCard = { 
	cardId: "P33HS3ZI",
	uniqueId: "11",
	name: "Zinnie",
    collectionId: "0",
	hp: 140,
	str: 50,
	dr: 30,
	powerupsApplied: 0,
	powerup1: "",
	powerup2: "",
	powerup3: "",
	ability1: "SATR+050,1-09N//", //All STR +50 1 round next, -9EP
	ability2: "SHEL+010,3-04///", //Heal 10HP each round for 3 rounds all cards including self, -4EP
	ability3: "SHEL+060,1-07///", //Heal 60HP 1 round all cards including self, -7EP
	ability4: ""
};
const ArvinDCard = { 
	cardId: "P41RA3AR",
	uniqueId: "12",
	name: "Arvin",
    collectionId: "0",
	hp: 160,
	str: 78,
	dr: 40,
	powerupsApplied: 0,
	powerup1: "",
	powerup2: "",
	powerup3: "",
	ability1: "AATK-120,1-08///", //damage 120 1 round, -8EP
	ability2: "AATK-140,1-10///", //damage 140 1 round, -10EP
	ability3: "AATK-170,1-18///", //damage 170 1 round, -18EP
	ability4: ""
};
const WenJayDCard = { 
	cardId: "P42NA3WE",
	uniqueId: "13",
	name: "Wen Jay",
    collectionId: "0",
	hp: 135,
	str: 70,
	dr: 60,
	powerupsApplied: 0,
	powerup1: "",
	powerup2: "",
	powerup3: "",
	ability1: "AATK-180,1-19///", //damage 180 1 round, -19EP (It takes a lot of energy to raise a frog)
	ability2: "AATK-080,1-04///", //damage 80 1 round, -4EP
	ability3: "DDTR+050,1-06D13N", //Arvin and Self STR +50, 1 round NEDXT ROUND.
	ability4: ""
};
// ------------------------ 

// --- Powerups Array ---
let cardPowerupsLib = [
    // CARD POWERUPS
    // Common
    {name: "Increase HP by 20", id: "CC-THP/+020MAXcrd,2"},
    {name: "Incease STR by 10", id: "CC-TSTR+010MAXcrd,2"},
    {name: "Increase DR by 10", id: "CC-TDR/+010MAXcrd,2"},
    {name: "Increase HP by 22", id: "CC-THP/+025MAXcrd,3"},
    {name: "Increase STR by 12", id: "CC-TSTR+012MAXcrd,3"},
    {name: "Increase DR by 12", id: "CC-TDR/+012MAXcrd,3"},
    {name: "Increase All Stats by 5", id: "CC-TALL+003MAXcrd,3"},
    {name: "Reduce Energy Used by Abilities by 1", id: "CC-TCEP-001MAXcrd,5"},
    {name: "Reduce Energy Used by Abilities by 2", id: "CC-TCEP-002MAXcrd,6"},
    // Rare
    {name: "Increase HP by 30", id: "CR-THP/+030MAXcrd,2"},
    {name: "Increase STR by 18", id: "CR-TSTR+018MAXcrd,3"},
    {name: "Increase DR by 18", id: "CR-TSTR+018MAXcrd,4"},
    {name: "Increase HP by 20 [FREE]", id: "CR-THP/+020MAXcrd,0"},
    {name: "Increase STR by 10 [FREE]", id: "CR-TSTR+010MAXcrd,0"},
    {name: "Increase DR by 10 [FREE]", id: "CR-TDR/+010MAXcrd,0"},
    {name: "Increase All Stats by 15", id: "CR-TALL+015MAXcrd,5"},
    {name: "Reduce Energy Used by Abilities by 5", id: "CR-TCEP-010MAXcrd,13"},
    // Epic
    {name: "Increase HP by 50 [FREE] [NO LIMIT]", id: "CE-THP/+050MAX///,0"},
    {name: "Increase HP by 70 [NO LIMIT]", id: "CE-THP/+070MAX///,10"},
    {name: "Increase STR by 35 [FREE] [NO LIMIT]", id: "CE-TSTR+035MAX///,0"},
    {name: "Increase STR by 50 [NO LIMIT]", id: "CE-TSTR+050MAX///,17"},
    {name: "Have a Extra NAGA card in your in-play deck [NAGA ONLY] [ONE PER DECK]", id: "CE-TEXTNAG,20"},
    {name: "Have a Extra RUSA card in your in-play deck [RUSA ONLY] [ONE PER DECK]", id: "CE-TEXTRUS,20"},
    {name: "Have a Extra HARIMAU card in your in-play deck [HARIMAU ONLY] [ONE PER DECK]", id: "CE-TEXTHAR,20"},
    {name: "Have a Extra BK card in your in-play deck [BK ONLY] [ONE PER DECK]", id: "CE-TEXTBUR,20"},
    // Legendary
    {name: "Max out ALL STATS", id: "CL-TALL+210MAXcrd,25"},
    {name: "Have an Extra card in your in-play deck", id: "CL-TEXTNHR,25"},
    {name: "Double your STR", id: "CL-TSTRx002MAX///,19"},
];
let playerPowerupsLib = [
    // PLAYER POWERUPS
    // Common
    {name: "Increase TLHP by 30", id: "PC-TPHP+030MAX///,6"},
    {name: "Increase TLEP by 15", id: "PC-TPEP+015MAX///,16"},
    {name: "Increase TLCK by 2", id: "PC-TPLK+002MAX100,1"},
    {name: "Increase TLHR by 4", id: "PC-TPHR+004MAX///,4"},
    {name: "10% XP Boost", id: "PC-TXPB%010MAX///,3"},
    {name: "10% Coin Boost", id: "PC-TCNB%010MAX///,4"},
    // Rare
    {name: "Increase TLHP by 45", id: "PR-TPHP+045MAX///,13"},
    {name: "Increase TLEP by 30", id: "PR-TPEP+030MAX///,38"},
    {name: "Increase TLCK by 7", id: "PR-TPLK+007MAX100,3"},
    {name: "Increase TLHR by 8", id: "PR-TPHR+008MAX///,14"},
    {name: "20% XP Boost", id: "PR-TXPB%020MAX///,8"},
    {name: "20% Coin Boost", id: "PR-TCNB%020MAX///,12"},
    // Epic
    {name: "Increase TLHP by 50", id: "PE-TPHP+050MAX///,17"},
    {name: "Increase TLEP by 40", id: "PE-TPEP+015MAX///,42"},
    {name: "Increase TLCK by 15", id: "PE-TPLK+015MAX100,16"},
    {name: "Increase TLHR by 10", id: "PE-TPHR+010MAX///,23"},
    {name: "30% XP Boost", id: "PE-TXPB%030MAX///,12"},
    {name: "30% Coin Boost", id: "PE-TCNB%030MAX///,17"},
    {name: "Extra Deck Slot [One per Profile]", id: "PE-TEDS+001///,26"},
    {name: "2 Extra Deck Slots [One per Profile]", id: "PE-TEDS+002///,38"},
    // Legendary
    {name: "Increase TLHP by 75", id: "PL-TPHP+075MAX///,27"},
    {name: "Increase TLHP by 50 [FREE]", id: "PL-TPHP+050MAX///,0"},
    {name: "Increase TLEP by 60", id: "PL-TPEP+015MAX///,65"},
    {name: "Max Out Luckiness", id: "PL-TPLK+100MAX100,34"},
    {name: "Increase TLHR by 25", id: "PL-TPHR+010MAX///,37"},
    {name: "50% XP Boost", id: "PL-TXPB%050MAX///,21"},
    {name: "50% Coin Boost", id: "PL-TCNB%050MAX///,23"},
    {name: "Extra Deck Slot [One per Profile] [FREE]", id: "PL-TEDS+001///,0"},
    {name: "2 Extra Deck Slots [One per Profile]", id: "PL-TEDS+002///,21"},
    {name: "3 Extra Deck Slots [One per Profile]", id: "PL-TEDS+003///,67"},
];
let defendPowerupsLib = [
    // DEFEND POWERUPS
    // Common
    {name: "10% Damage Resistence", id: "DC-TPDR%010MAX100,8"},
    {name: "20% Damage Resistence", id: "DC-TPDR%020MAX100,11"},
    {name: "25% Damage Resistence", id: "DC-TPDR%025MAX100,16"},
    // Rare
    {name: "10% Damage Resistence [FREE]", id: "DR-TPDR%010MAX100,0"},
    {name: "25% Damage Resistence [FREE]", id: "DR-TPDR%025MAX100,0"},
    {name: "35% Damage Resistence", id: "DR-TPDR%035MAX100,19"},
    // Epic 
    {name: "35% Damage Resistence [FREE]", id: "DE-TPDR%010MAX100,0"},
    {name: "50% Damage Resistence", id: "DE-TPDR%050MAX100,25"},
    {name: "100% Damage Resistence", id: "DE-TPDR%100MAX100,52"},
    // Legendary
    {name: "100% Damage Resistence [FREE]", id: "DL-TPDR%100MAX100,0"},
];

// --- Draw a Char Card ---
function drawPackFunc(packNumber) {
    console.log(`drawPackFunc called with Pack${packNumber}`);
	if (packNumber == 1) {
        cardsInPack = [FayyadhDCard, XilinDCard, EricaDCard, KaiYueDCard];
    } else if (packNumber == 2) {
        cardsInPack = [KenjiDCard, AllyssaDCard, LucasDCard, NicoleDCard];
    } else if (packNumber == 3) {
        cardsInPack = [NivritiDCard, JoeDCard, AnnaDCard, ZinnieDCard];
    } else if (packNumber == 4) {
		cardsInPack = [ArvinDCard, WenJayDCard, JiHyoDCard, OliviaDCard];
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
    playerProfile.allCharCards[playerProfile.allCharCards.length - 1].collectionId = String(playerProfile.characterCards);
}

// --- Draw a Powerup ---
function drawPowerupFunc() {
	console.log("drawPowerupFunc called")
    const rarityChance = Math.random();
    let rarity = "Null";
    if (rarityChance < 0.04) {
        console.log("Rarity: Legendary"); // 4% chance
        rarity = "L";
    } else if (rarityChance  < 0.14) {
        console.log("Rarity: Epic"); // 10% chance
        rarity = "E";
    } else if (rarityChance < 0.44) {
        console.log ("Rarity: Rare"); // 30% chance
        rarity = "R";
    } else {
        console.log("Rarity: Common"); // 56% chance
        rarity = "C";
    }
    const allPowerups = [...cardPowerupsLib,...playerPowerupsLib,...defendPowerupsLib];
    let eligiblePowerups = allPowerups.filter(item => item.id[1] === rarity);
    const randomPowerupIndex = Math.floor(Math.random() * eligiblePowerups.length);
    const drawnPowerup = eligiblePowerups[randomPowerupIndex]
    playerProfile.allPowerups.push(drawnPowerup);
    console.log(`Drawn ${drawnPowerup.name} with id: ${drawnPowerup.id}`);
}

// --- View cards ---
function viewCardsFunc() {
    const text = playerProfile.allCharCards.map(function(card) {
        return card.name; // This will return the 'name' property of each 'card' object
    }).join(', ');
	console.log(`All Character Cards: ${text}`);
    const text2 = playerProfile.allPowerups.map(function(card) {
        return card.name; // This will return the 'name' property of each 'card' object
    }).join(', '); // Optional: Join the array of names into a single string with commas
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
        TotalHealthRegen: playerProfile.TotalHealthRegen,
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

    const encodedCards = playerProfile.allCharCards.map(function(card) {
        const cardJsonString = JSON.stringify(card);
        return encodeBase64(cardJsonString)
    });
    const cardsMultilineString = encodedCards.join('\n'); // make a new line for each function
    
    const encodedPowerups = playerProfile.allPowerups.map(function(card) {
        const cardJsonString = JSON.stringify(card);
        return encodeBase64(cardJsonString)
    });

    const powerupsMultilineString = encodedPowerups.join('\n');

    const encodedPlayerAppliedPowerups = playerProfile.powerupsApplied.map(function(powerup){
        const cardJsonString = JSON.stringify(powerup);
        return encodeBase64(cardJsonString)
    });

    const playerAppliedPowerupsMultilineString = encodedPlayerAppliedPowerups .join('\n')

    const encodedDeck1 = playerProfile.cardDeck1.map(function(card){
        const cardJsonString = JSON.stringify(card);
        return encodeBase64(cardJsonString)
    });
    
    const deck1MultilineString = encodedDeck1.join('\n');

    const encodedDeck2 = playerProfile.cardDeck1.map(function(card){
        const cardJsonString = JSON.stringify(card);
        return encodeBase64(cardJsonString)
    });
    
    const deck2MultilineString = encodedDeck2.join('\n');

    const encodedDeck3 = playerProfile.cardDeck1.map(function(card){
        const cardJsonString = JSON.stringify(card);
        return encodeBase64(cardJsonString)
    });
    
    const deck3MultilineString = encodedDeck3.join('\n');

    const allContent = `${encodedPlayerProfileCore}\nsub\n${cardsMultilineString}\nsub\n${powerupsMultilineString}\nsub\n${playerAppliedPowerupsMultilineString}\nsub\n${deck1MultilineString}\nsub\n${deck2MultilineString}\nsub\n${deck3MultilineString}`;

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

