// merge.js
// graphical representation of the merge sort algorithm
// color palette: http://paletton.com/#uid=3000t0kcbnL4n-Z88slfRjQktg6
// S(n) = O(n)
// T(n) = O(nlogn)

var scene, camera, renderer, controls;
var group;


function add_objects(){
	var geometry = new THREE.BoxBufferGeometry( 100, 100, 100 );
	var material = new THREE.MeshNormalMaterial();
	group = new THREE.Group();
	for ( var i = 0; i < 13; i ++ ) {
		var mesh = new THREE.Mesh( geometry, material );
		mesh.position.z = 400;
		// mesh.position.x = i * 100;
		mesh.position.y = 0;
		//mesh.position.y = i + 50;
		mesh.position.x = Math.random() * 2000 - 1000;
		// mesh.position.y = Math.random() * 1000 - i*20;
		// mesh.position.z = 1000 + i*20;
		// mesh.rotation.x = Math.random() * 2 * Math.PI;
		// mesh.rotation.y = Math.random() * 2 * Math.PI;
		mesh.matrixAutoUpdate = false;
		mesh.updateMatrix();
		group.add( mesh );
	}
	scene.add( group );
}


function init(){
	scene = new THREE.Scene();

	scene.fog = new THREE.Fog( 0xBD7575, 1, 500 );
	camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
	// camera.position.z = -1000;
	camera.position.y = -1000;
	// camera.position.x = 200;
	camera.lookAt(scene.position);

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	var canvas = renderer.domElement;
	document.body.appendChild(canvas);

	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.maxPolarAngle = Math.PI/2;
	controls.target.set(0, -500, 0);
	controls.maxDistance = 10000;

	window.addEventListener( 'resize', onWindowResize, false );

	ambientLight = new THREE.AmbientLight( 0xffdcdc );
	scene.add( ambientLight );

	add_objects();
	// skybox();
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








// function skybox(){
// 	var skygeo = new THREE.CubeGeometry( 2500, 2500, 2500 );
// 	var cubeMaterials = [
// 	    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( "../images/cotton_candy/cottoncandy_ft.tga" ), side: THREE.DoubleSide }), //front side
// 	    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'https://github.com/hghazni/Three.js-Skybox/blob/master/img/nightsky_bk.png' ), side: THREE.DoubleSide }), //back side
// 	    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'https://github.com/hghazni/Three.js-Skybox/blob/master/img/nightsky_up.png' ), side: THREE.DoubleSide }), //up side
// 	    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'https://github.com/hghazni/Three.js-Skybox/blob/master/img/nightsky_dn.png' ), side: THREE.DoubleSide }), //down side
// 	    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'https://github.com/hghazni/Three.js-Skybox/blob/master/img/nightsky_rt.png' ), side: THREE.DoubleSide }), //right side
// 	    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'https://github.com/hghazni/Three.js-Skybox/blob/master/img/nightsky_lf.png' ), side: THREE.DoubleSide }) //left side
// 	];

// 	var cubeMaterial = new THREE.MeshFaceMaterial( cubeMaterials );
// 	var cube = new THREE.Mesh( skygeo, cubeMaterial );
// 	scene.add( cube );
// }

