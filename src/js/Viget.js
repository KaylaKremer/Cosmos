import React, { Component } from 'react';
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import '../scss/viget.scss';

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
      1000
    );
    this.camera.position.set(0,0,10);
    
    //ADD RENDERER
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor('#000000');
    this.renderer.setSize(width, height);
    mount.appendChild(this.renderer.domElement);
 
    //ADD CONTROLS
    this.controls = new OrbitControls( this.camera, this.renderer.domElement);
    //this.controls.enableZoom = false;
    
    //ADD LIGHT
    this.ambientLight = new THREE.AmbientLight(0x888888);
    this.directionalLight = new THREE.DirectionalLight(0xfdfc0, 1);
    this.directionalLight.position.set(20,10,20)
    this.scene.add(this.ambientLight);
    this.scene.add(this.directionalLight);
    
    //ADD GEOMETRIES
    const bigSphereGeometry = new THREE.SphereGeometry( 3, 50, 50 );
    const bigSphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x1595BA,
      specular: 0x333333,
      shininess: 25
    });
    this.bigSphere = new THREE.Mesh(bigSphereGeometry, bigSphereMaterial);
    this.scene.add(this.bigSphere);

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
     this.bigSphere.rotation.y -= .0005;
     this.renderScene();
     this.frameId = window.requestAnimationFrame(this.animate);
   }
   
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
