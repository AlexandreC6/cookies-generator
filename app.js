const inputs = document.querySelectorAll("input");

inputs.forEach(input => {
  input.addEventListener("invalid", handleValidation)
  input.addEventListener("input", handleValidation)
})

function handleValidation(e) {
  if(e.type === 'invalid'){
    // setCustomValidity => change msg de l'invalidité
    e.target.setCustomValidity("Ce champs ne peut être vide.");
  }
  // 'input' -> not empty
  else if (e.type === 'input'){
    e.target.setCustomValidity("")
  }
}

const cookieForm = document.querySelector("form")
cookieForm.addEventListener("submit", handleForm);

function handleForm(event) {
  event.preventDefault()

  const newCookie = {};

  inputs.forEach(input => {
    const nameAttribute = input.getAttribute("name")
    newCookie[nameAttribute] = input.value;
  })

  newCookie.expires = new Date(new Date().getTime() + 7 * 24 * 60 * 1000);

  // Restaure élément dans l'input d'un form
  cookieForm.reset();

  createCookie(newCookie)
}

function createCookie(newCookie) {
  // doesCookieExist -> Si le name est déjà dans l'array
  if (doesCookieExist(newCookie.name)) {
    createToast({name: newCookie.name, state: "modifié", color: "orange"})
  } else {
    createToast({name: newCookie.name, state: "crée", color: "green"})
  }

  document.cookie = `${encodeURIComponent(newCookie.name)} = ${encodeURIComponent(newCookie.value)};expires= ${newCookie.expires.toUTCString()}}`

  if (cookiesList.children.length) {
    displayCookies();
  }
}

function doesCookieExist(name) {
  const cookies = document.cookie.replace(/\s/g, "").split(";");
  const onlyCookieName = cookies.map(cookie => cookie.split("=")[0])
  // .map => retourne array avec le callback
  const onlyCookieValue = cookies.map(cookie => cookie.split("=")[1])
  console.log(cookies, onlyCookieName, onlyCookieValue);

  // Vrai si retourne qqch, faux si retourne rien
  const cookiePresence = onlyCookieName.find(cookie => cookie === encodeURIComponent(name))
  return cookiePresence;
}

const toastContainer = document.querySelector('.toasts-container')

function createToast({name, state, color}) {
  //createElement -> create html element with tag
  const toastInfo = document.createElement("p");
  toastInfo.className = "toast";

  toastInfo.textContent = `Cookie ${name} a été ${state}.`
  toastInfo.style.backgroundColor = color

  toastContainer.appendChild(toastInfo);

  setTimeout(() => {
    // Retire du DOM
    toastInfo.remove;
  }, 2500);
}

// Afficher les cookies

const cookiesList = document.querySelector(".cookies-list");
const displayCookieBtn = document.querySelector(".display-cookie-btn");
const infoTxt = document.querySelector(".info-txt");

displayCookieBtn.addEventListener("click", displayCookies)

let lock = false;

function displayCookies() {
  // Ne pas pouvoir afficher plusieurs fois le même cookie
  if (cookiesList.children.length) cookiesList.textContent = "";

  // chaîne de caracatère avec tous les cookies
  const cookies = document.cookie.replace(/\s/g, "").split(";").reverse();

  if (!cookies[0]) {
    if (lock) { return ; }
    lock = true;
    infoTxt.textContent = "Pas de cookies";

    setTimeout(() => {
    infoTxt.textContent = "";
    lock = false;
    }, 1500);
    return;
  }

  createElement(cookies)
}

function createElement(cookies) {
  cookies.forEach(cookie => {
    const formatCookie = cookie.split("=");
    console.log(formatCookie);
    const listItem = document.createElement("li");
    const name = decodeURIComponent(formatCookie[0]);
    const value = decodeURIComponent(formatCookie[1]);
    listItem.innerHTML =
    `
      <p>
        <span>Nom : </span>${name}
      </p>
      <p>
        <span>Valeur : </span>${value}
      </p>
      <button>X</button>
    `;
    listItem.querySelector("button").addEventListener("click", e => {
      createToast({name: name, state: 'supprimé', color: 'crimson'})
      // delete un cookie
      // format cookie = à rien; expires -> mettre une date avant nous date(0)=date originaire 1970
      document.cookie = `${formatCookie[0]}=; expires=${new Date(0)}`
      e.parentElement.remove();
    })

    cookiesList.appendChild(listItem);
  })
}
