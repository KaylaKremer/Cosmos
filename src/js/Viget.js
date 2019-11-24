import React, { Component } from 'react';
import * as THREE from 'three';
import '../scss/viget.scss';
import space from '../images/space.jpg';
import nebula from '../images/nebula.png';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default class Viget extends Component {

  constructor(props) {
    super(props);
    this.mount = React.createRef();
  }
  
  componentDidMount(){
    this.init();
    this.createBackground();
    this.createViget();
    this.resize();
    this.start();
  }
  
  componentWillUnmount(){
      const mount = this.mount.current;
      this.stop();
      mount.removeChild(this.renderer.domElement);
  }
  
  init = () => {
    // Store DOM reference as well as its width and height in variables
    const mount = this.mount.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;
    
    // SCENE
    // Create new scene with fog
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x042e5b, 0.001);
    
    // CAMERA
    // Create new perspective camera
    this.camera = new THREE.PerspectiveCamera(
      60,
      width / height,
      0.1,
      10000
    );
    // Set camera's z position to be further away so it doesn't sit on top of the geometry rendered at (0,0,0).
    this.camera.position.set(0,0,30);
    
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
    this.renderer.setSize(width, height);
    mount.appendChild(this.renderer.domElement);
 
    // CONTROLS
    // Add orbit controls to the renderer and enable zoom
    this.controls = new OrbitControls( this.camera, this.renderer.domElement);
    this.controls.enableZoom = true;
    
    // ANIMATION VALUES
    // Initialize values to be used when animating the small sphere's orbit around the big sphere
    this.r = 7;
    this.theta = 0;
    this.dTheta = 2 * Math.PI / 1000;
    
    // this.sphereVector = new THREE.Vector3(0,0,0);
    // this.dx = .01;
    // this.dy = -.01;
    // this.dz = -.05;
  };
  
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
    // Add big sphere to scene
    this.scene.add(this.bigSphere);
   
    // SMALL ORANGE SPHERE
    // Create sphere mesh with new geometry and material
    const smallSphereGeometry = new THREE.SphereGeometry(2, 50,50);
    const smallSphereMaterial = new THREE.MeshLambertMaterial({
      color: 0xF16C20
    });
    this.smallSphere = new THREE.Mesh(smallSphereGeometry, smallSphereMaterial);
    // Set position so small orange sphere can orbit around the big blue sphere
    this.smallSphere.position.set(7, 5, 0);
    // Add small sphere to scene
    this.scene.add(this.smallSphere);
  };
  
  resize = () => {
    //Make window responsive so animation won't become distorted or clipped on resize
    window.addEventListener('resize', () => {
      const mount = this.mount.current;
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      const tanFOV = Math.tan((( Math.PI / 180 ) * this.camera.fov / 2 ));
      this.camera.aspect = width / height;
      this.camera.fov = (360 / Math.PI) * Math.atan(tanFOV * (mount.clientHeight / height));
      this.camera.updateProjectionMatrix();
      this.camera.lookAt(this.scene.position);
      this.renderer.setSize(width, height);
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
    
    //
    this.bigSphere.rotation.y += .0005;
    
    
    //Move camera for fly-by effect
    // this.camera.position.x += this.dx;
    // this.camera.position.y += this.dy;
    // this.camera.position.z += this.dz;
  
    //Reset camera to original position
    // if (this.camera.position.z < -100) {
    //   this.camera.position.set(0,35,70);
    // }
    
    //Have camera always facing the sphere vector at the origin (0,0,0)
    // this.camera.lookAt(this.sphereVector);
    
    // Have small sphere orbit around the big sphere
    this.theta += this.dTheta;
    this.smallSphere.position.x = this.r * Math.cos(this.theta);
    this.smallSphere.position.z = this.r * Math.sin(this.theta);
    
    // Render the scene
    this.renderScene();
    
    // Create loop to call animate function over and over (60 fps)
    this.frameId = window.requestAnimationFrame(this.animate);
  };
   
  renderScene = () => {
    this.renderer.render(this.scene, this.camera);
  }
  
  render(){
      return(
        <div className="viget"
          ref={this.mount}
        />
      )
    }
}
