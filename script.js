const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open', !open);
});

nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuToggle.setAttribute('aria-expanded', 'false');
  nav.classList.remove('open');
}));

const filters = document.querySelectorAll('.filter');
const products = document.querySelectorAll('.product-card');
filters.forEach((filter) => filter.addEventListener('click', () => {
  filters.forEach((item) => item.classList.remove('active'));
  filter.classList.add('active');
  const value = filter.dataset.filter;
  products.forEach((product) => {
    const visible = value === 'all' || product.dataset.tags.includes(value);
    product.classList.toggle('is-hidden', !visible);
  });
}));

const bouquetForm = document.querySelector('#bouquet-form');
const bouquetSubmit = document.querySelector('#bouquet-submit');
const bouquetResult = document.querySelector('#builder-result');
const picks = {
  Czuły: { name: 'Poranek', note: 'pudrowe jaskry, róże i coś lekkiego' },
  Radosny: { name: 'Iskra', note: 'soczyste tulipany, anemony i błękitne akcenty' },
  Odważny: { name: 'Słoneczna strona', note: 'koralowe kwiaty, ciemne akcenty i dzikie gałązki' }
};

bouquetSubmit.addEventListener('click', () => {
  const mood = bouquetForm.querySelector('input[name="mood"]:checked').value;
  const budget = Number(bouquetForm.querySelector('input[name="budget"]:checked').value);
  const pick = picks[mood];
  const size = budget < 150 ? 'małym' : budget < 250 ? 'średnim' : 'dużym';
  const subject = encodeURIComponent(`Zamówienie bukietu ${pick.name}`);
  bouquetResult.innerHTML = `Twój typ to <strong>„${pick.name}”</strong> — ${pick.note}, w ${size} rozmiarze. <a class="text-link" href="mailto:whitep4gess@gmail.com?subject=${subject}">Napisz do nas →</a>`;
  bouquetResult.hidden = false;
});

const reviews = [...document.querySelectorAll('.review')];
const currentReview = document.querySelector('#review-current');
let reviewIndex = 0;
function showReview(index) {
  reviewIndex = (index + reviews.length) % reviews.length;
  reviews.forEach((review, i) => review.classList.toggle('active', i === reviewIndex));
  currentReview.textContent = String(reviewIndex + 1).padStart(2, '0');
}
document.querySelectorAll('[data-review]').forEach((button) => button.addEventListener('click', () => {
  showReview(reviewIndex + (button.dataset.review === 'next' ? 1 : -1));
}));

document.querySelector('#year').textContent = new Date().getFullYear();
