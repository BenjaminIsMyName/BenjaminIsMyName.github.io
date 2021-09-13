function changeTheme(theClass) {
  document.querySelector("body").className = theClass;
  setThemeButton(theClass);
}

function setThemeButton(theClass) {
  if (document.querySelector(`.selected-theme`))
    document
      .querySelector(`.selected-theme`)
      .classList.remove("selected-theme");
  document
    .querySelector(`.theme[onclick="changeTheme('${theClass}')"]`)
    .classList.add("selected-theme");
}

// change it later to set the right button, as in the localStorage (if exist)
setThemeButton("");
