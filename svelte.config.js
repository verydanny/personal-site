const preprocess = require('svelte-preprocess')

module.exports = {
  preprocess: require('svelte-preprocess')({
    preprocess: [preprocess()],
  }),
}
