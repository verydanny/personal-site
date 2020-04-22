module.exports = {
  preprocess: require('svelte-preprocess')({
    typescript: {
      module: 'commonjs',
    },
  }),
}
