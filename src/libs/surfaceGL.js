import {surfaceStore} from '../stores/stores.js'
import reglWrapper from 'regl'


const regl = reglWrapper(
    'gl',
    {extensions: ['oes_texture_float', 'oes_texture_float_linear']}
)

const vert=`
precision mediump float;

attribute vec2 a_position;
varying vec2 v_texcoord;

void main() {
    v_texcoord = 1. - a_position;
    gl_Position = vec4(1.0 - 2.0 * a_position, 0, 1);
}
`

const frag=``

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
        a_position : new Float32Array([ -2, 0,   0, -2,   2, 2]),
    },

    uniforms : {
        u_resX: $surfaceStore.resX,
        u_resY: $surfaceStore.resY,
        u_texture: ()=>{ getTexture( 'pictureCanvas' )},
        u_scale: $surfaceStore.scale,
        u_f: $surfaceStore.f,
        u_a: $surfaceStore.a,
    }
})