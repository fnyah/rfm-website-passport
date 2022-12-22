const getPhotos = () => {
  $.ajax({
    url: "http://localhost:3000/admin/home/files",
    type: "GET",
    success: function (data) {
      const images = [];
      for (let i = 0; i < data.length; i++) {
        images.push("/admin/home/image/" + data[i].filename);
      }
      createSlides(images);
    },
    error: function (err) {
      console.log(err);
    },
  });
};

const createSlides = (images) => {
  for (let i = 0; i < images.length; i++) {
    const slidesHost = document.getElementById("slides-host");
    const newSlide = document.createElement("li");
    newSlide.classList.add("slide");
    newSlide.style.backgroundImage = `url(${images[i]})`;
    newSlide.style.backgroundSize = "cover";
    newSlide.style.backgroundPosition = "center";
    newSlide.style.width = "400px";
    newSlide.style.height = "400px";
    // place image in center of slide
    newSlide.style.display = "flex";
    slidesHost.appendChild(newSlide);
    console.log(newSlide);
  }
  buttonLogic();
};

const buttonLogic = () => {
  const slidesContainer = document.getElementById("slides-host");
  const slide = document.querySelector(".slide");
  const prevButton = document.getElementById("slide-arrow-prev");
  const nextButton = document.getElementById("slide-arrow-next");

  nextButton.addEventListener("click", () => {
    if (
      slidesContainer.scrollLeft + slidesContainer.clientWidth >=
      slidesContainer.scrollWidth
    ) {
      slidesContainer.scrollLeft = 0;
      return;
    }
    // disable nextbutton for 1 second to not mess up animation
    nextButton.disabled = true;
    setTimeout(() => {
      nextButton.disabled = false;
    }, 500);
    const slideWidth = slide.clientWidth;
    slidesContainer.scrollLeft += slideWidth;
  });

  prevButton.addEventListener("click", () => {
    // when at first slide go to last slide
    if (slidesContainer.scrollLeft === 0) {
      slidesContainer.scrollLeft = slidesContainer.scrollWidth;
      return;
    }
    prevButton.disabled = true;
    setTimeout(() => {
      prevButton.disabled = false;
    }, 500);
    const slideWidth = slide.clientWidth;
    slidesContainer.scrollLeft -= slideWidth;
  });
};

// onload funciton
window.onload = () => {
  getPhotos();
};
