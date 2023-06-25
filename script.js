const loader = document.querySelector(".loader");
const imagesContainer = document.querySelector(".images-container");
const saveConfirmed = document.querySelector(".save-confirmed");
const favoriteNav = document.getElementById("favoritesNav");
const resultsNav = document.getElementById("resultsNav");

let resultArray = [];
let favorites = {};

// Hide Loader
function showContent(page) {
  window.scrollTo({ top: 0, behavior: "instant" });
  if (page === "results") {
    resultsNav.classList.remove("hidden");
    favoriteNav.classList.add("hidden");
  } else {
    resultsNav.classList.add("hidden");
    favoriteNav.classList.remove("hidden");
  }
  loader.classList.add("hidden");
}

// NASA API
const count = 2;
const apiKey = "DEMO_KEY";
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

// Create DOM
function createDOMNodes(page) {
  const currentArray =
    page === "results" ? resultArray : Object.values(favorites);

  currentArray.forEach((e) => {
    // Card Container
    const card = document.createElement("div");
    card.classList.add("card");
    // Link Container
    const link = document.createElement("a");
    link.href = e.hdurl;
    link.title = "View Full Image";
    link.target = "_blank";
    // Image
    const image = document.createElement("img");
    image.src = e.url;
    image.alt = "NASA Picture";
    image.loading = "lazy";
    image.classList.add("card-image-top");
    // Card Body
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    // Card Title
    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = e.title;
    // Save Text
    const saveText = document.createElement("p");
    saveText.classList.add("clickable");
    if (page === "results") {
      saveText.textContent = "Add To Favorites";
      saveText.setAttribute("onclick", `saveFavorites('${e.url}')`);
    } else {
      saveText.textContent = "Remove To Favorites";
      saveText.setAttribute("onclick", `removeFavorites('${e.url}')`);
    }
    // Card Text
    const cardText = document.createElement("p");
    cardText.classList.add("card-text");
    cardText.textContent = e.explanation;
    // Footer Container
    const footer = document.createElement("small");
    footer.classList.add("text-muted");
    // Date
    const date = document.createElement("strong");
    date.textContent = e.date;
    // Copy Right
    const copyRightResult = e.copyright === undefined ? "" : e.copyright;
    const copyRight = document.createElement("span");
    copyRight.textContent = ` ${copyRightResult}`;

    // Append
    footer.append(date, copyRight);
    cardBody.append(cardTitle, saveText, cardText, footer);
    link.appendChild(image);
    card.append(link, cardBody);
    imagesContainer.appendChild(card);
  });
}

// Update the DOM
function updateDOM(page) {
  if (localStorage.getItem("nasaFavorites")) {
    favorites = JSON.parse(localStorage.getItem("nasaFavorites"));
  }
  imagesContainer.textContent = "";
  createDOMNodes(page);
  showContent(page);
}

// fetch API
async function getNasaPicture() {
  loader.classList.remove("hidden");
  try {
    const response = await fetch(apiUrl);
    resultArray = await response.json();
    updateDOM("results");
  } catch (error) {
    // Catch Error
  }
}

function saveFavorites(itemUrl) {
  resultArray.forEach((item) => {
    if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
      favorites[itemUrl] = item;
      saveConfirmed.hidden = false;
      setTimeout(() => {
        saveConfirmed.hidden = true;
      }, 1000);
      //   Save Data LocalStorage
      localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
    }
  });
}
// Remove item
function removeFavorites(itemUrl) {
  if (favorites[itemUrl]) {
    delete favorites[itemUrl];
    //   Save Data LocalStorage
    localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
    updateDOM("favorites");
  }
}

// OnLoad Function

getNasaPicture();
