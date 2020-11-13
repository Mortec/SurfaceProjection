<script>


  import { onMount } from "svelte"
  import { picture } from "../stores/Picture.js"

  export let src = "./assets/images/Michael-Faraday.jpg"

  const id = "pictureCanvas"

  let pwidth, pheight

  onMount(() => { 
    picture.init(src, id);
  
    picture.subscribe( s =>{


      // s.ctxt.scale(s.zoom, s.zoom)
      s.ctxt.filter = `brightness(${s.brightness}) contrast(${s.contrast}) saturate(${s.saturation}) blur(${s.blur*5}px)`
      s.image.onload = () => {
        
        s.ctxt.canvas.width = s.width
        s.ctxt.canvas.height = s.height

        const offset = {
          x: Math.floor( (s.image.width - s.width/s.zoom)/2 ),
          y: Math.floor( (s.image.height - s.height/s.zoom)/2 )
        }
        s.ctxt.drawImage(s.image, offset.x, offset.y, s.width/s.zoom, s.height/s.zoom, 0, 0, s.width, s.height )
      }
    })
  })

  $: picture.tune( {width: pwidth, height: pheight})

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
      /* width: 216px;
      height: 279px; */
    padding: 0px;
    margin: 0px;
    background-color: whitesmoke;
  }
</style>

<!-- HTML -------------------------------------------------------- -->

<div class="picture" bind:clientWidth={pwidth} bind:clientHeight={pheight}>
  <canvas {id} {pwidth} {pheight} />
</div>
