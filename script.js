// get value from search input
//fetch api
//toggle light / dark mode -.-
// set url based on search
// form validation uWu

const searchInput = document.querySelector(".form__input");
const searchBtn = document.querySelector(".search-btn");
const themeBtn = document.querySelector(".themeBtn");
const notifContainer = document.querySelector(".section-notifs");
const loadingNotif = document.querySelector(".loading-notif");
const errorNotif = document.querySelector(".error-notif");
const mainContainer = document.querySelector(".main");
const themeText = document.querySelector(".text");
const themeIcon = document.querySelector(".theme-icon");
const errMsg = document.querySelector(".err-msg");

let urlParams = {
  search: "",
  theme: "",
};
themeBtn.addEventListener("click", changeTheme);
document.addEventListener("DOMContentLoaded", (e) => {
  getParams();
  urlParams.theme ? setTheme(urlParams.theme) : setTheme();
  if (urlParams.search) {
    searchInput.value = urlParams.search;
    searchUser(urlParams.search);
  }
});
searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let inputValue = searchInput.value;
  if (!inputValue) {
    errMsg.textContent = "Field cannot be empty";
    errMsg.classList.add("active");
  } else {
    errMsg.classList.remove("active");
    searchUser(inputValue);
  }

  updateUrl({ search: inputValue });
});

function searchUser(inputValue) {
  let apiUrl = `https://api.github.com/users/${inputValue}`;
  fetchApi(apiUrl).then((data) => {
    displayData(data);
  });
}

async function fetchApi(url) {
  try {
    errorNotif.classList.remove("active");
    notifContainer.classList.add("active");
    loadingNotif.classList.add("active");
    const response = await fetch(url);
    const data = await response.json();
    notifContainer.classList.remove("active");
    loadingNotif.classList.remove("active");
    return data;
  } catch (e) {
    loadingNotif.classList.remove("active");
    errorNotif.classList.add("active");
    console.log(e);
  }
}
function displayData(data) {
  console.log(data);
  if (data.message) {
    errMsg.textContent = "No results";
    errMsg.classList.add("active");
    mainContainer.classList.remove("active");
    return;
  }
  const {
    avatar_url,
    bio,
    blog,
    company,
    created_at,
    followers,
    following,
    location,
    login,
    name,
    public_repos,
    twitter_username,
  } = data;
  const formattedDate = formatDate(created_at);
  mainContainer.innerHTML = `
  <div class="main__avatar-box">
  <img class="fit-image" src=${avatar_url} alt=${name} /></div>
  <div class="main__col2">
    <div class="main__name-box">
      <p class="main__username">${name}</p>
      <p class="main__github__handle">@${login}</p>
    </div>
    <p class="main__date-joined">
      Joined <span class="date-joined">${formattedDate}</span>
    </p>
  </div>
  <p class="main__bio bio">
  ${bio ? bio : "This profile has no bio"}
  </p>
  <div class="main__row2">
    <ul class="main__stats">
      <li class="main__stat">
        <p class="main__stat-name">Repos</p>
        <p class="main__stat-result">${public_repos}</p>
      </li>
      <li class="main__stat">
        <p class="main__stat-name">Followers</p>
        <p class="main__stat-result">${followers}</p>
      </li>
      <li class="main__stat">
        <p class="main__stat-name">Following</p>
        <p class="main__stat-result">${following}</p>
      </li>
    </ul>
    <ul class="main__links">
      <li class="main__link align-center">
        <img src="./assets/icon-location.svg" alt="icon-location.svg" />
        <p class="${location ? "" : "not-available"}">${
    location ? location : "unknown"
  }</p>
      </li>
      <li class="main__link align-center">
        <img src="./assets/icon-twitter.svg" alt="icon-twitter" />
        <p class="main__not-available ${
          twitter_username ? "" : "not-available"
        }">${twitter_username ? twitter_username : "Not Available"}</p>
      </li>
      <li class="main__link align-center">
        <img src="./assets/icon-website.svg" alt="icon-website" />
        <a href="${blog}" class="${blog ? "" : "not-available"} link-wrap">${
    blog ? blog : "No blog o.o"
  }</a>
      </li>
      <li class="main__link align-center">
        <img src="./assets/icon-company.svg" alt="icon-company.svg" />
        <p class="main__company ${company ? "" : "not-available"}">${
    company ? company : "Not available"
  }</p>
      </li>
    </ul>
  </div>
  `;
  mainContainer.classList.add("active");
}

function formatDate(d) {
  const options = { month: "short" };
  const date = new Date(d);
  const day = date.getDate();
  const year = date.getFullYear();

  const shortMonth = new Intl.DateTimeFormat("en-US", options).format(date);
  return `${day} ${shortMonth} ${year}`;
}
function updateUrl(val) {
  let currentUrl = window.location.href;
  let key = Object.keys(val);
  let [value] = Object.values(val);
  urlParams = { ...urlParams, [key]: value };
  let newUrl = buildNewUrl(currentUrl);
  history.pushState(null, "", newUrl);
}

function buildNewUrl(url) {
  const paramObject = new URLSearchParams(urlParams);
  let newUrl = new URL(url);
  for (const [key, value] of paramObject) {
    if (value.length > 0) {
      newUrl.searchParams.set(key, value);
    }
  }
  return newUrl.href;
}

function getParams() {
  let currentUrl = window.location.href;
  let currentParams = currentUrl.split("?")[1];

  if (!currentParams) {
    return;
  }
  let formattedParam = new URLSearchParams(currentParams);
  for (const [key, value] of formattedParam) {
    urlParams = { ...urlParams, [key]: value };
  }
}

function changeTheme(e) {
  e.preventDefault();
  let theme;
  const target = e.target;
  const currentTheme = target.getAttribute("data-theme").toLowerCase();
  if (currentTheme === "light") {
    theme = "dark";
    themeText.textContent = "light";
    themeIcon.src = "./assets/icon-sun.svg";
  } else {
    theme = "light";
    themeText.textContent = "dark";
    themeIcon.src = "./assets/icon-moon.svg";
  }

  target.setAttribute("data-theme", theme);
  updateUrl({ theme });
  setTheme(urlParams.theme);
}
function setTheme(theme = "light") {
  if (theme === "light") {
    themeText.textContent = "dark";
    themeIcon.src = "./assets/icon-moon.svg";
  } else {
    themeText.textContent = "light";
    themeIcon.src = "./assets/icon-sun.svg";
  }
  themeBtn.setAttribute("data-theme", theme);
  document.documentElement.className = theme;
}
