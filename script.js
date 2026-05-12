const uploadButton = document.getElementById("cloudinaryUploadButton");
const uploadStatus = document.getElementById("uploadStatus");


const CLOUD_NAME = "dkkddwlak";
const UPLOAD_PRESET = "vacsoracsata";
const GALLERY_TAG = "vacsora-csata";

let galleryImages = [];
let currentSlideIndex = 0;

const uploadWidget = cloudinary.createUploadWidget(
  {
    cloudName: CLOUD_NAME,
    uploadPreset: UPLOAD_PRESET,
    sources: ["local"],
    multiple: true,
    maxFiles: 10,
    resourceType: "image",
    folder: "vacsora-csata",
    tags: [GALLERY_TAG],
    clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
    maxFileSize: 8000000,
    cropping: false
  },
  function (error, result) {
    if (error) {
      console.error("Cloudinary upload error:", error);
      uploadStatus.textContent = "Hiba történt a feltöltés közben.";
      return;
    }

    if (result && result.event === "success") {
      uploadStatus.textContent = "Sikeres képfeltöltés.";

      const imageUrl = result.info.secure_url;
      const publicId = result.info.public_id;

      const newImage = {
        publicId: publicId,
        fullUrl: imageUrl,
        thumbUrl: imageUrl
      };

      galleryImages.unshift(newImage);

      currentSlideIndex = 0;
      renderSlideshow();

      console.log("Új feltöltött kép:", newImage);
    }
  }
);

uploadButton.addEventListener("click", function () {
  uploadWidget.open();
});

function getOptimizedImageUrl(publicId) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/c_fill,w_900,h_650,q_auto,f_auto/${publicId}`;
}

function getThumbnailUrl(publicId) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/c_fill,w_500,h_500,q_auto,f_auto/${publicId}`;
}

async function loadCloudinaryGallery() {
  try {
    const listUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/list/${GALLERY_TAG}.json`;

    const response = await fetch(listUrl);

    if (!response.ok) {
      throw new Error("A galéria betöltése nem sikerült.");
    }

    const data = await response.json();

    galleryImages = data.resources.map(function (resource) {
      return {
        publicId: resource.public_id,
        fullUrl: getOptimizedImageUrl(resource.public_id),
        thumbUrl: getThumbnailUrl(resource.public_id)
      };
    });

    
    renderSlideshow();

  } catch (error) {
    console.error(error);
    uploadStatus.textContent = "A galéria betöltése nem sikerült. Ellenőrizd a Cloudinary Resource list beállítást.";
  }
}




function renderSlideshow() {
  const slideshowImage = document.getElementById("slideshowImage");
  const slideshowCounter = document.getElementById("slideshowCounter");

  if (!slideshowImage || !slideshowCounter) {
    return;
  }

  if (galleryImages.length === 0) {
    slideshowImage.src = "";
    slideshowImage.alt = "";
    slideshowCounter.textContent = "Nincs feltöltött kép";
    return;
  }

  slideshowImage.src = galleryImages[currentSlideIndex].fullUrl;
  slideshowImage.alt = "Vacsora Csata slideshow kép";
  slideshowCounter.textContent = `${currentSlideIndex + 1} / ${galleryImages.length}`;
}

function nextSlide() {
  if (galleryImages.length === 0) return;

  currentSlideIndex++;

  if (currentSlideIndex >= galleryImages.length) {
    currentSlideIndex = 0;
  }

  renderSlideshow();
}

function previousSlide() {
  if (galleryImages.length === 0) return;

  currentSlideIndex--;

  if (currentSlideIndex < 0) {
    currentSlideIndex = galleryImages.length - 1;
  }

  renderSlideshow();
}

const nextButton = document.getElementById("nextSlide");
const prevButton = document.getElementById("prevSlide");

if (nextButton) {
  nextButton.addEventListener("click", nextSlide);
}

if (prevButton) {
  prevButton.addEventListener("click", previousSlide);
}

setInterval(function () {
  if (galleryImages.length > 1) {
    nextSlide();
  }
}, 5000);

loadCloudinaryGallery();