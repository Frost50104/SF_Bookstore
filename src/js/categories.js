const CATEGORIES = [
  'Architecture',
  'Art',
  'Biography',
  'Business',
  'Crafts',
  'Drama',
  'Fiction',
  'Food',
  'History',
  'Humor',
  'Poetry',
  'Psychology',
  'Science',
  'Technology',
  'Travel',
];

let onSelectCallback = null;

function highlight(name) {
  document.querySelectorAll('.category__item').forEach((el) => {
    el.classList.toggle('category__item--active', el.dataset.name === name);
  });
}

function init(onSelect) {
  onSelectCallback = onSelect;
  const list = document.getElementById('categories-list');

  CATEGORIES.forEach((name, i) => {
    const li = document.createElement('li');
    li.className = 'category__item' + (i === 0 ? ' category__item--active' : '');
    li.dataset.name = name;
    li.textContent = name;
    li.addEventListener('click', () => {
      highlight(name);
      onSelectCallback(name);
    });
    list.appendChild(li);
  });

  return CATEGORIES[0];
}

export { init, CATEGORIES };
