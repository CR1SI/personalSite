/*
{
  "id": 3758,
  "favorite": no,
  "category": "Nature",
  "title": "Mountain Sunrise",
  "location": "Swiss Alps",
  "description": "A cold morning hike worth every second.",
  "imageSrc": "link post cloudinary",
  "metadata": {
    "Camera": "Canon Rebel T7",
    "Lens": "18-55mm",
    "Focal Length": "55mm",
    "Aperture": "f/4.0",
    "Exposure Time": "1/250s",
    "ISO": "100",
    "Date Taken": "04/13/26",
    "Author": "Cristian Padleski",
    "File Size": "54.3MB",
    "Dimensions": "4000x5800"
  }
}
*/

export const API_BASE = "https://personalsite-production-d831.up.railway.app/"

async function fetchData(){
    try {
    const response = await fetch(`http://127.0.0.1:8000/photos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      console.log("retrieved photos successfully:", data);
      return data
    } else {
      const errorData = await response.json();
      alert("Error retrieving photos: " + errorData.detail);
      return [];
    }
  } catch (error) {
    console.error("Network error:", error);
    alert("Could not connect to the server.");
    return [];
  }
}

async function fetchId(id){
    try {
    const response = await fetch(`http://127.0.0.1:8000/photos/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      console.log("retrieved photo successfully:", data);
      return data
    } else {
      const errorData = await response.json();
      alert("Error retrieving photo: " + errorData.detail);
      return [];
    }
  } catch (error) {
    console.error("Network error:", error);
    alert("Could not connect to the server.");
    return [];
  }
}

export async function populatePictures(){
    const picContainer = document.getElementById("Pictures");
    if(!picContainer) return;
    picContainer.innerHTML = ""

    const data = await fetchData();
    const frag = document.createDocumentFragment();

    data.forEach(item => {
        if(item.favorite === true){
        const photo = document.createElement("img");

        photo.src = item.img_src;
        photo.dataset.id = item.id;
        photo.draggable = false;
        photo.className = "pic hover:scale-110 active:scale-100 transition duration-150 ease-in-out shadow-2xl select-none w-[70vmin] h-[70vmin] sm:w-[46vmin] sm:h-[46vmin] object-cover object-center";

        frag.appendChild(photo);
        }
    });

    picContainer.appendChild(frag);
    return data;
}

export async function populatePicturesGallery(category){
    const picContainer = document.getElementById("Pictures");
    
    if(!picContainer) return;
    picContainer.innerHTML = ""

    const data = await fetchData();
    const frag = document.createDocumentFragment();

    data.forEach(item => {
      if(item.category.toUpperCase() === category){
          const photo = document.createElement("img");

          photo.src = item.img_src;
          photo.dataset.id = item.id;
          photo.draggable = false;
          photo.className = "pic hover:scale-110 active:scale-100 transition duration-150 ease-in-out shadow-2xl select-none w-[50vmin] h-[50vmin] sm:w-[26vmin] sm:h-[26vmin] object-cover object-center";

          frag.appendChild(photo);
      }
    });

    picContainer.appendChild(frag);
    return data;
}

export async function populatePicturesAdmin() {
  const picContainer = document.getElementById("Pictures");
  
  if (!picContainer) return;
  picContainer.innerHTML = ""

  const data = await fetchData();
  const frag = document.createDocumentFragment();

  data.forEach((item) => {
    const wrapper = document.createElement("div");
    wrapper.className =
      "relative group w-[50vmin] h-[50vmin] sm:w-[26vmin] sm:h-[26vmin]";
    
    const isFav = item.favorite ? 'text-yellow-400' : 'text-gray-400';
    const hoverClass = item.favorite ? 'hover:text-gray-400' : 'hover:text-yellow-400';

    wrapper.innerHTML = `
            <img data-id="${item.id}" src="${item.img_src}" draggable="false"
                class="pic shadow-2xl select-none w-full h-full object-cover object-center">
            
            <div class="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none">
                <div class="flex justify-start">
                    <button onclick="toggleStar('${item.id}', event)"
                        class="pointer-events-auto text-5xl transition-colors duration-200 focus:outline-none">
                        <span class="star-icon ${isFav} ${hoverClass}">★</span>
                    </button>
                </div>
                <div class="flex justify-end">
                    <button onclick="deleteImage('${item.id}', event)"
                        class="pointer-events-auto bg-black/50 hover:bg-red-600 text-white text-xl px-2 py-1 rounded border border-white/40 transition-colors">
                        DEL
                    </button>
                </div>
            </div>
        `;

    frag.appendChild(wrapper);
  });

  picContainer.appendChild(frag);

  return data;
}

export async function populateModal(photoID){

    const data = await fetchId(photoID);
    document.getElementById("imageTitle").textContent = data.title;
    document.getElementById("imageLocation").textContent = data.location;
    document.getElementById("imageDescription").textContent = data.description;
    document.getElementById("imageSrc").src = data.img_src;

    const metaList = document.getElementById("metaList");
    metaList.innerHTML = "";

    Object.entries(data.photo_metadata).forEach(([label, value]) => {
        const dt = document.createElement("dt");
        dt.className = "font-semibold text-gray-900";
        dt.textContent = label;

        const dd = document.createElement("dd");
        dd.className = "text-gray-600";
        dd.textContent = value;

        metaList.appendChild(dt);
        metaList.appendChild(dd);
    })
}

export function openModal(modal, modalScreen){
    modalScreen.classList.replace('hidden', 'flex');
    requestAnimationFrame(() => {
        modalScreen.classList.replace("opacity-0", "opacity-100");
        modal.classList.replace("scale-0", "scale-100");
        modal.classList.replace("opacity-0", "opacity-100");
        
        modal.classList.remove("duration-600");
        modal.classList.add("duration-250");
        modalScreen.classList.add("duration-250");
    });
}
export function closeModal(modal, modalScreen){
    modal.classList.replace("scale-100", "scale-0");
    modal.classList.replace("opacity-100", "opacity-0");
    modalScreen.classList.replace("opacity-100", "opacity-0");

    modal.classList.replace("duration-250", "duration-600");
    modalScreen.classList.replace("duration-250", "duration-600");

    setTimeout(() => {
        modalScreen.classList.replace('flex', 'hidden');
    }, 600);
}