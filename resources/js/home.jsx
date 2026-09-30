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
const skeleton = document.getElementById('skeleton');

if (mount && source) {
    const root = createRoot(mount);
    root.render(<Welcome {...JSON.parse(source.textContent || '{}')} />);
    
    // Remove skeleton after React has had a chance to mount and paint
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            setTimeout(() => {
                if (skeleton) {
                    skeleton.remove();
                }
            }, 100);
        });
    });
}
