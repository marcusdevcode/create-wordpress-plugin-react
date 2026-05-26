/**
 * Import the stylesheet for the plugin.
 */
import './style/main.scss';
import {createRoot} from "react-dom/client";
import {StrictMode} from "react";
import * as React from "react";
import App from "./App";
// Render the App component into the DOM
if(document.querySelectorAll('[id="bulk-action-form"]').length){
    document.getElementById('bulk-action-form').insertAdjacentHTML('afterend', `<div id="plugin-slug-root"></div>`);
    createRoot(document.getElementById('plugin-slug-root')!).render(
        <StrictMode>
            <App />
        </StrictMode>,
    )
}
