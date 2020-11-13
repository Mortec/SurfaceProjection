<script>


  import { onMount } from "svelte"
  import { picture } from "../stores/Picture.js"

  export let src = "./assets/images/Michael-Faraday.jpg"

  const id = "pictureCanvas"

  let pwidth, pheight
  
  onMount(() => { 
    picture.init(src, id);
    
    picture.subscribe( s =>{

      const offset = {
        x: Math.floor( (s.buffer.getContext('2d').canvas.width - s.width/s.zoom)/2 - s.x ),
        y: Math.floor( (s.buffer.getContext('2d').canvas.height - s.height/s.zoom)/2 - s.y )
      }
      s.ctxt.canvas.width = s.width
      s.ctxt.canvas.height = s.height
      s.ctxt.filter =`brightness(${s.brightness}) contrast(${s.contrast}) saturate(${s.saturation}) blur(${s.blur*5}px)`
      s.ctxt.drawImage(s.buffer, offset.x, offset.y, s.width/s.zoom, s.height/s.zoom, 0, 0, s.width, s.height )
    })
  })

  let dragRef = {x: 0, y: 0}
  let offset = {x: 0, y: 0}
  let locked = false

  function mousedown( e ){
    locked = true
    dragRef = {x: e.x, y: e.y}
  }
  
  function mouseup(e){
    offset.x = e.x - dragRef.x
    offset.y = e.y - dragRef.y
    locked = false
  }
  
  function drag( e ) {
    if (locked) {
      const position = {
        x: e.x - dragRef.x + offset.x, 
        y: e.y - dragRef.y + offset.y
      }
  
      picture.tune( {x: position.x, y: position.y}  )
    }
  }

  $: picture.tune( {width: pwidth, height: pheight})

</script>

<!-- STYLE -------------------------------------------------------- -->
<style>
  .picture {
    width: calc(100vh / 400 * 216 / 2);
    height: calc(100vh / 400 * 279 / 2);
    border: 1px solid black;
    background-color: whitesmoke;
  }

  canvas {
    padding: none;
    margin: none;
  }
</style>

<!-- HTML -------------------------------------------------------- -->

<div class="picture" bind:clientWidth={pwidth} bind:clientHeight={pheight}>
  <canvas {id} {pwidth} {pheight} on:mousedown={ mousedown }  on:mouseup={ mouseup } on:mouseout={ mouseup } on:mousemove={ drag }/>
</div>
