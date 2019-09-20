import { hydrate } from 'inferno-hydrate'

import { App } from '../components/App/app'

hydrate(<App />, document.querySelector('.app-root'))

if (module.hot) {
  module.hot.accept()
}
