import { getImagesByQuery } from './js/pixabay-api';

import {
    renderGallery,
    clearGallery,
    showLoader,
    hideLoader,
    showLoadMoreBtn,
    hideLoadMoreBtn,
} from './js/render-functions';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
const loadMoreBtn = document.querySelector('.load-more');

let currentPage = 1;
const perPage = 15;
let totalPages = 0;
let currentQuery = '';

form.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(event) {
    event.preventDefault();

    const query = event.currentTarget.elements['search-text'].value.trim();

    if (!query) {
        iziToast.warning({
            message: 'Please enter a search query!',
        });
        return;
    }

    currentQuery = query;
    currentPage = 1;
    totalPages = 0;

    clearGallery();
    hideLoadMoreBtn();
    showLoader();

    try {
        const data = await getImagesByQuery(currentQuery, currentPage);

        if (data.hits.length === 0) {
            iziToast.error({
                message:
                    'Sorry, there are no images matching your search query. Please try again!',
            });
            return;
        }

        totalPages = Math.ceil(data.totalHits / perPage);

        renderGallery(data.hits);

        if (currentPage < totalPages) {
            showLoadMoreBtn();
        } else {
            iziToast.info({
                message: "We're sorry, but you've reached the end of search results.",
            });
        }
    } catch (error) {
        console.error('Search error:', error);

        iziToast.error({
            message: 'Something went wrong. Please try again!',
        });
    } finally {
        hideLoader();
        form.reset();
    }
}

async function onLoadMore() {
    if (currentPage >= totalPages) {
        return;
    }

    currentPage += 1;
    hideLoadMoreBtn();
    showLoader();

    try {
        const data = await getImagesByQuery(currentQuery, currentPage);

        renderGallery(data.hits);

        if (currentPage < totalPages) {
            showLoadMoreBtn();
        } else {
            iziToast.info({
                message: "We're sorry, but you've reached the end of search results.",
            });
        }

        const galleryItem = document.querySelector('.gallery-item');

        if (galleryItem) {
            const itemHeight = galleryItem.getBoundingClientRect().height;
            window.scrollBy({
                top: itemHeight * 2,
                behavior: 'smooth',
            });
        }
    } catch (error) {
        console.error('Load more error:', error);

        currentPage -= 1;

        iziToast.error({
            message: 'Something went wrong. Please try again!',
        });
    } finally {
        hideLoader();

        if (currentPage < totalPages) {
            showLoadMoreBtn();
        }
    }
}