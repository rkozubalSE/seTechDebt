chrome.runtime.onMessage.addListener(function (evt, sender, sendResponse) {
  // listen for messages sent from background.js
  if (evt.message === "URL_UPDATED") {
    bootstrap();
  }
});
const PAGE_DISPLAYED_INTERVAL = 10000;

const cssClassName = ".mui-jss-MuiTypography-root";
const init = (interval = 200) => {
  const promise = new Promise((resolve) => {
    var intervalId = setInterval(() => {
      const listCategoriesToUpdate = [];

      const xpathTechDebt = "//p[text()='Completed tech debt']";
      const xpathTechImprov = "//p[text()='Completed tech debt/improvements']";
      const xpathHotfixes = "//p[text()='Completed deployable tickets']";
      const resultTechDebt = document.evaluate(
        xpathTechDebt,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
      listCategoriesToUpdate.push({
        container:
          resultTechDebt?.parentElement.parentElement.parentElement
            .parentElement.parentElement,
        failureRate: 25,
        indicatorText: "Percentage covered:",
      });

      const resultTechImprov = document.evaluate(
        xpathTechImprov,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
      listCategoriesToUpdate.push({
        container:
          resultTechImprov?.parentElement.parentElement.parentElement
            .parentElement.parentElement,
        failureRate: 25,
        indicatorText: "Percentage covered:",
      });

      const resultHotfixes = document.evaluate(
        xpathHotfixes,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
      listCategoriesToUpdate.push({
        container:
          resultHotfixes?.parentElement.parentElement.parentElement
            .parentElement.parentElement,
        failureRate: 10,
        indicatorText: "Change rate failure:",
        reverse: true,
      });

      if (!!resultTechDebt || !!resultTechImprov || !!resultHotfixes) {
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
  const failureRate = cat.failureRate;
  const totalScore =
    cat.container.querySelectorAll(cssClassName)[1].textContent;
  const totalScoreComapare =
    cat.container.querySelectorAll(cssClassName)[5].textContent;
  const indicator = document.createElement("p");
  const rate = cat.reverse
    ? Math.trunc((totalScore / totalScoreComapare) * 100)
    : Math.trunc((totalScoreComapare / totalScore) * 100);
  indicator.textContent = `${cat.indicatorText} ${rate}%`;
  indicator.classList.add("plop");
  if (cat.reverse ? rate > failureRate : rate < failureRate) {
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
