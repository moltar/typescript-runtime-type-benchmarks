import { render } from 'preact';
import { App } from './App.js';
import { activeTheme } from './theme.js';
import './styles.css';

document.documentElement.dataset.theme = activeTheme().name;

render(<App />, document.getElementById('root')!);
