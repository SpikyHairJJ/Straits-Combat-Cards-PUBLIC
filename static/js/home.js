let toggleAniButton = document.getElementById("toggleBodyAni");
let playButton = document.getElementById("playButton");
let bodyElement = document.body
let titleDisc = document.getElementById("titleAndDisclaimer");
let buttons = document.getElementById("buttons");
let toggleBody = document.getElementById("toggleBodyAni");
let versionNum = document.getElementById("versionNum");
let authLink = document.getElementById("authLink")
const loadingSpinners = document.querySelectorAll(".container");

toggleAniButton.addEventListener('click', function(){
    bodyElement.classList.toggle('no-animation');
    if (bodyElement.classList.contains('no-animation')) {
        toggleAniButton.textContent = 'Enable Background Animation';
    } else {
        toggleAniButton.textContent = 'Disable Background Animation';
    }
});

playButton.addEventListener('click', function(){
    bodyElement.classList.toggle('solid-background');
    const timeout = 1000

    // Title and Disc
    titleDisc.classList.add('fadeOut')
    setTimeout(()=> {
        titleDisc.style.display = 'none'
    }, timeout);

    // Buttons
    buttons.classList.add('fadeOut')
    setTimeout(()=> {
        buttons.style.display = 'none'
    }, timeout);

    // ToggleBodyAni
    toggleBody.classList.add('fadeOut')
    setTimeout(()=> {
        toggleBody.style.display = 'none'
    }, timeout);

    // VersionNum
    versionNum.classList.add('fadeOut')
    setTimeout(()=> {
        versionNum.style.display = 'none'
    }, timeout);

    // Loading
    loadingSpinners.forEach(spinner=>{
        spinner.style.display = 'block'
        setTimeout(() => {
            spinner.classList.add('fadeIn');
            setTimeout(() => {
                authLink.click();
            }, 400)
        }, 1200);
    })


})