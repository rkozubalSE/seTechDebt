const initMapperContainer = document.querySelector(".mapperContainer");
const cloneContainer = document
  .querySelector(".mapperContainer")
  .cloneNode(true);
const container = document.querySelector(".container");

// Saves options to chrome.storage
const saveOptions = () => {
  const listMappers = [...document.querySelectorAll(".mapperContainer")];
  const results = [];
  listMappers.forEach((mapper) => {
    console.log(9);
    const mapperTxt = mapper.querySelector(".mapper").value;
    const failrate = mapper.querySelector(".failrate").value;
    const indicatorText = mapper.querySelector(".indicatorText").value;
    const reverse = mapper.querySelector(".reverse").checked;
    const single = mapper.querySelector(".single").checked;
    results.push({ mapperTxt, failrate, indicatorText, reverse, single });
  });

  chrome.storage.sync.set({ results }, () => {
    // Update status to let user know options were saved.
    const status = document.getElementById("status");
    status.textContent = "Options saved.";
    setTimeout(() => {
      status.textContent = "";
    }, 750);
  });
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {
  chrome.storage.sync.get("results", ({ results }) => {
    if (!!results) {
      results.forEach((mapper) => {
        const newNode = initMapperContainer.cloneNode(true);
        newNode.querySelector(".mapper").value = mapper.mapperTxt;
        newNode.querySelector(".failrate").value = mapper.failrate;
        newNode.querySelector(".indicatorText").value = mapper.indicatorText;
        newNode.querySelector(".reverse").checked = mapper.reverse;
        newNode.querySelector(".single").checked = mapper.single;
        container.append(newNode);
      });
      initMapperContainer.parentNode.removeChild(initMapperContainer);
    }
  });
};

const addMapper = () => {
  container.appendChild(cloneContainer.cloneNode(true));
};

const reset = () => {
  chrome.storage.sync.clear(() => {
    // Update status to let user know options were saved.
    const status = document.getElementById("status");
    status.textContent = "Options removed.";
    document
      .querySelectorAll(".mapperContainer")
      .forEach((elem) => container.removeChild(elem));
    addMapper();
    setTimeout(() => {
      status.textContent = "";
    }, 750);
  });
};

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save").addEventListener("click", saveOptions);
document.getElementById("add").addEventListener("click", addMapper);
document.getElementById("reset").addEventListener("click", reset);
