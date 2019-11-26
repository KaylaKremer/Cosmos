import React, { Component } from 'react';
import * as THREE from 'three';
import '../scss/viget.scss';
import space from '../images/space.jpg';
import nebula from '../images/nebula.png';
import verano from '../fonts/verano.typeface.json';

export default class Viget extends Component {

  constructor(props) {
    super(props);
    this.mount = React.createRef();
  }
  
  componentDidMount(){
    this.init();
    this.createBackground();
    this.createViget();
    this.createText();
    this.resize();
    this.start();
  }
  
  componentWillUnmount(){
      // Stops the animation and removes the renderer from the DOM
      this.stop();
      this.mount.current.removeChild(this.renderer.domElement);
  }
  
  init = () => {
    // SCENE
    // Create new scene with fog
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x042e5b, 0.001);
    
    // CAMERA
    // Create new perspective camera
    this.camera = new THREE.PerspectiveCamera(
      60,
      this.mount.current.clientWidth / this.mount.current.clientHeight,
      0.1,
      10000
    );
    // Set camera's z position to be further away so it doesn't sit on top of the geometry rendered at (0,0,0).
    this.camera.position.set(0,0,0);
    
    // LIGHTS
    // Create ambient light and add to scene
    this.ambientLight = new THREE.AmbientLight(0xf2f2f2);
    this.scene.add(this.ambientLight);
    
    // Create directional light and add to scene
    this.directionalLight = new THREE.DirectionalLight(0xff8c19);
    this.directionalLight.position.set(0,0,1);
    this.scene.add(this.directionalLight);
    
    // Create three spotlights (red, pink, and purple) to add color variety to nebula texture and add all to scene
    this.redLight = new THREE.PointLight(0xef1039,10,550,2);
    this.redLight.position.set(-50,100,-150);
    this.scene.add(this.redLight);
    
    this.pinkLight = new THREE.PointLight(0xef56dd,10,450,2);
    this.pinkLight.position.set(-150,150,-150);
    this.scene.add(this.pinkLight);
    
    this.purpleLight = new THREE.PointLight(0xcf6df9,10,550,2);
    this.purpleLight.position.set(-100,200,-150);
    this.scene.add(this.purpleLight);
    
    // RENDERER
    // Create renderer and set its color to same as the fog
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor(this.scene.fog.color);
    // Set its size to be the whole screen and append it to the DOM
    this.renderer.setSize(this.mount.current.clientWidth, this.mount.current.clientHeight);
    this.mount.current.appendChild(this.renderer.domElement);
    
    // RAYCASTER
    // Initialize raycaster and 2D mouse vector in order for mouse to interact with 3D objects
    this.raycaster = new THREE.Raycaster(); 
    this.mouse = new THREE.Vector2(-1,-1);
    
    // ANIMATION VALUES
    // Initialize values to be used when animating the small sphere's orbit around the big sphere
    this.r = 7;
    this.theta = 0;
    this.dTheta = 2 * Math.PI / 1000;
    this.center = new THREE.Vector3();
    this.dz = .3;
  };
  
  onMouseClick = event => { 
    // Calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    this.mouse.x = (event.clientX / this.mount.current.clientWidth) * 2 - 1; 
    this.mouse.y = - (event.clientY / this.mount.current.clientHeight) * 2 + 1; 
  } 
  
  createBackground = () => {
    // SPACE BACKGROUND
    // Create loader to load space texture
    const loader = new THREE.TextureLoader();
    // Load space texture and have it wrap with repeating enabled
    loader.load(space, texture => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.offset.set(0, 0);
        texture.repeat.set(1, 1);
        // Create new sphere geometry and map the space texture to both sides of it.
        const spaceGeometry = new THREE.SphereGeometry(1000, 50, 50);
        const spaceMaterial = new THREE.MeshLambertMaterial({
        map: texture,
        side: THREE.DoubleSide
      });
      // Add space geometry to the scene
      this.space = new THREE.Mesh(spaceGeometry, spaceMaterial);
      this.scene.add(this.space);
    });
    
    // NEBULA EFFECT
    // Create array to hold each nebula particle
    this.nebulaParticles = [];
    // Use same loader from space texture to load nebula cloud texture
    loader.load(nebula, texture => {
      const nebulaGeometry = new THREE.PlaneBufferGeometry(500,500);
      const nebulaMaterial = new THREE.MeshLambertMaterial({
        map: texture,
        transparent: true
      });
      // Generate 15 nebula and set their positions to be random
      for(let p = 0; p < 15; p++) {
        let nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
        nebula.position.set(
          Math.random() * 400 - 150,
          Math.random() * 400 - 150,
          -200
        );
        // Set opacity of each nebula to allow for them to overlay each other
        nebula.material.opacity = 0.25;
        // Add each nebula to array and scene
        this.nebulaParticles.push(nebula);
        this.scene.add(nebula);
      }
    });
  };
  
  createViget = () => {
    // BIG BLUE SPHERE
    // Create sphere mesh with new geometry and material
    const bigSphereGeometry = new THREE.SphereGeometry(5, 50, 50);
    const bigSphereMaterial = new THREE.MeshLambertMaterial({
      color: 0x1595BA
    });
    this.bigSphere = new THREE.Mesh(bigSphereGeometry, bigSphereMaterial);
    this.bigSphere.position.set(0, 5, 0);
    // Add big sphere to scene
    this.scene.add(this.bigSphere);
   
    // SMALL ORANGE SPHERE
    // Create sphere mesh with new geometry and material
    const smallSphereGeometry = new THREE.SphereGeometry(2, 50,50);
    const smallSphereMaterial = new THREE.MeshLambertMaterial({
      color: 0xF16C20
    });
    this.smallSphere = new THREE.Mesh(smallSphereGeometry, smallSphereMaterial);
    // Set position so small orange sphere can orbit around big blue sphere
    this.smallSphere.position.set(7, 10, 0); 
    // Add small sphere to scene
    this.scene.add(this.smallSphere);
  };
  
  createText = () => {
    // TEXT
    // Create font loader
    const fontLoader = new THREE.FontLoader();
    // Use parse instead of load the font since the font is being imported as json and does not need to be loaded with an async call.
    const font = fontLoader.parse(verano);
    // Create text geometry with string and options object
    const textGeometry = new THREE.TextGeometry('viget', {
      font: font,
      size: 10,
      height: 3,
      curveSegments: 20,
      bevelEnabled: false
    } );
    // Create text material
    const textMaterial = new THREE.MeshLambertMaterial({
      color: 0xc4c4c4
    });
    // Create text mesh, position it under the animated logo, and add to scene
    this.text = new THREE.Mesh(textGeometry, textMaterial);
    this.text.position.set(-15, -10, 0);
    this.scene.add(this.text);
  };

  resize = () => {
    // Make window responsive so animation won't become distorted or clipped on resize
    window.addEventListener('resize', () => {
      const tanFOV = Math.tan((( Math.PI / 180 ) * this.camera.fov / 2 ));
      this.camera.aspect = this.mount.current.clientWidth / this.mount.current.clientHeight;
      this.camera.fov = (360 / Math.PI) * Math.atan(tanFOV * (this.mount.current.clientHeight / this.mount.current.clientHeight));
      this.camera.updateProjectionMatrix();
      this.camera.lookAt(this.scene.position);
      this.renderer.setSize(this.mount.current.clientWidth, this.mount.current.clientHeight);
      this.renderer.render(this.scene, this.camera);
    });
  };
  
  start = () => {
    // Starts the animation when called
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  }
  
  stop = () => {
    // Stops the animation when called
    cancelAnimationFrame(this.frameId);
  };
    
  animate = () => {
    //Rotate nebula particles so they appear floating
    this.nebulaParticles.forEach(nebulaParticle => {
      nebulaParticle.rotation.z -=0.001;
    });
  
    if (this.camera.position.z < 45) {
      // Move camera for zoom-out effect on z-axis
      this.camera.position.z += this.dz;
    } else {
      // Stop camera from zooming out any further once it reaches a position of 45 on z-axis
      this.camera.position.set(0,0,45);
    }
    
    // Have camera always facing the center at the origin (0,0,0)
    this.camera.lookAt(this.center);
    
    // Have small sphere orbit around the big sphere
    this.theta += this.dTheta;
    this.smallSphere.position.x = this.r * Math.cos(this.theta);
    this.smallSphere.position.z = this.r * Math.sin(this.theta);
    
    // Render the scene
    this.renderScene();
    
    // Add mouse click event listener so user can click on 3D objects in the scene
    window.addEventListener('click', this.onMouseClick, false);
    
    // Create loop to call animate function over and over (60 fps)
    this.frameId = window.requestAnimationFrame(this.animate);
  };
   
  renderScene = () => {
    // Only allow user to click on 3D objects when camera has stopped moving and menu isn't opened
    if (this.camera.position.z === 45 && !this.props.menu) {
      // Update the raycaster with the current camera and mouse position
      this.raycaster.setFromCamera(this.mouse, this.camera);
      // Calculate objects intersecting the raycaster
      const intersects = this.raycaster.intersectObjects([this.smallSphere, this.bigSphere, this.text]);
       for (let i = 0; i < intersects.length; i++) {
          console.log('hit');
       }
      this.mouse = new THREE.Vector2(-1,-1);
    }
    this.renderer.render(this.scene, this.camera);
  }
  
  render(){
      return(
        <div
          className="viget"
          ref={this.mount}
        />
      )
    }
}
