# Surface Projection
(work in progress)


Svelte app to map pictures to SVG paths then prepared to be sent as GCODE to a pen plotter.

This turns out to be some kind of oneliner with a bunch of parameters to generate a crazy SVG from a picture.

Inspired by Paul Butler's [article](https://nb.paulbutler.org/surface-projection/).


## Dependencies :
*  Svelte app [template](https://github.com/sveltejs/template)
*  [Filesaver.js](https://github.com/eligrey/FileSaver.js)
*  [regl](https://github.com/regl-project/regl)
*  [lodash](https://lodash.com/)

## to do :
*  path to gcode translation with speed mapping along lum.
*  estimation of path length in millimeters -> estimation of drawing time
*  export-import projects (json files outside of local storage)
*  load a picture from storage (that was previously used for a another project currently in the storage)
*  presentation mode (show drawing at real scale for convenient exploration of the path)

### to do v2
* multi-layer drawings with "concat" option
*  map the plotter dwell & z command along specific aspect of the picture