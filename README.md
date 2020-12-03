# Surface Projection
(work in progress)


Svelte app to map pictures to SVG paths prepared to be sent as GCODE to a pen plotter.

This turns out to be some kind of oneliner with a bunch of parameters to generate a crazy SVG from a picture.

Inspired by Paul Butler's [article](https://nb.paulbutler.org/surface-projection/).


## Dependencies :
*  Svelte app classic [template](https://github.com/sveltejs/template)
*  [Filesaver.js](https://github.com/eligrey/FileSaver.js)
*  [regl](https://github.com/regl-project/regl)


## to do :
*  gcode ui :
    *    begin / end / pen up / pen down commands
    *    drawing speed & translate speed
*  estimation of path length in millimeters -> estimation of drawing time
*  svg to gcode translation + export gcode
*  projects bar : delete a project / export-import projects (json files outside of local storage)
*  load a picture from "store" (that was previously used for a another project currently in the storage)
*  button tooltips improvement
*  presentation mode (show drawing only at maximum available size)
*  svg zoom at real scale for convenient exploration of the path
*  formula code checking 
*  isolate pieces of code that can be convert to component for later use

### to do v2
* multi-layer drawings with "concat" option
* map the plotter feed, dwell & z command along specific aspect of the picture