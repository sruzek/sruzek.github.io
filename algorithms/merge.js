//ariel.js
//graphical representation of an ariel tattoo

var scene, camera, renderer, controls;

function init(){
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 2, 100000);
	camera.position.set( 0, 1000, 0 );
	camera.lookAt(scene.position);
	scene.add(camera);

	renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild( renderer.domElement );

	window.addEventListener( 'resize', onWindowResize, false );

	var groundMaterial = new THREE.MeshLambertMaterial( {
		color: 0x3f2806
	} );

	var planeGeometry = new THREE.PlaneBufferGeometry( 100, 100 );

	var ground = new THREE.Mesh( planeGeometry, groundMaterial );
	ground.position.set( 0, 0, 0 );
	ground.rotation.x = - Math.PI / 2;
	ground.scale.set( 1000, 1000, 1000 );
	ground.receiveShadow = true;
	scene.add( ground );

	ambientLight = new THREE.AmbientLight( 0xffffff );
	scene.add( ambientLight );
}

function update() {
	requestAnimationFrame(update);
	renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

init();
update();

