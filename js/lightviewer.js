function LightViewer(){

    that = this;

    /**
     * Array containing the model data.
     * @type {Array}
     */
    this.model = [];

    /**
     * @public
     * X value and Y value in pixels of mouse's position.
     * @type {Array}
     */
    this.mouseCoordinates = [];

    /**
     * Calculates the height and width of the div which contians your 3D model.
     * @type {Object}
     */
    this.div = {
        offsetHeight : document.getElementById('viewer').offsetHeight,
        offsetWidth  : document.getElementById('viewer').offsetWidth,
        offsetTop    : document.getElementById('viewer').offsetTop,
        offsetLeft   : document.getElementById('viewer').offsetLeft,
    }

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, this.div.offsetWidth / this.div.offsetHeight, 0.1, 1000 );

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( this.div.offsetWidth, this.div.offsetHeight );

    this.ambientLight = new THREE.AmbientLight( 0x000000 );
    this.scene.add( this.ambientLight );

    // this.pointerLight = new THREE.PointLight( 0xffffff, 1, 0 );
    // this.scene.add( this.pointerLight );


    this.geometry = new THREE.BoxGeometry( 1, 1, 1 );
    this.sphere = new THREE.SphereGeometry( 0.1, 16, 16 );

    //Load a tablet
    var loader = new THREE.STLLoader();
    loader.load( '/models/globe.stl', function ( geometry ) {
                    var material = new THREE.MeshPhongMaterial( { color: 0xff5533, specular: 0xffffff, shininess: 200 } );
                    var mesh = new THREE.Mesh( geometry, material );
                    mesh.position.set( 0, 0, 0 );
                    // mesh.rotation.set( Math.PI / 2, - Math.PI / 2, Math.PI / 2 );
                    // mesh.scale.set( 0.1, 0.1, 0.1 );
                    mesh.castShadow = true;
                    mesh.receiveShadow = true;
                    that.scene.add( mesh );
                } );

    this.object = new THREE.Mesh( this.geometry, new THREE.MeshPhongMaterial( { color: 0x555555, specular: 0xffffff, shininess: 50 }  )  );

    this.object.rotation.x = 0.6;
    this.object.rotation.y = 0.6;
    // this.scene.add( that.object );

    this.camera.position.z = 5;

    // Add pointLight.
    this.pointLight = new THREE.PointLight( 0xfcd440, 3, 50 );
    // this.pointLight.add( new THREE.Mesh( this.sphere, new THREE.MeshBasicMaterial( { color: 0xfcd440 } ) ) );
    this.pointLight.position.set( 0, 0, 1 );
    this.scene.add( this.pointLight );

    
    // Add menu to viewer div
    menuButton = document.createElement('div');
    menuButton.className = 'lv-menuButton';
    document.getElementById('viewer').appendChild( menuButton );

    // Add canvas element to viewer div
    document.getElementById('viewer').appendChild( that.renderer.domElement );

    this.loadData = function(path){

        return this;
    }

    /**
     * Saves the mouse's position to this.mouseCoordinates.
     * @return {This} 
     */
    this.getMousePosition = function(){
        document.onmousemove = function(e){
            that.mouseCoordinates = [e.pageX, e.pageY];
            // console.log((e.pageX - that.div.offsetLeft), (e.pageY - that.div.offsetTop));
        };

        return this;
    }


    this.updateLightPosition = function(){
        that.getMousePosition();
        that.pointLight.position.y = -0.02 * (this.mouseCoordinates[1] - (this.div.offsetHeight/2) - this.div.offsetTop); 
        that.pointLight.position.x = 0.02 * (this.mouseCoordinates[0] - (this.div.offsetWidth/2) - this.div.offsetLeft); 
        return this;
    }

    
    /**
     * Logs a message
     * @private
     * @param  {String} message A message to be logged to the console.
     * @return {Void}         
     */
    function log(message){
        console.log(message);
    }



    /**
     * Renders the animation.
     * @private
     * @return {Void} 
     */
    function render() {
        requestAnimationFrame( render );
        that.renderer.render( that.scene, that.camera );
        // that.object.rotation.x += 0.03;
        // that.object.rotation.y += 0.03;
        that.updateLightPosition();
    }
    
    render();


    return this;
}