<script>
  import { onMount } from "svelte"
  import { tweened } from "svelte/motion";
  import { quintOut } from "svelte/easing";
  import { createEventDispatcher } from 'svelte'
  import {fade } from 'svelte/transition'

  import { Surface } from "../libs/surfaceGL.js"
  import  { surfaceStore }  from "../stores/stores.js"
  import  { pictureStore }  from "../stores/stores.js"
  import  { gcodeStore }  from "../stores/stores.js"

  import { buildSVG } from '../libs/svgFuncs'
  import Fader from './Fader.svelte'
  import IconButton from './IconButton.svelte'
  import DragLogger from './DragLogger.svelte'


    let width = 210
    let height = 279
    let formula = $surfaceStore.formula
    let pathLength = 0
    /*nota:
    path options : zig = unique snake path along the x axis
        zag: unique snake path along the y axis
        darken_1st : unique path with sorting of vertices based on luminance, darkness to light
        lightnen_1st : unique path with sorting of vertices based on luminance, darkness to light
        random
    */

    let surface = new Surface()


    onMount( () => {

        surface.init('surfacePath', 'glCanvas', 'pictureCanvas')

        pictureStore.subscribe( s =>{
            surfaceStore.trig()
        })

        surfaceStore.subscribe( s => {
            surface.update( s )
            pathLength = surface.path.length
            formula = $surfaceStore.formula
        } )
        gcodeStore.subscribe( s => surface.update( {format: s.format } ) )

    })

    const dispatch = createEventDispatcher()

    const exportSVG = function(){
        const SVGstring = buildSVG( 
          surface.pathString,
          $gcodeStore.format.width,
          $gcodeStore.format.height,
          $gcodeStore.pen_stroke,
          "test"
        )
        dispatch('exportSVG', SVGstring ) 
    }


  const easedWidth = tweened(undefined, {
    duration: 1500,
    easing: quintOut,
  });

  const handleformula = e => {
      if (e.keyCode == 13){
        $surfaceStore.formula = formula
      }
  }


  $: width = height * $gcodeStore.format.width/$gcodeStore.format.height
  $: easedWidth.set( width )


</script>



<!-- STYLE -------------------------------------------------------- -->


<style>

    .surfaceView{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
    }

	.surface{
		padding: 0px;
		background-color: white;	
		border: 1px solid rgb(211, 211, 211);
        box-shadow: 1px 2px 4px rgba(0, 0, 0, .2);
      }
      
    .surface_params{
        background-color: rgb(237, 237, 237);
        width: 26vh;
        padding: 1em 0em 1em 1em;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin: 0px;
        margin-left: 10px;
        /* height: 100%; */
      }

    .surface_params_faders{
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        margin: 0px;
        padding: 0px;
    }

    .surface_params_pathFeedback{
        font-family: 'Cutive Mono', monospace;
        font-size: 0.85em;
        letter-spacing: -1px;
        align-self: flex-start;
        margin-top: 1em;
        margin-bottom: 1em;

    }

    
    label{
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    .savebutton{
        position: absolute;
        transform: translateY( -2.5em);
        z-index: 1010;
    }



   select{
        outline: none;
        font-size: 0.8em;
        font-family: abel, roboto;
        border: none;
        height:  1.8em;
        padding: 0px;
        margin: 0px;
        margin-left: 1em;
        display: inline-block;
        width :auto;
        background-color: whitesmoke;
    }

    option{
        padding: 0px;  
        margin: 0px;
    }

    .glview{
            width: calc(100% - 1em); 
            height: 3em;
            margin: 0px;
            padding: 0px;
            overflow: hidden;
    }

    .glview>span{
        font-family: 'Cutive Mono', monospace;
        font-size: 0.9em;
        letter-spacing: -1px;
    }

    .surface_formula{
        margin-top: 0.5em;
        display: flex;
        flex-direction: row;
    }

    .surface_formula>label{
        display: inline;
        margin: 0.2em 0.5em 0.2em 0em;
    }
    #formula{
        background-color: rgb(255, 255, 255);
        color: rgb(0, 0, 0);
        /* padding: 0.5em; */
        font-family: roboto, monospace;
        font-size: 0.85em;
        margin: 0px;
        width: 100%;
        height: 2em;
        resize: none;
        border: 0px solid transparent;
    }

    #formula:focus{
        border: 0px solid transparent;
        box-shadow: transparent;
        outline: none;

    }
</style>


<!-- pseudoHTML -------------------------------------------------------- -->
<!-- https://oreillymedia.github.io/Using_SVG/guide/units.html } -->
<div>
    <div class="surfaceView" in:fade>

        <div class="surface"
            bind:clientHeight={height}
            style="
                width: {$easedWidth};
                height: 70vh;
            "
            
        >
            <DragLogger bind:x={$surfaceStore.x} bind:y={$surfaceStore.y}/>

            <svg id="surfacesvg"

                width = {$easedWidth}
                height = {height}
                viewBox = "0, 0, {$gcodeStore.format.width}, {$gcodeStore.format.height}"
                style="
                background-color:{$gcodeStore.paper_color};
                "
                >

                    <path id='surfacePath'
                        style="
                            fill : none;
                            stroke-width: {$gcodeStore.pen_stroke};
                            stroke : {$gcodeStore.pen_color};
                            stroke-opacity:{ $gcodeStore.pen_opacity};
                        "
                        d={
                            surface.pathString ||
                        "M0 0 L{$gcodeStore.format.width} {$gcodeStore.format.height/2} L{$gcodeStore.format.width/2} {$gcodeStore.format.height} Z"
                        }
                        />

            </svg>
            
            <div class="savebutton">
                <IconButton
                iconUrl="./assets/icons/export.png"
                on:action={ ()=>exportSVG()}
                tip="Export SVG"
                size= "1.2em"
                opacity="0.4"
                />
            </div>
        </div>

        <div class="surface_params">

            <div class="surface_params_faders">
                <Fader
                name="resX"
                label="res_x"
                range={{min: 2, max: $gcodeStore.format.width * 2}}
                step={1}
                bind:value={$surfaceStore.resX}
                />

                <Fader
                name="resY"
                label="res_y"
                range={{min: 2, max: $gcodeStore.format.height}}
                step={1}
                bind:value={$surfaceStore.resY}
                />
                
                <Fader
                name="threshold"
                label="floor"
                range={{min: 0, max: 1}}
                step={0.01}
                bind:value={$surfaceStore.threshold}
                />
                
                <Fader
                name="ceiling"
                label="ceil."
                range={{min: 0, max: 1}}
                step={0.01}
                bind:value={$surfaceStore.ceiling}
                />

                <Fader
                name="crop"
                label="crop"
                range={{min: 0, max: 1}}
                step={0.01}
                bind:value={$surfaceStore.crop}
                />

                <div class="surface_params_pathFeedback">
                    <span >path_length: {pathLength}_pts</span>
                </div>
                
                <Fader
                name="a"
                label="__a"
                range={{min: -1, max: 1}}
                step={0.001}
                bind:value={$surfaceStore.a}
                />

                <Fader
                name="f"
                label="__f"
                range={{min: 1, max: 1000}}
                step={1}
                bind:value={$surfaceStore.f}
                />

                <Fader
                name="scale"
                label="scale"
                range={{min: 0.25, max: 1.5}}
                step={0.01}
                bind:value={$surfaceStore.scale}
                />

                
            </div>
                
                <div class="glview" >
                    <span>gpu_ops.:</span>
                    <canvas id="glCanvas" 
                    style="
                    width: 600px;
                    height: 600px;
                    transform: translate(-165px, -245px) scale(0.45, {-1/6});
                    "
                    ></canvas>
                </div>
        </div>
            
        
        
        
    </div>

    <div class = "surface_formula">
        <label for="formula">magick: </label>
            <input type="text" name="formula" id="formula" bind:value={formula} on:keydown="{handleformula}">
    </div>

</div>