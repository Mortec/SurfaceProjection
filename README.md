# Surface Projection
(work in progress)


Svelte app to map pictures to SVG paths prepared to be send to a pen plotter.

This turns out to be some kind of oneliner with a bunch of parameters to generate a crazy SVG from a picture.

Inspired by Paul Butler's [article](https://nb.paulbutler.org/surface-projection/).


## Dependencies :
*  Svelte app classic [template](https://github.com/sveltejs/template)
*  [SvgSaver.js](https://github.com/Hypercubed/svgsaver)
*  [Filesaver.js](https://github.com/eligrey/FileSaver.js)



## to do :
*  ui load project
*  feedback/callback "tipslike" on button component
*  load image from url || local
*  on the fly evaluation of the formula
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
*  refactoring of surface object for easy path calculation / easy vertices structure / easy drawing pattern
*  appropriate handling of SVG control points coordinate for consistent result from screen to paper (correct handling of scale)
* presentation mode (show drawing only at maximum available size)