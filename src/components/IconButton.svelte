<script>
	import { createEventDispatcher } from 'svelte';

    export let iconUrl = "./assets/icons/save.png";  
    export let tip = "This button has an action";
    export let size = "1.4em";

    const dispatch = createEventDispatcher();

    const action = () => {  dispatch('action') };

</script>

<!-- STYLE -------------------------------------------------------- -->
<style>
  .IconButton {
    margin: 0.5em;
    display: inline-block;
    padding: none;
    opacity: 0.7;
  }
  button {
    border: none;
    text-align: center;
    text-decoration: none;
    border-radius: 50%;
    box-shadow: 1px 2px 4px rgba(180, 180, 180, 180);
    padding: 0px;
  }

  button:hover {
      filter: invert(1) opacity(0.3)
  }
  button:active {
      filter: invert(1)
  }

  button>img{
      width:100%;
      height: 100%;
      margin: none;
      padding: none;
      display: block;
  }

</style>

<!-- pseudoHTML -------------------------------------------------------- -->
<div class="IconButton"
    style= "width:{size}; height:{size};"
>
    <button type="submit" on:click={action}>
        <img src={iconUrl} alt={tip}/>
    </button>
</div>
