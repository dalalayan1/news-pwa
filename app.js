window.addEventListener('load', init);
const API_KEY = "6321f37f7ee44de58d16f3c18a7ff614";
const SAVED_SEARCHES = "SAVED_SEARCHES";
const savedSearches = sessionStorage.getItem(SAVED_SEARCHES) ? JSON.parse(sessionStorage.getItem(SAVED_SEARCHES)) : [];
function init() {

    if ('serviceWorker' in navigator) {
        try {
            navigator.serviceWorker.register('serviceworker.js');
            console.log('SW registered');
        } catch (error) {
            console.log('Error in registering SW => ', error);
        }
    }
    const searchCta = document.getElementById('searchCta');
    searchCta.addEventListener('click', fetchSearch);

    const savedSearchesList = document.getElementById('savedSearchesList');
    loadMarkup(savedSearches, savedSearchesList, addSavedSearch);
    savedSearchesList.addEventListener('click', fetchSavedSearch);


}

function fetchSavedSearch(e) {
    if (e.target.dataset.item) {
        document.getElementById('searchBox').value = e.target.dataset.item;
        fetchSearch();
    }
}

async function fetchSearch() {

    const searchBox = document.getElementById('searchBox');
    const searchVal = searchBox.value;
    if (!searchVal) {
        console.log("EMPTY search not allowed!!")
        return;
    }

    try {
        const res = await fetch(`https://newsapi.org/v2/everything?q=${searchVal}&apiKey=${API_KEY}`);
        const newsList = await res.json();
        const newsWrapper = document.getElementById('newsWrapper');

        try {
            loadMarkup(newsList.articles, newsWrapper, addArticle);
            if (!savedSearches.includes(searchVal)) {
                savedSearches.push(searchVal);
                sessionStorage.setItem(SAVED_SEARCHES, JSON.stringify(savedSearches));
                const savedSearchesList = document.getElementById('savedSearchesList');
                loadMarkup(savedSearches, savedSearchesList, addSavedSearch);
            }
        } catch (error) {
            newsWrapper.innerHTML = `<h1>Something went wrong!</h1>`;
        }
    } catch (error) {
        console.log("Network error", error);
        return {};
    }
}

function loadMarkup(data, selector, handler) {

    if (!data.length) return;

    selector.innerHTML = data.map(handler).join('\n');
}

function addArticle(datum) {


    return `
        <div class='news-item col-md-4'>
            <a href='${datum.url}'>
            <h2 title='${datum.title}'>${datum.title}</h2>
            <img src='${datum.urlToImage}' alt="">
            <p>${datum.description}</p>
            </a>
        </div>
    `;

    // const image = new Image();
    // image.src = datum.urlToImage;

    // image.addEventListener('load', function (e) {
    //     return `
    //     <div class='news-item col-md-4'>
    //         <a href='${datum.url}'>
    //         <h2 title='${datum.title}'>${datum.title}</h2>
    //         <img src='${datum.urlToImage}' alt="">
    //         <p>${datum.description}</p>
    //         </a>
    //     </div>
    // `;
    // });

    // image.addEventListener('error', function (e) {
    //     return `
    //     <div class='news-item col-md-4'>
    //         <a href='${datum.url}'>
    //         <h2 title='${datum.title}'>${datum.title}</h2>
    //         <img src="./images/loader.png" alt="">
    //         <p>${datum.description}</p>
    //         </a>
    //     </div>
    // `;
    // });
}

function addSavedSearch(datum) {
    return `<li data-item='${datum}'>${datum}<li>`;
}