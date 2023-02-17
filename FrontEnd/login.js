const data = { email: "sophie.bluel@test.tld", password: "S0phie" };
const jsonData = JSON.stringify(data);

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
  labelEmail.setAttribute("for", "email");
  labelEmail.innerText = "E-mail";

  form.appendChild(labelEmail);
  form.appendChild(inputMail);

  const inputPassword = document.createElement("input"); // input password
  inputPassword.classList = ("all-input", "password");
  inputPassword.setAttribute("type", "password");
  inputPassword.setAttribute("name", "password");
  const labelPassword = document.createElement("label"); //label password
  labelPassword.className = "label-login";
  labelPassword.setAttribute("for", "password");
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
      const emailValue = document.querySelector(".inputMail").value;
      const passwordValue = document.querySelector(".password").value;
      if (emailValue === data.email && passwordValue === data.password) {
        authenticatedSession();
      } else {
        alert("Erreur dans l’identifiant ou le mot de passe");
      }
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
    if (testEmail === true) {
      return true;
    } else {
      alert("e-mail non conforme");
    }
  };
  // verification de la validité du mot de passe
  const validPassword = function () {
    //RegEx du mot de passe
    let passwordRegEx = new RegExp("^[a-zA-Z0-9.-_()]+", "g");
    const testPassword = passwordRegEx.test(inputPassword.value);
    if (testPassword === true) {
      return true;
    } else {
      alert(
        "mot de passe non conforme, caractère speciaux autorisés . - _ ( )"
      );
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
      alert("erreur", Error);
    }
  });
}
