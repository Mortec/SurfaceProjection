<script>
  import SvgSaver from 'svgsaver'
  import { onMount } from "svelte"
  import { Surface } from "../libs/surface.js"
  import  { surfaceStore }  from "../stores/stores.js"
  import  { pictureStore }  from "../stores/stores.js"
import Fader from './Fader.svelte'

export let params = {
  x: 0,
  y: 0,
  width: 216,
  height: 279,
  resX: 5,
  resY: 5,
  skew: 1,
  crop: 0,
  q: 2,
  formula: 'y',
  structure: "net",
  threshold: 0,
  ceiling: 1,
  path: 'one',
  paper_color: "white",
  pen_color: "black",
}

let surface = new Surface()
let svgString = "M0 0, L5, 15, L15, 5, Z"

const formula = (x, y, l, i, a, q, w, h ) => Math.sin( i/a.length * Math.PI * (l*w/2) ) * q

onMount( () => {  
    // console.log(params)
    surface.params = params

    pictureStore.subscribe( s =>{
        svgString =
        surface.loadTexture( s.id )
                .process( formula )
                .loadPath()
                .getSVGstring()
    })

    surfaceStore.subscribe( s => {
        surface.params = s
        svgString =
        surface.loadVertices()
                .loadTexture()
                .process( formula )
                .loadPath()
                .getSVGstring()
        }
    )
    // console.log("Surface mounted")
})


const savesvg = function(){
    const svgsaver = new SvgSaver();                      
    const svg = document.querySelector('#svg');        
    svgsaver.asSvg(svg);   
}

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



 $: surfaceStore.tune( params )

</script>

<!-- pseudoHTML -------------------------------------------------------- -->

<div class="surfaceView">

    <!-- on:click={ savesvg } -->
    <div class="surface" bind:clientWidth={params.width} bind:clientHeight={params.height}>
        <svg id="svg"  width={params.width} height={params.height} 
        on:mousedown={ mousedown }
        on:mouseup={ mouseup }
        on:mouseout={ mouseup }
        on:mousemove={ drag }
        > 
            <path style="
            fill : none;
            stroke-width: 1px;
            stroke : black;" 
            d={svgString} />

            <!-- {#each surface.vertices as { x, y }, i}
            <circle cx={x*format.width} cy={y*format.height} r="2" stroke="none" stroke-width="1" fill="red" />
            {/each} -->
        </svg>
    </div>

    <div class="surface_params">

        <div class="surface_params_faders">
            <Fader
                name="resX"
                label="res_x"
                range={{min: 0, max: params.width}}
                step={1}
                value={params.resX}
                on:input={ (i)=>params.resX=i.detail.value }
            />

            <!-- <label >
                <span>res_x</span>
                <input type=range bind:value={params.resX} min=5 max={params.width} step="1">
                <input type=number bind:value={params.resX} min=5 max={params.width} step="1">
            </label> -->

            <label >
                <span>res_y</span>
                <input type=range bind:value={params.resY} min=5 max={params.height} step="1">
                <input type=number bind:value={params.resY} min=5 max={params.height} step="1">
            </label>
            <label >
                <span>skew</span>
                <input type=range bind:value={params.skew} min=0.5 max=1.5 step="0.01">
                <input type=number bind:value={params.skew} min=0.5 max=1.5 step="0.01">
            </label>

            <label >
                <span>crop</span>
                <input type=range bind:value={params.crop} min=0 max=0.35 step="0.01">
                <input type=number bind:value={params.crop} min=0 max=0.35 step="0.01">
            </label>

            <label >
                <span>q</span>
                <input type=range bind:value={params.q} min=0.0 max=100.0 step="0.5">
                <input type=number bind:value={params.q} min=0.0 max=100.0 step="0.1">
            </label>

            <label >
                <span>thrsh.</span>
                <input type=range bind:value={params.threshold} min=0 max=0.5 step="0.01">
                <input type=number bind:value={params.threshold} min=0 max=0.5 step="0.01">
            </label>

            <label >
                <span>ceil.</span>
                <input type=range bind:value={params.ceiling} min=0.5 max=1 step="0.01">
                <input type=number bind:value={params.ceiling} min=0.5 max=1 step="0.01">
            </label>
            
        </div>
            <div class = "surface_params_formula">
                <span>formula:</span>
                <label>
                <textarea id="formula" bind:value={params.formula}></textarea>
                </label>
            </div>

            <div class="surface_params_pathFeedback">
                <span >path_length: {surface.path.length}</span>
            </div>

    </div>
</div>


<!-- STYLE -------------------------------------------------------- -->


<style>

    .surfaceView{
        width: calc(100vh/400 * 216 * 1.5);
            display: flex;
        flex-direction: row;
        justify-content: flex-start;
    }

	.surface{
		width: calc(100vh/400 * 216);
		height: calc(100vh/400 * 279);
		padding: none;
		background-color: white;	
		border: 1px solid rgb(211, 211, 211);
        box-shadow: 1px 2px 4px rgba(0, 0, 0, .2);
	  }
    #svg{
        cursor: grab;
    }
	  path{
		  fill : none;
		  stroke-width: 1px;
		  stroke : black;
      }
      
    .surface_params{
        background-color: rgb(237, 237, 237);
        width: calc(100vh/400 * 216 * 0.5 );
        margin-left: 0.7em;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
      }

    .surface_params_faders{
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }
    .surface_params_formula{
        /* align-self: flex-start; */
        margin-top: 1em;
        height: 34%;
    }

    .surface_params_formula > span{
        width: 100%;
        margin-left: 1em;
    }

    #formula{
        background-color: rgb(222, 222, 222);
        color: rgb(0, 0, 0);
        padding: 0.5em;
        font-family: roboto, monospace;
        font-size: 0.85em;
        margin-top: 0.5em;
        margin-left: 1em;
        margin-right: 1em;
        width: 100%;
        height: calc(100vh/400 * 85);
        resize: none;
        border: 0px solid transparent
    }
    #formula:focus{
        border: 0px solid transparent;
        box-shadow: transparent;
        outline: none;

    }

    .surface_params_pathFeedback{
        font-family: 'Cutive Mono', monospace;
        font-size: 0.85em;
        letter-spacing: -1px;
        align-self: flex-start;
        margin-top: 1em;
        margin-bottom: 1em;
    }
    .surface_params_pathFeedback > span{
        
        margin: 0em 0em 0em 1em;
    }
    
    label{
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        /* width: 100%; */
    }

    input{
        border: none;
        padding: 0px 0px 0px 0px;
        background-color: transparent;
    }
    
    input[type=number]{
        text-align: center;
        border-radius: 0px;
        font-size: 0.9em;
        width: 30%;
        margin: 1em;
        margin-left: 0.5em;
    }

    label > span{
        text-align: center;
        width: 4em;
        margin: 1em;
        padding: 0;
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