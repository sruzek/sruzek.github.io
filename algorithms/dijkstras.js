// dijkstras.js

"use strict";

var scene, renderer;
var controls;
var clock = new THREE.Clock();

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(),
offset = new THREE.Vector3(),
INTERSECTED, SELECTED;

var mapWidth = 250, mapHeight = 170;

var camera, mapCamera;

var backgroundSound, pathSound;

var sky, sunSphere;

var spotLight, dirLight, hemiLight, light1, light2, light3, light4, light5, light6;
var light1go = false, light2go = false, light3go = false, light4go = false, light5go = false, light6go = false;

var shapes = [];
var paths = [];
var dgraph;

var texloader = new THREE.TextureLoader();

init();
animate();

function init() {
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0xffffff, 1, 5000 );
	scene.fog.color.setHSL( 0.6, 0, 1 );

	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000000);
	camera.position.set(400, 400, 1000);
	camera.lookAt(scene.position);
	scene.add(camera);

	mapCamera = new THREE.OrthographicCamera(    //camera that displays map in corner
	-2,		// Left
    2,		// Right
    1,		// Top
    -1,	// Bottom
    -200,            			// Near 
   	200 );  
	mapCamera.up = new THREE.Vector3(0,0,-1);
	mapCamera.lookAt( new THREE.Vector3(0,-1,0) );
	scene.add(mapCamera);

	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();

    renderer = new THREE.WebGLRenderer({ antialias: true }); 
    renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;
	renderer.shadowMapSoft = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	document.body.appendChild( renderer.domElement );
	renderer.autoClear = false;

	var listener = new THREE.AudioListener();
	camera.add( listener );

	backgroundSound = new THREE.Audio(listener);
	backgroundSound.load('sounds/586057_Relaxed-WiP.mp3')
	backgroundSound.position.set(400, 20, 0);
	backgroundSound.setRefDistance(500);
	backgroundSound.autoplay = true;
	scene.add(backgroundSound);


	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.maxPolarAngle = Math.PI/2;
	controls.maxDistance = 4000;
	controls.minDistance = 10;
	// controls.autoRotate = true;
	controls.center.set(400, 20, 0);	

	window.addEventListener( 'resize', onWindowResize, false );
	renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
	renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );

	initSky();
    initLights();
    ground();

    draw();
}

function draw() {
	var group = new THREE.Group();
	var dmap = {};
	var numNodes = 40;

	shapes = []

	for (var i = 0; i < numNodes; i++){
		var g = new THREE.SphereGeometry(10, 16, 16);
		var material = new THREE.MeshPhongMaterial( { color: 0x000000, specular: 0xffffff, metal: true });
		var temp = new THREE.Mesh(g, material);
		if (i == 0){
		 	temp.position.x = 500; //basepos[0] - 100;
		 	temp.position.y =  5;
		 	temp.position.z = 500; 
		 	temp.material.color.setHex(0xffffff);  //set the color of the starting one to white
		}
		else if (i == numNodes-1){
			temp.position.x =  200;  //-300*(0.8+Math.random());
		 	temp.position.y =  5;
		 	temp.position.z =  -400;    // -300*(0.6+Math.random()); 
		}
		else{
			do{
			 	temp.position.x = 700*1.4*Math.random()-30*1+Math.random()-i; //300 * 4 * (0.5 - Math.random()) - i;
			 	temp.position.y =  200*Math.random();  //Math.ceil(100*Math.random());
			 	temp.position.z = 500*1.7*(0.6-Math.random()); 
			} while(dist(temp.position, shapes[i-1].position) < 100);

	 	}
	 	temp.castShadow = true;
	 	group.add(temp);
	 	shapes.push(temp);
	}

 	for (var i = 0; i < shapes.length; i++){   //making the map for the shapes
 		dmap[shapes[i].id] = {};

 		for (var j = 1; j < shapes.length; j++){
 			var d = dist(shapes[i].position, shapes[j].position);
 			if (shapes[i].id != shapes[j].id && d < 400){
 				dmap[shapes[i].id][shapes[j].id] = d;
 			}
 		}
 	}

	scene.add(group);

	console.log("dmap:", dmap);
	dgraph = new Graph(dmap);

	text(shapes);

	var lineMaterial = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 0.1 } );
	var lineGeometry = new THREE.Geometry();

	var edges = dgraph.edges();
	var nodes = dgraph.nodes();

	for (var i = 0; i < edges.length-1; i++){
		var from = edges[i][0];
		var to = edges[i][1];
		var weight = edges[i][2];
		var fromObj = scene.getObjectById(parseInt(from), true);
		var toObj = scene.getObjectById(parseInt(to), true);
		lineGeometry.vertices.push(fromObj.position, toObj.position);
	}

	var line = new THREE.Line(lineGeometry, lineMaterial);
	scene.add(line);
}

var visited = {};
function path(dgraph, start, end){

	var SPlineMaterial = new THREE.LineBasicMaterial( { color: Math.random() * 0xffffff, linewidth: 2 } );
	var SPlineGeometry = new THREE.Geometry();

	var shortestpath = dgraph.findShortestPath(start, end);

	var d = 0;
	for (var i = 0; i < shortestpath.length-1; i++){
		var from = shortestpath[i];
		if (!(shortestpath[i] in visited)){
			visited[shortestpath[i]] = true;
		}
		var to = shortestpath[i+1];
		if (!(shortestpath[i+1] in visited)){
			visited[shortestpath[i+1]] = true;
		}
		var fromObj = scene.getObjectById(parseInt(from), true);
		var toObj = scene.getObjectById(parseInt(to), true);
		SPlineGeometry.vertices.push(fromObj.position, toObj.position);
		d+=dist(fromObj.position, toObj.position);
			
		fromObj.material.color.setHex(0xffffff);
	}

	document.getElementById('path').innerHTML = printp(d);

	function printp(d){
		var whattoprint = "<br><br>Distance from " + start + " to " + end + ": " + Math.floor(d) + "<br>";
		for (var i = 0; i < shortestpath.length-1; i++){
			if (i == shortestpath.length-2){
				whattoprint += shortestpath[i] + " -> " + shortestpath[i+1];
			}
			else{
				whattoprint += shortestpath[i] + " -> ";
			}
		}
		whattoprint += "<br>Click another black node to see another path.";
		return whattoprint
	}

	var vkeys = Object.keys(visited); 

	console.log(visited, vkeys.length);

	var spspline = new THREE.Line(SPlineGeometry, SPlineMaterial);
	scene.add(spspline);

	paths.push(spspline);

	if (vkeys.length == shapes.length){
		document.getElementById('path').innerHTML = "<br><br>you selected all the nodes!<br>Click <a onclick=startOver();> here </a> to play again!";
	}
}

function startOver() {
	for (var i = 0; i < paths.length; i++){
		scene.remove(paths[i]);
	}
	for (var i = 1; i < shapes.length; i++){
		shapes[i].material.color.setHex(0x000000);
	}
	selected = [shapes[0]];
	visited = {};
	document.getElementById('path').innerHTML = "<br><br>Node 33 is the first node (colored white).<br>Click any black node to see the shortest path.";
}

function dist(t0, t1){
	var deltaX = t1.x - t0.x;
	var deltaY = t1.y - t0.y;
	var deltaZ = t1.z - t0.z;

	var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);

	return distance;
}

function pathtext(from, to){

}

function text(shapes){
	var group = new THREE.Group();
	for (var t = 0; t < shapes.length; t++){
		var theText = shapes[t].id;
		var hash = document.location.hash.substr( 1 );
		if ( hash.length !== 0 ) {
			theText = hash;
		}
		var text3d = new THREE.TextGeometry( theText, {
			size: 5,
			height: 0.3,
			curveSegments: 10,
			font: "helvetiker"

		});
		text3d.computeBoundingBox();
		var centerOffset = -0.5 * ( text3d.boundingBox.max.x - text3d.boundingBox.min.x );
		var material = new THREE.MeshFaceMaterial( [
			new THREE.MeshPhongMaterial( { color: 0x9984A8 } ),
			// new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff, overdraw: 0.5 } ),
			new THREE.MeshPhongMaterial( { color: 0x9984A8, overdraw: 0.5 } )
		] );

		text = new THREE.Mesh( text3d, material );

		text.position.x = shapes[t].position.x + centerOffset;
		text.position.y = shapes[t].position.y + 10;
		text.position.z = shapes[t].position.z;

		text.rotation.x = 0;
		text.rotation.y = Math.PI * 2;

		group.add( text );
	}
	scene.add( group );
}

function ground() {
	var groundgeo = new THREE.BoxGeometry(18000, 14000, 10, 10);
	var groundtex = texloader.load('../images/marble.jpg');

	groundtex.repeat.set(5, 5);
	groundtex.wrapS = groundtex.wrapT = THREE.RepeatWrapping; 
    // groundtex.magFilter = THREE.NearestFilter;
    // groundtex.format = THREE.RGBFormat;

	var groundmat = new THREE.MeshPhongMaterial({map:groundtex, vertexColors: THREE.VertexColors});  //{shininess: 80, color: 0x1F0631, specular:0xffffff, vertexColors: THREE.VertexColors});
	var ground = new THREE.Mesh(groundgeo, groundmat);
	ground.position.y = -10;
	ground.position.x = 450;
	// ground.material.side = THREE.DoubleSide;
	ground.rotation.x = -Math.PI/2;
	scene.add(ground);
	ground.recieveShadow = true;
}

function initLights() {

	hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
	hemiLight.color.setHSL( 0.6, 1, 0.6 );
	hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
	hemiLight.position.set( 0, 500, 0 );
	scene.add( hemiLight );

	dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
	dirLight.color.setHSL( 0.1, 1, 0.95 );
	dirLight.position.set( -1, 1.75, 1 );
	dirLight.position.multiplyScalar( 50 );
	scene.add( dirLight );

	dirLight.castShadow = true;

	dirLight.shadowMapWidth = 2048;
	dirLight.shadowMapHeight = 2048;

	var d = 50;

	dirLight.shadowCameraLeft = -d;
	dirLight.shadowCameraRight = d;
	dirLight.shadowCameraTop = d;
	dirLight.shadowCameraBottom = -d;

	dirLight.shadowCameraFar = 3500;
	dirLight.shadowBias = -0.0001;
	addLights();

}

function addLights(){
	scene.add( new THREE.AmbientLight( 0x111111 ) );

	var intensity = 10;
	var distance = 150;
	// var c1 = Math.random() * 0xff0040, c2 = Math.random() * 0x0040ff, c3 = Math.random() * 0x80ff80, c4 = Math.random() * 0xffaa00, c5 = Math.random() * 0x00ffaa, c6 = Math.random() * 0xff1100;
	var c1 =  Math.random() * 0xffffff, c2 = Math.random() * 0xffffff, c3 = Math.random() * 0xffffff, c4 = Math.random() * 0xffffff, c5 = Math.random() * 0xffffff, c6 = Math.random() * 0xffffff;

	var sphere = new THREE.SphereGeometry(0.1, 16, 8 );

	light1 = new THREE.PointLight( c1, intensity, distance );
	light1.position.y = 100;
	light1.position.x = 300;
	light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c1 } ) ) );
	scene.add( light1 );

	light2 = new THREE.PointLight( c2, intensity, distance );
	light2.position.y = 100;
	light2.position.x = 400;
	light2.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c2 } ) ) );
	scene.add( light2 );

	light3 = new THREE.PointLight( c3, intensity, distance );
	light3.position.y = 100;
	light3.position.x = 500;
	light3.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c3 } ) ) );
	scene.add( light3 );

	light4 = new THREE.PointLight( c4, intensity, distance );
	light4.position.y = 100;
	light4.position.x = 200;
	light4.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c4 } ) ) );
	scene.add( light4 );

	light5 = new THREE.PointLight( c5, intensity, distance );
	light5.position.y = 100;
	light5.position.x = 600;
	light5.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c5 } ) ) );
	scene.add( light5 );

	light6 = new THREE.PointLight( c6, intensity, distance );
	light6.position.y = 100;
	light6.position.x = 750;
	light6.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c6 } ) ) );
	scene.add( light6 );

	var dlight = new THREE.DirectionalLight( 0xffffff, 0.1 );
	dlight.position.set( 0.5, -1, 0 ).normalize();
	scene.add( dlight );
}

function initSky() {

	var vertexShader = document.getElementById( 'vertexShader' ).textContent;
	var fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
	var uniforms = {
		topColor: 	 { type: "c", value: new THREE.Color( 0x777777 ) },
		bottomColor: { type: "c", value: new THREE.Color( 0x111111 ) },
		offset:		 { type: "f", value: 33 },
		exponent:	 { type: "f", value: 0.6 }
	};
	uniforms.topColor.value.setHSL( 0.6, 1, 0.6 );

	scene.fog.color.copy( uniforms.bottomColor.value );

	var skyGeo = new THREE.SphereGeometry( 4000, 32, 15 );
	var skyMat = new THREE.ShaderMaterial( { vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.BackSide } );

	var sky = new THREE.Mesh( skyGeo, skyMat );
	scene.add( sky );
}

var i = 1;
function animate() {
    requestAnimationFrame( animate );

	render();		
	update();
}

function update() {
	controls.update();
}

function render() {
	var w = window.innerWidth, h = window.innerHeight;

	var time = Date.now() * 0.00025;
	var z = 20, d = 150;

	if (light1go){
		light1.position.x = 300 + Math.sin( time * 1.7 ) * d;
		light1.position.z = Math.cos( time * 1.3 ) * d;
	}

	if (light2go){
		light2.position.x = 400 + Math.cos( time * 1.3 ) * d;
		light2.position.z = Math.sin( time * 1.7 ) * d;
	}

	if (light3go){
		light3.position.x = 500 + Math.sin( time * 1.7 ) * d;
		light3.position.z = Math.sin( time * 1.5 ) * d;
	}

	if (light4go){
		light4.position.x = 600 + Math.sin( time * 1.3 ) * d;
		light4.position.z = Math.sin( time * 1.5 ) * d;
	}

	if (light5go){
		light5.position.x = 700 + Math.cos( time * 0.3 ) * d;
		light5.position.z = Math.sin( time * 0.5 ) * d;
	}

	if (light6go){
		light6.position.x += 750 + Math.cos( time * 0.7 ) * d;
		light6.position.z = Math.cos( time * 0.5 ) * d;
	}
	
	camera.updateMatrixWorld();

	renderer.setViewport( 0, 0, w, h );
	renderer.clear();
	renderer.render( scene, camera );              //240       160
	// renderer.setViewport( 10, h - mapHeight - 10, mapWidth, mapHeight );
	// renderer.render( scene, mapCamera );

	camera.lookAt(scene.position);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentMouseMove( event ) {
	event.preventDefault();

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	raycaster.setFromCamera( mouse, camera );
}

var selected = [shapes[0]];  //sets the start node

function onDocumentMouseDown( event ) {
	event.preventDefault();

	raycaster.setFromCamera( mouse, camera );

	var intersects = raycaster.intersectObjects( shapes );

	if ( intersects.length > 0 ) {
		SELECTED = intersects[ 0 ].object;	
		SELECTED.material.color.setHex( 0xffffff );
		selected.push(intersects[0].object);
		if (selected.length == 2){
			path(dgraph, selected[0].id, selected[1].id);
			light1go = true;
		}
		if (selected.length > 2){
			path(dgraph, selected[selected.length-2].id, selected[selected.length-1].id);
			if (selected.length == 3)
				light2go = true;
			if (selected.length == 4)
				light3go = true;
			if (selected.length == 5)
				light4go = true;
			if (selected.length == 6)
				light5go = true;
			if (selected.length == 7)
				light6go = true;
		}
	}
}

