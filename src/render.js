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

    for (const name of card.querySelectorAll('[data-field="name"]')) {
      name.textContent = show.name;
    }
    card.querySelector('[data-field="year"]').textContent = show.year ?? '—';
    card.querySelector('[data-field="genres"]').textContent = show.genres.length
      ? show.genres.join(', ')
      : '—';
    card.querySelector('[data-field="rating"]').textContent = show.rating ?? '—';

    const inWatchlist = watchlist.has(show.id);
    card.querySelector('[data-action="toggle"]').setAttribute('aria-pressed', String(inWatchlist));

    const note = notes.get(show.id);
    const myRating = card.querySelector('.card__mine');
    const noteText = card.querySelector('.card__note');
    if (note) {
      myRating.hidden = false;
      card.querySelector('[data-field="my-rating"]').textContent = String(note.rating);
      if (note.text) {
        noteText.hidden = false;
        noteText.textContent = note.text;
      }
    }

    cards.append(card);
  }

  results.replaceChildren(cards);
  status.textContent = list.length
    ? `Знайдено: ${list.length} з ${shows.length}`
    : 'Нічого не знайдено';
}
