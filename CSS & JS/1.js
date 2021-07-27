// on reload: start from the top, no matter where you've been in the page before (because maybe you were at othe PM page)...
history.scrollRestoration = "manual";
// more info at: https://www.designcise.com/web/tutorial/how-to-force-scroll-to-the-top-of-the-page-on-page-reload-using-javascript

// open/exit the cards screen (when clicking the PM photo):
function seeCards() {
  document.querySelector("body").style.overflow = "hidden";
  document.querySelector(".cards-screen").classList.add("cards-screen-open");
}

function exitCardsScreen() {
  document.querySelector(".cards-screen").classList.remove("cards-screen-open");
  document.querySelector("body").style.overflow = "auto";
}

// global veriables
var currentPMglobal = "bennet";
var cuurentArticle = 0;

// on scroll:
document.addEventListener("scroll", fadeUp);
function fadeUp() {
  let articles = document.querySelectorAll("." + currentPMglobal);
  let foundTop = false;
  for (let i = 0; i < articles.length; i++) {
    let c = articles[i].getBoundingClientRect();
    // when in view:
    if (c.top < document.documentElement.clientHeight - 69 && c.bottom >= 69) {
      // save the first article you find in view in "cuurentArticle"
      if (!foundTop) {
        cuurentArticle = i;
        foundTop = true;
      }
      articles[i].classList.remove("aticles-up");
      articles[i].classList.remove("articles-down");
      // when up:
    } else if (c.bottom < 69) {
      articles[i].classList.add("aticles-up");
      articles[i].classList.remove("articles-down");
    }
    // when not-completely down, after viewing it (then keep it there, the fade-up effect was made)
    else if (
      !articles[i].classList.contains("articles-down") &&
      c.top < document.documentElement.clientHeight
    )
      // continue, return or break? break. because we want to call update() later.
      break;
    // when down:
    else {
      articles[i].classList.add("articles-down");
      articles[i].classList.remove("aticles-up");
      // break after one time, don't keep going to all the articles down... they're not close
      break;
    }
  }
  // after we found the top article and updated "cuurentArticle", let's really update the article (and the option)
  update();
}

function update() {
  let articles = document.querySelectorAll("." + currentPMglobal);
  // remove the "currentArticle" class from the previews article (if exist):
  if (
    document.getElementsByClassName("currentArticle").length > 0 &&
    document.getElementsByClassName("currentArticle")[0] !=
      articles[cuurentArticle]
  ) {
    document
      .querySelector(".currentArticle")
      .classList.remove("currentArticle");
  }
  // add a class only to our article:
  articles[cuurentArticle].classList.add("currentArticle");
  // now also change the selected option, according to the cuurentArticle:
  changeSelected();
}

// function to change the selected option (used by the "update" function):
function changeSelected() {
  // remove #selected from the cuurent selected option:
  document.querySelector("#selected").setAttribute("id", "");
  // add #selected the cuurent option:
  document
    .querySelectorAll(".options")
    [cuurentArticle].setAttribute("id", "selected");
}

// used by "onclick" in the HTML, when clicking an option:
function focusss(num) {
  if (!(innerWidth > 1300 && innerHeight > 550)) showMenu();
  // crate quick effect on clicked option:
  document.querySelectorAll(".options")[--num].classList.add("focu");
  setTimeout(
    () => document.querySelectorAll(".options")[num].classList.remove("focu"),
    500
  );
  if (currentPMglobal == "olmert") return;
  // scroll to the article:
  let article = document.querySelectorAll("." + currentPMglobal)[num];
  scrollTo(0, article.offsetTop - 25);
}
// show/hide menu (small screens) button, used by "onclick":
function showMenu() {
  // clicked? check if open. if open - close.
  if (document.querySelector("aside").style.display == "block") {
    document.querySelector("aside").style.display = "none";
    document.querySelector("button").innerHTML = "תפריט";
    document.querySelector("button").classList.remove("focusButton");
  } else {
    // clicked? check if open. if NOT open - open.
    document.querySelector("aside").style.display = "block";
    document.querySelector("button").innerHTML = "סגור";
    document.querySelector("button").classList.add("focusButton");
  }
}

// check if window size is changing
addEventListener("resize", reportWindowSize);

function reportWindowSize() {
  // if it got resize to a big screen, show the old big menu again (even if we hide it before from the small menu button!):
  if (innerWidth > 1300 && innerHeight > 550)
    document.querySelector("aside").style.display = "block";
  else if (document.querySelector("button").innerHTML == "תפריט") {
    // if it got resize to a small screen again, make sure to hide the big menu we opened ^^^^ in the previews line:
    document.querySelector("aside").style.display = "none";
  }
  // after the resize was made, update everything (find top article etc)
  setTimeout(fadeUp, 50);
}

// toggle dark and light theme (called by onclick):
function theme() {
  let ball = document.querySelector(".ball");
  // move the ball in the toggle etc
  ball.classList.toggle("night");
  // change the theme, add to body the "dark" class
  document.querySelector("body").classList.toggle("dark");
}

// check if the prefers-color-scheme is dark. if so, call the "theme" function to change the theme
if (matchMedia && matchMedia("(prefers-color-scheme: dark)").matches) theme();

// event listener to update the prefers-color-scheme changes:
matchMedia("(prefers-color-scheme: dark)").addEventListener(
  "change",
  checkIfNeedsUpdate
);
// if event listener from ^^^ found a change to the prefers-color-scheme, check if the current mode is different
function checkIfNeedsUpdate(e) {
  // if the new prefers-color-scheme is dark and the website is also already dark, do nothing
  if (e.matches && document.querySelector("body").classList.contains("dark"))
    return;
  // if the new prefers-color-scheme is light and the website is also already light, do nothing
  if (!e.matches && !document.querySelector("body").classList.contains("dark"))
    return;

  // if you got here, go change the theme
  theme();
}

// remove the picture-in-picture button
document.querySelector("video").disablePictureInPicture = true;

// change pm
function replacePM(newPM) {
  let currentPM = document.querySelector(".pm-name").classList[1].slice(0, 6);
  if (newPM == currentPM) {
    exitCardsScreen();
    return;
  }
  // remove:
  document.querySelector(".pm-name").classList.remove(currentPM + "-name");
  document.querySelector(".top-image").classList.remove(currentPM + "-photo");
  // add:
  document.querySelector(".pm-name").classList.add(newPM + "-name");
  document.querySelector(".top-image").classList.add(newPM + "-photo");
  // hide articles:
  document.querySelectorAll("." + currentPM).forEach(function (e) {
    e.style.display = "none";
  });
  // show articles:
  if (newPM == "olmert")
    document.querySelector(".olmert").style.display = "flex";
  else
    document.querySelectorAll("article." + newPM + "").forEach(function (e) {
      e.style.display = "block";
    });
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  exitCardsScreen();
  currentPMglobal = newPM;
  fadeUp();
}

// change the "background" (floating div) color:
var inputbotton = document.querySelector("article.olmert input");
inputbotton.addEventListener(
  "input",
  function () {
    var theColor = inputbotton.value;
    document.querySelector(".half-circle").style.backgroundColor = theColor;
  },
  false
);
