chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // read changeInfo data and do something with it (like read the url)
  if (
    changeInfo.url &&
    changeInfo.url.includes(
      "https://dashboards.plandek.com/for/secret-escapes/data/"
    )
  ) {
    chrome.tabs.sendMessage(tabId, {
      message: "URL_UPDATED",
      url: changeInfo.url,
    });
  }
});
