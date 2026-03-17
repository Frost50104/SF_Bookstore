const SLIDES = [
  {
    label:   'Black Friday Sale',
    tagline: 'up to',
    number:  '60',
    suffix:  '%',
    bg:      '#ffe0e2',
  },
  {
    label:   'New Arrivals',
    tagline: 'discover',
    number:  '100',
    suffix:  '+',
    bg:      '#dff0ff',
  },
  {
    label:   'Special Offer',
    tagline: 'save',
    number:  '30',
    suffix:  '%',
    bg:      '#dff5e8',
  },
  {
    label:   'Bestsellers',
    tagline: 'top',
    number:  '50',
    suffix:  '',
    bg:      '#f0e8ff',
  },
];

let current = 0;
let timer   = null;

function buildSlide(slide) {
  return `
    <div class="slider__slide" style="background:${slide.bg}">
      <div class="slider__content">
        <p class="slider__label">${slide.label}</p>
        <p class="slider__tagline">${slide.tagline}</p>
        <p class="slider__big-num">${slide.number}<span class="slider__suffix">${slide.suffix}</span></p>
      </div>
      <div class="slider__deco" aria-hidden="true">
        <span class="slider__circle slider__circle--1"></span>
        <span class="slider__circle slider__circle--2"></span>
        <span class="slider__circle slider__circle--3"></span>
      </div>
    </div>
  `;
}

function goTo(index) {
  const track = document.getElementById('slider-track');
  const dots  = document.querySelectorAll('.slider__dot');

  current = (index + SLIDES.length) % SLIDES.length;
  track.style.transform = `translateX(-${current * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('slider__dot--active', i === current));
}

function startAutoPlay() {
  stopAutoPlay();
  timer = setInterval(() => goTo(current + 1), 5000);
}

function stopAutoPlay() {
  clearInterval(timer);
}

function init() {
  const track     = document.getElementById('slider-track');
  const dotsWrap  = document.getElementById('slider-dots');
  const sliderEl  = document.getElementById('slider');

  track.innerHTML = SLIDES.map(buildSlide).join('');

  SLIDES.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className   = `slider__dot${i === 0 ? ' slider__dot--active' : ''}`;
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => { stopAutoPlay(); goTo(i); startAutoPlay(); });
    dotsWrap.appendChild(dot);
  });

  sliderEl.addEventListener('mouseenter', stopAutoPlay);
  sliderEl.addEventListener('mouseleave', startAutoPlay);

  goTo(0);
  startAutoPlay();
}

export { init };
