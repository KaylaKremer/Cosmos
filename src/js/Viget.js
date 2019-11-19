import React, { Component } from 'react';
import * as THREE from 'three';
import '../scss/viget.scss';
import space from '../images/space.jpg';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default class Viget extends Component {

  constructor(props) {
    super(props);
    this.mount = React.createRef();
  }
  
  componentDidMount(){
    const mount = this.mount.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;
    //ADD SCENE
    this.scene = new THREE.Scene();
    
    //ADD CAMERA
    this.camera = new THREE.PerspectiveCamera(
      45,
      width / height,
      0.1,
      10000
    );
    this.camera.position.set(0,0,30);
    
    //ADD RENDERER
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor('#000000');
    this.renderer.setSize(width, height);
    mount.appendChild(this.renderer.domElement);
    
    // MAKE WINDOW RESPONSIVE
    window.addEventListener('resize', () => {
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
 
    //ADD CONTROLS
    this.controls = new OrbitControls( this.camera, this.renderer.domElement);
    this.controls.enableZoom = false;
    
    //ADD LIGHT
    this.ambientLight = new THREE.AmbientLight(0x888888);
    this.directionalLight = new THREE.DirectionalLight(0xfdfc0, 1);
    this.directionalLight.position.set(20,10,20)
    this.scene.add(this.ambientLight);
    this.scene.add(this.directionalLight);
    
    //ADD BIG SPHERE MESH
    const bigSphereGeometry = new THREE.SphereGeometry(5, 50, 50);
    const bigSphereMaterial = new THREE.MeshLambertMaterial({
      color: 0x1595BA,
      specular: 0x333333
    });
    this.bigSphere = new THREE.Mesh(bigSphereGeometry, bigSphereMaterial);
    this.scene.add(this.bigSphere);
    
    // ADD SMALL SPHERE MESH
    const smallSphereGeometry = new THREE.SphereGeometry(2, 50,50);
    const smallSphereMaterial = new THREE.MeshLambertMaterial({
      color: 0xF16C20,
      specular: 0x333333
    });
    this.smallSphere = new THREE.Mesh(smallSphereGeometry, smallSphereMaterial);
    this.smallSphere.position.set(7, 5, 0);
    this.scene.add(this.smallSphere);
    
    //ADD SPACE BACKGROUND MESH
    const loader = new THREE.TextureLoader();
    loader.load( space, texture => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.offset.set(0, 0);
        texture.repeat.set(2, 2);
        const spaceGeometry = new THREE.SphereGeometry(1000, 50, 50);
        const spaceMaterial = new THREE.MeshLambertMaterial({
        map: texture,
        side: THREE.DoubleSide
      });
    this.spaceField = new THREE.Mesh(spaceGeometry, spaceMaterial);
    this.scene.add(this.spaceField);
    });
    
    this.r = 7;
    this.theta = 0;
    this.dTheta = 2 * Math.PI / 1000;
    
    this.sphereVector = new THREE.Vector3(0,0,0);
    this.dx = .01;
    this.dy = -.01;
    this.dz = -.05;

    this.start();
  }
  
  componentWillUnmount(){
      const mount = this.mount.current;
      this.stop();
      mount.removeChild(this.renderer.domElement);
  }
  
  start = () => {
      if (!this.frameId) {
        this.frameId = requestAnimationFrame(this.animate);
      }
  }
  
  stop = () => {
      cancelAnimationFrame(this.frameId);
  }
    
  animate = () => {
    this.bigSphere.rotation.y += .0005;
    
    //Move camera for fly-by effect
    this.camera.position.x += this.dx;
    this.camera.position.y += this.dy;
    this.camera.position.z += this.dz;
  
    //Reset camera to original position
    if (this.camera.position.z < -100) {
      this.camera.position.set(0,35,70);
    }
    
    //Have camera always facing the sphere vector at the origin (0,0,0)
    this.camera.lookAt(this.sphereVector);
    
    // Have small sphere orbit around the big sphere
    this.theta += this.dTheta;
    this.smallSphere.position.x = this.r * Math.cos(this.theta);
    this.smallSphere.position.z = this.r * Math.sin(this.theta);
    
    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate);
  };
   
  renderScene = () => {
    this.renderer.render(this.scene, this.camera);
  }
  
  render(){
      return(
        <div className="viget-logo"
          ref={this.mount}
        />
      )
    }
}
