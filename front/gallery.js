import { openModal, closeModal, populateModal, populatePicturesGallery} from "./crisiLibrary.js";

const pics = document.getElementById("Pictures");
const modalScreen = document.getElementById("modalScreen");
const modal = document.getElementById("modal");

const currentCategory = document.getElementById("currentCategory");

let currentCat = currentCategory.querySelector("h1").textContent.trim().toUpperCase();
let isModalOpen = false;

// category switching handlers
document.querySelectorAll(".cat-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        updateCategory(btn.id.toUpperCase());
    });
});

async function initPhotos(){
    await populatePicturesGallery(currentCat);
}

pics.addEventListener("click", (e) => {
    if(e.target.classList.contains("pic")) {
        const photoID = e.target.dataset.id;
        isModalOpen = true;

        console.log("photo id - " + photoID);
        populateModal(Number(photoID))

        openModal(modal, modalScreen);
    }
});

modalScreen.addEventListener('click', () => {
    isModalOpen = false;
    closeModal(modal, modalScreen);
});

/* --- Scroll Logic --- */
const handleOnDown = e => pics.dataset.mouseDownAt = e.clientX;

const handleOnUp = () => {
    pics.dataset.mouseDownAt = "0";
    pics.dataset.prevPercentage = pics.dataset.percentage;
}

const handleOnMove = e => {
    if(pics.dataset.mouseDownAt === "0") return;
    if(isModalOpen) return;

    const mouseDelta = parseFloat(pics.dataset.mouseDownAt) - e.clientX,
          maxDelta = window.innerWidth / 2;

    const percentage = (mouseDelta / maxDelta) * -100,
          nextPercentUnconstrained = parseFloat(pics.dataset.prevPercentage) + percentage;

    const imageCount = pics.getElementsByClassName("pic").length;
    const columns = Math.ceil(imageCount / 2);
    const screenCapacity = 4.5;

    const maxScroll = columns <= screenCapacity ? 0 : -100 * (1 - (screenCapacity / columns));

    const nextPercent = Math.max(Math.min(nextPercentUnconstrained, 0), maxScroll);

    pics.dataset.percentage = nextPercent;

    pics.animate({
        transform: `translate(${nextPercent}%)`
    }, { duration: 2500, fill: "forwards" });

    fadeCurrentCategory(Math.abs(nextPercent));
}

window.onwheel = e => {
    if(isModalOpen) return;

    const scrollSpeed = 0.03; 
    const currentPercent = parseFloat(pics.dataset.percentage) || 0;
    const nextPercentUnconstrained = currentPercent + e.deltaY * -scrollSpeed;

    const imageCount = pics.getElementsByClassName("pic").length;
    const columns = Math.ceil(imageCount / 2);
    const screenCapacity = 4.5;

    const maxScroll = columns <= screenCapacity ? 0 : -100 * (1 - (screenCapacity / columns));

    const nextPercent = Math.max(Math.min(nextPercentUnconstrained, 0), maxScroll);

    pics.dataset.percentage = nextPercent;
    pics.dataset.prevPercentage = nextPercent;

    pics.animate({
        transform: `translate(${nextPercent}%)`
    }, { duration: 1200, fill: "forwards" });

    fadeCurrentCategory(Math.abs(nextPercent));
}

function fadeCurrentCategory(normalizedPercent){
    const triggerThreshold = 20;

    const progress = Math.max(0, Math.min(normalizedPercent / triggerThreshold, 1));

    const blurAmount = progress * 24;

    const opacityAmount = 1 - progress;

    currentCategory.animate({
        filter: `blur(${blurAmount}px)`,
        opacity: opacityAmount,
        transform: `scale(${1 - (progress * 0.1)})`
    },{
        duration: 2400, fill: "both"
    });
}

function updateCategory(newCat){
    const h1 = currentCategory.querySelector("h1");

    if(h1 && currentCat !== newCat){
        currentCat = newCat;
        h1.textContent = currentCat;

        //resetting scroll
        pics.dataset.percentage = "0";
        pics.dataset.prevPercentage = "0";
        pics.animate({ transform: `translate(0%)` }, { duration: 500, fill: "forwards" });

        fadeCurrentCategory(0);

        populatePicturesGallery(currentCat)
    }
}

document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('dragstart', (e) => {
    if(e.target.nodeName === 'IMG') {
        e.preventDefault();
    }
});
window.ondragstart = function() { return false; };

document.addEventListener("DOMContentLoaded", () => {
    initPhotos();
});

window.onmousedown = e => handleOnDown(e);
window.ontouchstart = e => handleOnDown(e.touches[0]);
window.onmouseup = e => handleOnUp(e);
window.ontouchend = e => handleOnUp(e.touches[0]);
window.onmousemove = e => handleOnMove(e);
window.ontouchmove = e => handleOnMove(e.touches[0]);