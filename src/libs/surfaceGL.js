import reglWrapper from 'regl'
//https://stackoverflow.com/questions/18453302/how-do-you-pack-one-32bit-int-into-4-8bit-ints-in-glsl-webgl



const Surface = function (id) {
    this.params = {
      id: 'elementRenderingId',
      x: 0,
      y: 0,
      format:{ name: "sLTR", width: 216, height: 260},
      resX: 216,
      resY: 279,
      scale: 1,
      crop: 0,
      a: 0,
      f: 0,
      threshold: 0,
      ceiling: 1,
      formula: 'Math.sin(i/a.length * Math.PI * (l*w/2)) * q',
      structure: "net",
      path: 'zig',
    };
    this.sourceId = id;
    this.data = [];
    this.path = [];
    this.pathString = "M0, 0 L216 130, L108, 230 Z";
    this.regl =  {}
  };
  


  Surface.prototype.init = function( sourceId ){
    
    if(sourceId) this.sourceId = sourceId

    let glcanvas = document.getElementById('glcanvas')
        // const glctxt = glcanvas.getContext('webgl', {preserveDrawingBuffer: true} )
        // glctxt.canvas.width = 600
        // glctxt.canvas.height = 600

    this.regl = reglWrapper(
        // {gl: glctxt,
        {canvas: glcanvas,
        extensions: ['oes_texture_float', 'oes_texture_float_linear']
        }
    )
  }

  
  
  Surface.prototype.computePath = function () {
  
      const newPath = [];
  
      const sorted = this.data
  
      // data.sort( (a, b) => a.l - b.l )
  
      sorted.forEach((e, i) => {
        const scaleOffset = (1-this.params.scale)/2
        const x = e.x * this.params.scale + scaleOffset + this.params.x;
        const y = (e.y + e.z) * this.params.scale + scaleOffset + this.params.y;
  
        if (
            e.l <= this.params.ceiling &&
            e.l >= this.params.threshold &&
            y >= 0 &&
            y < (1 - this.params.crop) &&
            x >= 0 &&
            x < 1
        ) {
            const yCount = Math.floor(i / this.params.resX);
    
            //(snake unique path)
            const index = yCount % 2 === 0 ? i
                : this.params.resX - 1 - (i % this.params.resX) + yCount * this.params.resX;
    
            newPath.push(index);
        }

    }, this);
  
    this.path = newPath;
  
    return this;
  };
  
  
  
  Surface.prototype.computePathString = function () {
  
      if (this.path.length) {
  
          this.pathString = this.path.map((e, i) => {
  
          const scaleOffset = (1-this.params.scale)/2
  
          const X =
            this.data[e].x * this.params.scale + scaleOffset + this.params.x;
  
          const Y =
            (this.data[e].y + this.data[e].z) * this.params.scale
            + scaleOffset + this.params.y;
  
          let str =
            i === 0 ?
              "M" + X * this.params.format.width + ", " + Y * this.params.format.height 
              //:
              //( e === this.size-1 ) ? 'L' + X + ' ' + Y  + ' ' + 'Z'
              :
              "L" + X * this.params.format.width + ", " + Y * this.params.format.height + " ";
  
          return str;
        })
        .join(" ");
  
        const pathElement = document.getElementById(this.params.id)
        pathElement && pathElement.setAttribute('d', this.pathString)
      }
  
      return this;
  }
  

Surface.prototype.vertex = function(){
    return`
    precision mediump float;
    attribute vec2 position;
    varying vec2 coords;
    uniform vec2 u_resolution;

    void main () {
      coords = vec2( 1.-position.x, position.y)/u_resolution*600.;
      gl_Position = vec4(1.0 - 2.0 * position, 0, 1);
    }
`
}

Surface.prototype.fragment = function(){
    return`
    precision mediump float;
    varying vec2 coords;
    uniform sampler2D u_texture;
    uniform vec2 u_resolution;
    uniform float u_a;
    uniform float u_f;


    void main() {
    vec4 tex = texture2D( u_texture, coords);


	gl_FragColor = vec4( coords.x, coords.y, tex.r, 1.);
    }
`
}



Surface.prototype.getData = function(){
   
    const rawdata =  new Uint8Array(this.params.resX * this.params.resY * 4);
    // this.regl.read({
    //     x: 0,
    //     y: 0,
    //     width: this.params.resX,
    //     height: this.params.resY,
    //     data: new Uint8Array(this.params.resX * this.params.resY * 4)
    //   })
    
    const gl = document.getElementById('glcanvas').getContext('webgl')

    gl.readPixels(0, 0, this.params.resX, this.params.resY, gl.RGBA, gl.UNSIGNED_BYTE, rawdata);

    // console.log( rawdata )

    for( let i = 0; i < rawdata.length; i+=4) {

        this.data[i/4] = {
            x: rawdata[i] / 255,
            y: rawdata[i+1] / 255,
            l: rawdata[i+2] / 255,
            z: rawdata[i+3] / 255,
        }
    }
    return this
}


Surface.prototype.compute = function(){

    const texture = this.regl.texture(
        document.getElementById(this.sourceId)
    )


    const cpt = this.regl({

        vert: this.vertex,
        frag: this.fragment,

        // viewport: {
        //     x: 0,
        //     y: 0,
        //     w: this.params.resX,
        //     h: this.params.resY
        // },

        attributes: {
            position: [
              -2, 0,
              0, -2,
              2, 2]
        },

        uniforms : {
            u_resolution: [this.params.resX, this.params.resY],
            u_texture: texture,
            u_a: this.params.a,
            u_f: this.params.f,
        },

        count: 3
    })

    cpt()

    return this
}


export { Surface };
  