import { writable } from 'svelte/store';
import {Picture} from '../libs/picture.js'

const createStore = function( object ) {

	const { subscribe, set, update } = writable( object )

	return {

        subscribe,

        update,

        tune: ( newparams )  => {

            update( s =>( { ...s, ...newparams } ) )
        }
	}
}

export const pictureStore = createStore( {
    id: "null",
    x : 0,
    y: 0,
    width: 100,
    height: 100,
    brightness: 1.0,
    contrast: 1.0,
    saturation: 1.0,
    blur: 0,
    zoom: 1.0,
    invert: 0.0
} )

export const surfaceStore = createStore({
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  resX: 100,
  resY: 100,
  q: 1,
  formula: 'y',
  structure: "net",
  threshold: 0,
  ceiling: 1,
  path: 'one',
  paper_color: 1,
  pen_color: 0,
})