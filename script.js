const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const header = document.querySelector('.site-header');

menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open', !open);
});

nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuToggle.setAttribute('aria-expanded', 'false');
  nav.classList.remove('open');
}));

let headerOffset = header.offsetTop;
window.addEventListener('resize', () => { if (!header.classList.contains('is-sticky')) headerOffset = header.offsetTop; });
window.addEventListener('scroll', () => {
  header.classList.toggle('is-sticky', window.scrollY > headerOffset + 150);
});

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
const bouquetResult = document.querySelector('#builder-result');
const picks = {
  Czuły: { name: 'Poranek', note: 'pudrowe jaskry, róże i coś lekkiego' },
  Radosny: { name: 'Iskra', note: 'soczyste tulipany, anemony i błękitne akcenty' },
  Odważny: { name: 'Słoneczna strona', note: 'koralowe kwiaty, ciemne akcenty i dzikie gałązki' }
};

bouquetForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(bouquetForm);
  const mood = data.get('mood');
  const budget = Number(data.get('budget'));
  const pick = picks[mood];
  const size = budget < 150 ? 'małym' : budget < 250 ? 'średnim' : 'dużym';
  bouquetResult.innerHTML = `Twój typ to <strong>„${pick.name}”</strong> — ${pick.note}, w ${size} rozmiarze. <button class="text-link js-result-order" type="button">Zapytaj o ten bukiet →</button>`;
  bouquetResult.hidden = false;
  bouquetResult.querySelector('button').addEventListener('click', () => openOrder(pick.name));
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

const dialog = document.querySelector('#order-dialog');
const orderForm = document.querySelector('#order-form');
const formSuccess = document.querySelector('#form-success');
const formError = document.querySelector('#form-error');
const submitButton = orderForm.querySelector('button[type="submit"]');
const productSelect = orderForm.elements.product;

function openOrder(product = '') {
  orderForm.hidden = false;
  formSuccess.hidden = true;
  formError.hidden = true;
  if (product && [...productSelect.options].some((option) => option.value === product)) productSelect.value = product;
  dialog.showModal();
  document.body.classList.add('modal-open');
}

function closeOrder() {
  dialog.close();
  document.body.classList.remove('modal-open');
}

document.querySelectorAll('.js-open-order').forEach((button) => button.addEventListener('click', () => openOrder()));
document.querySelectorAll('.js-order-product').forEach((button) => button.addEventListener('click', () => openOrder(button.dataset.product)));
document.querySelector('.dialog-close').addEventListener('click', closeOrder);
document.querySelector('.dialog-done').addEventListener('click', closeOrder);
dialog.addEventListener('click', (event) => { if (event.target === dialog) closeOrder(); });

orderForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!orderForm.reportValidity()) return;

  formError.hidden = true;
  submitButton.disabled = true;
  submitButton.innerHTML = 'Wysyłamy… <span>↗</span>';

  const formData = new FormData(orderForm);
  const payload = Object.fromEntries(formData.entries());
  payload._replyto = payload.email;

  try {
    const response = await fetch('https://formsubmit.co/ajax/whitep4gess@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error(`FormSubmit responded with ${response.status}`);

    orderForm.hidden = true;
    formSuccess.hidden = false;
    orderForm.reset();
  } catch (error) {
    console.error('Nie udało się wysłać formularza:', error);
    formError.hidden = false;
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = 'Wyślij zapytanie <span>→</span>';
  }
});

document.querySelector('#year').textContent = new Date().getFullYear();
