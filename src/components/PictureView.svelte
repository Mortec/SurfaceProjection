<script>
  import { onMount } from "svelte"
  import { picture } from "../stores/Picture.js"

  export let src = "./assets/images/Michael-Faraday.jpg"

  let width, height

  onMount(() => { 
    picture.load(src);
    picture.tune({blur: 0.3})
    picture.draw()
  })


</script>

<!-- STYLE -------------------------------------------------------- -->
<style>
  .picture {
    width: calc(100vh / 400 * 216 / 2);
    height: calc(100vh / 400 * 279 / 2);
    /* overflow: hidden; */
    border: 1px solid black
  }

  canvas {
    width: 100%;
    height: 100%;
    padding: none;
    background-color: whitesmoke;
  }
</style>

<!-- HTML -------------------------------------------------------- -->

<div class="picture" bind:clientWidth={width} bind:clientHeight={height}>
  <canvas id="pictureCanvas" />
</div>
