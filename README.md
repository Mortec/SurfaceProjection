# Surface Projection
(work in progress)


Svelte app to map pictures to SVG paths prepared to be sent to a pen plotter.

This turns out to be some kind of oneliner with a bunch of parameters to generate a crazy SVG from a picture.

Inspired by Paul Butler's [article](https://nb.paulbutler.org/surface-projection/).


## Dependencies :
*  Svelte app classic [template](https://github.com/sveltejs/template)
*  [SvgSaver.js](https://github.com/Hypercubed/svgsaver)
*  [Filesaver.js](https://github.com/eligrey/FileSaver.js)



## to do :
*  appropriate handling of SVG control points coordinates for consistent result from screen to paper (correct handling of scale)
*  drop out svg saver for custom made svg files
*  refactoring of surface object to send all the computation to the graphic card
*  on the fly evaluation of the oneliner formula in a fragment shader
*  refactoring of surface object for easy path calculation / easy vertices structure / easy drawing pattern
*  load image from url || local
* temporisation of mouse drag input to prevent over-computing
* surface ui :
    *    pen color / opacity / stroke
    *    paper size
    *    paper color
*  svg to gcode translation
* gcode ui :
    *    begin / end / pen up / pen down commands
    *    drawing speed & translate speed
*  estimation of path length in millimeters -> estimation of drawing time
* presentation mode (show drawing only at maximum available size)
* eased transition on changes (projects bar, playground div, svg canvas format, picture canvas format)

### to do v2
* multilayering
* control point selection for specific gcode commands editing