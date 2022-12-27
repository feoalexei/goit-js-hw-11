import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';

import ImagesApiService from './js/images-api-service';

// Referencies
const refs = {
  searchForm: document.querySelector('#search-form'),
  loadMoreBtn: document.querySelector('.load-more'),
  gallery: document.querySelector('.gallery'),
};

const imagesApiService = new ImagesApiService();
const galleryBox = new SimpleLightbox('.gallery a');

// Event listeners
refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

// Functions
function onSearch(e) {
  e.preventDefault();
  imagesApiService.searchQuery =
    e.currentTarget.elements.searchQuery.value.trim();

  toggleSearchBtn(e);
  if (e.currentTarget.classList.contains('active')) return;
  e.currentTarget.elements.searchQuery.value = '';

  clearGallery();

  if (!imagesApiService.searchQuery) {
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  imagesApiService.resetPage();

  imagesApiService.fetchImages().then(data => {
    if (!data.hits.length) {
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    renderImages(data.hits);
    galleryBox.refresh();

    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);

    if (imagesApiService.per_page >= data.totalHits) return;
    refs.loadMoreBtn.classList.add('is-active');
  });
}

function onLoadMore() {
  imagesApiService.fetchImages().then(data => {
    renderImages(data.hits);
    galleryBox.refresh();

    if (
      imagesApiService.per_page * (imagesApiService.page - 1) >=
      data.totalHits
    ) {
      refs.loadMoreBtn.classList.remove('is-active');
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  });
}

function renderImages(hits) {
  const imagesGrid = hits.map(hit => createImageMarkup(hit)).join('');
  refs.gallery.insertAdjacentHTML('beforeend', imagesGrid);
}

function createImageMarkup(img) {
  return `
  <div class="photo-card">
    <a href="${img.webformatURL}">
        <img src="${img.largeImageURL}" alt="${img.tags}" loading="lazy" />
    </a>
    <div class="info">
        <p class="info-item">
            <b>Likes</b>
            ${img.likes}
        </p>
        <p class="info-item">
            <b>Views</b>
            ${img.views}
        </p>
        <p class="info-item">
            <b>Comments</b>
            ${img.comments}
        </p>
        <p class="info-item">
        <b>Downloads</b>
        ${img.downloads}
        </p>
    </div>
</div>
    `;
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

function toggleSearchBtn(e) {
  e.currentTarget.classList.toggle('active');
  e.currentTarget.firstElementChild.focus();
}
