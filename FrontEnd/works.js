const responses = await fetch("http://localhost:5678/api/works");
const works = await responses.json();

const responsesCategories = await fetch("http://localhost:5678/api/categories");
const categories = await responsesCategories.json();
const categoryNames = categories.map((category) => category.name);
document.querySelector(".gallery").innerHTML = "";

//verification du statut de connexion
if (sessionStorage.getItem("loggedIn") === "true") {
  //si connexion ok afficher la page utilisateur

  const header = document.querySelector("header"); //creation de la bannière
  const banner = document.createElement("nav");
  banner.className = "banner";
  header.appendChild(banner);
  const bannerText = document.createElement("p");
  bannerText.innerText = "Mode édition";
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
function genererProjects(works) {
  for (let i = 0; i < works.length; i++) {
    const project = works[i];
    const sectionGallery = document.querySelector(".gallery");

    const workElement = document.createElement("figure"); // fiche projet
    workElement.classList.add("shape-" + project.id, "shape");

    const imageElement = document.createElement("img"); // image de la fiche
    imageElement.src = project.imageUrl;
    imageElement.crossOrigin = "anonymous";
    imageElement.alt = project.title;
    imageElement.classList.add("category-" + project.categoryId, "img");
    const titleElement = document.createElement("h2"); //titre de la fiche
    titleElement.innerText = project.title;

    sectionGallery.appendChild(workElement);
    workElement.appendChild(imageElement);
    workElement.appendChild(titleElement);
  }
}
genererProjects(works);

// affichage des boutons
const filters = document.querySelector("#filters");
const gallery = document.querySelector(".gallery");

function genererButton(works) {
  // bouton "tous"
  const buttonAll = document.createElement("button");
  buttonAll.className = "filter";
  buttonAll.innerText = "Tous";
  buttonAll.addEventListener("click", function () {
    document.querySelector(".gallery").innerHTML = "";
    return genererProjects(works);
  });
  filters.appendChild(buttonAll);
}
genererButton(works);

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

// creation du formulaire de connexion
function createForm() {
  const formlogin = document.querySelector("main");
  const form = document.createElement("form");
  form.setAttribute("id", "form");
  formlogin.appendChild(form);

  const labelName = document.createElement("label"); // titre du formulaire
  labelName.className = "form-title";
  labelName.setAttribute("for", "nom");
  labelName.innerText = "Log In";
  form.appendChild(labelName);
  const inputMail = document.createElement("input"); // input e-mail
  inputMail.classList = ("all-input", "inputMail");
  inputMail.setAttribute("type", "email");
  inputMail.setAttribute("name", "email");
  const labelEmail = document.createElement("label"); //label e-mail
  labelEmail.className = "label-login";
  labelEmail.setAttribute("for", "name");
  labelEmail.innerText = "E-mail";

  form.appendChild(labelEmail);
  form.appendChild(inputMail);

  const inputPassword = document.createElement("input"); // input password
  inputPassword.classList = ("all-input", "password");
  inputPassword.setAttribute("type", "password");
  inputPassword.setAttribute("name", "password");
  const labelPassword = document.createElement("label"); //label password
  labelPassword.className = "label-login";
  labelPassword.setAttribute("for", "name");
  labelPassword.innerText = " Mot de passe";

  form.appendChild(labelPassword);
  form.appendChild(inputPassword);

  const buttonLogin = document.createElement("input"); // bouton se connecter
  buttonLogin.setAttribute("type", "submit");
  buttonLogin.setAttribute("value", "Se connecter");
  buttonLogin.setAttribute("id", "buttonLogin");
  buttonLogin.addEventListener("click", function (event) {
    event.preventDefault();
    if (validEmail(inputMail) && validPassword(inputPassword)) {
      authenticatedSession();
    } else {
      console.log("non ok");
    }
  });

  form.appendChild(buttonLogin);

  // verification de la validité du mail
  const validEmail = function () {
    //RegEx de l'e-mail
    let emailRegEx = new RegExp(
      "^[a-zA-Z0-9.-_]+@{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$",
      "g"
    );
    const testEmail = emailRegEx.test(inputMail.value);
    console.log(testEmail);
    if (testEmail === true) {
      return true;
    }
  };
  // verification de la validité du mot de passe
  const validPassword = function () {
    //RegEx du mot de passe
    let passwordRegEx = new RegExp("^[a-zA-Z0-9.-_()]+", "g");
    const testPassword = passwordRegEx.test(inputPassword.value);
    console.log(testPassword);
    if (testPassword === true) {
      return true;
    }
  };
  // lien mot de passe oublié
  const forgotPassword = document.createElement("a");
  forgotPassword.href = "#";
  forgotPassword.innerText = "Mot de passe oublié";

  form.appendChild(forgotPassword);
}

// affichage de la page de connexion
const navLogin = document.querySelector(".login");
navLogin.addEventListener("click", function () {
  document.querySelector("main").innerHTML = "";
  return createForm();
});

//verification de la connexion
const data = { email: "sophie.bluel@test.tld", password: "S0phie" };
const jsonData = JSON.stringify(data);
function authenticatedSession() {
  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "content-Type": "application/json",
    },
    body: jsonData,
  }).then(async (responses) => {
    let tokenData = await responses.json();

    if (responses.ok) {
      // si connexion ok =
      sessionStorage.setItem("loggedIn", true); //enregistrer les infos de connexion
      sessionStorage.setItem("token", tokenData.token); //enregistrer le token
      window.location.replace("index.html"); //rediriger vers la page principale
    } else {
      console.log("erreur"); //sinon =
      alert("Erreur dans l’identifiant ou le mot de passe");
    }
  });
}
// creation de la modale
let modal = null;

modal = document.querySelector(".modal");
const editButton = document.querySelector(".the-third");
//ouverture de la modale
editButton.addEventListener("click", function (event) {
  event.preventDefault();
  modal.style.display = null;
  modal.removeAttribute("aria-hidden");
  modal
    .querySelector(".button-close-modal")
    .addEventListener("click", closeModal);
  modal
    .querySelector(".stop-propagation")
    .addEventListener("click", stopPropagation);
});
//fermeture de la modale
const closeModal = function () {
  let selectedModal;
  if (modal !== null) {
    selectedModal = modal;
  } else if (modal2 !== null) {
    selectedModal = modal2;
  }
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

const stopPropagation = function (event) {
  event.stopPropagation();
};

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
    const arrowsIcon = document.createElement("i"); //creation de l'icone fleches
    arrowsIcon.className = "fa-solid fa-arrows-up-down-left-right";

    editModal.appendChild(workModal);
    workModal.appendChild(picturesModal);
    picturesModal.parentNode.appendChild(deleteIcon);
  }
}
generateProjectsModal(works);

//supression des projets depuis la modale 1
const deletedButton = document.querySelectorAll(".fa-trash-can");
deletedButton.forEach((button) => {
  button.addEventListener("click", function (event) {
    event.preventDefault();
    const projectId = event.currentTarget.getAttribute("dataId");
    console.log(projectId);
    fetch(`http://localhost:5678/api/works/${projectId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${sessionStorage["token"]}`,
        "content-Type": "application/json",
      },
    }).then(responses);
    if (responses.ok) {
      console.log(responses);
      //selection des figures
      let shape = document.querySelectorAll(".shape");

      for (let i = 0; i < shape.length; i++) {
        if (!shape[i].classList.contains("shape-" + projectId)) {
          shape[i].remove();
        }
      }
    }
  });
});

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

closeButton.appendChild(iconClose);
headerModal2.appendChild(closeButton);

const backPreviousButton = document.createElement("button"); //bouton retour à la modale 1
backPreviousButton.className = "back-previous-button";
backPreviousButton.addEventListener("click", function (event) {
  event.preventDefault();
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

backPreviousButton.appendChild(iconBack);
headerModal2.appendChild(backPreviousButton);

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
uploadPicture.addEventListener("change", function () {
  validatePicture();
});

const labelUploadPicture = document.createElement("label"); //label du bouton(apparence du bouton)
labelUploadPicture.innerText = "+ ajouter photo";
labelUploadPicture.setAttribute("id", "add-picture");
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
  optionInputCat.value = category;
  optionInputCat.textContent = category;
  inputCategory.appendChild(optionInputCat);
});
const optionDefault = document.createElement("option");
optionDefault.value = "";
optionDefault.textContent = "-- selectionnez une catégorie.--";
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

const openModal2 = document.querySelector(".upload-picture");
//ouverture de la modale 2

openModal2.addEventListener("click", function (event) {
  event.preventDefault();
  modal.style.display = "none";
  modal2.style.display = null;
  modal2.removeAttribute("aria-hidden");
  modal2
    .querySelector(".button-close-modal")
    .addEventListener("click", closeModal(modal2));
  modal2
    .querySelector(".stop-propagation")
    .addEventListener("click", stopPropagation);
});
//creation du bouton valider (ajout photo)
const validateButton = document.createElement("input");
validateButton.setAttribute("type", "submit");
validateButton.setAttribute("value", "Valider");
validateButton.className = "validate-button";

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
    console.log(selectedPicture);
  }
};
//
//
//
//
// code en cours
//addEventListener ligne 377
const imgInput = document.querySelector("#buttonFile");
const titleInput = document.querySelector(".input-title");
const categoryInput = document.querySelector(".select-category");

const formData = new FormData();
formData.append("imageURL", imgInput.files[0]);
formData.append("title", titleInput.value);
formData.append("categoryId", categoryInput.value);

// envoie de nouveau projets
validateButton.addEventListener("click", function (event) {
  if (validPicture === false || optionDefault.selected === true) {
    event.preventDefault();
    alert("Veuillez renseigner tous les champs.");
  } else {
    event.preventDefault();
    console.log(imgInput.files[0]);
    console.log(titleInput.value);
    console.log(categoryInput.value);
    console.log(formData);

    fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${sessionStorage["token"]}`,
      },
      body: formData,
    })
      .then((response) => {
        return response.json(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
});
formAddProject.appendChild(validateButton);
