import reglWrapper from 'regl'


const Surface = function () {

    this.params = {
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
      formula: 'sin(i/(w*h) * PI * (l*w/2.)) * a',
      structure: "net",
      path: 'zig',
    };

    this.svgId = 'surfacePath'
    this.glId = 'glCanvas'
    this.textureSrcId = 'pictureCanvas'
    this.data = [];
    this.path = [];
    this.pathString = "M0, 0 L216 130, L108, 230 Z";
    this.regl =  {}
};
  


Surface.prototype.init = function( svgId, glId, textureSrcId ){

    if (svgId) this.svgId = svgId
    if (glId) this.glId = glId
    if (textureSrcId) this.textureSrcId = textureSrcId

    const glcanvas = document.getElementById( this.glId )
    glcanvas.getContext('webgl').canvas.width = 600
    glcanvas.getContext('webgl').canvas.height = 600

    this.regl = reglWrapper(
        {canvas: glcanvas,
        extensions: ['oes_texture_float', 'oes_texture_float_linear']
        }
    )
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


//https://stackoverflow.com/questions/48288154/pack-depth-information-in-a-rgba-texture-using-mediump-precison

Surface.prototype.fragment = function( formula ){


    return`
    #define PI 3.1415926535897932384626433832795
    precision mediump float;
    varying vec2 coords;
    uniform sampler2D u_texture;
    uniform vec2 u_resolution;
    uniform float u_a;
    uniform float u_f;
    const vec4 bitEnc = vec4(1.,255.,65025.,16581375.);
    const vec4 bitDec = 1./bitEnc;


    vec2 PackDepth16( float depth ) {
        float depthVal = depth * (256.0*256.0 - 1.0) / (256.0*256.0);
        vec3 encode = fract( depthVal * vec3(1.0, 256.0, 256.0*256.0) );
        return encode.xy - encode.yz / 256.0 + 1.0/512.0;
    }

    vec2 compute( vec4 tex, vec2 coords){

        float a = u_a;
        float f = u_f;
        float w = u_resolution.x;
        float h = u_resolution.y;
        float x = floor( coords.x * w );
        float y = floor( coords.y * h );
        float i = coords.x + ( w * coords.y );
        float l = (tex.r + tex.g + tex.b) / 3.;

        float z = ${ formula };
         
        return vec2( l, (z+1.) / 2.);
    }


    void main() {
        
        vec2 st = gl_FragCoord.xy/u_resolution;
        vec4 tex = texture2D( u_texture, st);
        vec2 res = compute(tex, st);

	    gl_FragColor = vec4( PackDepth16(res.x).rg, PackDepth16(res.y).rg);
    }
`
}


Surface.prototype.compute = function(){

    const texture = this.regl.texture(
        document.getElementById(this.textureSrcId)
    )

    const cpt = this.regl({

        vert: this.vertex,
        frag: ()=>this.fragment(this.params.formula),

        viewport: {
            x: 0,
            y: 0,
            w: 600,
            h: 600
        },

        attributes: {
            position:
            [-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0]
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

//https://stackoverflow.com/questions/48288154/pack-depth-information-in-a-rgba-texture-using-mediump-precison

Surface.prototype.getData = function(){

    const rawdata =  new Uint8Array(this.params.resX * this.params.resY * 4)
    const gl = document.getElementById( this.glId ).getContext('webgl')
    gl.readPixels(0, 0, this.params.resX, this.params.resY, gl.RGBA, gl.UNSIGNED_BYTE, rawdata);

    this.data = []

    for( let i = 0; i < rawdata.length; i+=4 ) {

        this.data[i/4] = {
            x: (i/4)%this.params.resX / (this.params.resX) + (1/this.params.resX/2),
            y: Math.floor( i/ 4 / this.params.resX) / (this.params.resY ) + (1/this.params.resY/2),
            l: (rawdata[i] + rawdata[i+1]/256)  / 256,
            z: (rawdata[i+2] + rawdata[i+3]/256) / 256 - 0.5,
        }
    }

    return this
}

  
Surface.prototype.computePath = function () {
  
    const newPath = [];

    // data.sort( (a, b) => a.l - b.l )

    this.data.forEach((e, i) => {
      const scaleOffset = (1-this.params.scale)/2
      e.x = e.x * this.params.scale + scaleOffset + this.params.x;
      e.y = (e.y + e.z) * this.params.scale + scaleOffset + this.params.y;

      if (
          e.l <= this.params.ceiling &&
          e.l >= this.params.threshold &&
          e.y >= 0 &&
          e.y < (1 - this.params.crop) &&
          e.x >= 0 &&
          e.x < 1
      ) {

          //(snake unique path)
          const yCount = Math.floor(i / this.params.resX);
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

        const X = this.data[e].x

        const Y = this.data[e].y 

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

      const pathElement = document.getElementById( this.svgId )
      pathElement && pathElement.setAttribute('d', this.pathString)
    }

    return this;
}



export { Surface };
  