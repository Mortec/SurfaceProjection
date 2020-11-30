import reglWrapper from 'regl'
//https://stackoverflow.com/questions/18453302/how-do-you-pack-one-32bit-int-into-4-8bit-ints-in-glsl-webgl



const Surface = function (id) {
    this.params = {
      id: 'surfacePath',
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
    this.glId = 'glcanvas'
    this.sourceId = 'pictureCanvas';
    this.data = [];
    this.path = [];
    this.pathString = "M0, 0 L216 130, L108, 230 Z";
    this.regl =  {}
  };
  


  Surface.prototype.init = function( sourceId, glId ){
    
    if(sourceId) this.sourceId = sourceId
    if(glId) this.glId = glId


    let glcanvas = document.getElementById( this.glId )
        glcanvas.getContext('webgl').canvas.width = 600
        glcanvas.getContext('webgl').canvas.height = 600

    this.regl = reglWrapper(
        {canvas: glcanvas,
        extensions: ['oes_texture_float', 'oes_texture_float_linear']
        }
    )
  }

  
  
  Surface.prototype.computePath = function () {
  
      const newPath = [];
  
      // data.sort( (a, b) => a.l - b.l )
  
      this.data.forEach((e, i) => {
        //   console.log(e.y)
        const scaleOffset = (1-this.params.scale)/2
        const x = e.x * this.params.scale + scaleOffset + this.params.x;
        const y = (e.y + e.l) * this.params.scale + scaleOffset + this.params.y;
  
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
                : this.params.resX - 1 - (i % this.params.resX) + (yCount * this.params.resX);
    
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
            (this.data[e].y + this.data[e].l) * this.params.scale + scaleOffset + this.params.y //+ this.data[e].z) ;
  
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
  

  /*book of shader
#ifdef
GL_ES\nprecision mediump float;
#endif
attribute vec2 a_position;//[-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0]
attribute vec2 a_texcoord;//[0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]
varying vec2 v_texcoord;
void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
            v_texcoord = a_texcoord;
        }
    
*/

Surface.prototype.vertex = function(){
    return`
    precision mediump float;
    attribute vec2 position;
    attribute vec2 tex_coords;
    varying vec2 coords;
    uniform vec2 u_resolution;

    void main () {
      coords = vec2(tex_coords.x, tex_coords.y);
      gl_Position = vec4(position, 0., 1.);
    }
`
}

/*Book of shader
#ifdef GL_ES
precision mediump float;
#endif
varying vec2 v_texcoord;
void main(){
    gl_FragColor = vec4(0.0);
}'
 */
Surface.prototype.fragment = function(){
    return`
    precision mediump float;
    varying vec2 coords;
    uniform sampler2D u_texture;
    uniform vec2 u_resolution;
    uniform float u_a;
    uniform float u_f;


    void main() {
        vec2 st = gl_FragCoord.xy/u_resolution;
        st = vec2( st.x, st.y);
        vec4 tex = texture2D( u_texture, st);

	    gl_FragColor = vec4( st.x, st.y, tex.r*u_a, 1.);
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
    // gl.canvas.width = 600
    // gl.canvas.height = 600

    gl.readPixels(0, 0, this.params.resX, this.params.resY, gl.RGBA, gl.UNSIGNED_BYTE, rawdata);

    this.data = []

    for( let i = 0; i < rawdata.length; i+=4) {

        this.data[i/4] = {
            x: rawdata[i] / 255,
            y: rawdata[i+1] / 255,
            l: rawdata[i+2] / 255,
            z: rawdata[i+3] / 255,
        }
    }

    // console.log(this.data)
    return this
}


Surface.prototype.compute = function(){

    const texture = this.regl.texture(
        document.getElementById(this.sourceId)
    )


    const cpt = this.regl({

        vert: this.vertex,
        frag: this.fragment,

        viewport: {
            x: 0,
            y: 0,
            w: 600,
            h: 600
        },

        attributes: {
            position:
            [-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0]

            // [ -2, 0, 0, -2, 2, 2]
            ,
            tex_coords:
            [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]

        },

        uniforms : {
            u_resolution: [this.params.resX, this.params.resY],
            u_texture: texture,
            u_a: this.params.a,
            u_f: this.params.f,
        },

        count: 6
    })

    cpt()

    return this
}


export { Surface };
  