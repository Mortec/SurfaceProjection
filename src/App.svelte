<script>
  import PictureView from "./components/PictureView.svelte";
  import SurfaceView from "./components/SurfaceView.svelte";
  import IconButton from "./components/IconButton.svelte";

  let title = "surface_projection";
</script>

<!-- STYLE -------------------------------------------------------- -->

<style>
.container{
	display: flex;
	flex-direction: row;
	width: 100%;
	height: 100%;
}


	nav {
	
	}
	.navbutton {
		height: 10%;
		vertical-align: center;
	}

	main{
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	header {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	height: 10%;
	margin: none;
	padding: none;
	padding-left: 1.5em;
	}

  h1 {
    font-size: 1.5em;
    margin: none;
  }

  .playground {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: flex-start;
    margin-top: 1em;
	margin-bottom: 1em;
	padding-left: 3em;
	height: auto;
	
  }
  footer {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-end;
		height: 10%;
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

	<nav>
		<div class="navbutton">
		<IconButton iconUrl="./assets/icons/save.png"/>
		</div>
		<div class="navbutton">
		<IconButton iconUrl="./assets/icons/load.png"/>
		</div>
	</nav>

	<main>
		<header>
			<h1>{title}</h1>
		</header>

		<div class="playground">
			<PictureView />
			<SurfaceView />
			<div class="gcode">
				<label for="title">title:</label>
				<input type="text" bind:value={title} />
			</div>
		</div>

		<footer>
			<p style="color: #bbb">©<a style="color: #bbb" href="https://www.edouardmortec.com.com">mortec</a> lockdown 2020</p>
		</footer>
	</main>
</div>
