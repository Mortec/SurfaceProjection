<script>

  import { get } from 'svelte/store';
  import { onMount } from "svelte"
  import { Picture } from "../libs/picture.js"
  import  { pictureStore }  from "../stores/stores.js"
  
  const id = "pictureCanvas"

  let params = get( pictureStore )
  let picture


  onMount(() => { 
    picture = new Picture( id )
    pictureStore.subscribe( s => picture.set( s ) )
    picture.load("./assets/images/Michael-Faraday.jpg")
  })

  let dragRef = {x: params.x, y: params.y}
  let locked = false

  function mousedown( e ){
    locked = true
    dragRef = {x: e.x - params.x, y: e.y - params.y }
  }

  function mouseup(e){
    locked = false
  }
  
  function drag( e ) {
    if (locked) {
      params.x = e.x - dragRef.x, 
      params.y = e.y - dragRef.y
    }
  }

  $: pictureStore.tune( params )
  // $: console.log( params )

</script>



<!-- pseudoHTML -------------------------------------------------------- -->
<div class="pictureBox">

  <div class="picture" bind:clientWidth={params.width} bind:clientHeight={params.height}>
    <canvas {id}
      on:mousedown={ mousedown }
      on:mouseup={ mouseup }
      on:mouseout={ mouseup }
      on:mousemove={ drag }
    />
  </div>
  
  <div class="params">
  <label >
    <span>brtnss</span>
    <input type=number bind:value={params.brightness} min=0.0 max=3.0 step="0.01">
    <input type=range bind:value={params.brightness} min=0.0 max=3.0 step="0.01">
  </label>
  
  <label>
    <span>ctrst</span>
    <input type=number bind:value={params.contrast} min=0.0 max=3.0 step="0.01">
    <input type=range bind:value={params.contrast} min=0.0 max=3.0 step="0.01">
  </label>
  
  <label>
    <span>sat</span>
    <input type=number bind:value={params.saturation} min=0.0 max=1.0 step="0.01">
    <input type=range bind:value={params.saturation} min=0.0 max=1.0 step="0.01">
  </label>
  
  <label>
    <span>blur</span>
    <input type=number bind:value={params.blur} min=0.0 max=1.0 step="0.01">
    <input type=range bind:value={params.blur} min=0.0 max=1.0 step="0.01">
  </label>
  
  <label>
    <span>zoom</span>
    <input type=number bind:value={params.zoom} min=0.1 max=3.0 step="0.01">
    <input type=range bind:value={params.zoom} min=0.1 max=3.0 step="0.01">
  </label>
  </div>
  
  </div>


<!-- STYLE -------------------------------------------------------- -->

<style>
  .picture {
    width: calc(100vh / 400 * 216 / 2);
    height: calc(100vh / 400 * 279 / 2);
    border: 1px solid black;
    background-color: whitesmoke;
  }

  #pictureCanvas {
    cursor: grab;
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
