# Surface Projection
(work in progress)


Svelte app to map pictures to SVG paths prepared to be sent as GCODE to a pen plotter.

This turns out to be some kind of oneliner with a bunch of parameters to generate a crazy SVG from a picture.

Inspired by Paul Butler's [article](https://nb.paulbutler.org/surface-projection/).


## Dependencies :
*  Svelte app classic [template](https://github.com/sveltejs/template)
*  [SvgSaver.js](https://github.com/Hypercubed/svgsaver)
*  [Filesaver.js](https://github.com/eligrey/FileSaver.js)



## to do :
*  refactoring of surface object for easy path calculation / easy vertices structure / easy drawing pattern
*  refactoring of surface object to send all the computation to the graphic card
*  on the fly evaluation of the oneliner formula in a fragment shader
*  temporisation of mouse drag input events to prevent over-computing
*  eased transition on changes (projects bar, playground div, svg canvas format, picture canvas format)
*  surface ui :
    *    svg zoom at real scale for convenient exploration of the path
*  projects bar : delete a project
*  svg to gcode translation
*  gcode ui :
    *    begin / end / pen up / pen down commands
    *    drawing speed & translate speed
*  estimation of path length in millimeters -> estimation of drawing time
*  presentation mode (show drawing only at maximum available size)
*  button tooltips improvement

### to do v2
* multilayering
* map the plotter feed command along specific aspect of the picture
* map dwell command along specific aspect of the picture
* map z command along specific aspect of the picture
