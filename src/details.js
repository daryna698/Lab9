import { getShow, notes, saveNote } from './state.js';

/** @type {number | null} */
let activeShowId = null;
/** @type {HTMLElement | null} */
let dialogOpener = null;
let savedSuccessfully = false;

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
  const form = document.querySelector('#note-form');
  const rating = document.querySelector('#note-rating');
  const text = document.querySelector('#note-text');

  if (
    !(dialog instanceof HTMLDialogElement) ||
    !(title instanceof HTMLElement) ||
    !(summary instanceof HTMLElement) ||
    !(link instanceof HTMLAnchorElement) ||
    !(form instanceof HTMLFormElement) ||
    !(rating instanceof HTMLInputElement) ||
    !(text instanceof HTMLTextAreaElement)
  ) {
    throw new Error('Не знайдено розмітку діалогу #details або форми нотатки');
  }

  if (!dialog.open) {
    const opener = document.activeElement;
    dialogOpener = opener instanceof HTMLElement ? opener : null;
  }
  activeShowId = id;
  savedSuccessfully = false;
  title.textContent = show.name;

  const parsedSummary = new DOMParser().parseFromString(show.summary, 'text/html');
  const paragraphs = [...parsedSummary.body.querySelectorAll('p')].map((source) => {
    const paragraph = document.createElement('p');
    paragraph.textContent = source.textContent;
    return paragraph;
  });
  const summaryText = parsedSummary.body.textContent?.trim();
  if (paragraphs.length === 0 && summaryText) {
    const paragraph = document.createElement('p');
    paragraph.textContent = summaryText;
    paragraphs.push(paragraph);
  }
  summary.replaceChildren(...paragraphs);

  link.href = show.url;
  form.reset();
  clearRatingError(rating, document.querySelector('#note-rating-error'));
  const note = notes.get(id);
  if (note) {
    rating.value = String(note.rating);
    text.value = note.text;
  }

  if (!dialog.open) dialog.showModal();
}

/**
 * @param {HTMLInputElement} rating
 * @param {Element | null} error
 */
function clearRatingError(rating, error) {
  rating.removeAttribute('aria-invalid');
  rating.removeAttribute('aria-describedby');
  if (error) error.textContent = '';
}

/**
 * C4. Підключає діалог #details: закриття й форму «Моя оцінка й нотатка». main.js викликає цю
 * функцію один раз. Специфікація — ТЗ, C4.
 *
 * @param {() => void} refresh перемальовує список для поточних фільтрів
 */
export function initDetails(refresh) {
  const dialog = document.querySelector('#details');
  const form = document.querySelector('#note-form');
  const rating = document.querySelector('#note-rating');
  const text = document.querySelector('#note-text');
  const error = document.querySelector('#note-rating-error');
  const cancel = form?.querySelector('button[type="button"]');

  if (
    !(dialog instanceof HTMLDialogElement) ||
    !(form instanceof HTMLFormElement) ||
    !(rating instanceof HTMLInputElement) ||
    !(text instanceof HTMLTextAreaElement) ||
    !(error instanceof HTMLElement) ||
    !(cancel instanceof HTMLButtonElement)
  ) {
    throw new Error('Не знайдено розмітку діалогу #details або форми нотатки');
  }

  form.noValidate = true;

  rating.addEventListener('input', () => {
    const value = rating.valueAsNumber;
    if (Number.isInteger(value) && value >= 1 && value <= 10) {
      clearRatingError(rating, error);
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = rating.valueAsNumber;
    if (!Number.isInteger(value) || value < 1 || value > 10) {
      rating.setAttribute('aria-invalid', 'true');
      rating.setAttribute('aria-describedby', error.id);
      error.textContent = 'Введіть ціле число від 1 до 10.';
      rating.focus();
      return;
    }
    if (activeShowId === null) {
      throw new Error('Не вибрано серіал для збереження нотатки');
    }

    const show = getShow(activeShowId);
    saveNote(activeShowId, { rating: value, text: text.value });
    clearRatingError(rating, error);

    const status = document.querySelector('#status');
    if (!(status instanceof HTMLElement)) throw new Error('Не знайдено рядок статусу #status');

    refresh();
    status.textContent = `Нотатку до ${show.name} збережено`;
    savedSuccessfully = true;
    dialog.close();

    const detailsButton = document.querySelector(
      `#results li[data-id="${activeShowId}"] button[data-action="details"]`,
    );
    if (detailsButton instanceof HTMLElement) detailsButton.focus();
  });

  cancel.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    const focusTarget = savedSuccessfully
      ? document.querySelector(`#results li[data-id="${activeShowId}"] button[data-action="details"]`)
      : dialogOpener;
    if (focusTarget instanceof HTMLElement) focusTarget.focus();
    dialogOpener = null;
    savedSuccessfully = false;
  });
}
