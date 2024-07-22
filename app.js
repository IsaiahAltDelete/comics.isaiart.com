document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = 'c6a6ccbb5ee00ed0d26246690f983bc657a976d5';
    const BASE_URL = 'https://comicvine.gamespot.com/api/';
    const API_URL = `${BASE_URL}issues/?api_key=${API_KEY}&format=json`;
    const comicsList = document.getElementById('comics-list');
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    const publisherFilter = document.getElementById('publisher-filter');
    const prevPageButton = document.getElementById('prev-page');
    const nextPageButton = document.getElementById('next-page');
    const modal = document.getElementById('comic-modal');
    const modalContent = document.getElementById('comic-details');
    const closeButton = document.querySelector('.close-button');
    let offset = 0;

    const fetchComics = (url) => {
        console.log('Fetching comics from:', url);
        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log('Data fetched:', data);
                comicsList.innerHTML = '';
                if (data.results) {
                    const comics = data.results;
                    comics.forEach(comic => {
                        const comicItem = document.createElement('div');
                        comicItem.className = 'comic-item';
                        comicItem.dataset.id = comic.id;

                        const comicImage = document.createElement('img');
                        comicImage.src = comic.image.original_url;
                        comicImage.alt = comic.name;

                        const comicTitle = document.createElement('h3');
                        comicTitle.textContent = comic.name;

                        comicItem.appendChild(comicImage);
                        comicItem.appendChild(comicTitle);
                        comicsList.appendChild(comicItem);

                        comicItem.addEventListener('click', () => {
                            showComicDetails(comic);
                        });
                    });
                } else {
                    comicsList.innerHTML = '<p>No comics found.</p>';
                }
            })
            .catch(error => console.error('Error fetching comics:', error));
    };

    const fetchPublishers = () => {
        const url = `${BASE_URL}publishers/?api_key=${API_KEY}&format=json`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const publishers = data.results;
                publishers.forEach(publisher => {
                    const option = document.createElement('option');
                    option.value = publisher.id;
                    option.textContent = publisher.name;
                    publisherFilter.appendChild(option);
                });
            })
            .catch(error => console.error('Error fetching publishers:', error));
    };

    const showComicDetails = (comic) => {
        modalContent.innerHTML = `
            <h2>${comic.name}</h2>
            <img src="${comic.image.original_url}" alt="${comic.name}">
            <p>${comic.deck}</p>
            <p><strong>Issue Number:</strong> ${comic.issue_number}</p>
            <p><strong>Cover Date:</strong> ${comic.cover_date}</p>
        `;
        modal.style.display = 'block';
    };

    searchButton.addEventListener('click', () => {
        const query = searchInput.value;
        const url = `${BASE_URL}search/?api_key=${API_KEY}&format=json&resources=issue&query=${query}`;
        fetchComics(url);
    });

    publisherFilter.addEventListener('change', () => {
        const publisherId = publisherFilter.value;
        const url = `${BASE_URL}issues/?api_key=${API_KEY}&format=json&publisher=${publisherId}`;
        fetchComics(url);
    });

    prevPageButton.addEventListener('click', () => {
        if (offset > 0) {
            offset -= 10;
            const url = `${API_URL}&offset=${offset}`;
            fetchComics(url);
        }
    });

    nextPageButton.addEventListener('click', () => {
        offset += 10;
        const url = `${API_URL}&offset=${offset}`;
        fetchComics(url);
    });

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Initial Fetch
    fetchComics(API_URL);
    fetchPublishers();
});
