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
  scale: 1,
  crop: 0,
  q: 0,
  formula: 'Math.sin(i/a.length * Math.PI * (l*w/2)) * q',
  structure: "net",
  threshold: 0,
  ceiling: 1,
  path: 'one',
  paper_color: "white",
  pen_color: "black",
}

let surface = new Surface()
let string

const formula = (x, y, l, i, a, q, w, h ) => Math.sin( i/a.length * Math.PI * (l*w/2) ) * q

onMount( () => {

    surface.params = params
    string = surface.SVGstring
    pictureStore.subscribe( s =>{
        surface.loadTexture( s.id )
        .computeMap( formula )
        .computePath()
        .computeSVGstring()
    string = surface.SVGstring

    })

    surfaceStore.subscribe( s => {
        
        surface.params = s
        surface.setVertices()
                .loadTexture()
                .computeMap( formula )
                .computePath()
                .computeSVGstring()
        string = surface.SVGstring
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

  const handleInput = e => {
    
    params = {...params, ...{[e.detail.name]: e.detail.value} }
  }

 $: surfaceStore.tune( params )

</script>

<!-- pseudoHTML -------------------------------------------------------- -->

<div class="surfaceView">

    <!-- on:click={ savesvg } -->
    <div class="surface" bind:clientWidth={params.width} bind:clientHeight={params.height}>
        <svg id="svg"
        viewbox="0 0 {params.width} {params.height}"
        on:mousedown={ mousedown }
        on:mouseup={ mouseup }
        on:mouseout={ mouseup }
        on:mousemove={ drag }
        > 
            <path style="
            fill : none;
            stroke-width: {1/params.height}px;
            stroke : black;"
            transform="
            translate({params.x} {params.y})
            scale({params.width} {params.height})" 
            d={ string } />

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
                range={{min: 2, max: params.width}}
                step={1}
                value={params.resX}
                on:input={ handleInput }
            />

            <Fader
            name="resY"
            label="res_y"
            range={{min: 2, max: params.height}}
            step={1}
            value={params.resY}
            on:input={ handleInput }
            />

            <Fader
            name="scale"
            label="scale"
            range={{min: 0.25, max: 1.5}}
            step={0.01}
            value={params.scale}
            on:input={ handleInput }
            />

            <Fader
            name="crop"
            label="crop"
            range={{min: 0, max: 1}}
            step={0.01}
            value={params.crop}
            on:input={ handleInput }
            />

            <Fader
            name="q"
            label="__q"
            range={{min: 0, max: 1}}
            step={0.001}
            value={params.q}
            on:input={ handleInput }
            />

            <Fader
            name="threshold"
            label="thrsh."
            range={{min: 0, max: 1}}
            step={0.01}
            value={params.threshold}
            on:input={ handleInput }
            />

            <Fader
            name="ceiling"
            label="ceil."
            range={{min: 0, max: 1}}
            step={0.01}
            value={params.ceiling}
            on:input={ handleInput }
            />
            
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
        /* height: 100%; */
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
        /* height: 34%; */
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
        /* margin-top: 0.5em; */
        margin-left: 1em;
        margin-right: 1em;
        width: 100%;
        height: calc(100vh/400 * 90);
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
        margin-bottom: 1.5em;
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




</style>