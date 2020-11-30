<script>
  import Vader from "./Vader.svelte"
  import { onMount } from "svelte"
  import  { pictureStore }  from "../stores/stores.js"
  import  { surfaceStore }  from "../stores/stores.js"
  import { Picture } from "../libs/picture.js"
  import { createEventDispatcher } from 'svelte'
  import {fade } from 'svelte/transition'
  import IconButton from './IconButton.svelte'
	import DragLogger from './DragLogger.svelte'
  import { tweened } from "svelte/motion"
  import { quintOut } from "svelte/easing" 
  
  const picture = new Picture()
  let width, height

  export let params = {
    id: "pictureCanvas",
    imgUrl: "./assets/images/EM-portrait2.jpg",
    x : 0,
    y : 0,
    brightness: 1.0,
    contrast: 1.0,
    saturation: 1.0,
    blur: 0,
    zoom: 1.0,
    invert: 0.0,
  }

  const easedWidth = tweened( undefined, {
    duration: 1500,
    easing: quintOut,
  });

  onMount(() => {

    surfaceStore.subscribe( s => {
      
      width = ( s.format.width/s.format.height * height )
      easedWidth.set( width )
    })

    picture.notifyLoaded = () => pictureStore.trig()
    picture.init(params.id)
    picture.set( params )
    picture.resize(width, height)
    pictureStore.subscribe( s => {
      picture.set( s )
    } )
    picture.load(params.imgUrl)
  })

  const handleInput = e => {
    
    params = {...params, ...{[e.detail.name]: e.detail.value} }
  }

  const dispatch = createEventDispatcher()

  const exportpng = function(){
    dispatch('exportPNG') 
  }


  $: pictureStore.tune( params )
  $: picture.load( params.imgUrl )
  $: (
    ()=> {
      picture.resize( $easedWidth, height );
      pictureStore.trig()
    }
  )()

</script>


<!-- STYLE -------------------------------------------------------- -->

<style>

  .pictureView{
    width: 28vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .picture {
    border: 1px solid black;
    background-color: whitesmoke;
  }

  #pictureCanvas {
    cursor: grab;
    width: 100%;
    height: 100%;
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
    transform: translateY( -2.4em );
    z-index: 1010;
  }

  .input-image-container{
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }

  .input-image{
    /* margin: auto; */
    margin-top: 1em;
    padding:0.1em;
    background-color: whitesmoke;
    border-radius: 3px;
    border: 1px solid rgb(203, 203, 203);
    overflow: hidden;
    width: 9ch;
    height: 2.6ex;
    text-align: center;
    /* display: inline; */
  }
  .input-image:hover{
    background-color: rgb(201, 201, 201);
    color: whitesmoke;
  }
  .input-image:active{
    filter: invert(1)
  }

  .input-image>input[type="file"]{
    margin:  auto;
    top: 0px;
    left: 0px;
    width: 110%;
    height: 110%;
    opacity: 0;
    transform: translateY(-1.6em) translateX(-0.6em);
    z-index: 10;
  }

  input[type="text"] {
		margin: 1em;
		height: 1.5em;
    border: none;
    outline: none;
	}
</style>


<!-- pseudoHTML -------------------------------------------------------- -->
<div class="pictureView" in:fade>

  <div class="picture" bind:clientHeight={height}
  style="width: {$easedWidth}; height: 35vh;"
  >
  <DragLogger bind:x={params.x} bind:y={params.y}/>
  <canvas id={params.id}/>
      <div class="savebutton">
        <IconButton
        iconUrl="./assets/icons/export.png"
        on:action={exportpng}
        tip="Export PNG"
        size= "1.2em"
        opacity={0.5}
      />
    
    </div>
</div>

<div class="picture_params">
  
  <Vader
  name="brightness"
  label="brtnss"
  range={{min: 0, max: 3}}
  step={0.01}
  value={params.brightness}
    on:input={ handleInput }
    />
    <Vader
    name="contrast"
    label="ctrst"
    range={{min: 0, max: 3}}
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
    range={{min: 0, max: 2}}
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

  <div class="input-image-container">
    <div class="input-image">
      load local
      <input type="file"
            id="image" name="temp"
            accept="image/png, image/jpeg"
            on:change="{
              
              e => picture.loadLocal(e.target.files[0], ( url )=>params.imgUrl = url )
            
            }"
      >    
    </div>
  </div>
</div>

