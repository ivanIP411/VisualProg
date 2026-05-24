import { describe, it, expect } from 'vitest';
import uiReducer, { openModal, closeModal, setSaveStatus } from '../uiSlice';

describe('uiSlice', () => {
  it('Открывает модальное окно', () => {
    let state = uiReducer(undefined, { type: 'init' });
    state = uiReducer(state, openModal());
    expect(state.newModal).toBe(true);
  });

  it('Закрывает модальное окно', () => {
    let state = uiReducer(undefined, { type: 'init' });
    state = uiReducer(state, openModal());
    state = uiReducer(state, closeModal());
    expect(state.newModal).toBe(false);
  });

  it('Устанавливает статус сохранения', () => {
    let state = uiReducer(undefined, { type: 'init' });
    state = uiReducer(state, setSaveStatus('saving'));
    expect(state.saveStatus).toBe('saving');
    state = uiReducer(state, setSaveStatus('saved'));
    expect(state.saveStatus).toBe('saved');
  });
});
