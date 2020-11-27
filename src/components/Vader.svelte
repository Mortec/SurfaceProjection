
<script>
  //a vader is a vertical fader....

    import { createEventDispatcher } from 'svelte';
 
    export let id = Date.now() + Math.random();
    export let label = "vadr" //name as it appear in the ui
    export let name = "vader" ///programmatic name
    export let value = "0.5"
    export let range = {min: 0.0, max: 1.0}
    export let step = 0.01
    
    const dispatch = createEventDispatcher();

    $: dispatch( 'input', { name: name, value: value } )


</script>

<!-- STYLE -------------------------------------------------------- -->
<style>

    .vader{
      width: 40px;
      height: 100%;
      display: flex;
      /* border: 1px solid red; */
      overflow: hidden;
    }

   .vader-container{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      transform-origin: 50% 50%;
      -webkit-transform: rotate(-90deg);
      -moz-transform: rotate(-90deg);
      -o-transform: rotate(-90deg);
      transform: rotate(-90deg);
      height:100%;
      position: relative;
      left: calc( -190px/2 - 20px);
      bottom: 25px;  
   }

   .label-container{
     width: 100%;
     height: 100%;
     display: flex;
     flex-direction: column;
     justify-content: flex-end;
     align-items: center;
     float: left;

   }

   label{
    padding: 0px;
    margin: 0px;
    text-align: center;
    width: 4em;
    height: 1em;
    padding: 4px;
  }

  input[type=number]{
    text-align: center;
    border-radius: 0px;
    font-size: 0.9em;
    width: 7ch;
    height: 1em;
    outline: none;
  }
  label > span{
    text-align: center;
    width: 4em;
    margin: 0;
    padding: 0;
    -webkit-transform: rotate(90deg);
    -moz-transform: rotate(90deg);
    -o-transform: rotate(90deg);
    transform: rotate(90deg);
  }
  input{
    border: none;
    padding: 0px 0px 0px 0px;
    background-color: transparent;
  }

  /* https://www.cssportal.com/style-input-range/ */
  input[type=range] {
    -webkit-appearance: none;
    width: 180px;

  }

  input[type=range]:focus {
    outline: none;
  }
  input[type=range]::-webkit-slider-runnable-track {
    width: 100%;
    height: 2px;
    cursor: pointer;
    animate: 0.2s;
    box-shadow: 0px 0px 1px #000000;
    background: #C9C9C9;
    border-radius: 2px;
    border: 0px solid #000000;
  }
  input[type=range]::-webkit-slider-thumb {
    box-shadow: 0px 0px 1px #000000;
    border: 0px solid #B1C8E3;
    height: 6px;
    width: 24px;
    border-radius: 20px;
    background: #283440;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -2px;
  }
  input[type=range]:focus::-webkit-slider-runnable-track {
    background: #C9C9C9;
  }
  input[type=range]::-moz-range-track {
    width: 100%;
    height: 2px;
    cursor: pointer;
    animate: 0.2s;
    box-shadow: 0px 0px 1px #000000;
    background: #C9C9C9;
    border-radius: 2px;
    border: 0px solid #000000;
  }
  input[type=range]::-moz-range-thumb {
    box-shadow: 0px 0px 1px #000000;
    border: 0px solid #B1C8E3;
    height: 6px;
    width: 24px;
    border-radius: 20px;
    background: #283440;
    cursor: pointer;
  }
  input[type=range]::-ms-track {
    width: 100%;
    height: 2px;
    cursor: pointer;
    animate: 0.2s;
    background: transparent;
    border-color: transparent;
    color: transparent;
  }
  input[type=range]::-ms-fill-lower {
    background: #C9C9C9;
    border: 0px solid #000000;
    border-radius: 4px;
    box-shadow: 0px 0px 1px #000000;
  }
  input[type=range]::-ms-fill-upper {
    background: #C9C9C9;
    border: 0px solid #000000;
    border-radius: 4px;
    box-shadow: 0px 0px 1px #000000;
  }
  input[type=range]::-ms-thumb {
    margin-top: 1px;
    box-shadow: 0px 0px 1px #000000;
    border: 0px solid #B1C8E3;
    height: 6px;
    width: 24px;
    border-radius: 20px;
    background: #283440;
    cursor: pointer;
  }
  input[type=range]:focus::-ms-fill-lower {
    background: #C9C9C9;
  }
  input[type=range]:focus::-ms-fill-upper {
    background: #C9C9C9;
  }
</style>



<!-- pseudoHTML -------------------------------------------------------- -->
<div class="vader" {id}>

  <div class="label-container">
  <input type="number" name={name} bind:value={value} min={range.min} max={range.max} {step}>
  <label for={name}> <span>{label}</span></label>
  </div>

  <div class="vader-container" >
    <input type="range" name={name} bind:value={value} min={range.min} max={range.max} {step}>
  </div>


</div>