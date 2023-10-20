chrome.runtime.onMessage.addListener(function (evt, sender, sendResponse) {
  // listen for messages sent from background.js
  if (evt.message === "URL_UPDATED") {
    bootstrap();
  }
});
const PAGE_DISPLAYED_INTERVAL = 2000;

const cssClassName = ".MuiTypography-root";

let savedData = [];
chrome.storage.sync.get("results", (items) => {
  savedData = items.results;
  console.log("SavedData", savedData);
});

const init = (interval = 200) => {
  const promise = new Promise((resolve) => {
    var intervalId = setInterval(() => {
      const listCategoriesToUpdate = [];

      savedData.forEach((mapper) => {
        const xpathToMatch = `//p[text()='${mapper.mapperTxt}']`;
        const result = document.evaluate(
          xpathToMatch,
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;
        listCategoriesToUpdate.push({
          container:
            result?.parentElement.parentElement.parentElement.parentElement
              .parentElement,
          failureRate: mapper.failrate,
          indicatorText: mapper.indicatorText,
          reverse: mapper.reverse,
          reverseFailrate: mapper.reverseFailrate,
          single: mapper.single,
        });
      });

      if (listCategoriesToUpdate.length) {
        prepForRefresh();
        clearInterval(intervalId);
        resolve(listCategoriesToUpdate);
        setTimeout(() => {
          init();
        }, PAGE_DISPLAYED_INTERVAL);
      }
    }, interval);
  });
  promise.then((listCategoriesToUpdate) => {
    listCategoriesToUpdate.forEach((cat) => {
      if (!!cat.container) {
        prepareAndDisplayIndicator(cat);
      }
    });
  });
};

const prepareAndDisplayIndicator = (cat) => {
  const indicator = document.createElement("p");
  const failureRate = cat.failureRate;
  let rate;
  const totalScore =
    cat.container.querySelectorAll(cssClassName)[2].textContent;
  if (cat.single) {
    rate = totalScore;
  } else {
    const totalScoreComapare =
      cat.container.querySelectorAll(cssClassName)[7].textContent;
    rate = cat.reverse
      ? Math.trunc((totalScore / totalScoreComapare) * 100)
      : Math.trunc((totalScoreComapare / totalScore) * 100);
  }
  indicator.textContent = `${cat.indicatorText} ${rate}${
    cat.single ? `/${failureRate}` : "%"
  }`;
  indicator.classList.add("plop");
  if (cat.reverseFailrate ? rate > failureRate : rate < failureRate) {
    indicator.classList.add("failure");
  } else {
    indicator.classList.add("success");
  }
  cat.container.insertAdjacentElement("beforeend", indicator);
};

const bootstrap = () => {
  if (document.location.origin === "https://dashboards.plandek.com") {
    init();
  }
};

bootstrap();

const prepForRefresh = () => {
  const listElemsToRefresh = Array.from(document.querySelectorAll(".plop"));
  listElemsToRefresh.forEach((elem) => elem.parentElement.removeChild(elem));
};
