<script>

import {Texture} from './Texture/texture'

let name = 'Surface Projection'

let format = {width: 216, height: 279}

let vertices = 10;
let lines = 10;

let texture = new Texture( vertices, lines ).generate()

let svgPath 


$: (()=>{
		svgPath = texture.getSVGpath( format )
		console.log(svgPath)
	}
)()


</script>




<h1>{name}</h1>


<div class="canva" bind:clientWidth={format.width} bind:clientHeight={format.height}>
	<svg xmlns="http://www.w3.org/2000/svg">
	<path d={svgPath} />
	{#each texture.vertices as { x, y }, i}
	<circle cx={x*format.width} cy={y*format.height} r="2" stroke="none" stroke-width="1" fill="red" />
	{/each}
  </svg>
</div>




  <style>

	  h1{
		width: 50%;
		margin: auto;
		text-align: center;
		margin-top: 1em;
		margin-bottom: 1em;
	  }

	  .canva{
		width: calc(100vh/400 * 216);
		height: calc(100vh/400 * 279);
		margin: auto;
		padding: none;
	  }

	  svg{
		width: 100%;
		height: 100%;
		border: 1px solid rgb(41, 40, 40);
	  }

	  path{
		  fill : none;
		  stroke-width: 1px;
		  stroke : black;
	  }

  </style>