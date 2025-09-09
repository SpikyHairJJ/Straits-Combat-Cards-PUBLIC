let welcomeTextE = document.getElementById("welcomeH");
let loginWrapperE = document.getElementById("loginWrapper");

addEventListener("DOMContentLoaded", (event) => {
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


window.addEventListener('resize', (event)=>{
    console.log("windowResized");
    const loginWrapperE_width = parseFloat(getComputedStyle(loginWrapperE).width)
    if (loginWrapperE_width<=365) {
        welcomeTextE.classList.remove("noWrap");
        console.log("Changed welcomeH to wrap");
    } else {
        welcomeTextE.classList.add("noWrap");
        console.log("i am flipping stupid");
    }
})