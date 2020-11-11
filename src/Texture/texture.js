const Texture = function ( width, height ){

    this.width = width ? width : 1
    this.height = height ? height : 1
    this.size = width * height
    this.vertices = []
    this.map = []
    this.path = []
}


Texture.prototype.generate = function( width, height ){

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


Texture.prototype.loadMap = function( pixels, option ){

    this.vertices.forEach( (e, i, a) => {
        const pixel = pixels.get( e.x * pixels.width, e.y * pixels.height )
        this.map[i] = pixel.red/255
    }, this)
}


Texture.prototype.process = function( func ){

    this.vertices.forEach( (e, i, a) =>  this.vertices[i] = func( e, this.map[i], i, a ), this )
}



Texture.prototype.getSVGpath = function( format) {

    let svgString = this.path.map( e => {

		let X = this.vertices[e].x * format.width 
		let Y = this.vertices[e].y * format.height 

		let str = (e === 0) ? 'M' + X + ' ' + Y
				// : ( e === texture.size-1 ) ? 'L' + X + ' ' + Y  + ' ' + 'Z'
				: 'L' + X + ' ' + Y
		
		return str
	}).join( ' ' )

	return svgString
}

export {Texture}