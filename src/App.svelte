<script>
import PictureView from './components/PictureView.svelte'
import SurfaceView from './components/SurfaceView.svelte'

let title = 'surface projection'

</script>

<h1>{title}</h1>

<div class = "playground">
	<PictureView></PictureView>
	<SurfaceView></SurfaceView>
</div>

<!-- STYLE -------------------------------------------------------- -->

<style>

	  h1{
		/* width: 33%; */
		/* margin: auto; */
		/* text-align: center; */
		font-size: 1.5em;
		margin-top: 1em;
		margin-bottom: 2em;
		margin-left: 1em;
	  }

	  .playground{
		  display: flex;
		  flex-direction: row;
		  justify-content: space-around;
		  align-items:flex-start;
		  margin-top: 1em;
			margin-bottom: 1em;
	  }

</style>