const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';
const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
const PAGE_SIZE = 6;

const state = {
  category: '',
  startIndex: 0,
  isLoading: false,
  hasMore: true,
  totalItems: 0,
};

function resetPagination(category) {
  state.category = category;
  state.startIndex = 0;
  state.isLoading = false;
  state.hasMore = true;
  state.totalItems = 0;
}

function normalizeBook(volume) {
  const info = volume.volumeInfo || {};
  const sale = volume.saleInfo || {};

  const thumbnail =
    info.imageLinks?.thumbnail?.replace('http://', 'https://') || null;

  const rating =
    typeof info.averageRating === 'number' ? info.averageRating : null;
  const ratingsCount =
    typeof info.ratingsCount === 'number' ? info.ratingsCount : null;

  const priceSource = sale.retailPrice || sale.listPrice;
  let price = null;
  if (priceSource && typeof priceSource.amount === 'number') {
    price = { amount: priceSource.amount, currency: priceSource.currencyCode };
  }

  return {
    id: volume.id,
    title: info.title || 'Unknown Title',
    authors: info.authors || [],
    description: info.description || '',
    thumbnail,
    rating,
    ratingsCount,
    price,
    category: info.categories?.[0] || '',
  };
}

async function fetchBooks(category) {
  if (state.isLoading || !state.hasMore) return [];

  state.isLoading = true;

  const query = encodeURIComponent(`subject:${category}`);
  const url = `${BASE_URL}?q=${query}&key=${API_KEY}&printType=books&startIndex=${state.startIndex}&maxResults=${PAGE_SIZE}&langRestrict=en&country=US`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const data = await response.json();
    const items = data.items || [];

    state.totalItems = data.totalItems || 0;
    state.startIndex += items.length;
    state.hasMore = state.startIndex < state.totalItems && items.length > 0;

    return items.map(normalizeBook);
  } catch (err) {
    console.error('fetchBooks failed:', err);
    state.hasMore = false;
    return [];
  } finally {
    state.isLoading = false;
  }
}

export { fetchBooks, resetPagination, state };
