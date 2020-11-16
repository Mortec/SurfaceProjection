<script>
  import SvgSaver from 'svgsaver'
  import { get } from 'svelte/store';
  import { onMount } from "svelte"
  import { Surface } from "../libs/surface.js"
  import  { surfaceStore }  from "../stores/stores.js"
  import  { pictureStore }  from "../stores/stores.js"


let params = {
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  resX: 100,
  resY: 100,
  q: 1,
  formula: 'y',
  structure: "net",
  threshold: 0,
  ceiling: 1,
  path: 'one',
  paper_color: 1,
  pen_color: 0,
}

let surface = new Surface()
let svgString = "M0 0, L5, 15, L15, 5, Z"
let format = {
    width: document.body.clientHeight/400*216,
    height: document.body.clientHeight/400*279
}



onMount( () => {  
    
    surface.with = format.width
    surface.height = format.height
    pictureStore.subscribe( s =>{
        update( s.id )
    })
    console.log("Surface mounted")
})


const savesvg = function(){
    const svgsaver = new SvgSaver();                      
    const svg = document.querySelector('#svg');        
    svgsaver.asSvg(svg);   
}

 const update = ( id ) => {
    surface.generate(
			Math.floor(format.width/2), 
			Math.floor(format.height/4)
            )
            .loadTexture( id )
            .process( (x, y, l, i, a, q, w, h )=> Math.sin( i/a.length * Math.PI * (l*w/2) ) * 2 )
    
    svgString = surface.getSVGstring()
 }

 $: surface.width = format.width
 $: surface.height = format.height


</script>

<!-- pseudoHTML -------------------------------------------------------- -->


<div class="surface" bind:clientWidth={format.width} bind:clientHeight={format.height}>
    <svg id="svg"  width={format.width} height={format.height} on:click={ savesvg }> 
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



<!-- STYLE -------------------------------------------------------- -->


<style>

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
</style>