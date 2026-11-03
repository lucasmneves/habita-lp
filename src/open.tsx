import { createRoot } from 'react-dom/client';
import { OpenApp } from './components/OpenApp';
import './styles/main.css';
import './styles/header.css';

createRoot(document.getElementById('root')!).render(<OpenApp />);
