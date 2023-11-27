import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import store from './store/store';
import { Enter } from './components/';

it('renders without crashing', () => {
  shallow(
    <Provider store={store}>
      <Enter />
    </Provider>,
  );
});
