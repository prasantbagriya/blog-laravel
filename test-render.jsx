import React from 'react';
import { renderToString } from 'react-dom/server';
import Show from './resources/js/Pages/Blog/Show.jsx';

const post = {
    title: 'Test',
    excerpt: 'Test excerpt',
    content: '<p>Test</p>'
};

try {
    const html = renderToString(<Show post={post} />);
    console.log("Success! Render length:", html.length);
} catch (e) {
    console.error("Render failed:", e);
}
