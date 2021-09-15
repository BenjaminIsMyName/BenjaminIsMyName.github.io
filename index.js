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

setThemeButton("");

// IntersectionObserver:
const themeContainer = document.querySelector(".theme-container");
const fadeInOptions = {};
const fadeIn = new IntersectionObserver(handleFadeIn, fadeInOptions);

function handleFadeIn(entries, fadeIn) {
  entry = entries[0];
  if (entry.isIntersecting) {
    entry.target.classList.add("appear");
  } else {
    entry.target.classList.remove("appear");
  }
}

fadeIn.observe(themeContainer);
