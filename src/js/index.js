import '../scss/main.scss';

import * as cart from './cart.js';
import * as header from './header.js';
import * as slider from './slider.js';
import * as categories from './categories.js';
import * as books from './books.js';

cart.init();
header.init();
slider.init();
books.init();

const defaultCategory = categories.init((name) => books.loadCategory(name));
books.loadCategory(defaultCategory);
