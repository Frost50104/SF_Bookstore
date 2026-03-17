import { fetchBooks, resetPagination, state } from './api.js';
import { addToCart, removeFromCart, isInCart, onCartChange } from './cart.js';

const PLACEHOLDER = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='130' height='200' viewBox='0 0 130 200'%3E%3Crect width='130' height='200' fill='%23efeef6'/%3E%3Ctext x='65' y='108' font-size='12' text-anchor='middle' fill='%235c6a79' font-family='sans-serif'%3ENo cover%3C/text%3E%3C/svg%3E`;

function formatPrice({ amount, currency }) {
  const sym = { USD: '$', EUR: '€', GBP: '£', RUB: '₽' }[currency] || currency;
  return `${sym}${amount.toFixed(2)}`;
}

function renderStars(rating) {
  let html = '<span class="stars">';
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating))          html += '<span class="star star--full">★</span>';
    else if (i - rating > 0 && i - rating < 1) html += '<span class="star star--half">★</span>';
    else                                  html += '<span class="star star--empty">★</span>';
  }
  return html + '</span>';
}

function fmtCount(n) {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return String(n);
}

function updateBtn(btn, book) {
  const active = isInCart(book.id);
  btn.textContent = active ? 'In the cart' : 'Buy now';
  btn.classList.toggle('btn-buy--active', active);
}

function createCard(book) {
  const card = document.createElement('article');
  card.className  = 'book-card';
  card.dataset.id = book.id;

  const authors  = book.authors.length ? book.authors.join(', ') : 'Unknown Author';
  const rating   = book.rating !== null
    ? `<div class="book-card__rating">
         ${renderStars(book.rating)}
         <span class="book-card__reviews">${fmtCount(book.ratingsCount ?? 0)} reviews</span>
       </div>` : '';
  const price    = book.price !== null
    ? `<p class="book-card__price">${formatPrice(book.price)}</p>` : '';

  card.innerHTML = `
    <div class="book-card__cover">
      <img src="${book.thumbnail || PLACEHOLDER}"
           alt="${book.title}"
           loading="lazy"
           onerror="this.src='${PLACEHOLDER}'" />
    </div>
    <div class="book-card__body">
      <p class="book-card__authors">${authors}</p>
      <h3 class="book-card__title">${book.title}</h3>
      ${rating}
      <p class="book-card__description">${book.description || 'No description available.'}</p>
      ${price}
      <button class="btn-buy" data-id="${book.id}">Buy now</button>
    </div>
  `;

  const btn = card.querySelector('.btn-buy');
  updateBtn(btn, book);

  btn.addEventListener('click', () => {
    isInCart(book.id) ? removeFromCart(book.id) : addToCart(book);
    updateBtn(btn, book);
  });

  onCartChange(() => updateBtn(btn, book));
  return card;
}

function renderCards(items) {
  const grid = document.getElementById('books-grid');
  items.forEach(b => grid.appendChild(createCard(b)));
}

function updateLoadMore() {
  document.getElementById('load-more').classList.toggle('hidden', !state.hasMore);
}

async function loadMore() {
  if (state.isLoading) return;
  renderCards(await fetchBooks(state.category));
  updateLoadMore();
}

async function loadCategory(category) {
  resetPagination(category);
  document.getElementById('books-grid').innerHTML = '';
  document.getElementById('load-more').classList.add('hidden');
  renderCards(await fetchBooks(category));
  updateLoadMore();
}

function init() {
  document.getElementById('load-more').addEventListener('click', loadMore);
}

export { init, loadCategory };
