if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
let container, stats, controls;
let camera, scene, renderer, light;
let clock = new THREE.Clock();
let mixers = [];
init();
animate();
function init() {
  let canvas = document.getElementById('mainCanvas');
  // console.log(canvas);

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set( 100, 200, 300 );
    controls = new THREE.OrbitControls( camera );
    controls.target.set( 0, 100, 0 );
    controls.update();
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xa0a0a0 );
    scene.fog = new THREE.Fog( 0xa0a0a0, 1000, 10000 );
    light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    light.position.set( 0, 200, 0 );
    scene.add( light );
    light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0, 200, 100 );
    light.castShadow = true;
    light.shadow.camera.top = 180;
    light.shadow.camera.bottom = -100;
    light.shadow.camera.left = -120;
    light.shadow.camera.right = 120;
    scene.add( light );
    // scene.add( new THREE.CameraHelper( light.shadow.camera ) );
    // ground
    let mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add( mesh );
    let grid = new THREE.GridHelper( 2000, 20, 0x000000, 0x000000 );
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene.add( grid );

    // // model
    // let loader = new THREE.FBXLoader();
    //
    // loader.load( './Samba Dancing.fbx', function ( object ) {
    //     // object.mixer = new THREE.AnimationMixer( object );
    //     // mixers.push( object.mixer );
    //     // let action = object.mixer.clipAction( object.animations[ 0 ] );
    //     // action.play();
    //     object.traverse( function ( child ) {
    //         if ( child.isMesh ) {
    //             child.castShadow = true;
    //             child.receiveShadow = true;
    //         }
    //     } );
    //     scene.add( object );
    // } );
    //
    renderer = new THREE.WebGLRenderer({canvas});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    // container.appendChild( renderer.domElement );
    window.addEventListener( 'resize', onWindowResize, false );

    // stats
    // stats = new Stats();
    // container.appendChild( stats.dom );
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
//
function animate() {
    requestAnimationFrame( animate );
    if ( mixers.length > 0 ) {
        for ( let i = 0; i < mixers.length; i ++ ) {
            mixers[ i ].update( clock.getDelta() );
        }
    }
    renderer.render( scene, camera );
    // stats.update();
}

let dropzone = document.getElementById('mainCanvas');

dropzone.ondragover = function(e) {
  e.preventDefault();
  e.stopPropagation();
  return false;
}

dropzone.ondrop = function(e) {
  e.preventDefault();
  e.stopPropagation();

  const reader = new FileReader();

  const files = e.dataTransfer.files; // FileList object.

  // files is a FileList of File objects. List some properties.
  const output = [];
  for (let i = 0, file; file = files[i]; i++) {
    output.push(file.name);
    var fileReader = new FileReader();
    fileReader.onload = function(ev) {
      // get file content
      MODEL_BUFFER = ev.target.result;

      // model
      let loader = new THREE.FBXLoader();
      let object = loader.parse(MODEL_BUFFER, './');

      // anim
      // object.mixer = new THREE.AnimationMixer( object );
      // mixers.push( object.mixer );
      // let action = object.mixer.clipAction( object.animations[ 0 ] );
      // action.play();

      // add shadows
      object.traverse( function ( child ) {
        if ( child.isMesh ) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      } );

      // add to scene
      scene.add( object );

    }
    fileReader.readAsArrayBuffer(file);
  }

  // alert(output);
}

// document.getElementById('dropzone').onclick = function(e) {
//   alert('HELLO!');
// }

