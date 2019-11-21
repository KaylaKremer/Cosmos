import React, { Component } from 'react';
import * as THREE from 'three';
import '../scss/viget.scss';
import space from '../images/space.jpg';
import cloud from '../images/cloud.png';
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
    this.scene.fog = new THREE.FogExp2(0x03544e, 0.001);
    
    //ADD CAMERA
    this.camera = new THREE.PerspectiveCamera(
      60,
      width / height,
      1,
      10000
    );
    this.camera.position.set(0,0,30);
    
    //ADD LIGHT
    // this.ambientLight = new THREE.AmbientLight(0x888888);
    // this.directionalLight = new THREE.DirectionalLight(0xfdfc0, 1);
    // this.directionalLight.position.set(20,10,20)
    // this.scene.add(this.ambientLight);
    // this.scene.add(this.directionalLight);
    this.ambientLight = new THREE.AmbientLight(0x555555);
    this.scene.add(this.ambientLight);
    
    this.directionalLight = new THREE.DirectionalLight(0xff8c19);
    this.directionalLight.position.set(0,0,1);
    this.scene.add(this.directionalLight);
    
    this.orangeLight = new THREE.PointLight(0xcc6600,50,450,1.7);
    this.orangeLight.position.set(200,300,100);
    this.scene.add(this.orangeLight);
    
    this.redLight = new THREE.PointLight(0xd8547e,50,450,1.7);
    this.redLight.position.set(100,300,100);
    this.scene.add(this.redLight);
    
    this.blueLight = new THREE.PointLight(0x3677ac,50,450,1.7);
    this.blueLight.position.set(300,300,200);
    this.scene.add(this.blueLight);
    
    //ADD RENDERER
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor(this.scene.fog.color);
    this.renderer.setSize(width, height);
    mount.appendChild(this.renderer.domElement);
 
    //ADD CONTROLS
    this.controls = new OrbitControls( this.camera, this.renderer.domElement);
    this.controls.enableZoom = true;
    
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
    loader.load(space, texture => {
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
    
    //CREATE AND ADD NEBULA EFFECT
    this.cloudParticles = [];
    loader.load(cloud, texture => {
      const cloudGeometry = new THREE.PlaneBufferGeometry(500,500);
      const cloudMaterial = new THREE.MeshLambertMaterial({
        map: texture,
        transparent: true
      });
      for(let p=0; p<20; p++) {
        let cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
        cloud.position.set(
          Math.random()*800 -400,
          Math.random()*500-500,
          -200
          
        );
        // cloud.rotation.x = 1.16;
        // cloud.rotation.y = 90;
        // cloud.rotation.z = 10;
        //cloud.position.z = -200;
        cloud.material.opacity = 0.55;
        this.cloudParticles.push(cloud);
        this.scene.add(cloud);
      }
    });
    
    this.r = 7;
    this.theta = 0;
    this.dTheta = 2 * Math.PI / 1000;
    
    this.sphereVector = new THREE.Vector3(0,0,0);
    this.dx = .01;
    this.dy = -.01;
    this.dz = -.05;
    
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
    this.cloudParticles.forEach(cloudParticle => {
      cloudParticle.rotation.z -=0.001;
    });
  
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
