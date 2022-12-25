import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';
const API_KEY = '32363221-575cc77647989ad3c866cfeee';
const searchParams = new URLSearchParams({
  key: API_KEY,
  q: `${input}`,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
});

export default function fetchImages(input, page, perPage) {
  const response = axios.get().then(response => console.log(response));
}
