<script>
  import { tweened } from "svelte/motion";
  import { quintOut } from "svelte/easing";

  export let x = 0;
  export let y = 0;
  export let timing = 900;

  const easedX = tweened(0, {
    duration: timing,
    easing: quintOut,
  });

  const easedY = tweened(0, {
    duration: timing,
    easing: quintOut,
  });


  let dragRef = { x, y };
  let locked = false;
  let width = 100;
  let height = 100;

  function mousedown(e) {
    locked = true;
    dragRef = { x: e.x / width - x, y: e.y / height - y };
  }

  function mouseup(e) {
    locked = false;
  }

  function drag(e) {
    if (locked) {
      easedX.set( (e.x / width) - dragRef.x )
      easedY.set( (e.y / height) - dragRef.y )
    }

  }

  $: x = $easedX
  $: y = $easedY

</script>

<style>
  .dragzone {
    margin: none;
    padding: none;
    opacity: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 1000;
    cursor: grab;
  }
</style>

<div
  class="dragzone"
  bind:clientWidth={width}
  bind:clientHeight={height}
  on:mousedown={mousedown}
  on:mouseup={mouseup}
  on:mouseout={mouseup}
  on:mousemove={drag}>
  <slot />
</div>
