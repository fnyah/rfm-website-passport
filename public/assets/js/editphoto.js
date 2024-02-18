console.log("editphoto.js loaded");

const clickedPhotos = [];
const handlePhotoClicked = (e) => {
  e.target.classList.add("selected");
  let photoUrl = e.target.style.backgroundImage;
  // trim the url away from the background image so its only the file name left
  photoUrl = photoUrl.slice(5, -2);
  //replace single quotes with double quotes
  photoUrl = photoUrl.replace(/'/g, '"');
  photoUrl = photoUrl.split("/").pop();

  // if the photo is already in the clickedPhotos array remove it
  if (clickedPhotos.includes(photoUrl)) {
    e.target.classList.remove("selected");
    const index = clickedPhotos.indexOf(photoUrl);
    clickedPhotos.splice(index, 1);
    console.log(clickedPhotos);
    return;
  }
  // if the photo is not in the clickedPhotos array add it
  clickedPhotos.push(photoUrl);
  console.log(photoUrl.length);
  console.log(clickedPhotos);
};

const editPhotos = () => {
  const projectPhotoBox = document.querySelector(".project-photo-box");
  projectPhotoBox.style.border = "5px solid grey";
  const photos = document.querySelectorAll(".project-image-background");
  // remove the edit button
  const editPhotoButton = document.querySelector("#edit-images-btn");
  editPhotoButton.remove();
  // add the click event listener to each photo
  photos.forEach((photo) => {
    photo.addEventListener("click", handlePhotoClicked);
  });

  // add the save button
  const savePhotoButton = document.createElement("button");
  savePhotoButton.type = "button";
  savePhotoButton.id = "save-images-btn";
  savePhotoButton.innerText = "Stop Editing Photos";
  savePhotoButton.classList.add("btn", "btn-primary", "px-3", "mt-4");
  savePhotoButton.style.marginBottom = "10px";
  savePhotoButton.style.marginRight = "5px";
  const editPhotoButtonContainer = document.querySelector(".btn-container");

  // create remove photos button
  const removePhotosButton = document.createElement("button");
  removePhotosButton.type = "button";
  removePhotosButton.id = "remove-images-btn";
  removePhotosButton.innerText = "Remove Selected Photos";
  removePhotosButton.classList.add("btn", "btn-danger", "px-3", "mt-4");
  removePhotosButton.style.marginBottom = "10px";
  removePhotosButton.style.marginLeft = "10px";
  // on click add clickedPhotosurl to the body of the request
  const projectId = document.URL.split("/")[6];
  removePhotosButton.addEventListener("click", () => {
    projectPhotoBox.style.border = "none";
    photos.forEach((photo) => {
      // remove selected class
      photo.classList.remove("selected");
      photo.removeEventListener("click", handlePhotoClicked);
    });

    const removePhotosUrl = "/admin/projects/" + projectId;
    const removePhotosRequest = new Request(removePhotosUrl, {
      method: "post",
      body: JSON.stringify(clickedPhotos),
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
    });
    fetch(removePhotosRequest).then((res) => {
      if (res.ok) {
        console.log("photos removed");
        location.reload();
      }
    });
    clickedPhotos.length = 0;
    savePhotoButton.remove();
    removePhotosButton.remove();
    editPhotoButtonContainer.appendChild(editPhotoButton);
  });

  editPhotoButtonContainer.appendChild(removePhotosButton);

  // when save button is clicked, remove the click event listener from each photo
  // and remove the save button
  savePhotoButton.addEventListener("click", () => {
    removePhotosButton.remove();
    projectPhotoBox.style.border = "none";
    //empty clickedPhotos array
    clickedPhotos.length = 0;

    photos.forEach((photo) => {
      // remove selected class
      photo.classList.remove("selected");
      photo.removeEventListener("click", handlePhotoClicked);
    });
    savePhotoButton.remove();
    editPhotoButtonContainer.appendChild(editPhotoButton);
  });
  editPhotoButtonContainer.appendChild(savePhotoButton);

  // console log photos background url when clicked
};

const editPhotoButton = document.querySelector("#edit-images-btn");
editPhotoButton.addEventListener("click", editPhotos);

// need to used named functions for event listeners to be able to remove them

