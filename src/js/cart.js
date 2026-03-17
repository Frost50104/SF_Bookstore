const STORAGE_KEY = 'bookstore_cart';
const subscribers = [];

let cart = new Map();

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...cart]));
}

function notify() {
  subscribers.forEach((cb) => cb());
}

function init() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      cart = new Map(JSON.parse(saved));
    }
  } catch {
    cart = new Map();
  }
}

function addToCart(book) {
  cart.set(book.id, book);
  persist();
  notify();
}

function removeFromCart(id) {
  cart.delete(id);
  persist();
  notify();
}

function isInCart(id) {
  return cart.has(id);
}

function getCount() {
  return cart.size;
}

function onCartChange(cb) {
  subscribers.push(cb);
}

export { init, addToCart, removeFromCart, isInCart, getCount, onCartChange };
