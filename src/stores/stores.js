import { writable, derived } from 'svelte/store';

const createStore = function( object ) {

	const { subscribe, set, update } = writable( object )

	return {

        subscribe,

        set,

        update,

        tune: ( newparams )  => {

            update( s =>( { ...s, ...newparams } ) )
        },

        trig: ()=>{update( s => s)}
	}
}

export const pictureStore = createStore( {
    imgUrl: "./assets/images/EM-portrait2.jpg",
    x : 0,
    y : 0,
    brightness: 1.0,
    contrast: 1.0,
    saturation: 1.0,
    blur: 0,
    zoom: 1.0,
    invert: 0.0,
} )

export const surfaceStore = createStore({
    x: 0,
    y: 0,
    resX: 7,
    resY: 7,
    scale: 0.7,
    crop: 0,
    a: 0,
    f: 0,
    threshold: 0,
    ceiling: 1,
    formula: 'sin(i/(w*h) * PI * (l*w/2.)) * a',
    structure: "net",
    path: 'zig',
})

export const gcodeStore = createStore({
    title: "surface_projection_store",
    pen_color: "#000000",
    pen_stroke: 0.5,
    pen_opacity: 1,
    format: {name:"sLTR", width: 216, height: 260},
    paper_color: "#FFFFFF",
    gcode_cmds: {
        drawing_speed: 5000,
        translate_speed: 10000,
        begin:"(BEGIN);G17;G90;G00 Z1;G00 X0 Y0;",
        pen_up:";(PEN_UP);G00 Z0.25;M03 S80;G01 F10000;(TRANSLATE)",
        pen_down:";(PEN_DOWN);G01 Z0 F1000;M05;G04 P0.20000000298023224;G01 F5000;(DRAW)",
        end:";(END);G00 Z0.25;M3S80;G04 P0.20000000298023224;(HOME);G00 X0 Y0 F10000;",
    }
})

export const projectStore = derived(
    [pictureStore, surfaceStore, gcodeStore],
    ( ([$pictureStore, $surfaceStore, $gcodeStore]) => (
        { ...{picture: $pictureStore, surface: $surfaceStore, gcode: $gcodeStore } }
        )
    )
)