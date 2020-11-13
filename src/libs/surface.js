const Surface = function ( width, height ){

    this.width = width ? width : 1
    this.height = height ? height : 1
    this.size = width * height
    this.vertices = []
    this.map = []
    this.path = []
}


Surface.prototype.generate = function( width, height ){

    if (width && height){
        this.width = width
        this.height = height
        this.size = width * height
    }

    this.vertices = new Array( this.width * this.height ).fill(0).map( (e, i) => {

        const y = Math.floor(i/this.width) / this.height + (1/this.height/2)
        const x = i%this.width / this.width + (1/this.width/2)
        return {x, y}
    })

    this.map = new Array(this.width * this.height ).fill(0)

    this.path = new Array(this.width * this.height ).fill(0).map( (e, i) => {

        const yCount = Math.floor(i/this.width)
        const index = (yCount%2 === 0) ? i : (this.width-1 - i%this.width) + ( yCount * this.width )
        return index 
    })

    return this
}


Surface.prototype.loadMap = function( ctxt, option ){

    this.vertices.forEach( (e, i, a) => {

        const x = Math.floor(e.x * ctxt.canvas.clientWidth*1.1)
        const y = Math.floor(e.y * ctxt.canvas.clientHeight/2.2)

        const pixel = ctxt.getImageData( x, y, 1, 1 )
        // console.log( {x, y}, pixel.data[0] )
        this.map[i] = pixel.data[0]/255.0 //RED val
    }, this)
}


Surface.prototype.process = function( func ){

    this.vertices.forEach( (e, i, a) =>  this.vertices[i] = func( e.x, e.y, this.map[i], i, a ), this )
}



Surface.prototype.getSVGpath = function( format) {

    let svgString = this.path.map( e => {

		let X = this.vertices[e].x * format.width 
		let Y = this.vertices[e].y * format.height 

		let str = (e === 0) ? 'M' + X + ' ' + Y
				// : ( e === this.size-1 ) ? 'L' + X + ' ' + Y  + ' ' + 'Z'
				: 'L' + X + ' ' + Y
		
		return str
	}).join( ' ' )

	return svgString
}

export { Surface }