var pageAction = chrome.pageAction;
var tabs = chrome.tabs;

function onTabUpdate(tabId, change, tab)
{
    if (tab.url.indexOf('grooveshark.com') > -1) {
        pageAction.show(tabId);
    }
}

function onPageActionClick(tab)
{
    tabs.executeScript(null, { 'file': 'contentscript/page_action.js' });
}

tabs.onUpdated.addListener(onTabUpdate);
pageAction.onClicked.addListener(onPageActionClick);

