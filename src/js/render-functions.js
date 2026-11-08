import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');

const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
});

export function createGallery(images) {
    return images
        .map(
            ({
                webformatURL,
                largeImageURL,
                tags,
                likes,
                views,
                comments,
                downloads,
            }) => `
        <li class="gallery-item">
          <a href="${largeImageURL}" class="gallery-link">
            <img
              src="${webformatURL}"
              alt="${tags}"
              class="gallery-image"
            />
          </a>
          <div class="info">
            <p><b>Likes:</b> ${likes}</p>
            <p><b>Views:</b> ${views}</p>
            <p><b>Comments:</b> ${comments}</p>
            <p><b>Downloads:</b> ${downloads}</p>
          </div>
        </li>
      `
        )
        .join('');
}

export function renderGallery(images) {
    gallery.insertAdjacentHTML('beforeend', createGallery(images));
    lightbox.refresh();
}

export function clearGallery() {
    gallery.innerHTML = '';
}

export function refreshGallery() {
    lightbox.refresh();
}

export function showLoader() {
    loader.hidden = false;
}

export function hideLoader() {
    loader.hidden = true;
}

const loadMoreBtn = document.querySelector('.load-more');

export function showLoadMoreBtn() {
    loadMoreBtn.hidden = false;
}

export function hideLoadMoreBtn() {
    loadMoreBtn.hidden = true;
}