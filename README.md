# Surface Projection
(work in progress)


Svelte app to map pictures to SVG paths prepared to be send to a pen plotter.

This turns out to be some kind of oneliner with a bunch of parameters to generate a crazy SVG from a picture.

Inspired by Paul Butler's [article](https://nb.paulbutler.org/surface-projection/).


## Dependencies :
*  svelte app template
*  SvgSaver.js
*  Filesaver.js



## to do :
*  ui load project
*  feedback/callback "tipslike" on button "save project"
*  load image from url / local
*  on the fly evaluation of the formula
*  svg to gcode translation
*  gcode ui :   *  paper color
                *  pen color
                *  paper size
                *  begin / end / pen up / pen down commands
                *  drawing speed & translate speed

*  estimation of path length in millimeters -> estimation of drawing time
*  refactoring of suface object for easy path calculation / easy vertices structure / easy drawing pattern
*  appropriate handling of SVG control points coordinate for consistent result from screen to paper (handle correctly scale)
