const responses = await fetch("http://localhost:5678/api/works");
let works = await responses.json();

const responsesCategories = await fetch("http://localhost:5678/api/categories");
const categories = await responsesCategories.json();
const categoryNames = categories.map((category) => [
  category.name,
  category.id,
]);

//verification du statut de connexion
if (sessionStorage.getItem("loggedIn") === "true") {
  //si connexion ok afficher la page utilisateur

  const header = document.querySelector("header"); //creation de la bannière
  const banner = document.createElement("nav");
  banner.className = "banner";
  header.appendChild(banner);
  const modifyIcon = document.createElement("i");
  modifyIcon.className = "fa-regular fa-pen-to-square";
  const bannerText = document.createElement("p");
  bannerText.innerText = "Mode édition";
  bannerText.className = "mode-edition";
  bannerText.appendChild(modifyIcon);
  banner.appendChild(bannerText);
  const bannerButton = document.createElement("button");
  bannerButton.innerText = "publier les changements";
  bannerButton.className = "banner-button";
  banner.appendChild(bannerButton);

  const linkToModify = document.querySelectorAll(".to-modify"); //ajout des liens "modifier"
  linkToModify.forEach((link) => {
    const toModify = document.createElement("a");
    toModify.innerText = "modifier";
    const modifyIcon = document.createElement("i");
    modifyIcon.className = "fa-regular fa-pen-to-square";

    const removeFilters = document.querySelector("#filters");
    removeFilters.style.display = " none";

    const loginbtn = document.querySelector(".login"); //modification login => logout
    loginbtn.innerText = "logout";
    loginbtn.addEventListener("click", function () {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("loggedIn");

      location.replace("index.html"); // redirection vers la page de connexion
    });

    link.appendChild(modifyIcon);
    link.appendChild(toModify);
  });
}

// Si pas de connexion = affichage des projets sur le site
const sectionGallery = document.querySelector(".gallery");

export function generateProjects(works) {
  document.querySelector(".gallery").innerHTML = "";

  if (works.length === 0) {
    const noProjects = document.createElement("p");
    noProjects.className = "no-project";
    noProjects.innerText = "Prochainement de nouveaux projets!";
    sectionGallery.appendChild(noProjects);
    return;
  } else {
    for (let i = 0; i < works.length; i++) {
      const project = works[i];

      const workElement = document.createElement("figure"); // fiche projet
      workElement.classList.add("shape-" + project.id, "shape");

      const imageElement = document.createElement("img"); // image de la fiche
      imageElement.src = project.imageUrl;
      imageElement.crossOrigin = "anonymous";
      imageElement.alt = project.title;
      imageElement.classList.add("category-" + project.categoryId, "img");
      const titleElement = document.createElement("h3"); //titre de la fiche
      titleElement.innerText = project.title;

      workElement.appendChild(imageElement);
      workElement.appendChild(titleElement);
      sectionGallery.appendChild(workElement);
    }
  }
}
generateProjects(works);

// affichage des boutons
const filters = document.querySelector("#filters");

const generateButton = function () {
  // bouton "tous"
  const buttonAll = document.createElement("button");
  buttonAll.className = "filter";
  buttonAll.innerText = "Tous";
  buttonAll.addEventListener("click", function () {
    let pictures = document.querySelectorAll(".img");
    for (let i = 0; i < pictures.length; i++) {
      pictures[i].parentElement.style.display = "block";
    }
  });
  filters.appendChild(buttonAll);
};
generateButton();

function genererButtons(categories) {
  // boutons categorie

  for (let i = 0; i < categories.length; i++) {
    const filter = categories[i];
    const buttons = document.createElement("button");
    buttons.className = "filter";
    buttons.innerText = filter.name;
    buttons.id = categories[i].id;
    buttons.addEventListener("click", function (event) {
      let buttonId = event.currentTarget;
      let pictures = document.querySelectorAll(".img");
      for (let i = 0; i < pictures.length; i++) {
        if (!pictures[i].classList.contains("category-" + buttonId.id)) {
          pictures[i].parentElement.style.display = "none";
        } else {
          pictures[i].parentElement.style.display = "block";
        }
      }
    });
    filters.appendChild(buttons);
  }
}
genererButtons(categories);
