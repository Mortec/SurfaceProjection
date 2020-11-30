<script>
	import PictureView from "./components/PictureView.svelte";
	import SurfaceView from "./components/SurfaceView.svelte";
	import IconButton from "./components/IconButton.svelte";
	import { projectStore } from './stores/stores'
	import { get } from 'svelte/store';
	import { onMount } from "svelte"
	import { defaultProject, defaultProjects } from './configs/default.js'
	import { saveAs } from 'file-saver';	
	import { fly, fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { tweened } from "svelte/motion";
  	import { quintOut } from "svelte/easing";

	let title = 'none'
	let currentProject, projects
	let showprojects = false

	let saveStatus = "waiting"

	currentProject = { ...defaultProject }

	// projects = localStorage.length ?
	// 				JSON.parse( localStorage.getItem( 'projects' ) )
	// 				:
	// 				{...defaultProjects};
	
	projects = {...defaultProjects};

  	const saveProject = ()=>{
		currentProject = {...currentProject, ...get(projectStore) }
		currentProject.title = title
		projects.projects = projects.projects.filter( p => p.title != currentProject.title )
		projects.projects.push( currentProject )
		projects.last_project_title = currentProject.title
		localStorage.setItem( 'projects', JSON.stringify( projects ) )
		saveStatus = "success"
	}
  
  	const loadProject = ( loadtitle )=>{
	  const loadedProject = projects.projects.filter( p => p.title === loadtitle )[0]
	  currentProject = { ...currentProject, ...loadedProject }	
	  title = currentProject.title
	}

  	onMount( ()=>{

	  loadProject( projects.last_project_title )
	} )
 
	const exportSVG = function ( message ){

		const blob = new Blob([ message.detail ], {type: "text/plain;charset=utf-8"});
		const format = currentProject.surface.format.name
    	saveAs(blob, title + "_" + format + ".svg");  
	}

	const exportPNG = function(){

		const canvas = document.querySelector("#pictureCanvas");
		const format = currentProject.surface.format.name
		canvas.toBlob(function(blob) {
    		saveAs(blob, title + "_" + format +".png");
		})
	}

	const exportGCODE = ( message )=>{
		
		const blob = new Blob([ message.detail ], {type: "text/plain;charset=utf-8"});
		const format = currentProject.surface.format.name
		saveAs(blob, title + "_" + format + ".nc");
	}

	const easedBar = tweened( 0, {
		duration: 1500,
		easing: quintOut,
	});


	$: easedBar.set( showprojects*1 )

</script>

<!-- STYLE -------------------------------------------------------- -->

<style>

	.container{
		width: 100%;
		height: 100%;
	}

	header {
		margin: 0px;
		padding-top: 1em;
		padding-left: 3em;
		height: 8vh;
	}
	
	h1 {
	  font-size: 1.6em;
	  margin: 0px;
	  padding:0px;
	  font-family: "Cutive Mono", monospace;
	  letter-spacing: -3px;
	}

	main{
		width: 100%;
		height: 83vh;
		display: flex;
		flex-direction: row;
		justify-content:space-between;
	}
	
	nav {
		display: block;
		margin: 0px;
		padding: 0px;
		background-color: white;
		overflow-y: scroll;
		height: 100%;
	}

	.loadbutton_container{
		margin: 0.12em;
		display: flex;
		justify-content: center;
	}

	.projects_list{
		padding-top: 1em;
		padding-bottom: 1em;
	}

	.projects_list>ul{
		list-style-type: none;
		padding: 0px;
		margin: 0px;
		margin-left: 1em;;
	}

	.projects_list>ul>li{
		padding: 0.2em;
		margin: 0px;
		margin-top: 1em;
		cursor:pointer;
		width:100%;
	}

	.projects_list>ul>li:hover{
		background-color: rgb(225, 225, 225);
	}

	.playground {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: space-around;
		padding-top: 1em;
		padding-left: 3em;
		height: 100%;
		width: 100%;
		position: relative;
	}

  	footer {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-end;
		height: auto;
		padding-right: 2em;
	}

	.gcode {
		display: flex;
		flex-direction: column;
		align-items:center;
		justify-self: flex-start;
		align-self: flex-start;
		margin: 0px;
		padding: 0px;
	}

	.title{
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-self: flex-start;
		align-self: flex-start;
		margin: 0px;
	}

	input[type="text"] {
		font-family: "Cutive Mono", monospace;
		letter-spacing: -1px;
		margin: 1em;
		height: 1.5em;
		border: none;
	}

	input[type="text"]:focus {
		outline: none;
	}

	.colophon{
		color: #bbb;
		font-size:0.9em;
	}

	.colophon>a{
		color: #bbb;
	}
</style>


<!-- pseudoHTML -------------------------------------------------------- -->

<div class="container">
	
	<header>
		<h1>{title}</h1>
	</header>
	<main>

		<nav class="projects-menu">
			<div class="loadbutton_container">
				<IconButton
				iconUrl="./assets/icons/load.png"
				on:action={()=> showprojects = !showprojects}
				tip="Projects"
				size="1.7em"
				/>
			</div>

			<div style="width: calc( 13vw * {$easedBar});">
			{#if showprojects}
			<div class="projects_list"
			in:fly="{{ x: -100, duration: 1000, delay: 500 }}"
			out:fly="{{ x: -100, duration: 800 }}"
			>
				<ul>
					{#each projects.projects as p, index (p)}
					<li on:click={()=>loadProject(p.title)}
						transition:fade
						animate:flip="{{ delay: 1000 }}"
					> 
						{p.title}
					</li>
					{/each}
				</ul>
			</div>
			{/if}
		</div>
		</nav>

		<div class="playground">
			<PictureView params={currentProject.picture} on:exportPNG={exportPNG} />
			<SurfaceView params={currentProject.surface} on:exportSVG={exportSVG}/>

 			
			<div class="gcode" style = "width: 28vh;"> 
				<div class="title"> 
					<label for="title">title:</label>
					<input type="text" bind:value={title} />
				</div>

				<div class="save" style="align-self: flex-end;" >
					<IconButton iconUrl="./assets/icons/save.png"
					on:action={saveProject}
					bind:status={saveStatus}
					tip= "Save project"
					tipsuccess="Project saved"
					tiperror="error while saving, please retry"
					/>	
				</div>

				<div class="glview" style="
					width: 100%; 
					height: 100px;
					border:	 1px solid red;
					
				">
					<canvas id="glcanvas" 
					style="
					width: 600px;
					height: 600px;
					
					"
					></canvas>
				</div>
			</div>




		</div>

	</main>
	<footer>
		<p class="colophon">
		surface_projection © <a href="https://www.edouardmortec.com.com">mortec</a> lockdown 2020
		</p>
	</footer>
</div>
