const pics = document.getElementById("Pictures");
const vine = document.getElementById("Vine");
const vinesContainer = document.getElementById("VinesContainer");
const aboutMe = document.getElementById("AboutMe");

const imageCount = pics.getElementsByClassName("pic").length;
const maxScroll = -100 * (imageCount - 4);
const currentPercent = parseFloat(pics.dataset.percentage) || 0;
const normalizedPercent = (currentPercent / maxScroll) * -100;

for(const image of pics.getElementsByClassName("pic")){
    image.style.objectPosition = `${100 + normalizedPercent}% center`;
}

vine.style.clipPath = `inset(0 ${100 - normalizedPercent}% 0 0)`;
vine.style.maskImage = `linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)`;

const rosePositions = [
    { position: 20, triggerPercent: -25, bottomOffset: 3.25},
    { position: 45, triggerPercent: -50, bottomOffset: 3},
    { position: 70, triggerPercent: -75, bottomOffset: 1},
    { position: 90, triggerPercent: -95, bottomOffset: 3}
];

const roses = [];
rosePositions.forEach((config, index) => {
    const roseContainer = document.createElement('div');
    roseContainer.className = 'rose-container';
    roseContainer.style.cssText = `
        position: absolute;
        left: ${config.position}%;
        bottom: ${config.bottomOffset}%;
        transform: translate(-50%, 50%);
        opacity: 0;
        pointer-events: none;
        width: 100px;
        height: 100px;
    `;

    const frames = ['assets/frame1Rose.svg', 'assets/frame2Rose.svg', 'assets/frame3Rose.svg'];
    const roseImages = [];
    
    frames.forEach(src => {
        const roseImg = document.createElement('img');
        roseImg.className = 'rose-img';
        roseImg.src = src;
        roseImg.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100px;
            height: 100px;
            transform: scale(0);
            transform-origin: center center;
        `;

        roseContainer.appendChild(roseImg);
        roseImages.push(roseImg);
    });

    vinesContainer.appendChild(roseContainer);
    
    roses.push({
        container: roseContainer,
        imgs: roseImages,
        config: config,
        currentFrame: 0,
        isAnimating: false,
        hasBlossomed: false
    });
});

const roseTimeouts = new Map();
function animateRose(rose){
    if (rose.isAnimating || rose.hasBlossomed){
        return;
    } 

    rose.isAnimating = true;
    rose.hasBlossomed = true;

    rose.fadeAnim = rose.container.animate(
        { opacity: [0, 1] },
        { duration: 1000, fill: 'forwards', easing: 'ease-out' }
    );

    let frameIndex = 0;

    function nextFrame() {
        if(!rose.hasBlossomed) return;

        const currentImg = rose.imgs[frameIndex];

        const scaleValues = frameIndex === 0 ? [0, 1] : frameIndex === 1 ? [0.5, 1] : [0.86, 1];

        currentImg.animate(
            {
                transform: scaleValues.map(s => `scale(${s})`)
            },
            {
                duration: 500,
                fill: `both`,
                easing: `cubic-bezier(0.24, 0.84, 0.94, 1)`
            }
        );

        frameIndex++;
        if(frameIndex < rose.imgs.length){
            const timeout = setTimeout(nextFrame, 400);
            roseTimeouts.set(rose, timeout);
        }else{
            rose.isAnimating = false;
        }
    }

    nextFrame();
}


function updateRoses(normalizedPercent){
    roses.forEach(rose => {
        if(normalizedPercent <= rose.config.triggerPercent && !rose.hasBlossomed) {
            animateRose(rose);
        }
        else if(normalizedPercent >= rose.config.triggerPercent && rose.hasBlossomed) {
            resetRose(rose);
        }
    });
}

function resetRose(rose) {
    rose.hasBlossomed = false;
    rose.isAnimating = false;

    if (roseTimeouts.has(rose)) {
        clearTimeout(roseTimeouts.get(rose));
        roseTimeouts.delete(rose);
    }

    rose.imgs.forEach(img => {
        img.animate(
            { transform: ['scale(1)', 'scale(0)'] },
            { duration: 400, fill: 'forwards', easing: 'ease-in' }
        );
    });

    rose.fadeAnim = rose.container.animate(
        { opacity: [1, 0] },
        { duration: 400, fill: 'forwards' }
    );

    rose.fadeAnim.onfinish = () => {
        if (!rose.hasBlossomed) { 
            rose.container.style.opacity = '0';
            rose.imgs.forEach(img => img.style.transform = 'scale(0)');
        }
    };
}

const handleOnDown = e => pics.dataset.mouseDownAt = e.clientX;

const handleOnUp = () => {
    pics.dataset.mouseDownAt = "0";
    pics.dataset.prevPercentage = pics.dataset.percentage;
}

function updateAboutMe(normalizedPercent){
    const triggerThreshold = 15;

    const progress = Math.max(0, Math.min(normalizedPercent / triggerThreshold, 1));

    const blurAmount = progress * 24;

    const opacityAmount = 1 - progress;

    aboutMe.animate({
        filter: `blur(${blurAmount}px)`,
        opacity: opacityAmount,
        transform: `scale(${1 - (progress * 0.1)})`
    },{
        duration: 2400, fill: "both"
    });
}

const handleOnMove = e => {
    if(pics.dataset.mouseDownAt === "0") return;
    
    const mouseDelta = parseFloat(pics.dataset.mouseDownAt) - e.clientX, maxDelta = window.innerWidth / 2;

    const percentage = (mouseDelta / maxDelta) * -100, 
    nextPercentUnconstrained = parseFloat(pics.dataset.prevPercentage) + percentage;

    const imageCount = pics.getElementsByClassName("pic").length;
    const maxScroll = -100 * (imageCount - 5);
    const nextPercent = Math.max(Math.min(nextPercentUnconstrained, 0), maxScroll);

    const currentPercent = parseFloat(pics.dataset.percentage) || 0;
    if(nextPercent === currentPercent) return;

    pics.dataset.percentage = nextPercent;

    pics.animate({transform: `translate(${nextPercent}%, -65%)`}, 
        {duration: 2500, fill: "forwards" });

    const scrollRange = -100 * (imageCount - 5);
    const normalizedPercent = (nextPercent / scrollRange) * -100;
    
    for(const image of pics.getElementsByClassName("pic")){
        image.animate({objectPosition: `${100 + normalizedPercent}% center`}, 
            {duration: 1200, fill: "forwards" });
    }

    vine.animate({clipPath: `inset(0 ${100 - Math.abs(normalizedPercent)}% 0 0)`},
        {duration: 1200, fill: "forwards"});

    updateRoses(normalizedPercent);
    updateAboutMe(Math.abs(normalizedPercent));
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