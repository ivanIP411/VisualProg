import { describe, it, expect } from 'vitest';
import docsReducer, { setCurId } from '../docSlice';

describe('docsSlice', () => {
  it('Устанавливает id документа', () => {
    let state = docsReducer(undefined, { type: 'init' });
    state = docsReducer(state, setCurId('123'));
    expect(state.curId).toBe('123');
  });
});
