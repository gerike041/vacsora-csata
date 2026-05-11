const uploadButton = document.getElementById("cloudinaryUploadButton");
const uploadStatus = document.getElementById("uploadStatus");
const previewContainer = document.getElementById("previewContainer");

// 1. Ide írd be a saját Cloudinary cloud name-edet
const CLOUD_NAME = "dkkddwlak";

// 2. Ide írd be az unsigned upload preset nevét
const UPLOAD_PRESET = "vacsoracsata";

const uploadWidget = cloudinary.createUploadWidget(
  {
    cloudName: CLOUD_NAME,
    uploadPreset: UPLOAD_PRESET,
    sources: ["local"],
    multiple: true,
    maxFiles: 10,
    resourceType: "image",
    folder: "vacsora-csata",
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

      const previewCard = document.createElement("div");
      previewCard.classList.add("preview-card");

      const image = document.createElement("img");
      image.src = imageUrl;
      image.alt = "Feltöltött kép";

      previewCard.appendChild(image);
      previewContainer.prepend(previewCard);

      console.log("Feltöltött kép URL:", imageUrl);
    }
  }
);

uploadButton.addEventListener("click", function () {
  uploadWidget.open();
});