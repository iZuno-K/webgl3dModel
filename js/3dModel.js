<!DOCTYPE html>
<html lang="en">
    <head>
        <title>three.js webgl - OBJLoader + MTLLoader</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
        <style>
            body {
                font-family: Monospace;
                background-color: #000;
                color: #fff;
                margin: 0px;
                overflow: hidden;
            }
            #info {
                color: #fff;
                position: absolute;
                top: 10px;
                width: 100%;
                text-align: center;
                z-index: 100;
                display:block;
            }
            #info a, .button { color: #f00; font-weight: bold; text-decoration: underline; cursor: pointer }
        </style>
    </head>

    <body>
        <script src="js/three.js"></script>

        <script src="js/DDSLoader.js"></script>
        <script src="js/MTLLoader.js"></script>
        <script src="js/OBJLoader.js"></script>

        <!-- <script src="js/Detector.js"></script> -->

        <script>

            var container;

            var camera, scene, renderer;

            var mouseX = 0, mouseY = 0;

            var windowHalfX = window.innerWidth / 2;
            var windowHalfY = window.innerHeight / 2;


            init();
            animate();


            function init() {

                container = document.createElement( 'div' );
                document.body.appendChild( container );

                camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
                camera.position.z = 250;

                // scene

                scene = new THREE.Scene();

                var ambient = new THREE.AmbientLight( 0x444444 );
                scene.add( ambient );

                var directionalLight = new THREE.DirectionalLight( 0xffeedd );
                directionalLight.position.set( 0, 0, 1 ).normalize();
                scene.add( directionalLight );

                // model

                var onProgress = function ( xhr ) {
                    if ( xhr.lengthComputable ) {
                        var percentComplete = xhr.loaded / xhr.total * 100;
                        console.log( Math.round(percentComplete, 2) + '% downloaded' );
                    }
                };

                var onError = function ( xhr ) { };

                THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

                var mtlLoader = new THREE.MTLLoader();
                mtlLoader.setPath( 'obj/male02/' );
                mtlLoader.load( 'male02_dds.mtl', function( materials ) {

                    materials.preload();

                    var objLoader = new THREE.OBJLoader();
                    objLoader.setMaterials( materials );
                    objLoader.setPath( 'obj/male02/' );
                    objLoader.load( 'male02.obj', function ( object ) {

                        object.position.y = - 95;
                        scene.add( object );

                    }, onProgress, onError );

                });

                //

                renderer = new THREE.WebGLRenderer();
                renderer.setPixelRatio( window.devicePixelRatio );
                renderer.setSize( window.innerWidth, window.innerHeight );
                container.appendChild( renderer.domElement );

                document.addEventListener( 'mousemove', onDocumentMouseMove, false );

                //

                window.addEventListener( 'resize', onWindowResize, false );

            }

            function onWindowResize() {

                windowHalfX = window.innerWidth / 2;
                windowHalfY = window.innerHeight / 2;

                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();

                renderer.setSize( window.innerWidth, window.innerHeight );

            }

            function onDocumentMouseMove( event ) {

                mouseX = ( event.clientX - windowHalfX ) / 2;
                mouseY = ( event.clientY - windowHalfY ) / 2;

            }

            //

            function animate() {

                requestAnimationFrame( animate );
                render();

            }

            function render() {

                camera.position.x += ( mouseX - camera.position.x ) * .05;
                camera.position.y += ( - mouseY - camera.position.y ) * .05;

                camera.lookAt( scene.position );

                renderer.render( scene, camera );

            }

        </script>

    </body>
</html>
