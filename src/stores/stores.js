import { writable } from 'svelte/store';


function createStore( params ) {

	const { subscribe, set, update } = writable( params )

	return {

        subscribe,

        update,

        tune: ( params )  => {
            update( s =>( { ...s, ...params } ) )
        }
	}
}

export const pictureStore = createStore({
  id: "pictureCanvas",
  x: -5,
  y: 10,
  width: 100,
  height: 100,
  brightness: 1,
  contrast: 0.1,
  saturation: 1,
  zoom: 0.4,
  blur: 0,
  invert: 0,
})

export const surfaceStore = createStore({
  x: 0,
  y: 0,
  resX: 100,
  resY: 100,
  width: 100,
  height: 100,
  q: 1,
  r: 1,
  pen_color: 0,
  paper_color: 1,
  structure: "net",
  path: 'one',
  pattern: 'frequency modulation',
  threshold: 0,
  ceiling: 1
})