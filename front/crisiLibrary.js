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

export function fetchData(){
    //make fetch function
}

export function makeRequest(){
    //make it so I can put a request and it will do what it has to do!
}

export function populatePictures(data){
    const picContainer = document.getElementById("Pictures");
    if(!picContainer) return;

    const frag = document.createDocumentFragment();

    data.forEach(item => {
        const photo = document.createElement("img");

        photo.src = item.imageSrc;
        photo.dataset.id = item.id;
        photo.draggable = false;
        photo.className = "pic hover:scale-110 active:scale-100 transition duration-150 ease-in-out shadow-2xl select-none w-[70vmin] h-[70vmin] sm:w-[46vmin] sm:h-[46vmin] object-cover object-center";

        frag.appendChild(photo);
    });

    picContainer.appendChild(frag);
}

export function populatePicturesGallery(data){
    const picContainer = document.getElementById("Pictures");
    if(!picContainer) return;

    const frag = document.createDocumentFragment();

    data.forEach(item => {
        const photo = document.createElement("img");

        photo.src = item.imageSrc;
        photo.dataset.id = item.id;
        photo.draggable = false;
        photo.className = "pic hover:scale-110 active:scale-100 transition duration-150 ease-in-out shadow-2xl select-none w-[50vmin] h-[50vmin] sm:w-[26vmin] sm:h-[26vmin] object-cover object-center";

        frag.appendChild(photo);
    });

    picContainer.appendChild(frag);
}

export function populatePicturesAdmin(data) {
  const picContainer = document.getElementById("Pictures");
  if (!picContainer) return;

  const frag = document.createDocumentFragment();

  data.forEach((item) => {
    const wrapper = document.createElement("div");
    wrapper.className =
      "relative group w-[50vmin] h-[50vmin] sm:w-[26vmin] sm:h-[26vmin]";

    wrapper.innerHTML = `
            <img data-id="${item.id}" src="${item.imageSrc}" draggable="false"
                class="pic shadow-2xl select-none w-full h-full object-cover object-center">
            
            <div class="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none">
                <div class="flex justify-start">
                    <button onclick="toggleStar('${item.id}', event)"
                        class="pointer-events-auto text-5xl transition-colors duration-200 focus:outline-none">
                        <span class="star-icon text-gray-400 hover:text-yellow-400">★</span>
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
}

export function populateModal(data){
    document.getElementById("imageTitle").textContent = data.title;
    document.getElementById("imageLocation").textContent = data.location;
    document.getElementById("imageDescription").textContent = data.description;
    document.getElementById("imageSrc").src = data.imageSrc;

    const metaList = document.getElementById("metaList");
    metaList.innerHTML = "";

    Object.entries(data.metadata).forEach(([label, value]) => {
        const dt = document.createElement("dt");
        dt.textContent = label;

        const dd = document.createElement("dd");
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