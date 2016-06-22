// dna.js
// graphical visualization of dna

var spinSelect = document.getElementById("spin-select");
var spin = false;

var scene, camera, renderer, controls;

// purine bases
var A = "adenine";
var G = "guanine";

// pyrimidine bases
var C = "cytosine";
var T = "thymine";

var bases = [];

var strand = new THREE.Object3D();
var rows = [];

function deoxyribose() {
	var sugarshape = new THREE.Shape();
	sugarshape.moveTo(0, 200, 0);
	sugarshape.lineTo(20, 215, 0);
	sugarshape.lineTo(40, 200, 0);
	sugarshape.lineTo(30, 185, 0);
	sugarshape.lineTo(10, 185, 0);
	sugarshape.lineTo(0, 200, 0);
	// var sugarGeo = new THREE.ShapeGeometry(sugarshape);
	var sugarGeo = new THREE.ExtrudeGeometry(sugarshape, {amount: 10});
	var sugarMat = new THREE.MeshLambertMaterial({color: 0xDDA0DD});
	var sugar = new THREE.Mesh(sugarGeo, sugarMat);
	sugar.castShadow = true;
	return sugar;
}

function phosphateGroup() {
	var phosphateGeo = new THREE.SphereGeometry(15, 10, 10);
	var phosphateMat = new THREE.MeshLambertMaterial({color: 0xFFA500});
	var phosphate = new THREE.Mesh(phosphateGeo, phosphateMat);
	phosphate.castShadow = true;
	phosphate.position.set(-5, 220, 5);
	return phosphate;
}

function base(b) {
	var bcolor, blength, bx;
	if (b == "adenine"){
		bcolor = 0xBA55D3;
		blength = 100;
		bx = 90;
	}
	if (b == "guanine"){
		bcolor = 0xD2691E;
		blength = 100;
		bx = 90;
	}
	if (b == "cytosine"){
		bcolor = 0xffff00;
		blength = 50;
		bx = 65;
	}
	if (b == "thymine"){
		bcolor = 0xAFEEEE;
		blength = 50;
		bx = 65;
	}
	var baseGeo = new THREE.CylinderGeometry(7, 7, blength, 32);
	var baseMat = new THREE.MeshLambertMaterial({color: bcolor});
	var base = new THREE.Mesh(baseGeo, baseMat);
	base.position.set(bx, 200, 10);
	base.rotation.z = 90 * Math.PI/180;
	return base;
}

function nucleotide(side, b) {
	var po4 = phosphateGroup();
	var sugar = deoxyribose();
	var dnaBase = base(b);
	var ntide = new THREE.Object3D();
	ntide.add(po4);
	ntide.add(sugar);
	ntide.add(dnaBase);
	if (side == "left")
		ntide.position.set(-100, 0, 0);
	if (side == "right"){
		ntide.rotation.z = 180 * Math.PI/180;
		ntide.position.set(130, 400, 0);
	}
	return ntide;
}

bases = [A, T, C, G, G, A, T, C, C, A, A, T, G, A, T, A, T, C, T, A, A, T, G, A, T, C, G, G, A, T, C, C, A, A, T, G, A, T, C, C, G, G, A, T, C, C, A, A, T, G, A, T, C, G, G, A, T, C, C, A, A, T, G, A, T, C, G, G, A, T, C, C, A, A, T, G];

function dna(bases, strand) {

	for (var i = 0; i < bases.length; i++){
		var right;
		var left = nucleotide("left", bases[i]);
		if (bases[i] == A)
			right = nucleotide("right", T);
		if (bases[i] == T)
			right = nucleotide("right", A);
		if (bases[i] == C)
			right = nucleotide("right", G);
		if (bases[i] == G)
			right = nucleotide("right", C);
		var row = new THREE.Object3D();
		row.add(left);
		row.add(right);

		row.position.y = i*30;
		row.rotation.y = 20*i * Math.PI/180;

		rows.push({obj: row, left: row.children[0], right: row.children[1]});
		strand.add(row);
	}

	strand.position.set(1200, 200, 0);
	strand.rotation.z = 90 * Math.PI/180;
	scene.add(strand);

}

var flattening = false;
var separating = false;

function transcription() {
	if (spin)
		spin = false;
	flattening = true;

	if (!flattening)
		separating = true;

}


function init() {

	scene = new THREE.Scene();
	// scene.fog = new THREE.Fog( 0x000000, 1000, 10000 );

	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 2, 100000);
	camera.position.set( 0, 500, 2500 );
	camera.lookAt(scene.position);
	scene.add(camera);

	renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild( renderer.domElement );
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.target.set(0, 200, 0);

	window.addEventListener( 'resize', onWindowResize, false );

	var groundMaterial = new THREE.MeshPhongMaterial( {
		shininess: 80,
		color: 0xffffff,
		specular: 0xffffff
	} );

	var planeGeometry = new THREE.PlaneBufferGeometry( 100, 100 );

	var ground = new THREE.Mesh( planeGeometry, groundMaterial );
	ground.position.set( 0, 0, 0 );
	ground.rotation.x = - Math.PI / 2;
	ground.scale.set( 1000, 1000, 1000 );
	ground.receiveShadow = true;
	scene.add( ground );


	var sunIntensity = 0.3,
		pointIntensity = 1,
		pointColor = 0xffaa00;
	ambientLight = new THREE.AmbientLight( 0x3f2806 );
	scene.add( ambientLight );

	sunLight = new THREE.SpotLight( 0xffffff, sunIntensity, 0, Math.PI/2, 1 );
	sunLight.position.set( 1000, 2000, 1000 );

	sunLight.castShadow = true;

	sunLight.shadow.bias = -0.0002;

	sunLight.shadow.camera.near = 750;
	sunLight.shadow.camera.far = 4000;
	sunLight.shadow.camera.fov = 600;

	scene.add( sunLight );

	spinSelect.addEventListener("change", function () {
		if (this.selectedIndex == 0){
			spin = false;
		}
		if (this.selectedIndex == 1){
			spin = true;
		}

	});

	dna(bases, strand);
}

function update() {
	requestAnimationFrame(update);
	controls.update();

	if (spin)
		strand.rotation.x += 0.05;

	if (flattening){
		for (var i = 0; i < rows.length; i++){
			while (rows[i].obj.rotation.y > 0)
				rows[i].obj.rotation.y -= 0.001;
		}
		flattening = false;
		separating = true;
	}
	if (separating){
		for (var i = 0; i < rows.length/2; i++){
			rows[i+rows.length/2].right.position.x += i*20;
		}
		// rows[rows.length/2].right.position.x = (rows.length/4)*20;

		// for (var i = 0; i < rows.length/4; i++){
		// 	rows[i+rows.length/2].right.position.x -= i*20;
		// }
		separating = false;
	}

	renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

init();
update();

