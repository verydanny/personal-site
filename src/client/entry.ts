import App from '../app/components/app/app'

new App({
  target: document.querySelector('.app-container'),
  hydrate: true
})

if (module.hot) {
  module.hot.accept()
}
