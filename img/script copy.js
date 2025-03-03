const mobMenuToggle = document.querySelector(".mob-menu-toggle");
const mobMenuPopUp = document.querySelector(".mob-items");
const mobMenuItem = document.querySelectorAll(".mob-item");
const descMenuItem = document.querySelectorAll(".nav-item");
const descNavMenu = document.querySelector(".desc-items");
//
const popUpToggle = document.querySelector(".close-pop-up");
const popUpContainer = document.getElementById("popUp");
const blurContainer = document.getElementById("blur");
//
const navBar = document.getElementById("nav");
//
const nameId = document.querySelector(".id-data");
const nameText = document.querySelector(".text-data");
//
const productsContener = document.getElementById("section--3");
const sections = document.querySelectorAll("section[data-id]");
// POP-UP and BLUR

const blurContainerClose = () => {
  blurContainer.classList.remove("blur-container");
  blurContainer.classList.add("hidden-items");
};
const blurContainerOpen = () => {
  blurContainer.classList.add("blur-container");
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
  if (blurContainer.classList.contains("blur-container")) {
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

const deskNavElements = document.querySelectorAll("li[data-desk-href]");
const mobileNavElements = document.querySelectorAll("li[data-mob-href]");
//
let sectioinStartPosition = [];
let navBarHeight = navBar.getBoundingClientRect().height;
//
const resizeScreenHandler = () => {
  sectioinStartPosition = [];
  navBarHeight = navBar.getBoundingClientRect().height;
  sections.forEach((section) => {
    const sectionTop = section.getBoundingClientRect().top;
    const sectionHeight = section.getBoundingClientRect().height;
    sectioinStartPosition.push({
      top: Math.round(sectionTop),
      height: Math.round(sectionHeight),
    });
  });
};
//
resizeScreenHandler();
console.log(sectioinStartPosition);
//
window.onresize = function () {
  resizeScreenHandler();
};

const activeMenuItem = (nodeNavList, screenMoborDesk) => {
  let activeClass;
  if (screenMoborDesk) {
    activeClass = "mob-item-active";
  } else {
    activeClass = "desc-active-item";
  }
  if (nodeNavList.length !== 0) {
    nodeNavList.forEach((navItem, index) => {
      navItem.addEventListener("click", function () {
        nodeNavList.forEach((navItem) => {
          navItem.classList.contains(activeClass)
            ? navItem.classList.remove(activeClass)
            : navItem;
        });
        navItem.classList.add(activeClass);
        if (screenMoborDesk) {
          togleMobMenuClose();
        }
        blurContainerClose();
        const scrollToPosition =
          sectioinStartPosition[index].top - navBarHeight;
        window.scroll(0, `${scrollToPosition}`);
      });
    });
  }
};
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
const screenMoborDesk = document.body.clientWidth < 1024;
const onResizeScreen = () => {
  if (screenMoborDesk) {
    activeMenuItem(mobMenuItem, screenMoborDesk);
  } else {
    activeMenuItem(descMenuItem, screenMoborDesk);
  }
};
onResizeScreen();

screenMoborDesk
  ? descNavMenu.classList.add("hidden-items")
  : mobMenuPopUp.classList.add("hidden-items");

window.onresize = function () {
  onResizeScreen();
};
// 333
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
    blurContainerOpen();
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
  pageSize: selectdata.value,
  loadedData: [],
  lastPageData: [],
  pageHeight: document.body.offsetHeight,
  isLoading: false,
};

/////////////////////////////////

//
const addNewResponseData = (responseData, arrayData) => {
  responseData.forEach((item) => {
    arrayData.push({
      id: item.id,
      text: item.text,
    });
  });
};
//

//
const fetchData = async (productData) => {
  if (productData.isLoading) return;
  productData.isLoading = true;
  try {
    const url = `${apiUrl}?pageNumber=${productData.pageNumber}&pageSize=${productData.pageSize}`;
    productData.pageNumber++;
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(
        "Wystąpił błąd podczas pobierania danych o naszych produktach. Przepraszamy"
      );
    const { data: responseData } = await response.json();
    productData.lastPageData = [];
    addNewResponseData(responseData, productData.lastPageData);
    addNewResponseData(responseData, productData.loadedData);
    displayProducts(productData.lastPageData);
  } catch (e) {
    productsContener.appendChild(errorMessage);
    errorMessage.textContent = e.message;
  } finally {
    productData.isLoading = false;
  }
};

/////////////////////////////////
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
  products.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");

    const productName = document.createElement("h2");
    productName.textContent = product.text;

    productDiv.appendChild(productName);
    productList.appendChild(productDiv);

    observeDynamicElements();

    productDiv.addEventListener("click", function () {
      blurContainerOpen();
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
//

window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY + 2 >= productData.pageHeight) {
    fetchData(productData);
  }
});

//////////////////////////////////////////////

const parallaxContainer = document.querySelector(".parallax-container");

////////////////////////////////////////////
window.addEventListener("scroll", function () {
  const parallaxContainer = document.querySelector(".parallax-container");
  const pC = parallaxContainer.getBoundingClientRect();
  //
  const dog = document.querySelector(".parallax-dog");
  const rightSpot = document.querySelector(".parallax-rightSpot");
  const leftSpot = document.querySelector(".parallax-leftSpot");
  //
  const dogSpeed = 0.5;
  const rightSpotSpeed = 1.5;
  const leftSpotSpeed = -1.3;

  dog.style.cssText = `transform: translateY(300px)`;
  rightSpot.style.cssText = `transform: translateY(490px)`;

  if (pC.top <= 550 && pC.top > 0) {
    dog.style.cssText = `transform: translateY(${pC.top * dogSpeed}px)`;
    rightSpot.style.cssText = `transform: translateX(${
      pC.top * rightSpotSpeed
    }px)`;
    leftSpot.style.cssText = `transform: translateX(${
      pC.top * leftSpotSpeed
    }px)`;
    //
  } else if (pC.top < 0) {
    dog.style.cssText = `transform: none`;
    rightSpot.style.cssText = `transform: none`;
    leftSpot.style.cssText = `transform: none`;
  }
});

//

const topLogo = document.getElementById("topLogo");

topLogo.addEventListener("click", () => {
  window.scroll(0, 0);
});

/////////////////////////////////////////
// OBSERVER
// document.addEventListener("DOMContentLoaded", () => {
// const sections = document.querySelectorAll("section[data-id]");
const akcentSectionName = (entries) => {
  entries.forEach((entry) => {
    const navItem = document.getElementById(entry.target.dataset.id);
    if (navItem && entry.isIntersecting) {
      navItem.classList.add("desc-active-item");
    } else {
      navItem.classList.remove("desc-active-item");
    }
  });
};

const sectionObserver = new IntersectionObserver(akcentSectionName, {
  root: null,
  threshold: [0.2, 0.2],
});

sections.forEach((section) => {
  sectionObserver.observe(section);
});
// });

const observeDynamicElements = () => {
  const dynamicSections = document.querySelectorAll("#section--3 .product");
  dynamicSections.forEach((section) => {
    sectionObserver.observe(section);
  });
};
