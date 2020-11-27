import {surfaceStore} from '../stores/stores.js'
import reglWrapper from 'regl'


const regl = reglWrapper(
    'gl',
    {extensions: ['oes_texture_float', 'oes_texture_float_linear']}
)

const vert=`
precision mediump float;

attribute vec2 a_position;

void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const frag=`
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform sampler2D u_texture;
uniform float u_scale;
uniform float u_f;
uniform float u_a;


void compute ( vec2 positions, sampler2D texture, float f, float a, float scale ){

    float x = positions.x;
    float y = posittions.y;
    float i = y * u_resolution.x + x;
    float l = ( texture.r + texture.g + texture.b ) / 3.0;
    float resX = u_resolution.x;
    float resY = u_resolution.y;
    
    float z = sin( i/(resX * resY) * PI * ( l * resX/2 ) ) * a;

    return vec4( x * scale, y * scale, l, z);
}

void main() {
    vec2 positions = gl_FragCoord.xy/u_resolution;
	gl_FragColor = compute( positions, u_texture, u_f, u_a);
}
`

const getTexture = (id) => {
    const context2D = document.getElementById( id ).getContext('2d')
    return regl.texture(context2D)
}

const compute =  regl({

    vert: vert,
    frag: frag,

    viewport: {
        x: 0,
        y: 0,
        w: $surfaceStore.resX,
        h: $surfaceStore.resY
    },

    attributes: {
        a_position : new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0])
    },

    uniforms : {
        u_resolution: new Float32Array([$surfaceStore.resX,$surfaceStore.resY]),
        u_texture: ()=>{ getTexture( 'pictureCanvas' )},
        u_scale: $surfaceStore.scale,
        u_f: $surfaceStore.f,
        u_a: $surfaceStore.a,
    }
})