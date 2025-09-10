let welcomeTextE = document.getElementById("welcomeH");
let loginWrapperE = document.getElementById("loginWrapper");
let uniPass = document.getElementById("uniPass");
let username = document.getElementById("username");
let pass = document.getElementById("pass");
let rMCb = document.getElementById("rememberMeCb");
let nHCb = document.getElementById("newCb");
let unM = document.getElementById("unM")
let unMMaxL = document.getElementById("maxL");
let unMMaxLC = document.getElementById("maxLC");
let unMCleanL = document.getElementById("cleanL");
let unMCleanLC = document.getElementById("cleanLC");
let usernameMakerWrapper = document.getElementById("usernameMakerWrapper");
let passHider = document.getElementById("passHider");
let uniPassHider = document.getElementById("uniPassHider");
let overlay = document.getElementById("overlay");
let popUp = document.getElementById("popUp");
let popUpHeading = document.getElementById("popUpHeading");
let popUpBody = document.getElementById("popUpBody");
let popUpYes = document.getElementById("popUpYes");
let popUpNo = document.getElementById("popUpNo");
let testButton = document.getElementById("testButton");

let bannedWords = ["fuck", "f*ck", "f1ck", "f!ck", "bitch", "b*tch", "b1tch", "h*ll", "h!ll", "h1ll", "fck", "btch", "fuc", "h3ll", "dick", "d*ck", "d1ck", "d!ck", "nigger", "nigg", "hell"];

let lastLengthIsValid = false; // null means unknown initial state
let lastIsClean = true;       // null means unknown initial state

let uniPassText = "";
let usernameText = "";
let passText = "";
let rememberMe = false;
let newHere = false;
let newUsernameText = "";

addEventListener("DOMContentLoaded", (event) => { 
    rMCb.classList.remove("checked")
    console.log("DomContentLoaded");
    const loginWrapperE_width = parseFloat(getComputedStyle(loginWrapperE).width)
    if (loginWrapperE_width<=365) {
        welcomeTextE.classList.remove("noWrap");
        console.log("Changed welcomeH to wrap");
    } else {
        welcomeTextE.classList.add("noWrap");
        console.log("Changed welcomeH to no wrap");
    }
})

// check if welcomeH need wrap
window.addEventListener('resize', (event)=>{
    console.log("windowResized");
    const loginWrapperE_width = parseFloat(getComputedStyle(loginWrapperE).width)
    if (loginWrapperE_width<=365) {
        welcomeTextE.classList.remove("noWrap");
        console.log("Changed welcomeH to wrap");
    } else {
        welcomeTextE.classList.add("noWrap");
        console.log("Changed welcomeH to no wrap");
    }
})

//rememberMeCb toggle & value change
rMCb.addEventListener('click', (event) => {
    if (rememberMe === false) {
        rMCb.style.backgroundColor = "#2dbd98";
        rMCb.style.borderColor = "#2dbd98";
        rememberMe = true;
    } else {
        rMCb.style.backgroundColor = "#0b1f30";
        rMCb.style.borderColor = "#214055";
        rememberMe = false;
    }
    rMCb.classList.toggle("checked");
})

unM.addEventListener('input', (event) => {
    // --- Length Check ---
    const currentLengthIsValid = (event.target.value.length >= 2 && event.target.value.length <= 18);

    // Only update and animate if the state has changed
    if (currentLengthIsValid !== lastLengthIsValid) {
        if (currentLengthIsValid) {
            unMMaxL.style.color = "#2dbd98"; // Green
            unMMaxLC.style.opacity = "0";
            setTimeout(() => {
                unMMaxLC.style.backgroundImage = "url(/static/media/icons/check.png)";
                unMMaxLC.style.opacity = "1";
            }, 500);
        } else {
            unMMaxL.style.color = "#fc3f3f"; // Red
            unMMaxLC.style.opacity = "0";
            setTimeout(() => {
                unMMaxLC.style.backgroundImage = "url(/static/media/icons/cross.png)";
                unMMaxLC.style.opacity = "1";
            }, 500);
        }
        lastLengthIsValid = currentLengthIsValid; // Update the last known state
    }


    let currentIsClean = true; // Assume clean until proven otherwise
    const un = event.target.value.toLowerCase(); // LOWERCASE INPUT VALUE!!!

    for (const badWord of bannedWords) {
        if (badWord === "hell") {
            let hellFoundAndBad = false;
            let startIndex = 0;
        
            // Find all occurrences of "hell"
            while ((startIndex = un.indexOf("hell", startIndex)) !== -1) {
                if (un[startIndex + 4] !== "o") {
                    hellFoundAndBad = true;
                    break; // Found a bad "hell"
                }
                startIndex += 4; // move past hell
            }

        if (hellFoundAndBad) {
            currentIsClean = false;
            break; // Input contains a bad "hell", stop checking all bad words
        }
    } else { // Handle all other bad words
        if (un.includes(badWord)) {
            currentIsClean = false;
            break; // Input contains another bad word, stop checking
        }
    }
    }

    // Only update and animate if the state has changed
    if (currentIsClean !== lastIsClean) {
        if (currentIsClean) {
            unMCleanL.style.color = "#2dbd98"; // Green
            unMCleanLC.style.opacity = "0";
            setTimeout(() => {
                unMCleanLC.style.backgroundImage = "url(/static/media/icons/check.png)";
                unMCleanLC.style.opacity = "1";
            }, 500);
        } else {
            unMCleanL.style.color = "#fc3f3f"; // Red
            unMCleanLC.style.opacity = "0";
            setTimeout(() => {
                unMCleanLC.style.backgroundImage = "url(/static/media/icons/cross.png)";
                unMCleanLC.style.opacity = "1";
            }, 500);
        }
        lastIsClean = currentIsClean; // Update the last known state
    }
});

//new here Cb toggle & value change
nHCb.addEventListener('click', (event) => {
    if (newHere === false) {
        nHCb.style.backgroundColor = "#2dbd98";
        nHCb.style.borderColor = "#2dbd98";
        usernameMakerWrapper.style.display = "block";
        usernameMakerWrapper.style.opacity = "1";
        newHere = true;
    } else {
        nHCb.style.backgroundColor = "#0b1f30";
        nHCb.style.borderColor = "#214055";
        usernameMakerWrapper.style.opacity = "0";
        setTimeout(() => {
            usernameMakerWrapper.style.display = "none";
        }, 200)
        newHere = false;
    }
    nHCb.classList.toggle("checked");
})

passHider.addEventListener('click', (event) => {
    if (pass.type === "password") {
        pass.type = "text";
    } else {
        pass.type = "password";
    }
})

uniPassHider.addEventListener('click', (event) => {
    if (uniPass.type === "password") {
        pass.type = "text";
    } else {
        uniPass.type = "password";
    }
})

function signInFunc(event) {
    event.preventDefault(); //prevent form submit immediately
    postSignIn();

}

// SIGN IN STEP 1
async function postSignIn() {
    try {
        const response = await fetch("/api/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"},
            body: JSON.stringify({
                uniPass: uniPass.value,
                username: username.value,
                password: pass.value,
                rememberMe: rememberMe,
                newUser: newHere,
                newUsername: unM.value
            })
        });

        const status = response.status // Http code

        if (!response.ok) { // If response is having a meltdown
            const responseJson = await response.json();

            const error = new Error(`HTTP Error! ${responseJson.error} HTTP Code: ${response.status} Error Code: ${responseJson.code}`);

            error.status = status;
            error.code = responseJson.code;
            throw error;

        }

        if (status === 202) { // If response is non-automaitic step 
            const responseJson = await response.json();
            console.log("response Step:", responseJson.step)
            if (responseJson.step === "s001") {
                signIn2(responseJson); // Call signIn2 (next step) with userId
                return;
            }
        }

        const responseJson = await response.json();
        signIn2(responseJson)
    } catch (error) {
        signInErrors(error);
        
    }
}

// SIGN IN STEP 2 (if User is New but did not select New User)
async function signIn2(json) {
    if (json.step !== undefined && json.step === "s001") {
        overlay.style.display = "block";
        popUp.style.display = "block";
        setTimeout(() => {
            overlay.style.opacity = "0.5";
            popUp.style.opacity = "1";
        }, 10);
    } else {
        try {
            const response = await fetch("/api/signin2", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"},
                body: JSON.stringify({
                    id: json.id,
                    newUsername: json.newUsername,
                    actions: json.actions,
                    rememberMe: json.rememberMe
                })
            });

            
        }
    }

}


function signInErrors(error) {
    console.error("Error during sign-in:", error);
    if (error.code === "") {

    } else if (error.code === "") {

    }
}

testButton.addEventListener('click', (event) => {
    overlay.style.display = "block";
    popUp.style.display = "block";
    setTimeout(() => {
        overlay.style.opacity = "0.5";
        popUp.style.opacity = "1";
    }, 10);
})

popUpNo.addEventListener('click', (event) => {
    overlay.style.opacity ="0";
    popUp.style.opacity = "0";
    setTimeout (() => {
        overlay.style.display = "none";
        popUp.style.display = "none;"
    }, 320);
})

popUpYes.addEventListener('click', (event) => {
    overlay.style.opacity ="0";
    popUp.style.opacity = "0";
    setTimeout (() => {
        overlay.style.display = "none";
        popUp.style.display = "none;"
    }, 320);
    nHCb.click();
})