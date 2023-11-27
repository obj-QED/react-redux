import { render } from 'preact';
import { useEffect } from 'preact/hooks';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import store from './store/store';
import { Enter } from './components/Enter/Enter';
import reportWebVitals from './reportWebVitals';

import './components//style.scss';
const App = () => {
  useEffect(() => {
    const root = document.documentElement;

    for (const key in window.theme) {
      if (window.theme.hasOwnProperty(key)) {
        root.style.setProperty(key, window.theme[key]);
      }
    }
  }, []);

  return (
    <BrowserRouter>
      <Provider store={store}>
        <ConfigProvider>
          <Enter />
        </ConfigProvider>
      </Provider>
    </BrowserRouter>
  );
};

render(<App />, document.body);

reportWebVitals();
