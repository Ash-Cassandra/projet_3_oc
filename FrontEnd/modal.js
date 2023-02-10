import { generateProjects } from "./works.js";

const responses = await fetch("http://localhost:5678/api/works");
const works = await responses.json();

const responsesCategories = await fetch("http://localhost:5678/api/categories");
const categories = await responsesCategories.json();
const categoryNames = categories.map((category) => [
  category.name,
  category.id,
]);

// creation de la modale
let modal = null;

modal = document.querySelector(".modal");
const editButton = document.querySelector(".the-third");
//ouverture de la modale
editButton.addEventListener("click", function (event) {
  event.preventDefault();
  modal.style.display = null;
  modal.removeAttribute("aria-hidden");
  modal.addEventListener("click", closeModal);
  modal
    .querySelector(".button-close-modal")
    .addEventListener("click", closeModal);
  modal
    .querySelector(".stop-propagation")
    .addEventListener("click", stopPropagation);
});
const stopPropagation = function (event) {
  event.stopPropagation();
};
//fermeture de la modale
const closeModal = function (event) {
  let selectedModal = modal;
  if ((modal.style.display = "none")) {
    selectedModal = modal2;
  } else event.preventDefault();
  selectedModal.style.display = "none";
  selectedModal.setAttribute("aria-hidden", "true");
  selectedModal.removeEventListener("click", closeModal);
  selectedModal
    .querySelector(".button-close-modal")
    .removeEventListener("click", closeModal);
  selectedModal
    .querySelector(".stop-propagation")
    .removeEventListener("click", stopPropagation);
};
//supression des projets depuis la modale 1
const deletedWorks = function (event) {
  const parentIcon = event.target.parentNode;
  parentIcon.remove();
  const projectId = event.currentTarget.getAttribute("dataId");
  fetch(`http://localhost:5678/api/works/${projectId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${sessionStorage["token"]}`,
      "content-Type": "application/json",
    },
  }).then((deleteData) => {
    if (deleteData.ok) {
      console.log(deleteData);
      console.log(projectId);
      //selection des figures
      let shape = document.querySelectorAll(".shape");
      for (let i = 0; i < shape.length; i++) {
        if (shape[i].classList.contains("shape-" + projectId)) {
          shape[i].remove();
        }
      }
    }
  });
};
generateProjects(works);
//affichage des projets dans la modale 1
function generateProjectsModal(works) {
  for (let i = 0; i < works.length; i++) {
    const projectsModal = works[i];
    const editModal = document.querySelector(".edit-project");
    const workModal = document.createElement("figure"); //figure des projets

    const picturesModal = document.createElement("img"); //affichage image
    picturesModal.src = projectsModal.imageUrl;
    picturesModal.crossOrigin = "anonymous";
    picturesModal.alt = projectsModal.title;
    picturesModal.className = "pictures-modal";
    picturesModal.setAttribute("id", [i]);
    const deleteIcon = document.createElement("img"); //création de l'icone supprimer
    deleteIcon.className = "fa-trash-can";
    deleteIcon.setAttribute("src", "assets/icons/vector.svg");
    deleteIcon.setAttribute("dataId", works[i].id);
    deleteIcon.addEventListener("click", deletedWorks);

    const arrowsIcon = document.createElement("img"); //creation de l'icone fleches
    arrowsIcon.className = "fa-arrows";
    arrowsIcon.setAttribute("src", "assets/icons/arrows.svg");
    arrowsIcon.setAttribute("iconData", works[i].id);
    picturesModal.addEventListener("mouseover", function () {
      arrowsIcon.style.display = "block";
    });
    picturesModal.addEventListener("mouseout", function () {
      arrowsIcon.style.display = "none";
    });

    const textPictureModal = document.createElement("figcaption");
    textPictureModal.innerText = "éditer";

    editModal.appendChild(workModal);
    workModal.appendChild(picturesModal);
    workModal.appendChild(textPictureModal);
    picturesModal.parentNode.appendChild(arrowsIcon);
    picturesModal.parentNode.appendChild(deleteIcon);
  }
}
generateProjectsModal(works);

//creation de la modale 2
let modal2 = null;
modal2 = document.querySelector(".modal-2");
let boxModal2 = document.querySelector(".box-modal-2");

const headerModal2 = document.createElement("header"); //en-tête (boutons retour et fermer)
headerModal2.className = "header-modal-2";

const closeButton = document.createElement("button"); //bouton fermer
closeButton.className = "button-close-modal";
closeButton.addEventListener("click", closeModal);
const iconClose = document.createElement("i");
iconClose.classList.add("fa-solid", "fa-xmark");

const backPreviousButton = document.createElement("button"); //bouton retour à la modale 1
backPreviousButton.className = "back-previous-button";
backPreviousButton.addEventListener("click", function () {
  modal2.style.display = "none";
  modal.style.display = null;
  modal.removeAttribute("aria-hidden");
  modal.addEventListener("click", closeModal);
  modal
    .querySelector(".button-close-modal")
    .addEventListener("click", closeModal);
  modal
    .querySelector(".stop-propagation")
    .addEventListener("click", stopPropagation);
});

const iconBack = document.createElement("img");
iconBack.setAttribute("src", "assets/icons/arrowBack.svg");
iconBack.className = "icon-back";

closeButton.appendChild(iconClose);
backPreviousButton.appendChild(iconBack);
headerModal2.appendChild(backPreviousButton);
headerModal2.appendChild(closeButton);

const formAddProject = document.createElement("form"); //création du formulaire
formAddProject.className = "form-add-project";

const titleModal2 = document.createElement("h1"); //titre de la modale 2
titleModal2.innerText = " Ajout photo";
titleModal2.className = "title-modal-2";

const articleUpload = document.createElement("article"); //création de l'encadrer ajouter photo
articleUpload.className = "article-upload";

const imgModal2 = document.createElement("img");
imgModal2.setAttribute("src", "assets/icons/img-modal-2.svg");
imgModal2.className = "img-modal-2";

const uploadPicture = document.createElement("input"); //bouton telecharger photo
uploadPicture.setAttribute("type", "file");
uploadPicture.setAttribute("id", "buttonFile");
uploadPicture.setAttribute("name", uploadPicture.name);
uploadPicture.addEventListener("change", function () {
  validatePicture();
});

const labelUploadPicture = document.createElement("label"); //label du bouton(apparence du bouton)
labelUploadPicture.innerText = "+ ajouter photo";
labelUploadPicture.setAttribute("id", "add-picture");
labelUploadPicture.setAttribute("for", "name");
//transfert du click sur le button
labelUploadPicture.addEventListener("click", function () {
  uploadPicture.click();
});

const uploadFormat = document.createElement("p");
uploadFormat.innerText = "jpg, png : 4mo max";

articleUpload.appendChild(imgModal2);
articleUpload.appendChild(uploadPicture);
articleUpload.appendChild(labelUploadPicture);
articleUpload.appendChild(uploadFormat);

const labeltitle = document.createElement("label"); //label titre image
labeltitle.className = "label-title";
labeltitle.setAttribute("for", "name");
labeltitle.innerText = "Titre";

const inputTitle = document.createElement("input"); //titre de l'image
inputTitle.className = "input-title";
inputTitle.setAttribute("type", "text");
inputTitle.setAttribute("name", "title");
inputTitle.required = true;

const labelCategory = document.createElement("label"); // label selection categorie
labelCategory.className = "label-category";
labelCategory.setAttribute("for", "name");
labelCategory.innerText = "Catégorie";

const inputCategory = document.createElement("select"); // selection de la categorie
inputCategory.className = "select-category";
inputCategory.setAttribute("type", "select");
inputCategory.setAttribute("name", "category");
categoryNames.forEach((category) => {
  const optionInputCat = document.createElement("option"); // creation des options "categorie"
  optionInputCat.value = category[1];
  optionInputCat.textContent = category[0];
  inputCategory.appendChild(optionInputCat);
});
const optionDefault = document.createElement("option");
optionDefault.value = "";
optionDefault.selected = true;
inputCategory.appendChild(optionDefault);

//ajout du formulaire sur la page Modale 2
formAddProject.appendChild(titleModal2);
formAddProject.appendChild(articleUpload);
formAddProject.appendChild(labeltitle);
formAddProject.appendChild(inputTitle);
formAddProject.appendChild(labelCategory);
formAddProject.appendChild(inputCategory);
boxModal2.appendChild(headerModal2);
boxModal2.appendChild(formAddProject);
modal2.appendChild(boxModal2);

//ouverture de la modale 2
const openModal2 = document.querySelector(".upload-picture");
openModal2.addEventListener("click", function (event) {
  event.preventDefault();
  //
  const newImgModal2 = document.querySelector(".new-img-modal-2");
  if (newImgModal2) {
    newImgModal2.style.display = "none";
  }
  imgModal2.style.display = "block"; //remplacement de l'icone par l'image selectionnée
  labelUploadPicture.style.display = "block";
  uploadFormat.style.display = "block";
  document.querySelector(".input-title").value = "";
  document.querySelector(".select-category").value = optionDefault;
  //
  //
  modal.style.display = "none";
  modal2.style.display = null;
  modal2.removeAttribute("aria-hidden");
  modal2.addEventListener("click", closeModal);

  modal2
    .querySelector(".button-close-modal")
    .addEventListener("click", closeModal);
  modal2
    .querySelector(".stop-propagation")
    .addEventListener("click", stopPropagation);
});
//creation du bouton valider (ajout photo)
const validateButton = document.createElement("input");
validateButton.setAttribute("type", "submit");
validateButton.setAttribute("value", "Valider");
validateButton.className = "validate-button";
formAddProject.appendChild(validateButton);
//fonction validité de l'image
let validPicture = false;
const validatePicture = function () {
  const selectedPicture = uploadPicture.files[0];
  const pictureRegEx = new RegExp(".jpg|.jpeg|.png$", "i");
  const testPicture = pictureRegEx.test(selectedPicture.name);
  const pictureURL = URL.createObjectURL(selectedPicture);
  imgModal2.style.display = "none"; //remplacement de l'icone par l'image selectionnée
  labelUploadPicture.style.display = "none";
  uploadFormat.style.display = "none";
  const newImgModal2 = document.createElement("img");
  newImgModal2.setAttribute("src", pictureURL);
  newImgModal2.className = "new-img-modal-2";

  articleUpload.appendChild(newImgModal2);

  if (testPicture === false) {
    //verification du format de l'image
    alert("Selectionner une image valide (.jpg ou .png)");
  } else if (selectedPicture.size > 4000000) {
    //verifictaion de la taille de l'image
    alert("image limitée à 4Mo");
  } else {
    validPicture = true;
  }
};

// form ajout projet
const imgInput = document.querySelector("#buttonFile");
const titleInput = document.querySelector(".input-title");
const categoryInput = document.querySelector(".select-category");
//changement d'apparence du bouton valider
let emptyImgInput = true;
let emptyTitleInput = true;
let emptyCatInput = true;
imgInput.addEventListener("change", function () {
  emptyImgInput = false;
  checkInputs();
});
titleInput.addEventListener("change", function () {
  emptyTitleInput = false;
  checkInputs();
});
categoryInput.addEventListener("change", function () {
  emptyCatInput = false;
  checkInputs();
});
const checkInputs = function () {
  if (!emptyImgInput && !emptyTitleInput && !emptyCatInput) {
    validateButton.style.backgroundColor = "#1D6154";
  }
};
//envoie du nouveau projet
validateButton.addEventListener("click", function (event) {
  event.preventDefault();
  if (validPicture === false || optionDefault.selected === true) {
    alert("Veuillez renseigner tous les champs.");
  } else {
    const formData = new FormData();
    formData.append("image", imgInput.files[0], imgInput.files[0].name);
    formData.append("title", titleInput.value);
    formData.append("category", categoryInput.value);

    fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${sessionStorage["token"]}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((workData) => {
        document.querySelector(".gallery").innerHTML = "";
        works.push(workData);
        generateProjects(works);
        document.querySelector(".edit-project").innerHTML = "";
        generateProjectsModal(works);
        console.log("projets", works);
        closeModal();
      })
      .catch((error) => {
        console.log("error", error);
      });
  }
});
console.log("tous les projets", works);
