<script>
  import Vader from "./Vader.svelte"
  import { onMount } from "svelte"
  import  { pictureStore }  from "../stores/stores.js"
  import { Picture } from "../libs/picture.js"
  import { createEventDispatcher } from 'svelte'
import {fade } from 'svelte/transition'
import IconButton from './IconButton.svelte'

  
  const picture = new Picture()

  export let params = {
    id: "pictureCanvas",
    imgUrl: "./assets/images/EM-portrait2.jpg",
    x : 0,
    y: 0,
    width: 100,
    height: 100,
    brightness: 1.0,
    contrast: 1.0,
    saturation: 1.0,
    blur: 0,
    zoom: 1.0,
    invert: 0.0,
  }

  onMount(() => {

    picture.notify = () => pictureStore.tune( {} )
    picture.init(params.id)
    pictureStore.subscribe( s => {
      picture.set( s )} )
    picture.load(params.imgUrl)
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

  const handleInput = e => {
    
    params = {...params, ...{[e.detail.name]: e.detail.value} }
  }

  const dispatch = createEventDispatcher()

  const savepng = function(){
    dispatch('savePNG') 
  }

  $: pictureStore.tune( params )

</script>



<!-- pseudoHTML -------------------------------------------------------- -->
<div class="pictureView" in:fade>

  <div class="picture" bind:clientWidth={params.width} bind:clientHeight={params.height}>
    <canvas id={params.id}
      on:mousedown={ mousedown }
      on:mouseup={ mouseup }
      on:mouseout={ mouseup }
      on:mousemove={ drag }
    />
    <div class="savebutton">
      <IconButton
      iconUrl="./assets/icons/save.png"
      on:action={savepng}
      tip="save PNG"
      size= "1.3em"
      />
    </div>
  </div>
  
  <div class="picture_params">

    <Vader
    name="brightness"
    label="brtnss"
    range={{min: 0, max: 1}}
    step={0.01}
    value={params.brightness}
    on:input={ handleInput }
    />
    <Vader
    name="contrast"
    label="ctrst"
    range={{min: 0, max: 1}}
    step={0.01}
    value={params.contrast}
    on:input={ handleInput }
    />
    <Vader
    name="blur"
    label="blur"
    range={{min: 0, max: 1}}
    step={0.01}
    value={params.blur}
    on:input={ handleInput }
    />
    <Vader
    name="zoom"
    label="zoom"
    range={{min: 0, max: 1}}
    step={0.01}
    value={params.zoom}
    on:input={ handleInput }
    />
    <Vader
    name="invert"
    label="inv."
    range={{min: 0, max: 1}}
    step={1}
    value={params.invert}
    on:input={ handleInput }
    />
  </div>
  
</div>


<!-- STYLE -------------------------------------------------------- -->

<style>
  .picture {
    width: calc(100vh / 400 * 216 / 2 - 1px);
    height: calc(100vh / 400 * 279 / 2 - 1px);
    border: 1px solid black;
    background-color: whitesmoke;
  }

  #pictureCanvas {
    cursor: grab;
  }

  .picture_params {  
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: flex-end;
    margin-top:2em;
    width: calc(100vh / 400 * 216 / 2);
    height: calc(100vh / 400 * 216 / 2);
  }

  .savebutton{
    position: absolute;
    transform: translateY( -100%)
  }
</style>
