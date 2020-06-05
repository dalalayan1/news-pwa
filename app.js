window.addEventListener('load', init);
const API_KEY = "6321f37f7ee44de58d16f3c18a7ff614";
function init() {

    if ('serviceWorker' in navigator) {
        try {
            navigator.serviceWorker.register('serviceworker.js');
            console.log('SW registered');
        } catch (error) {
            console.log('Error in registering SW => ', error);
        }
    }

    updateNews();
}

async function updateNews() {

    try {
        const res = await fetch(`https://newsapi.org/v2/top-headlines?country=in&apiKey=${API_KEY}`);
        const newsList = await res.json();
        const newsWrapper = document.getElementById('newsWrapper');

        try {
            loadNews(newsList, newsWrapper);
        } catch (error) {
            newsWrapper.innerHTML = `<h1>Something went wrong!</h1>`;
        }
    } catch (error) {
        console.log("Network error", error);
        return {};
    }
}

function loadNews(data, selector) {
    selector.innerHTML = data.articles.map(addArticle).join('\n');
}

function addArticle(datum) {
    return `
        <div class='news-item'>
            <a href='${datum.url}'>
            <h2>${datum.title}</h2>
            <img src="${datum.urlToImage}" alt="">
            <p>${datum.description}</p>
            </a>
        </div>
    `;
}