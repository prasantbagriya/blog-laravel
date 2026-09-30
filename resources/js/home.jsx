import '@fontsource/outfit/300.css';
import '@fontsource/outfit/400.css';
import '@fontsource/outfit/500.css';
import '@fontsource/outfit/600.css';
import '@fontsource/outfit/700.css';
import '@fontsource/outfit/800.css';
import '@fontsource/outfit/900.css';
import '../css/home.css';
import { createRoot } from 'react-dom/client';
import Welcome from './Pages/Welcome';

const mount = document.getElementById('home-app');
const source = document.getElementById('home-props');

if (mount && source) {
    createRoot(mount).render(<Welcome {...JSON.parse(source.textContent || '{}')} />);
}
