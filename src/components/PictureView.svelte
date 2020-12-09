<script>
  import Vader from "./Vader.svelte"
  import { onMount } from "svelte"
  import  { pictureStore, surfaceStore }  from "../stores/stores.js"
  import  { gcodeStore }  from "../stores/stores.js"
  import { Picture } from "../libs/picture.js"
  import { createEventDispatcher } from 'svelte'
  import IconButton from './IconButton.svelte'
	import DragLogger from './DragLogger.svelte'
  import { tweened } from "svelte/motion"
  import { quintOut } from "svelte/easing" 
  
  const picture = new Picture('pictureCanvas')
  let width = 100
  let height = 100
  
  
  const easedWidth = tweened( undefined, {
    duration: 1500,
    easing: quintOut,
  });
  
  onMount(() => {
    picture.init()
    picture.resize(width, height)
    picture.set( $pictureStore )
    picture.load($pictureStore.imgUrl)
    picture.notifyRedraw = () => surfaceStore.trig()
    pictureStore.subscribe( s => {
      picture.set( s )
    } )
  })

  const dispatch = createEventDispatcher()

  const exportPNG = function(){
    dispatch('exportPNG') 
  }

  const fr =  new FileReader();
  fr.onload = ()=>{
    $pictureStore.imgUrl = fr.result
  }

  const loadLocal = function(e){
    fr.readAsDataURL( e.target.files[0] )
  }

  $: width = ( $gcodeStore.format.width/$gcodeStore.format.height * height )
  $: easedWidth.set( width )

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
<div class="pictureView"
  ondblclick={()=>console.log($pictureStore.imgUrl, picture.imgUrl)}>

  <div class="picture" bind:clientHeight={height}
  style="width: {$easedWidth}; height: 35vh;"
  >
  <DragLogger bind:x={$pictureStore.x} bind:y={$pictureStore.y}/>
  <canvas id="pictureCanvas"/>
      <div class="savebutton">
        <IconButton
        iconUrl="./assets/icons/export.png"
        on:action={exportPNG}
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
  bind:value={$pictureStore.brightness}
    />
    <Vader
    name="contrast"
    label="ctrst"
    range={{min: 0, max: 3}}
    step={0.01}
    bind:value={$pictureStore.contrast}
    />
    <Vader
    name="blur"
    label="blur"
    range={{min: 0, max: 1}}
    step={0.01}
    bind:value={$pictureStore.blur}
    />
    <Vader
    name="zoom"
    label="zoom"
    range={{min: 0, max: 2}}
    step={0.01}
    bind:value={$pictureStore.zoom}
    />
    <Vader
    name="invert"
    label="neg."
    range={{min: 0, max: 1}}
    step={1}
    bind:value={$pictureStore.invert}
    />
  </div>

  <div class="input-image-container">
    <div class="input-image">
      load local
      <input type="file"
            id="image" name="temp"
            accept="image/png, image/jpeg"
            on:change="{loadLocal}"
      >    
    </div>
  </div>
</div>

