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
*  appropriate handling of SVG control points coordinate for consistent result from screen to paper (correct handling of scale)
*  refactoring of surface object for easy path calculation / easy vertices structure / easy drawing pattern
*  refactoring of surface object to send all the computation on the graphic card
*  on the fly evaluation of the formula in a fragment shader
*  load image from url || local
* temporisation of mouse drag input to prevent computing
* surface ui :
    *    paper color
    *    pen color
    *    paper size
* gcode ui :
    *    begin / end / pen up / pen down commands
    *    drawing speed & translate speed
*  svg to gcode translation
*  estimation of path length in millimeters -> estimation of drawing time
* presentation mode (show drawing only at maximum available size)

### to do v2
* multilayering
* control point selection for gcode command editing