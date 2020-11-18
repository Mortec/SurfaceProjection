<script>
  import PictureView from "./components/PictureView.svelte";
  import SurfaceView from "./components/SurfaceView.svelte";
  import IconButton from "./components/IconButton.svelte";

  let title = "surface_projection";
</script>

<!-- STYLE -------------------------------------------------------- -->

<style>

	.container{
		width: 100%;
		height: 100%;
	}

	header {
		margin: none;
		padding-top: 1em;
		padding-left: 3em;
		height: 8vh;
	}
	
	h1 {
	  font-size: 1.5em;
	  margin: none;
	  padding:none;
	}

	main{
		width: 100%;
		height: 83vh;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;

	}
	
	nav {
		display: block;
		width: 3vw;
		margin: none;
		padding: none;
	}


	.playground {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: space-around;
		padding-top: 1em;
		padding-left: 1em;

		height: 100%;
		width: 100%
		
	}

  	footer {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-end;
		height: auto;
		padding-right: 2em;
	}


	.gcode {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-self: flex-start;
		align-self: flex-start;
		margin: none;
		padding: none;
	}

	input[type="text"] {
		font-family: "Cutive Mono", monospace;
		letter-spacing: -1px;
		margin: 1em;
		height: 1.5em;
		border: none;
	}
	input[type="text"]:focus {
		outline: none;
	}
</style>


<!-- pseudoHTML -------------------------------------------------------- -->

<div class="container">
	
	<header>
		<h1>{title}</h1>
	</header>
	<main>

		<nav>
			<IconButton iconUrl="./assets/icons/load.png"/>
		</nav>

		<div class="playground">
			<PictureView />
			<SurfaceView />

			<div class="gcode" style="align-self: flex-end; height: calc(100vh/400 * 279);">
				<label for="title">title:</label>
				<input type="text" name="title" bind:value={title} />
				<IconButton iconUrl="./assets/icons/save.png"/>	
			</div>
		</div>

	</main>
	<footer>
		<p style="color: #bbb">©<a style="color: #bbb" href="https://www.edouardmortec.com.com">mortec</a> lockdown 2020</p>
	</footer>
</div>
