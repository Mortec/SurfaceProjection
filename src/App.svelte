<script>
let name = 'Surface Projection'

let format = {width: 216, height: 279}

let vertices = 100;
let lines = 100;

let texture = new Array(lines * vertices).fill(0).map( (e, i) => {

	const z = 0

	const ycount = Math.floor(i/vertices)
	const y = ycount/lines

	const x = (ycount%2 === 0) ? i%vertices/vertices : (vertices-1 - i%vertices)/vertices

	return {x, y, z}
} )

let path 

function getpath ( texture, format ){

	return texture.map( (e, i) => {

		let X = ( (e.x + 1/vertices/2) * format.width )
		let Y = ( (e.y + 1/lines/2) * format.height )

		let str = (i === 0) ? 'M' + X + ' ' + Y
			: ( i === texture.length-1 ) ? 'L' + X + ' ' + Y // + ' ' + 'Z'
			: 'L' + X + ' ' + Y
		
		return str

	}).join( ' ' )
}

$: path = getpath( texture, format )

</script>




<h1>Hello {name}!</h1>


<div class="canva" bind:clientWidth={format.width} bind:clientHeight={format.height}>
<svg xmlns="http://www.w3.org/2000/svg" 
>
	<path d={path} />
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