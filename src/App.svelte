<script>
import { onMount } from 'svelte';
import { Texture } from './Texture/texture'

let title = '~'

let format = {width: 216, height: 279}

let vertices = 55;
let lines = Math.floor( vertices * 1.3 );

let texture = new Texture( vertices, lines ).generate()

let svgPath 


let picture = new Image()
picture.src = './assets/images/Michael-Faraday.jpg';
let pictureContext
let pictureWidth, pictureHeight



onMount( () => {  

    pictureContext = document.getElementById('canvas').getContext('2d')
	picture.onload = ()=>{
		pictureContext.drawImage(picture, 0, 0, pictureContext.canvas.width, pictureContext.canvas.height) 
		texture.loadMap( pictureContext)

		texture.process( ( x, y, v )=>{
			const newx = x
			const newy = y + ( ( 1-v + 0.5 )*0.01 )	- 0.01
			return { x: newx, y: newy  }
		})
		svgPath = texture.getSVGpath( format )
	}
 })






$: (()=>{

		svgPath = texture.getSVGpath( format )
	}
)()


</script>


<h1>{title}</h1>

<div class = "playground">

	<div class="pictureCanvas" bind:clientWidth={pictureWidth} bind:clientHeight={pictureHeight}>

		<canvas id="canvas" ></canvas>
	</div>


	<div class="svgCanvas" bind:clientWidth={format.width} bind:clientHeight={format.height}>
		<svg xmlns="http://www.w3.org/2000/svg">
		<path d={svgPath} />

		<!-- {#each texture.vertices as { x, y }, i}
		<circle cx={x*format.width} cy={y*format.height} r="2" stroke="none" stroke-width="1" fill="red" />
		{/each} -->

	</svg>
	</div>
</div>


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

	  .pictureCanvas{
		width: calc(100vh/400 * 216 /2);
		height: calc(100vh/400 * 279 /2);
	  }

	  canvas{
		width: 100%;
		height: 100%;
		padding: none;
		background-color: whitesmoke;
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