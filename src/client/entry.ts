import App from '../app/components/app/app.svelte'

new App({
  target: document.querySelector('.app-container'),
  hydrate: true
})

if (module.hot) {
  module.hot.accept()
}
