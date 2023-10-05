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
      const resultTechImprov = document.evaluate(
        xpathTechImprov,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
      const resultHotfixes = document.evaluate(
        xpathHotfixes,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;

      if (!!resultTechDebt || !!resultTechImprov || !!resultHotfixes) {
        prepForRefresh();
        clearInterval(intervalId);
        resolve({
          containerTechDebt:
            resultTechDebt?.parentElement.parentElement.parentElement
              .parentElement.parentElement,
          containerTechImprov:
            resultTechImprov?.parentElement.parentElement.parentElement
              .parentElement.parentElement,
          containerHotfixes:
            resultHotfixes?.parentElement.parentElement.parentElement
              .parentElement.parentElement,
        });
        setTimeout(() => {
          init();
        }, PAGE_DISPLAYED_INTERVAL);
      }
    }, interval);
  });
  promise.then(
    ({ containerTechDebt, containerTechImprov, containerHotfixes }) => {
      if (containerTechDebt) {
        const failureRate = 25;
        const totalPointsDebt =
          containerTechDebt.querySelectorAll(cssClassName)[1].textContent;
        const techDebtPointsDebt =
          containerTechDebt.querySelectorAll(cssClassName)[5].textContent;
        const indicatorDebt = document.createElement("p");
        const rate = Math.trunc((techDebtPointsDebt / totalPointsDebt) * 100);
        indicatorDebt.textContent = `Percentage covered: ${rate}%`;
        indicatorDebt.classList.add("plop");
        if (rate < failureRate) {
          indicatorDebt.classList.add("failure");
        } else {
          indicatorDebt.classList.add("success");
        }
        containerTechDebt.insertAdjacentElement("beforeend", indicatorDebt);
      }
      if (containerTechImprov) {
        const failureRate = 25;
        const totalPointsImprov =
          containerTechImprov.querySelectorAll(cssClassName)[1].textContent;
        const techDebtPointsImprov =
          containerTechImprov.querySelectorAll(cssClassName)[5].textContent;
        const indicatorImprov = document.createElement("p");
        const rate = Math.trunc(
          (techDebtPointsImprov / totalPointsImprov) * 100
        );
        indicatorImprov.textContent = `Percentage covered: ${rate}%`;
        indicatorImprov.classList.add("plop");
        if (rate < failureRate) {
          indicatorImprov.classList.add("failure");
        } else {
          indicatorImprov.classList.add("success");
        }
        containerTechImprov.insertAdjacentElement("beforeend", indicatorImprov);
      }
      if (containerHotfixes) {
        const failureRate = 10;
        const totalPointsHotfixes =
          containerHotfixes.querySelectorAll(cssClassName)[1].textContent;
        const techDebtPointsHotfixes =
          containerHotfixes.querySelectorAll(cssClassName)[5].textContent;
        const indicatorHotfixes = document.createElement("p");
        const rate = Math.trunc(
          (totalPointsHotfixes / techDebtPointsHotfixes) * 100
        );
        indicatorHotfixes.textContent = `Change rate failure: ${rate}%`;
        indicatorHotfixes.classList.add("plop");
        if (rate > failureRate) {
          indicatorHotfixes.classList.add("failure");
        } else {
          indicatorHotfixes.classList.add("success");
        }
        containerHotfixes.insertAdjacentElement("beforeend", indicatorHotfixes);
      }
    }
  );
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
