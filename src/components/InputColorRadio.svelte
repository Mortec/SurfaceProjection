<script>
    export let id="none"
    export let name="some"
    export let value="#000000"
    export let radius="50%"
    export let size= "1em"
    export let group="many"
    export let checked = false

    $: checked = group === value

</script>


<style>

    .color-radio-container{
        margin:0.5em;
        margin-left: 0.5em;
        margin-bottom: 0px;
        padding: none;
        overflow: hidden;
        display: inline-block;
        background-color: transparent;
    }
    .color-radio{
        width: 100%;
        height: 100%;
        padding: none;
        margin: none;
    }

    input[type = "radio"]{
        margin: none;
        padding: none;
        opacity: 0;
        position: absolute;
    }

</style>


<div class="color-radio-container"
    style="
        width: {size};
        height: {size};
        border: 1px solid {value};
        border-radius: {radius};
        "
>

        <div class="color-radio"
            style="
                background-color: {value};
                opacity: { checked*0.8 + 0.2 };
                border-radius: {radius};
            "
        >

            <input type="radio" {id} {name} {value} bind:group={group}/>

        </div>

</div>