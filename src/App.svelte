<script>
import { onMount } from 'svelte';
import PictureView from './components/PictureView.svelte'
import { pictureStore } from "./stores/stores.js"

import { Surface } from './libs/surface'

let title = 'surface projection'


let resX = 1080;
let resY = Math.floor( resX * 1.3 )/6;

let surface = new Surface()

let svgPath 

let format = {width: 100, height: 100}

onMount( () => {  

	
	pictureStore.subscribe( s =>{

		surface.generate(
			Math.floor(format.width/2), 
			Math.floor(format.height/2)
			)

		surface.loadTexture( s.id )
		
		surface.process( ( x, y, v, i )=>{
			const newx = x
			const newy = y
			let z = 0
			let c = i/(resX*resY)
			// z = -v * format.height/resY //luminsosity to y
			z = Math.sin( c * Math.PI * 1000 ) * -v//FM
			z = z/2 + 0.5

			z = (z  * 0.75 - 0.375)*1000
			return { x: newx, y: newy, z: z  }
		})

		svgPath = surface.getSVGpath( format )
	})
 })









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
		/* width: 33%; */
		/* margin: auto; */
		/* text-align: center; */
		font-size: 1.5em;
		margin-top: 1em;
		margin-bottom: 2em;
		margin-left: 1em;
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