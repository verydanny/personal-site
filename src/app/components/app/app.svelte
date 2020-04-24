<style src="text/scss">
@import './app.scss';

.someOther {
  font-size: 72px;
  font-family: 'Helvetica Neue', Helvetica, sans-serif;
  font-weight: 200;
}
</style>

<script lang="typescript">
let count = 0;

function handleClick(event: Event) {
  count += 1;
}
</script>

<h1 class="someOther">Future Site</h1>
<button on:click={handleClick}>
	count: {count}
</button>
