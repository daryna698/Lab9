/** @typedef {import('./state.js').Filters} Filters */

/**
 * C3. Повертає поточні значення форми фільтрів #filters. Поки C3 не виконано, фільтрів немає,
 * і список показує всі серіали. Специфікація — ТЗ, C3.
 *
 * @returns {Filters}
 */
export function readFilters() {
  const form = document.querySelector('#filters');
  const query = form?.querySelector('[name="query"]');
  const genre = form?.querySelector('[name="genre"]');
  const mine = form?.querySelector('[name="mine"]');

  if (
    !(form instanceof HTMLFormElement) ||
    !(query instanceof HTMLInputElement) ||
    !(genre instanceof HTMLSelectElement) ||
    !(mine instanceof HTMLInputElement)
  ) {
    throw new Error('Не знайдено поля фільтрів у формі #filters');
  }

  return {
    query: query.value,
    genre: genre.value,
    mine: mine.checked,
  };
}

/**
 * C3. Підключає форму фільтрів: після кожної зміни — refresh(). main.js викликає цю функцію
 * один раз. Специфікація — ТЗ, C3.
 *
 * @param {() => void} refresh перемальовує список для поточних фільтрів
 */
export function initFilters(refresh) {
  const form = document.querySelector('#filters');
  if (!(form instanceof HTMLFormElement)) {
    throw new Error('Не знайдено форму #filters');
  }

  const query = form.querySelector('[name="query"]');
  const genre = form.querySelector('[name="genre"]');
  const mine = form.querySelector('[name="mine"]');
  if (
    !(query instanceof HTMLInputElement) ||
    !(genre instanceof HTMLSelectElement) ||
    !(mine instanceof HTMLInputElement)
  ) {
    throw new Error('Не знайдено поля фільтрів у формі #filters');
  }

  query.addEventListener('input', refresh);
  genre.addEventListener('change', refresh);
  mine.addEventListener('change', refresh);
  form.addEventListener('submit', (event) => event.preventDefault());
  form.addEventListener('reset', () => queueMicrotask(refresh));
}
