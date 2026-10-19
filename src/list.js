import { getShow, toggle, watchlist } from './state.js';

/**
 * C2. Підключає кнопки карток у списку #results: «До списку» додає серіал до мого списку або
 * прибирає з нього, «Детальніше» відкриває діалог (openDetails з details.js). main.js викликає
 * цю функцію один раз, після першого показу списку. Специфікація — ТЗ, C2.
 *
 * @param {() => void} refresh перемальовує список для поточних фільтрів
 */
export function initList(refresh) {
  const results = document.querySelector('#results');
  if (!results) throw new Error('Не знайдено список #results');

  results.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;

    const button = event.target.closest('button[data-action]');
    if (!button || !results.contains(button)) return;

    const card = button.closest('li[data-id]');
    const id = Number(card?.dataset.id);
    if (!card || !Number.isSafeInteger(id)) return;

    if (button.dataset.action === 'details') {
openDetails(id);
      return;
    }
    if (button.dataset.action === 'toggle') {
    const oldCards = [...results.querySelectorAll('li[data-id]')];
    const oldIndex = oldCards.indexOf(card);
    toggle(id);

    const count = document.querySelector('#watchlist-count');
    if (!count) throw new Error('Не знайдено лічильник #watchlist-count');
    count.textContent = String(watchlist.size);

    refresh();

    const currentButton = results.querySelector(
      `li[data-id="${id}"] button[data-action="toggle"]`,
    );
    if (currentButton) {
      currentButton.setAttribute('aria-pressed', String(watchlist.has(id)));
      currentButton.focus();
      return;
    }

    const candidates = [...oldCards.slice(oldIndex + 1), ...oldCards.slice(0, oldIndex).reverse()];
    for (const oldCard of candidates) {
      const nextButton = results.querySelector(
        `li[data-id="${oldCard.dataset.id}"] button[data-action="toggle"]`,
      );
      if (nextButton) {
        nextButton.focus();
        return;
      }
    }

    const heading = document.querySelector('#results-heading');
    if (!(heading instanceof HTMLElement)) throw new Error('Не знайдено заголовок #results-heading');
    heading.tabIndex = -1;
    heading.focus();
  }
  });
}
