<script>

  import { get } from 'svelte/store';
  import { onMount } from "svelte"
  import { picture } from "../stores/Picture.js"
  
  export let src = "./assets/images/Michael-Faraday.jpg"

  const id = "pictureCanvas"
  let params = {brightness: 1, contrast: 1, saturation: 1, zoom: 1, blur: 0}
  let pwidth, pheight
  
  onMount(() => { 
    picture.init(src, id);
    
    params = { ...get(picture) }

    picture.subscribe( s =>{

      const offset = {
        x: (s.buffer.getContext('2d').canvas.width - s.width/s.zoom)/2 - s.x/s.zoom ,
        y: (s.buffer.getContext('2d').canvas.height - s.height/s.zoom)/2 - s.y/s.zoom 
      }
      s.ctxt.canvas.width = s.width
      s.ctxt.canvas.height = s.height
      s.ctxt.filter =`brightness(${s.brightness}) contrast(${s.contrast}) saturate(${s.saturation}) blur(${s.blur*5}px)`
      s.ctxt.drawImage(s.buffer, offset.x, offset.y, s.width/s.zoom, s.height/s.zoom, 0, 0, s.width, s.height )
    })
  })

  let dragRef = {x: 0, y: 0}
  let locked = false

  function mousedown( e ){
    locked = true
    dragRef = {x: e.x - get(picture).x, y: e.y - get(picture).y }
  }

  function mouseup(e){
    locked = false
  }
  
  function drag( e ) {
    if (locked) {
      const position = {
        x: e.x - dragRef.x, 
        y: e.y - dragRef.y
      }
  
      picture.tune( {x: position.x, y: position.y}  )
    }
  }

  $: picture.tune( {width: pwidth, height: pheight})
  $: picture.tune( {brightness: params.brightness} )
  $: picture.tune( {contrast: params.contrast} )
  $: picture.tune( {saturation: params.saturation} )
  $: picture.tune( {blur: params.blur} )
  $: picture.tune( {zoom: params.zoom} )


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

<!-- pseudoHTML -------------------------------------------------------- -->
<div>

<div class="picture" bind:clientWidth={pwidth} bind:clientHeight={pheight}>
  <canvas {id} {pwidth} {pheight} on:mousedown={ mousedown }  on:mouseup={ mouseup } on:mouseout={ mouseup } on:mousemove={ drag }/>
</div>

<label>
	<input type=range bind:value={params.brightness} min=0.0 max=3.0 step="0.1">
	<input type=number bind:value={params.brightness} min=0.0 max=3.0 step="0.05">
</label>

<label>
	<input type=range bind:value={params.contrast} min=0.0 max=3.0 step="0.1">
	<input type=number bind:value={params.contrast} min=0.0 max=3.0 step="0.05">
</label>

<label>
	<input type=range bind:value={params.saturation} min=0.0 max=1.0 step="0.1">
	<input type=number bind:value={params.saturation} min=0.0 max=1.0 step="0.05">
</label>

<label>
	<input type=range bind:value={params.blur} min=0.0 max=1.0 step="0.1">
	<input type=number bind:value={params.blur} min=0.0 max=1.0 step="0.05">
</label>

<label>
	<input type=range bind:value={params.zoom} min=0.0 max=3.0 step="0.1">
	<input type=number bind:value={params.zoom} min=0.0 max=3.0 step="0.05">
</label>

</div>