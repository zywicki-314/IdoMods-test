const mobMenuToggle = document.querySelector(".mob-menu-toggle");
const descNavMenu = document.querySelector(".desc-items");
const mobMenuPopUp = document.querySelector(".mob-items");
//
const descMenuItem = document.querySelectorAll(".nav-item");
const mobMenuItem = document.querySelectorAll(".mob-item");
const allMenuItems = [...descMenuItem, ...mobMenuItem];
//
const popUpToggle = document.querySelector(".close-pop-up");
const popUpContainer = document.getElementById("popUp");
const blurContainer = document.getElementById("blur");
//
const topLogo = document.getElementById("topLogo");
const navBar = document.getElementById("nav");
//
const nameId = document.querySelector(".id-data");
const nameText = document.querySelector(".text-data");
//
const section1 = document.getElementById("section--1");
const section2 = document.getElementById("section--2");
//
const productsContener = document.getElementById("section--3");
const sections = document.querySelectorAll("section[data-id]");
// POP-UP and BLUR

const blurContainerClose = () => {
  blurContainer.classList.remove(
    blurContainer.classList.contains("blur-container_pop-up")
      ? "blur-container_pop-up"
      : "blur-container_mob-bg"
  );
  if (navBar.classList.contains("blur-container_mob-bg")) {
    navBar.classList.remove("blur-container_mob-bg");
  }
  blurContainer.classList.add("hidden-items");
};
const blurContainerOpen = (type) => {
  if (type === "mob") {
    blurContainer.classList.add("blur-container_mob-bg");
  }
  if (type === "prod") {
    blurContainer.classList.add("blur-container_pop-up");
  }
  blurContainer.classList.remove("hidden-items");
};

const togleMobMenuClose = () => {
  mobMenuPopUp.classList.remove("mob-nav-active");
  midleMenuLine.classList.add("line-burger-active");
  mobMenuToggle.classList.add("mob-menu-toggle-disabled");
  mobMenuToggle.classList.remove("mob-menu-toggle-active");
};

const popUpContainerClose = () => {
  popUpContainer.classList.remove("pop-up");
  popUpContainer.classList.add("hidden-items");
};
const popUpContainerOpen = () => {
  popUpContainer.classList.add("pop-up");
  popUpContainer.classList.remove("hidden-items");
};

popUpToggle.addEventListener("click", function () {
  popUpContainerClose();
  if (blurContainer.classList.contains("blur-container_pop-up")) {
    blurContainerClose();
  }
});

blurContainer.addEventListener("click", function () {
  blurContainerClose();
  popUpContainerClose();
  togleMobMenuClose();

  if (mobMenuPopUp.classList.contains("mob-nav-active")) {
    togleMobMenuClose();
  }
});
//

let navBarHeight = navBar.getBoundingClientRect().height;
//
const midleMenuLine = document.querySelector(".line-burger");
mobMenuToggle.classList.add("mob-menu-toggle-disabled");
midleMenuLine.classList.add("line-burger-active");

mobMenuToggle.addEventListener("click", function () {
  const isTheMenuOpen = mobMenuPopUp.classList.contains("mob-nav-active");

  if (isTheMenuOpen) {
    togleMobMenuClose();
    blurContainerClose();
  } else {
    mobMenuPopUp.classList.add("mob-nav-active");
    midleMenuLine.classList.remove("line-burger-active");
    mobMenuToggle.classList.remove("mob-menu-toggle-disabled");
    mobMenuToggle.classList.add("mob-menu-toggle-active");
    blurContainerOpen("mob");
  }
});
///////////////////////////////////////////////

// SELECT
const productList = document.querySelector(".product-list");
const errorMessage = document.createElement("span");
errorMessage.classList.add("error");
const apiUrl = "https://brandstestowy.smallhost.pl/api/random";

const selectdata = document.getElementById("produkt-list");
const productData = {
  pageNumber: 1,
  pageSize: parseInt(selectdata.value),
  loadedData: [],
  lastPageData: [],
  pageHeight: document.body.offsetHeight,
  isLoading: false,
};

const addNewResponseData = (responseData, arrayData) => {
  responseData.forEach((item) => {
    arrayData.push({
      id: item.id,
      text: item.text,
    });
  });
};

const fetchData = async (productData) => {
  if (productData.isLoading) return;
  productData.isLoading = true;
  try {
    const url = `${apiUrl}?pageNumber=${productData.pageNumber}&pageSize=${productData.pageSize}`;
    const response = await fetch(url);
    console.log("scroll fetch");
    if (!response.ok)
      throw new Error(
        "Wystąpił błąd podczas pobierania danych o naszych produktach. Przepraszamy"
      );
    const { data: responseData } = await response.json();
    productData.lastPageData = [];
    addNewResponseData(responseData, productData.lastPageData);
    addNewResponseData(responseData, productData.loadedData);
    displayProducts(productData.lastPageData);
    productData.pageNumber++;
  } catch (e) {
    productsContener.appendChild(errorMessage);
    errorMessage.textContent = e.message;
  } finally {
    productData.isLoading = false;
  }
};

selectdata.addEventListener("change", function () {
  productData.pageSize = selectdata.value;
  productData.pageNumber = 1;
  productList.innerHTML = "";
  productData.loadedData = [];
  productData.lastPageData = [];
  productList.pageHeight = document.body.offsetHeight;
  fetchData(productData);
});

function displayProducts(products) {
  if (products) {
    products.forEach((product) => {
      const productDiv = document.createElement("div");
      productDiv.classList.add("product");

      const productName = document.createElement("h2");
      productName.textContent = `ID:${product.id}`;

      productDiv.appendChild(productName);
      productList.appendChild(productDiv);

      productDiv.addEventListener("click", function () {
        blurContainerOpen("prod");
        popUpContainerOpen();

        const id = product.id;
        const text = product.text;

        if (nameId && nameText) {
          nameId.textContent = id;
          nameText.textContent = text;
        }
      });
    });
    productData.pageHeight = document.body.offsetHeight;
  }
}
//

//
allMenuItems.forEach((menuItem) => {
  menuItem.addEventListener("click", () => {
    const sectionId = menuItem.dataset.href;
    const section = document.getElementById(`${sectionId}`);
    if (section) {
      navBarHeight = navBar.getBoundingClientRect().height;
      const sectionTop = Math.round(section.getBoundingClientRect().top);
      const sectionPosition = sectionTop - navBarHeight;
      window.scrollBy({
        top: sectionPosition,
        behavior: "smooth",
      });
    }
    if (menuItem.classList.contains("mob-item")) {
      togleMobMenuClose();
      blurContainerClose();
    }
  });
});

//

const keySectionsPosition = [];
//
sections.forEach((section) => {
  const top = Math.round(section.getBoundingClientRect().top);
  const height = Math.round(section.getBoundingClientRect().height);
  const name = section.dataset.id;

  const nav = document.querySelectorAll(`li[data-href=${name}]`);

  keySectionsPosition.push({
    top,
    height,
    name,
    nav,
  });
});

//

window.addEventListener("scroll", () => {
  const currentScrollPosition = Math.round(window.scrollY);
  for (const section of keySectionsPosition) {
    const topPosition =
      section.top - navBarHeight * 1.2 < currentScrollPosition;
    const bottomCoords = section.top + section.height - navBarHeight * 1.5;
    const bottomPosition = bottomCoords < currentScrollPosition;
    if (topPosition) {
      section.nav.forEach((item) => {
        item.classList.add("desc-active-item");
      });
    } else {
      section.nav.forEach((item) => {
        item.classList.remove("desc-active-item");
      });
    }
    if (bottomPosition) {
      section.nav.forEach((item) => {
        item.classList.remove("desc-active-item");
      });
      allMenuItems.forEach((item) => {
        item.classList.remove("desc-active-item");
      });
    }
  }
});

window.addEventListener("scroll", () => {
  const isThisTheEndOfPage =
    window.innerHeight + window.scrollY + window.innerHeight * 0.15 >=
    productData.pageHeight;
  if (isThisTheEndOfPage && !productData.isLoading) {
    fetchData(productData);
  }

  productsSectionTopCoords =
    Math.round(productsContener.getBoundingClientRect().top) - navBarHeight;
  const desktopPosition = productsSectionTopCoords < navBarHeight;
  const mobilePosition =
    document.body.clientWidth < 1240 && productsSectionTopCoords < 240;
  if (desktopPosition || mobilePosition) {
    descMenuItem[2].classList.add("desc-active-item");
    mobMenuItem[2].classList.add("desc-active-item");
  } else {
    descMenuItem[2].classList.remove("desc-active-item");
    mobMenuItem[2].classList.remove("desc-active-item");
  }
});

//////////////////////////////////////////////
////////////////////////////////////////////

const parallaxContainer = document.querySelector(".parallax-container");

const dog = document.querySelector(".parallax-dog");
const rightSpot = document.querySelector(".parallax-rightSpot");
const leftSpot = document.querySelector(".parallax-leftSpot");

const dogSpeed = 3;
const rightSpotSpeed = 1;
const leftSpotSpeed = 1.7;

const paralax = () => {
  const pC = parallaxContainer.getBoundingClientRect();

  const triggerPoint = window.innerHeight * 2;

  if (pC.top <= triggerPoint && pC.top > 0) {
    dog.style.transform = `translateY(${pC.top * dogSpeed}px)`;
    rightSpot.style.transform = `translateY(${pC.top * rightSpotSpeed}px)`;
    leftSpot.style.transform = `translateY(${pC.top * leftSpotSpeed}px)`;
  } else if (pC.top < 0) {
    dog.style.transform = `translateY(0px)`;
    rightSpot.style.transform = `translateY(0px)`;
    leftSpot.style.transform = `translateY(0px)`;
  }
  requestAnimationFrame(paralax);
};

paralax();
// //////////////////////////////

//

topLogo.addEventListener("click", () => {
  window.scroll(0, 0);

  if (mobMenuPopUp.classList.contains("mob-nav-active")) {
    togleMobMenuClose();
    blurContainerClose();
  }
});
