import '../css/home.css';
import { createRoot } from 'react-dom/client';
import Welcome from './Pages/Welcome';

const mount = document.getElementById('home-app');
const source = document.getElementById('home-props');

if (mount && source) {
    createRoot(mount).render(<Welcome {...JSON.parse(source.textContent || '{}')} />);
}
