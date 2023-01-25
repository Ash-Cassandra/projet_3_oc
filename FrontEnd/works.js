const responses = await fetch("http://localhost:5678/api/works");
const works = await responses.json();

const responsesCategories = await fetch("http://localhost:5678/api/categories");
const categories = await responsesCategories.json();

document.querySelector(".gallery").innerHTML = "";

//verification du statut de connexion
if (sessionStorage.getItem("loggedIn") === "true") {
  //si connexion ok afficher la page utilisateur
  //creation de la bannière
  const header = document.querySelector("header");

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

  const linkToModify = document.querySelectorAll(".to-modify");
  linkToModify.forEach((link) => {
    const toModify = document.createElement("p");
    toModify.innerText = "modifier";
    link.appendChild(toModify);
  });
} else {
  //sinon afficher la page de projets
  genererProjects(works);
}
// affichage des projets sur le site

function genererProjects(works) {
  for (let i = 0; i < works.length; i++) {
    const project = works[i];
    const sectionGallery = document.querySelector(".gallery");
    // fiche projet
    const workElement = document.createElement("figure");

    // balises de la fiche
    const imageElement = document.createElement("img");
    imageElement.src = project.imageUrl;
    imageElement.crossOrigin = "anonymous";
    imageElement.alt = project.title;
    imageElement.classList.add("category-" + project.categoryId, "img");

    const titleElement = document.createElement("h2");
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
// bouton "tous"
function genererButton(works) {
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
// boutons categorie

function genererButtons(categories) {
  for (let i = 0; i < categories.length; i++) {
    const filter = categories[i];
    const buttons = document.createElement("button");
    buttons.className = "filter";
    buttons.innerText = filter.name;
    buttons.id = categories[i].id;
    buttons.addEventListener("click", function (event) {
      let buttonId = event.currentTarget;
      let pictures = document.querySelectorAll(".img");
      let filtredCategory = [];
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

// creation du formulaire
function createForm() {
  const formlogin = document.querySelector("main");

  const form = document.createElement("form");
  form.setAttribute("id", "form");

  formlogin.appendChild(form);
  // titre du formulaire
  const labelName = document.createElement("label");
  labelName.className = "form-title";
  labelName.setAttribute("for", "nom");
  labelName.innerText = "Log In";
  form.appendChild(labelName);
  // input e-mail
  const inputMail = document.createElement("input");
  inputMail.classList = ("all-input", "inputMail");
  inputMail.setAttribute("type", "email");
  inputMail.setAttribute("name", "email");

  const labelEmail = document.createElement("label");
  labelEmail.className = "input-title";
  labelEmail.setAttribute("for", "name");
  labelEmail.innerText = "E-mail";

  form.appendChild(labelEmail);
  form.appendChild(inputMail);

  // input password
  const inputPassword = document.createElement("input");
  inputPassword.classList = ("all-input", "password");
  inputPassword.setAttribute("type", "password");
  inputPassword.setAttribute("name", "password");

  const labelPassword = document.createElement("label");
  labelPassword.className = "input-title";
  labelPassword.setAttribute("for", "name");
  labelPassword.innerText = " Mot de passe";

  form.appendChild(labelPassword);
  form.appendChild(inputPassword);
  // bouton se connecter
  const buttonLogin = document.createElement("input");
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
      // si connexion ok = enregistrer le token & rediriger vers la page principale
      sessionStorage.setItem("token", tokenData);
      sessionStorage.setItem("loggedIn", true);
      window.location.replace("index.html");
    } else {
      console.log("erreur");
      alert("Erreur dans l’identifiant ou le mot de passe");
    }
  });
}
