<script>
  import PictureView from "./components/PictureView.svelte";
  import SurfaceView from "./components/SurfaceView.svelte";
  import IconButton from "./components/IconButton.svelte";
  import { projectStore } from './stores/stores'
  import { get } from 'svelte/store';
  import { onMount } from "svelte"
  import { defaultProject, defaultProjects } from './configs/configs.js'

  let title = 'none'
  let currentProject, projects
  let showprojects = false

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
	}
  
  const loadProject = ( loadtitle )=>{
	  const loadedProject = projects.projects.filter( p => p.title === loadtitle )[0]
	  currentProject = { ...currentProject, ...loadedProject }	
	  title = currentProject.title
	  showprojects = false
	}

  onMount( ()=>{

	  loadProject( projects.last_project_title )
	} )
 



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
	  font-size: 1.5em;
	  margin: none;
	  padding:none;
	}

	main{
		width: 100%;
		height: 83vh;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;

	}
	
	nav {
		display: block;
		margin: none;
		padding: none;
	}

	nav>ul{
		width: 20vw;
	}


	.playground {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: space-around;
		padding-top: 1em;
		padding-left: 1em;

		height: 100%;
		width: 100%
		
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
		flex-direction: row;
		align-items: center;
		justify-self: flex-start;
		align-self: flex-start;
		margin: none;
		padding: none;
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

		<nav>
			<IconButton iconUrl="./assets/icons/load.png"
			on:action={()=> showprojects = !showprojects}
			/>
			{#if showprojects}
			
			<div class="projects_list">
				<ul>
					{#each projects.projects as p}
					<li on:dblclick={()=>loadProject(p.title)}> {p.title} </li>
					{/each}
				</ul>
			</div>
			{/if}
		</nav>

		<div class="playground">
			<PictureView params={currentProject.picture}/>
			<SurfaceView params={currentProject.surface}/>


			<div class="gcode"> 
				<label for="title">title:</label>
				<input type="text" bind:value={title} />
			</div>

			<div class="save" style="align-self: flex-start;" >
				<IconButton iconUrl="./assets/icons/save.png"
				on:action={saveProject}
				/>	

			</div>
		</div>

	</main>
	<footer>
		<p style="color: #bbb">surface_projection © <a style="color: #bbb" href="https://www.edouardmortec.com.com">mortec</a> lockdown 2020</p>
	</footer>
</div>
