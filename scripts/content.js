chrome.runtime.onMessage.addListener(function (evt, sender, sendResponse) {
  // listen for messages sent from background.js
  if (evt.message === "URL_UPDATED") {
    bootstrap();
  }
});

const init = () => {
  const promise = new Promise((resolve) => {
    var intervalId = setInterval(() => {
      const xpathTechDebt = "//p[text()='Completed tech debt']";
      const xpathTechImprov = "//p[text()='Completed tech debt/improvements']";
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

      if (!!resultTechDebt || !!resultTechImprov) {
        prepForRefresh();
        clearInterval(intervalId);
        resolve({
          containerTechDebt:
            resultTechDebt?.parentElement.parentElement.parentElement
              .parentElement.parentElement,
          containerTechImprov:
            resultTechImprov?.parentElement.parentElement.parentElement
              .parentElement.parentElement,
        });
      }
    }, 200);
  });
  promise.then(({ containerTechDebt, containerTechImprov }) => {
    if (containerTechDebt) {
      const totalPointsDebt = containerTechDebt.querySelectorAll(
        ".MuiTypography-root"
      )[2].textContent;
      const techDebtPointsDebt = containerTechDebt.querySelectorAll(
        ".MuiTypography-root"
      )[7].textContent;
      const indicatorDebt = document.createElement("p");
      indicatorDebt.textContent = `Percentage of tech debt covered: ${Math.trunc(
        (techDebtPointsDebt / totalPointsDebt) * 100
      )}%`;
      indicatorDebt.classList.add("plop");
      containerTechDebt.insertAdjacentElement("beforeend", indicatorDebt);
    }
    if (containerTechImprov) {
      const totalPointsImprov = containerTechImprov.querySelectorAll(
        ".MuiTypography-root"
      )[2].textContent;
      const techDebtPointsImprov = containerTechImprov.querySelectorAll(
        ".MuiTypography-root"
      )[7].textContent;
      const indicatorImprov = document.createElement("p");
      indicatorImprov.textContent = `Percentage of tech debt/improvment covered: ${Math.trunc(
        (techDebtPointsImprov / totalPointsImprov) * 100
      )}%`;
      indicatorImprov.classList.add("plop");
      containerTechImprov.insertAdjacentElement("beforeend", indicatorImprov);
    }
  });
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
