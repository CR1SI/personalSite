import {openModal, closeModal, fetchData, populatePicturesAdmin } from "./crisiLibrary.js";

const addPic = document.getElementById("addPic");
const modal = document.getElementById("modal");
let isModalOpen = false;

addPic.addEventListener("click", () => {
    isModalOpen = true;
    openModal(modal, modalScreen);
});

let topPics = [];

async function toggleStar(id, ev){
    const index = topPics.findIndex(item => item === id);
    const isStarred = index !== -1;

    const starIcon = ev.currentTarget.querySelector('.star-icon');

    if(!isStarred){
        console.log("starring " + id);
        topPics.push(id);

        //add to database

        starIcon.classList.replace('text-gray-400', 'text-yellow-400');
        starIcon.classList.replace('hover:text-yellow-400', 'hover:text-gray-400');
    }
    else{
        console.log("unstarring " + id);
        topPics.splice(index, 1);

        //take out of database for starred images

        starIcon.classList.replace('text-yellow-400', 'text-gray-400');
        starIcon.classList.replace('hover:text-gray-400', 'hover:text-yellow-400');
    }
    
}

async function deleteImage(id, ev){
    console.log("deleting " + id);
    const container = ev.currentTarget.closest('.relative.group');

    if(container){
        container.style.transition = 'opacity 0.2s ease';
        container.style.opacity = '0';

        setTimeout(() => {
            container.remove();
        }, 200)
    }

    //delete from main database
}

window.toggleStar = toggleStar;
window.deleteImage = deleteImage;
window.closeM = () => {
    isModalOpen = false;
    closeModal(modal, modalScreen);
};