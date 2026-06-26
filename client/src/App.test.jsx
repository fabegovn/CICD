import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('shows the main title', () => {
    const html = renderToStaticMarkup(<App />);

    expect(html).toContain('Todo Web App');
  });
});

