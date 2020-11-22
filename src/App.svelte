<script>
  import PictureView from "./components/PictureView.svelte";
  import SurfaceView from "./components/SurfaceView.svelte";
  import IconButton from "./components/IconButton.svelte";
  import { projectStore } from './stores/stores'
  import { get } from 'svelte/store';
  import { onMount } from "svelte"
  import { defaultProject, defaultProjects } from './configs/configs.js'
  import SvgSaver from 'svgsaver'
  import { FileSaver, saveAs } from 'file-saver';	
  import { fly, fade, crossfade } from 'svelte/transition';
  import { flip } from 'svelte/animate';



  let title = 'none'
  let currentProject, projects
  let showprojects = false

  let saveStatus = "waiting"

  currentProject = { ...defaultProject }
  projects = localStorage.length ?
	  			JSON.parse( localStorage.getItem( 'projects' ) )
				:
				{...defaultProjects};

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
	//   showprojects = false
	}

  onMount( ()=>{

	  loadProject( projects.last_project_title )
	} )
 
	const saveSVG = function(){
		const svgsaver = new SvgSaver();                      
		const svg = document.querySelector("#svg");        
		svgsaver.asSvg(svg, title+".svg");   
	}

	const savePNG = function(){
		const canvas = document.querySelector("#pictureCanvas");
		canvas.toBlob(function(blob) {
    		saveAs(blob, title+".png");
		})
	}

	const saveGCODE = ( gcode )=>{
		const file = new File([gcode], title+".nc", {type: "text/plain;charset=utf-8"});
		FileSaver.saveAs(file);
	}


</script>

<!-- STYLE -------------------------------------------------------- -->

<style>

	.container{
		width: 100%;
		height: 100%;
	}

	header {
		margin: none;
		padding-top: 1em;
		padding-left: 3em;
		height: 8vh;
	}
	
	h1 {
	  font-size: 1.7em;
	  margin: none;
	  padding:none;
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
		margin: none;
		padding: none;
		background-color: white;
		overflow-y: scroll;
		height: 100%;
	}
	.loadbutton_container{
		width: 3vw;
		margin: auto;
		display: flex;
		justify-content: center;
	}
	.projects_list{
		width: 14vw;
		font-size: 1.1em;
		padding-top: 1em;
		padding-bottom: 1em;
	}

	.projects_list>ul{
		list-style-type: none;
		padding: none;
		margin: none;
	}
	.projects_list>ul>li{
		padding: 0.2em;
		/* padding-left: 0.5em; */
		margin: none;
		margin-top: 1em;
		cursor:pointer;
		width:100%;
	}

	.projects_list>ul>li:hover{
		background-color: whitesmoke;
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
		margin: none;
		padding: none;
	}
	.title{
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-self: flex-start;
		align-self: flex-start;
		margin: none;
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
</style>


<!-- pseudoHTML -------------------------------------------------------- -->

<div class="container">
	
	<header>
		<h1>{title}</h1>
	</header>
	<main>

		<nav transition:crossfade>
			<div class="loadbutton_container">
				<IconButton
				iconUrl="./assets/icons/load.png"
				on:action={()=> showprojects = !showprojects}
				tip="Projects"
				tipPosition="right"
				/>
			</div>
			{#if showprojects}
			<div class="projects_list" in:fly="{{ x: -100, duration: 1000 }}" out:fly="{{ x: -100, duration: 1000 }}">
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
		</nav>

		<div class="playground" transition:crossfade>
			<PictureView params={currentProject.picture} on:savePNG={savePNG} />
			<SurfaceView params={currentProject.surface} on:saveSVG={saveSVG}/>

			<div class="gcode"> 
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
					tipPosition="left"
					/>	

				</div>
			</div>
		</div>

	</main>
	<footer>
		<p style="color: #bbb; font-size:0.9em">surface_projection © <a style="color: #bbb" href="https://www.edouardmortec.com.com">mortec</a> lockdown 2020</p>
	</footer>
</div>
