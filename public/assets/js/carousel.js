const getPhotos = () => {
  $.ajax({
    url: "http://localhost:3000/admin/home/files",
    type: "GET",
    success: function (data) {
      const images = [];
      for (let i = 0; i < data.length; i++) {
        console.log(data[i]);
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
    console.log(images);
    const slidesHost = document.getElementById("slides-host");
    const newSlide = document.createElement("li");
    newSlide.classList.add("slide");
    newSlide.style.backgroundImage = `url(${images[i]})`;
    newSlide.style.backgroundSize = "cover";
    newSlide.style.backgroundPosition = "center";
    newSlide.style.width = "300px";
    newSlide.style.height = "300px";
    newSlide.style.display = "inline-block";
    newSlide.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
    newSlide.style.borderRadius = "5px";
    newSlide.style.margin = "5px";

    // if there are more than 8 slides than drop the first one to prioritize the new ones

    slidesHost.appendChild(newSlide);

    console.log(newSlide);
  }
};

// onload funciton
window.onload = () => {
  getPhotos();
};
