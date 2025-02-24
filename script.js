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
//
const nameId = document.querySelector(".id-data");
const nameText = document.querySelector(".text-data");
//
const productsContener = document.getElementById("section--3");
// POP-UP and BLUR

const blurContainerClose = () => {
  blurContainer.classList.remove("blur-container");
  blurContainer.classList.add("hidden-items");
};
const blurContainerOpen = () => {
  blurContainer.classList.add("blur-container");
  blurContainer.classList.remove("hidden-items");
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

  if (mobMenuPopUp.classList.contains("mob-nav-active")) {
    mobMenuPopUp.classList.remove("mob-nav-active");
  }
});
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
const activeMenuItem = (nodeNavList, screenMoborDesk) => {
  let activeClass;
  if (screenMoborDesk) {
    activeClass = "mob-item-active";
  } else {
    activeClass = "desc-active-item";
  }
  if (nodeNavList.length !== 0) {
    nodeNavList.forEach((navItem) => {
      navItem.addEventListener("click", function () {
        nodeNavList.forEach((navItem) => {
          navItem.classList.contains(activeClass)
            ? navItem.classList.remove(activeClass)
            : navItem;
        });
        navItem.classList.add(activeClass);
        if (screenMoborDesk) {
          mobMenuPopUp.classList.remove("mob-nav-active");
          midleMenuLine.classList.add("line-burger-active");
          mobMenuToggle.classList.add("mob-menu-toggle-disabled");
          mobMenuToggle.classList.remove("mob-menu-toggle-active");
        }
        blurContainerClose();
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

//
const midleMenuLine = document.querySelector(".line-burger");
mobMenuToggle.classList.add("mob-menu-toggle-disabled");
midleMenuLine.classList.add("line-burger-active");

mobMenuToggle.addEventListener("click", function () {
  const isTheMenuOpen = mobMenuPopUp.classList.contains("mob-nav-active");

  if (isTheMenuOpen) {
    mobMenuPopUp.classList.remove("mob-nav-active");
    midleMenuLine.classList.add("line-burger-active");
    mobMenuToggle.classList.add("mob-menu-toggle-disabled");
    mobMenuToggle.classList.remove("mob-menu-toggle-active");
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
//////////////////////////////////////////////
/////////////////////////////////////////////
///////////////////////////////////////////////
//////////////////////////////////////////////
/////////////////////////////////////////////
///////////////////////////////////////////////
//////////////////////////////////////////////
/////////////////////////////////////////////

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
  productList.loadedData = [];
  productList.lastPageData = [];
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
//////////////////////////////////////////////
//////////////////////////////////////////////
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

//

const section1 = document.getElementById("section--1");
const section2 = document.getElementById("section--2");
const section3 = document.getElementById("section--3");

const akcentSectionName = (entries, observer) => {
  const entry = entries[0];
  const navItem = document.getElementById(entry.target.dataset.id);
  if (entry.isIntersecting) {
    navItem.classList.add("desc-active-item");
  } else {
    navItem.classList.remove("desc-active-item");
  }
};

const sectionObserver = new IntersectionObserver(akcentSectionName, {
  root: null,
  threshold: 0.1,
});

const underlineNavItem = (section) => {
  sectionObserver.observe(section);
};

underlineNavItem(section1);
underlineNavItem(section2);
underlineNavItem(section3);
