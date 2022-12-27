import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '32363221-575cc77647989ad3c866cfeee';

export default class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
  }

  async fetchImages() {
    const searchParams = new URLSearchParams({
      key: API_KEY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: this.page,
      per_page: 40,
    });
    try {
      const response = await axios.get(`${BASE_URL}?${searchParams}`);
      this.incrementPage();
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
