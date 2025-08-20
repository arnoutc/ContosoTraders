import React from "react";
import ReactDOM from "react-dom";
import { Provider } from 'react-redux';
import "./index.css";
import App from "./App";
import './i18n';
import store from './store';
import ConfigService from './services/configService';
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { Buffer } from 'buffer';
import { BrowserRouter } from "react-router-dom";

window.Buffer = Buffer; // Makes Buffer available globally in the browser

const history = createBrowserHistory({ basename: "" });
(async () => {
    await ConfigService.loadSettings();

    ReactDOM.render(
        <Provider store={store}><BrowserRouter><App /></BrowserRouter></Provider>,
        document.getElementById('root')
    );
})();