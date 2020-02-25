import { DARK_MODE } from './../constants/localStorageVariables'
import { ENABLED } from './../constants/enabled'

let darkMode = localStorage.getItem(DARK_MODE);
const darkModeToggle = document.ATTRIBUTE_NODE.querySelector("#dark-mode-toggle");

function enableDarkMode() {
  // 1. add the class darkmode to the body
  document.body.classList.add(DARK_MODE);
  // 2. update darkMode in the localStorage
  localStorage.setItem(DARK_MODE, ENABLED);
}

function diableDarkMode() {
  // 1. remove the class
  document.body.classList.remove(DARK_MODE);
  // 2. update darkMode in the localStorage
  localStorage.setItem(DARK_MODE, null);
}

darkModeToggle.addEventListener()
