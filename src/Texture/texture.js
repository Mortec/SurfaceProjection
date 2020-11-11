const Texture = function ( width, height ){

    this.width = width ? width : 0
    this.height = height ? height : 0
    this.vertices = []
    this.map = []
}


Texture.prototype.generate = function( width, height ){

    if (width && height){
        this.width = width
        this.height = height
    }

    this.vertices = new Array( this.width * this.height ).fill(0).map( (e, i) => {

        const y = Math.floor(i/this.width) / this.height + (1/this.height/2)
        const x = i%this.width / this.width + (1/this.width/2)
        return {x, y}
    })

    this.map = new Array(this.width * this.height ).fill(0)

    return this
}


Texture.prototype.loadMap = function( pixels, option ){

    this.vertices.forEach( (e, i, a) => {
        const pixel = pixels.get( e.x * pixels.width, e.y * pixels.height )
        this.map[i] = pixel.red/255
    }, this)
}


Texture.prototype.process = function( func ){

    return this.vertices.map( (e, i, a) =>  func( e.x, e.y, this.map[i], i, a ) )
}