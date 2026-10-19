import { getShow } from './state.js';

/**
 * C4. Відкриває діалог #details для серіалу: назва, опис, посилання на сторінку TVmaze і форма
 * з моєю оцінкою й нотаткою. Специфікація — ТЗ, C4.
 *
 * @param {number} id
 */
export function openDetails(id) {
  const show = getShow(id);
  const dialog = document.querySelector('#details');
  const title = document.querySelector('#details-title');
  const summary = document.querySelector('#details-summary');
  const link = document.querySelector('#details-link');

  if (
    !(dialog instanceof HTMLDialogElement) ||
    !(title instanceof HTMLElement) ||
    !(summary instanceof HTMLElement) ||
    !(link instanceof HTMLAnchorElement)
  ) {
    throw new Error('Не знайдено розмітку діалогу #details');
  }

  title.textContent = show.name;
  const parsed = new DOMParser().parseFromString(show.summary, 'text/html');
  const paragraphs = [...parsed.body.querySelectorAll('p')].map((source) => {
    const paragraph = document.createElement('p');
    paragraph.textContent = source.textContent;
    return paragraph;
  });
  summary.replaceChildren(...paragraphs);
  link.href = show.url;

  if (!dialog.open) dialog.showModal();
}

/**
 * C4. Підключає діалог #details: закриття й форму «Моя оцінка й нотатка». main.js викликає цю
 * функцію один раз. Специфікація — ТЗ, C4.
 *
 * @param {() => void} refresh перемальовує список для поточних фільтрів
 */
export function initDetails(refresh) {
  // TODO C4
}
