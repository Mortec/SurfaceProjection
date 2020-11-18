<script>
  import PictureView from "./components/PictureView.svelte";
  import SurfaceView from "./components/SurfaceView.svelte";
  import IconButton from "./components/IconButton.svelte";

  let title = "surface_projection";
</script>

<!-- STYLE -------------------------------------------------------- -->

<style>
  header {
    display: flex;
    flex-direction: row;
    align-items: center;
	justify-content: flex-start;
    height: 10%;
  }

  footer {
	  height: 10%;
  }

  h1 {
    font-size: 1.5em;
    margin: 1em;
  }

  .playground {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: flex-start;
    margin-top: 1em;
    margin-bottom: 1em;
  }

  .title {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-self: flex-start;
    align-self: flex-start;
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


<header>
	<IconButton iconUrl="./assets/icons/save.png"/>
	<IconButton iconUrl="./assets/icons/load.png"/>
  <div class="title">
    <h1>{title}</h1>
  </div>
</header>

<main>
  <div class="playground">
    <PictureView />
    <SurfaceView />
    <div class="title">
      <label for="title">title:</label>
      <input type="text" bind:value={title} />
    </div>
  </div>
</main>
<footer />
