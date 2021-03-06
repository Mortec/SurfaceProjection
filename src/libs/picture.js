const Picture = function ( id ){

    this.targetId = id;

    this.params = {
        imgUrl: "./assets/images/IMG_0406.jpg",
        x : 0,
        y: 0,
        brightness: 1.0,
        contrast: 1.0,
        saturation: 1.0,
        blur: 0,
        zoom: 1.0,
        invert: 0.0
    }

    this.width = 100
    this.height = 100
    this.buffer = {}
    
    this.ctxt = {}

    this.image = new Image()

    this.notifyRedraw = function(){}
}

Picture.prototype.init = function(){


    this.buffer = document.createElement('canvas')
    
    this.ctxt = document.getElementById( this.targetId ).getContext("2d")

    this.image = new Image()

    this.image.onload = (e) => {

        const width = this.image.naturalWidth
        const height = this.image.naturalHeight
        this.buffer.getContext('2d').canvas.width = width
        this.buffer.getContext('2d').canvas.height = height
        this.buffer.getContext('2d').drawImage( this.image, 0, 0, width, height )
        this.draw()
    }
}


Picture.prototype.resize = function( width, height ){
    this.width = width
    this.height = height
}

Picture.prototype.reset = function(){

    this.params = {
        x : 0,
        y: 0,
        brightness: 1.0,
        contrast: 1.0,
        saturation: 1.0,
        blur: 0,
        zoom: 1.0,
        invert: 0.0
    }
}

Picture.prototype.set = function( params ){

    if (params.imgUrl != this.params.imgUrl){
        this.params = {...this.params, ...params }
        this.load( this.params.imgUrl )
    }

    else {
        this.params = {...this.params, ...params }
        this.draw()
    }
}

Picture.prototype.load = function( url ){

    if(url) this.params.imgUrl = url
    this.image.crossOrigin='anonymous'
    this.image.src = this.params.imgUrl
}


Picture.prototype.draw = function(){


    const canvas = this.ctxt.canvas
    canvas.width = this.width
    canvas.height = this.height

    const area = {
        width: Math.floor( canvas.width/this.params.zoom ),
        height: Math.floor( canvas.height/this.params.zoom )
    }

    const dragX = this.params.x *  this.width / this.params.zoom
    const dragY = this.params.y *  this.height / this.params.zoom

    const offset = {
        x: (this.buffer.getContext('2d').canvas.width - area.width)/2 - dragX ,
        y: (this.buffer.getContext('2d').canvas.height - area.height)/2 - dragY 
    }

    this.ctxt.clearRect(0, 0, canvas.width,  canvas.height);

    this.ctxt.filter =`
        invert(${this.params.invert})
        brightness(${this.params.brightness})
        contrast(${this.params.contrast})
        saturate(${this.params.saturation})
        blur(${this.params.blur*5}px)
    `
    this.ctxt.drawImage(this.buffer,
            offset.x, offset.y, area.width, area.height,
            0, 0, canvas.width, canvas.height
    )

    this.notifyRedraw()
}

Picture.prototype.getPixel = function( x, y) {

    return this.ctxt.getImageData(x, y, 1, 1)
}

export { Picture }