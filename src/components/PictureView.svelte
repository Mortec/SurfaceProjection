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

  .params{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: 2em;
    width: calc(100vh / 400 * 216 / 2);
    height: calc(100vh / 400 * 216 / 2);
    -webkit-transform: rotate(-90deg);
        -moz-transform: rotate(-90deg);
        -o-transform: rotate(-90deg);
        transform: rotate(-90deg);
  }

label{
  display: flex;
  justify-content: flex-start;
  width: 100%
}
input[type=number]{
  text-align: center;
  /* background: red; */
  border-radius: 0px;
  font-size: 0.9em;
  width: 30%;
  margin: 0;
  margin-top: 0.85em;
  padding-left: 0 em;
  -webkit-transform: rotate(90deg);
        -moz-transform: rotate(90deg);
        -o-transform: rotate(90deg);
        transform: rotate(90deg);
}
label > span{
  text-align: center;
  width: 4em;
  margin: 0;
  padding: 0;
  -webkit-transform: rotate(90deg);
        -moz-transform: rotate(90deg);
        -o-transform: rotate(90deg);
        transform: rotate(90deg);
}
input{
  border: none;
  padding: 0px 0px 0px 0px;
  background-color: transparent;
}

/* https://www.cssportal.com/style-input-range/ */
input[type=range] {
  height: 12px;
  -webkit-appearance: none;
  margin: 10px 0;
  width: 100%;
}
input[type=range]:focus {
  outline: none;
}
input[type=range]::-webkit-slider-runnable-track {
  width: 100%;
  height: 2px;
  cursor: pointer;
  animate: 0.2s;
  box-shadow: 0px 0px 1px #000000;
  background: #C9C9C9;
  border-radius: 2px;
  border: 0px solid #000000;
}
input[type=range]::-webkit-slider-thumb {
  box-shadow: 0px 0px 1px #000000;
  border: 0px solid #B1C8E3;
  height: 6px;
  width: 24px;
  border-radius: 20px;
  background: #283440;
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -2px;
}
input[type=range]:focus::-webkit-slider-runnable-track {
  background: #C9C9C9;
}
input[type=range]::-moz-range-track {
  width: 100%;
  height: 2px;
  cursor: pointer;
  animate: 0.2s;
  box-shadow: 0px 0px 1px #000000;
  background: #C9C9C9;
  border-radius: 2px;
  border: 0px solid #000000;
}
input[type=range]::-moz-range-thumb {
  box-shadow: 0px 0px 1px #000000;
  border: 0px solid #B1C8E3;
  height: 6px;
  width: 24px;
  border-radius: 20px;
  background: #283440;
  cursor: pointer;
}
input[type=range]::-ms-track {
  width: 100%;
  height: 2px;
  cursor: pointer;
  animate: 0.2s;
  background: transparent;
  border-color: transparent;
  color: transparent;
}
input[type=range]::-ms-fill-lower {
  background: #C9C9C9;
  border: 0px solid #000000;
  border-radius: 4px;
  box-shadow: 0px 0px 1px #000000;
}
input[type=range]::-ms-fill-upper {
  background: #C9C9C9;
  border: 0px solid #000000;
  border-radius: 4px;
  box-shadow: 0px 0px 1px #000000;
}
input[type=range]::-ms-thumb {
  margin-top: 1px;
  box-shadow: 0px 0px 1px #000000;
  border: 0px solid #B1C8E3;
  height: 6px;
  width: 24px;
  border-radius: 20px;
  background: #283440;
  cursor: pointer;
}
input[type=range]:focus::-ms-fill-lower {
  background: #C9C9C9;
}
input[type=range]:focus::-ms-fill-upper {
  background: #C9C9C9;
}
</style>

<!-- pseudoHTML -------------------------------------------------------- -->
<div>

<div class="picture" bind:clientWidth={pwidth} bind:clientHeight={pheight}>
  <canvas {id} {pwidth} {pheight} on:mousedown={ mousedown }  on:mouseup={ mouseup } on:mouseout={ mouseup } on:mousemove={ drag }/>
</div>

<div class="params">
<label >
  <span>btns</span>
	<input type=number bind:value={params.brightness} min=0.0 max=3.0 step="0.05">
	<input type=range bind:value={params.brightness} min=0.0 max=3.0 step="0.05">
</label>

<label>
  <span>ctst</span>
	<input type=number bind:value={params.contrast} min=0.0 max=3.0 step="0.05">
	<input type=range bind:value={params.contrast} min=0.0 max=3.0 step="0.05">
</label>

<label>
  <span>satu</span>
	<input type=number bind:value={params.saturation} min=0.0 max=1.0 step="0.05">
	<input type=range bind:value={params.saturation} min=0.0 max=1.0 step="0.05">
</label>

<label>
  <span>blur</span>
	<input type=number bind:value={params.blur} min=0.0 max=1.0 step="0.05">
	<input type=range bind:value={params.blur} min=0.0 max=1.0 step="0.05">
</label>

<label>
  <span>zoom</span>
	<input type=number bind:value={params.zoom} min=0.1 max=3.0 step="0.05">
	<input type=range bind:value={params.zoom} min=0.1 max=3.0 step="0.05">
</label>
</div>

</div>