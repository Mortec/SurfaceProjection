const Surface = function (){

    this.params = {
      resX: 100,
      resY: 100,
      x: 0,
      y: 0,
      width: 1,
      height: 1,
      intensity: 1,
    }

    this.vertices = []
    this.texture = []
    this.path = []
}


Surface.prototype.generate = function( resX, resY ){

    if (resX && resY){
        this.params.resX = resX
        this.params.resY = resY
    }
    let width = this.params.resX
    let height = this.params.resY

    this.vertices = new Array( width * height ).fill(0).map( (e, i) => {

        const x = i%width / width + (1/width/2)
        const y = Math.floor(i/width) / height + (1/height/2)

        return { x, y, z: 0 }
    })

    this.texture = new Array(width * height ).fill(0)

    this.path = new Array(width * height ).fill(0).map( (e, i) => {

        const yCount = Math.floor(i/width)
        const index = (yCount%2 === 0) ? i : (width-1 - i%width) + ( yCount * width )
        return index 
    })

    return this
}


Surface.prototype.loadTexture = function( id, option ){

    const image = document.getElementById( id ).getContext('2d')
    const imagedata = image.getImageData(0,0,image.canvas.width, image.canvas.height)

    let width = imagedata.width
    let height = imagedata.height

    this.vertices.forEach( (e, i, a) => {

        const x = Math.floor(e.x * width)
        const y = Math.floor(e.y * height)

        const index = (width * y + x) * 4

        const red = imagedata.data[ index ]
        const green = imagedata.data[ index + 1 ]
        const blue = imagedata.data[ index + 2]
        const alpha = imagedata.data[ index + 3]

        this.texture[i] = (red+green+blue)/3/255.0
    }, this)
}


Surface.prototype.process = function( func ){

    this.vertices.forEach( (e, i, a) =>  {
        this.vertices[i] = func( e.x, e.y, this.texture[i], i, a )
        return this.vertices[i]
     }, this )
}



Surface.prototype.getSVGpath = function( format ) {
    let svgString = this.path.map( e => {
        
        const X = this.vertices[e].x * format.width 
		const Y = (this.vertices[e].y ) * format.height + this.vertices[e].z
        
        // console.log( this.vertices[e].z )

		let str = (e === 0) ? 'M' + X + ' ' + Y
				// : ( e === this.size-1 ) ? 'L' + X + ' ' + Y  + ' ' + 'Z'
				: 'L' + X + ' ' + Y
		
		return str
	}).join( ' ' )

	return svgString
}

export { Surface }