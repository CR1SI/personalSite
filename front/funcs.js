const pics = document.getElementById("Pictures");
const vine = document.getElementById("Vine");

const imageCount = pics.getElementsByClassName("pic").length;
const maxScroll = -100 * (imageCount - 4);
const currentPercent = parseFloat(pics.dataset.percentage) || 0;
const normalizedPercent = (currentPercent / maxScroll) * -100;

for(const image of pics.getElementsByClassName("pic")){
    image.style.objectPosition = `${100 + normalizedPercent}% center`;
}

vine.style.clipPath = `inset(0 ${100 - normalizedPercent}% 0 0)`;
vine.style.maskImage = `linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)`;

const handleOnDown = e => pics.dataset.mouseDownAt = e.clientX;

const handleOnUp = () => {
    pics.dataset.mouseDownAt = "0";
    pics.dataset.prevPercentage = pics.dataset.percentage;
}

const handleOnMove = e => {
    if(pics.dataset.mouseDownAt === "0") return;
    
    const mouseDelta = parseFloat(pics.dataset.mouseDownAt) - e.clientX, maxDelta = window.innerWidth / 2;

    const percentage = (mouseDelta / maxDelta) * -100, 
    nextPercentUnconstrained = parseFloat(pics.dataset.prevPercentage) + percentage;

    const imageCount = pics.getElementsByClassName("pic").length;
    const maxScroll = -100 * (imageCount - 4);
    const nextPercent = Math.max(Math.min(nextPercentUnconstrained, 0), maxScroll);

    const currentPercent = parseFloat(pics.dataset.percentage) || 0;
    if(nextPercent === currentPercent) return;

    pics.dataset.percentage = nextPercent;

    pics.animate({transform: `translate(${nextPercent}%, -65%)`}, 
        {duration: 1200, fill: "forwards" });

    const scrollRange = -100 * (imageCount - 4);
    const normalizedPercent = (nextPercent / scrollRange) * -100;
    
    for(const image of pics.getElementsByClassName("pic")){
        image.animate({objectPosition: `${100 + normalizedPercent}% center`}, 
            {duration: 1200, fill: "forwards" });
    }

    vine.animate({clipPath: `inset(0 ${100 - Math.abs(normalizedPercent)}% 0 0)`},
        {duration: 1200, fill: "forwards"});
}

document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('dragstart', (e) => {
    if(e.target.nodeName === 'IMG') {
        e.preventDefault();
    }
});
window.ondragstart = function() { return false; };

window.onmousedown = e => handleOnDown(e);
window.ontouchstart = e => handleOnDown(e.touches[0]);
window.onmouseup = e => handleOnUp(e);
window.ontouchend = e => handleOnUp(e.touches[0]);
window.onmousemove = e => handleOnMove(e);
window.ontouchmove = e => handleOnMove(e.touches[0]);