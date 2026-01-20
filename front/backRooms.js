import {openModal, closeModal, populatePicturesAdmin, API_BASE } from "./crisiLibrary.js";

const uploadForm = document.getElementById('uploadForm');
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

        //update starred database
        try {
          const response = await fetch(
            `${API_BASE}/photos/${Number(id)}/favorite`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({}),
            },
          );
          if (response.ok) {
            const data = await response.json();
            console.log("updated successfully:", data);
          } else {
            const errorData = await response.json();
            alert("Error updating photo: " + errorData.detail);
          }
        } catch (error) {
          console.error("Network error:", error);
          alert("Could not connect to the server.");
        }

        starIcon.classList.replace('text-gray-400', 'text-yellow-400');
        starIcon.classList.replace('hover:text-yellow-400', 'hover:text-gray-400');
    }
    else{
        console.log("unstarring " + id);
        topPics.splice(index, 1);

        //update starred images
        try {
          const response = await fetch(
            `${API_BASE}/photos/${Number(id)}/favorite`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({}),
            },
          );
          if (response.ok) {
            const data = await response.json();
            console.log("updated successfully:", data);
          } else {
            const errorData = await response.json();
            alert("Error updating photo: " + errorData.detail);
          }
        } catch (error) {
          console.error("Network error:", error);
          alert("Could not connect to the server.");
        }

        starIcon.classList.replace('text-yellow-400', 'text-gray-400');
        starIcon.classList.replace('hover:text-gray-400', 'hover:text-yellow-400');
    }
    
}

async function deleteImage(id, ev) {
  console.log("deleting " + id);
  const container = ev.currentTarget.closest(".relative.group");

  if (container) {
    container.style.transition = "opacity 0.2s ease";
    container.style.opacity = "0";

    setTimeout(() => {
      container.remove();
    }, 200);
  }

  //delete from databases
  try {
    const response = await fetch(`${API_BASE}/photos/${Number(id)}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      console.log("Deleted successfully:", data);
    } else {
      const errorData = await response.json();
      alert("Error deleting photo: " + errorData.detail);
    }
  } catch (error) {
    console.error("Network error:", error);
    alert("Could not connect to the server.");
  }
}

uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fileInput = uploadForm.querySelector('input[type="file"]');
    const file = fileInput.files[0];

    const MAX_SIZE = 10 * 1024 * 1024;

    if (file && file.size > MAX_SIZE) {
        alert(`File is too large (${(file.size / (1024 * 1024)).toFixed(2)}MB). Max limit is 10MB.`);
        return;
    }

    const formData = new FormData(uploadForm);

    try{
        const response = await fetch(`${API_BASE}/upload`, {
            method: "POST",
            body: formData,
        });

        if(response.ok){
            const data = await response.json();
            console.log("upload success: ", data);

            isModalOpen = false;
            closeModal(modal, modalScreen)

            uploadForm.reset();
            populatePicturesAdmin();
        }else{
            alert("Upload failed. Check console for details.");
        }
    }catch(error){
        console.error("Error: ", error);
    }
});

document.addEventListener("DOMContentLoaded", async () => {
  const data = await populatePicturesAdmin();
  if (data) {
    topPics = data
      .filter((item) => item.favorite === true)
      .map((item) => String(item.id));

    console.log("Synced starred photos: ", topPics);
  }
});

window.toggleStar = toggleStar;
window.deleteImage = deleteImage;
window.closeM = () => {
    isModalOpen = false;
    closeModal(modal, modalScreen);
};