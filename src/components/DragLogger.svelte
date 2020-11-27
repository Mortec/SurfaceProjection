<script>
  import { tweened } from "svelte/motion";
  import { quintOut } from "svelte/easing";
 

  export let x = 0;
  export let y = 0;
  export let z = 1000;
  export let timing = 900;

  let easedX, easedY, dragRef
  let locked = false;
  let width, height = 100;

  easedX = tweened( 0, {
      duration: timing,
      easing: quintOut,
  });

  easedY = tweened( 0, {
      duration: timing,
      easing: quintOut,
  });

  
  function lock(e) {
    locked = true;
    dragRef = { x: e.x - $easedX, y: e.y - $easedY };
  }

  function unlock(e) {
    locked = false;
  }

  function drag(e) {
    if (locked) {
      easedX.set( e.x - dragRef.x ) 
      easedY.set( e.y - dragRef.y ) 
    }
  }

  $: x += $easedX/width - x
  $: y += $easedY/height - y

</script>

<style>
  .dragzone {
    margin: none;
    padding: none;
    opacity: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    cursor: grab;
  }
</style>

<div
  class="dragzone" z-index={z}
  bind:clientWidth={width}
  bind:clientHeight={height}
  on:mousedown={lock}
  on:mouseup={unlock}
  on:mouseout={unlock}
  on:mousemove={drag}>
</div>
