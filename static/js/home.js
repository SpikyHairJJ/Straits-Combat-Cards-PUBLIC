let toggleAniButton = document.getElementById("toggleBodyAni");
let bodyElement = document.body

toggleAniButton.addEventListener('click', function(){
    bodyElement.classList.toggle('no-animation');
    if (bodyElement.classList.contains('no-animation')) {
        toggleAniButton.textContent = 'Enable Background Animation';
    } else {
        toggleAniButton.textContent = 'Disable Background Animation';
    }
});