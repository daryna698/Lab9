/** @typedef {import('./state.js').Show} Show */
import { notes, shows, watchlist } from './state.js';

/**
 * C1. Показує серіали в списку #results — по картці з шаблону #show-card на кожен, у тому
 * самому порядку, — і оновлює рядок статусу #status. Специфікація — ТЗ, C1.
 *
 * @param {readonly Show[]} list серіали, які треба показати
 */
export function renderShows(list) {
  const results = document.querySelector('#results');
  const status = document.querySelector('#status');
  const template = document.querySelector('#show-card');
  const templateCard = template?.content.firstElementChild;

  if (!results || !status || !templateCard) {
    throw new Error('Не знайдено список #results, статус #status або шаблон #show-card');
  }

  const cards = document.createDocumentFragment();

  for (const show of list) {
    const card = /** @type {HTMLElement} */ (templateCard.cloneNode(true));
    card.dataset.id = String(show.id);
    const inWatchlist = watchlist.has(show.id);
    card.querySelector('[data-action="toggle"]').setAttribute('aria-pressed', String(inWatchlist));

    for (const name of card.querySelectorAll('[data-field="name"]')) {
      name.textContent = show.name;
    }
    card.querySelector('[data-field="year"]').textContent = show.year ?? '—';
    card.querySelector('[data-field="genres"]').textContent = show.genres.length
      ? show.genres.join(', ')
      : '—';
    card.querySelector('[data-field="rating"]').textContent = show.rating ?? '—';

    const note = notes.get(show.id);
    if (note) {
      card.querySelector('.card__mine').hidden = false;
      card.querySelector('[data-field="my-rating"]').textContent = String(note.rating);
      if (note.text) {
        const noteElement = card.querySelector('.card__note');
        noteElement.textContent = note.text;
        noteElement.hidden = false;
      }
    }

    for (const button of card.querySelectorAll('button[data-action]')) {
      if (button.dataset.action === 'toggle') {
        button.setAttribute('aria-label', `До списку: ${show.name}`);
      } else if (button.dataset.action === 'details') {
        button.setAttribute('aria-label', `Детальніше про ${show.name}`);
      }
    }

    cards.append(card);
  }

  results.replaceChildren(cards);
  status.textContent = list.length
    ? `Знайдено: ${list.length} з ${shows.length}`
    : 'Нічого не знайдено';
}