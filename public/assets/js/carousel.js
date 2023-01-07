const getPhotos = async () => {
  const images = [];
  try {
    const response = await fetch("http://localhost:3000/admin/home/files");
    const data = await response.json();
    data.map((data) => {
      images.push({
        image: "/admin/home/image/" + data.filename,
        link: data.link,
        description: data.description,
      });
    });
  } catch (err) {
    console.log(err);
  }
  createSlides(images);
};

const createSlides = (images) => {
  const slidesHost = document.getElementById("slides-host");

  images.map((image) => {
    if (image.link) {
      const a = document.createElement("a");
      a.href = image.link;
      const newSlide = document.createElement("div");
      const background = document.createElement("div");
      background.classList.add("slide-background");
      background.style.backgroundImage = `url(${image.image})`;
      newSlide.classList.add("slide", "slide-with-link");
      const slideDescription = document.createElement("div");
      slideDescription.classList.add("slide-description");
      slideDescription.innerText = image.description;
      newSlide.appendChild(background);
      newSlide.appendChild(slideDescription);
      a.appendChild(newSlide);
      slidesHost.append(a);
    } else {
      const newSlide = document.createElement("div");
      const background = document.createElement("div");
      background.classList.add("slide-background");
      background.style.backgroundImage = `url(${image.image})`;
      newSlide.classList.add("slide");
      const slideDescription = document.createElement("div");
      slideDescription.classList.add("slide-description");
      slideDescription.innerText = image.description;
      newSlide.appendChild(background);
      newSlide.appendChild(slideDescription);
      slidesHost.append(newSlide);
    }
  });
};

// onload funciton
window.addEventListener("DOMContentLoaded", () => {
  getPhotos();
});
