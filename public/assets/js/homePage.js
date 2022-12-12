// generate an array of photo urls
const getPhotos = () => {
  $.ajax({
    url: "http://localhost:3000/admin/home/files",
    type: "GET",
    success: function (data) {
      for (let i = 0; i < data.length; i++) {
        if (i === 0) {
          const carousel = document.getElementById("carousel-host");
          const carouselItem = document.createElement("div");
          carouselItem.className = "carousel-item active";
          const img = document.createElement("img");
          img.className = "d-block w-100";
          img.src = "/admin/home/image/" + data[i].filename;
          img.alt = "First slide";
          carouselItem.appendChild(img);
          carousel.appendChild(carouselItem);
          continue;
        }
        const carousel = document.getElementById("carousel-host");
        const carouselItem = document.createElement("div");
        carouselItem.className = "carousel-item";
        const img = document.createElement("img");
        img.className = "d-block w-100";
        img.src = "/admin/home/image/" + data[i].filename;
        img.alt = "First slide";
        carouselItem.appendChild(img);
        carousel.appendChild(carouselItem);
      }
    },
    error: function (err) {
      console.log(err);
    },
  });
};

// onload function
window.onload = () => {
  getPhotos();
};
