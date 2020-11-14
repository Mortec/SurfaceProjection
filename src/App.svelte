<script>
import { onMount } from 'svelte';
import PictureView from './components/PictureView.svelte'
import { pictureStore } from "./stores/stores.js"

import { Surface } from './libs/surface'

let title = 'surface projection'

let format = {width: 216, height: 279}

let vertices = 55;
let lines = Math.floor( vertices * 1.3 );

let surface = new Surface( vertices, lines ).generate()

let svgPath 
let unsubscribe

onMount( () => {  

	unsubscribe = pictureStore.subscribe( s =>{

		
		// surface.loadMap( s.ctxt)
		
		// surface.process( ( x, y, v )=>{
		// 	const newx = x
		// 	const newy = y 
		// 	const z = ( ( 1-v + 0.5 )*0.01 )
		// 	return { x: newx, y: newy, z: z  }
		// })
		svgPath = "M0 0 L10 20 L20 10 Z" //surface.getSVGpath( format )
	})
 })






$: (()=>{

		svgPath = "M0 0 L10 20 L20 10 Z" //surface.getSVGpath( format )
	}
)()


</script>


<h1>{title}</h1>

<div class = "playground">


	<PictureView></PictureView>


	<div class="svgCanvas" bind:clientWidth={format.width} bind:clientHeight={format.height}>
		<svg xmlns="http://www.w3.org/2000/svg">
		<path d={svgPath} />

		<!-- {#each surface.vertices as { x, y }, i}
		<circle cx={x*format.width} cy={y*format.height} r="2" stroke="none" stroke-width="1" fill="red" />
		{/each} -->

	</svg>
	</div>
</div>


<!-- STYLE -------------------------------------------------------- -->

<style>

	  h1{
		width: 50%;
		margin: auto;
		text-align: center;
		margin-top: 1em;
		margin-bottom: 1em;
	  }

	  .playground{
		  display: flex;
		  flex-direction: row;
		  justify-content: space-around;
		  align-items:flex-start;
		  margin-top: 1em;
			margin-bottom: 1em;
	  }

	  .svgCanvas{
		width: calc(100vh/400 * 216);
		height: calc(100vh/400 * 279);
		padding: none;
		background-color: white;	
	  }

	  svg{
		width: 100%;
		height: 100%;
		border: 1px solid rgb(211, 211, 211);
		box-shadow: 1px 2px 4px rgba(0, 0, 0, .4);
	  }

	  path{
		  fill : none;
		  stroke-width: 1px;
		  stroke : black;
	  }

</style>