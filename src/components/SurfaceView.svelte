<script>
  import SvgSaver from 'svgsaver'
  import { onMount } from "svelte"
  import { Surface } from "../libs/surface.js"
  import  { surfaceStore }  from "../stores/stores.js"
  import  { pictureStore }  from "../stores/stores.js"


export let params = {
  x: 0,
  y: 0,
  width: 216,
  height: 279,
  resX: 216,
  resY: 279,
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


onMount( () => {  
    console.log(params)
    surface.params = params
    pictureStore.subscribe( s =>{
        update( s.id )
    })
    surfaceStore.subscribe( s => {
        surface.params = params
        update()
        }
    )
    // console.log("Surface mounted")
})


const savesvg = function(){
    const svgsaver = new SvgSaver();                      
    const svg = document.querySelector('#svg');        
    svgsaver.asSvg(svg);   
}

 const update = ( id ) => {
    surface.generate()
            .loadTexture( id )
            .process(
                (x, y, l, i, a, q, w, h )=> Math.sin( i/a.length * Math.PI * (l*w/2) ) * q
            )
    
    svgString = surface.getSVGstring()
 }

 $: surfaceStore.tune( params )

</script>

<!-- pseudoHTML -------------------------------------------------------- -->

<div class="surfaceView">
    <div class="surface" bind:clientWidth={params.width} bind:clientHeight={params.height}>
        <svg id="svg"  width={params.width} height={params.height} on:click={ savesvg }> 
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
        <label >
            <span>res_x</span>
            <input type=range bind:value={params.resX} min=5 max=216 step="1">
            <input type=number bind:value={params.resX} min=5 max=216 step="1">
        </label>

        <label >
            <span>res_y</span>
            <input type=range bind:value={params.resY} min=5 max=279 step="1">
            <input type=number bind:value={params.resY} min=5 max=279 step="1">
        </label>
        <label >
            <span>q</span>
            <input type=range bind:value={params.q} min=0.0 max=100.0 step="0.5">
            <input type=number bind:value={params.q} min=0.0 max=100.0 step="0.1">
        </label>
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

	  path{
		  fill : none;
		  stroke-width: 1px;
		  stroke : black;
      }
      
    .surface_params{
        background-color: rgb(237, 237, 237);
        width: calc(100vh/400 * 216 * 0.5 );
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        margin-left: 0.5em;
      }

    label{
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        /* width: 100%; */
    }

  input[type=number]{
    text-align: center;
    border-radius: 0px;
    font-size: 0.9em;
    width: 30%;
    margin: 0.9em;
  }
  label > span{
    text-align: center;
    width: 4em;
    margin: 1em;
    padding: 0;
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