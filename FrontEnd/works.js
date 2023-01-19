const responses = await fetch("http://localhost:5678/api/works");
const works = await responses.json();

const responsesCategories = await fetch("http://localhost:5678/api/categories");
const categories = await responsesCategories.json();

document.querySelector(".gallery").innerHTML = "";

/* affichage des projets sur le site */

function genererProjects(works) {
  for (let i = 0; i < works.length; i++) {
    const project = works[i];
    const sectionGallery = document.querySelector(".gallery");
    /* fiche projet */
    const workElement = document.createElement("figure");

    /* balises de la fiche */
    const imageElement = document.createElement("img");
    imageElement.src = project.imageUrl;
    imageElement.crossOrigin = "anonymous";
    imageElement.alt = project.title;

    const titleElement = document.createElement("h2");
    titleElement.innerText = project.title;

    sectionGallery.appendChild(workElement);
    workElement.appendChild(imageElement);
    workElement.appendChild(titleElement);
  }
}
genererProjects(works);

/* affichage des boutons */

const filters = document.querySelector("#filters");
const gallery = document.querySelector(".gallery");
/*bouton "tous" */
function genererButton(works) {
  const buttonAll = document.createElement("button");
  buttonAll.className = "filter";
  buttonAll.innerText = "Tous";
  buttonAll.addEventListener("click", function () {
    console.log(works);
    return genererProjects(works);
  });
  filters.appendChild(buttonAll);
}

genererButton(works);
/*boutons categorie*/

function genererButtons(categories) {
  for (let i = 0; i < categories.length; i++) {
    const filter = categories[i];
    const buttons = document.createElement("button");
    buttons.className = "filter";
    buttons.innerText = filter.name;
    buttons.id = categories.id;
    buttons.addEventListener("click", function (event) {
      let buttonId = event.currentTarget;
      let pictures = document.querySelectorAll("img");
      let filtredCategory = [];
      for (let i = 0; i < pictures.length; i++) {
        if (pictures[i].classList.contains(buttonId.id)) {
          filtredCategory.push(pictures[i]);
        }
      }
      for (let i = 0; i < filtredCategory.length; i++) {
        console.log(filtredCategory[i]);
        return filtredCategory[i];
      }
    });
    filters.appendChild(buttons);
  }
}
genererButtons(categories);

/* creation du formulaire */
function createForm() {
  const formlogin = document.querySelector("main");

  const form = document.createElement("form");
  form.setAttribute("id", "form");

  formlogin.appendChild(form);
  /* titre du formulaire */
  const labelName = document.createElement("label");
  labelName.className = "form-title";
  labelName.setAttribute("for", "nom");
  labelName.innerText = "Log In";
  form.appendChild(labelName);
  /* input e-mail */
  const inputMail = document.createElement("input");
  inputMail.className = "all-input";
  inputMail.setAttribute("type", "email");
  inputMail.setAttribute("name", "e-mail");

  const labelEmail = document.createElement("label");
  labelEmail.className = "input-title";
  labelEmail.setAttribute("for", "name");
  labelEmail.innerText = "E-mail";

  form.appendChild(labelEmail);
  form.appendChild(inputMail);

  /* input password */
  const inputPassword = document.createElement("input");
  inputPassword.className = "all-input";
  inputPassword.setAttribute("type", "password");
  inputPassword.setAttribute("name", "password");

  const labelPassword = document.createElement("label");
  labelPassword.className = "input-title";
  labelPassword.setAttribute("for", "name");
  labelPassword.innerText = " Mot de passe";

  form.appendChild(labelPassword);
  form.appendChild(inputPassword);
}
/* affichage de la page de connexion */
const login = document.querySelector(".login");
login.addEventListener("click", function () {
  document.querySelector("main").innerHTML = "";
  return createForm();
});
