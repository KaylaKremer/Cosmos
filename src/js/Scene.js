import React, { Component } from 'react';
import * as THREE from 'three';
import PropTypes from 'prop-types';
import '../scss/scene.scss';
// import space from '../images/space.jpg';
import nebula from '../images/nebula.png';
import verano from '../fonts/verano.typeface.json';
import { FlatShading } from 'three';

export default class Scene extends Component {
  
  mount = React.createRef();
  
  componentDidMount() {
    this.init();
    //this.createSpace();
    this.createNebula();
    this.createPlanet();
    this.createMoons();
    this.createText();
    this.resize();
    this.start();
  }
  
  componentWillUnmount() {
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
      45,
      this.mount.current.clientWidth / this.mount.current.clientHeight,
      0.1,
      10000
    );
    // Set camera's z position to be further away so it doesn't sit on top of the geometry rendered at (0,0,0).
    this.camera.position.set(0, 0, 0);
    
    // LIGHTS
    // Create ambient light and add to scene
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    this.scene.add(this.ambientLight);
    
    // Create directional light and add to scene
    this.directionalLight = new THREE.DirectionalLight(0xff8c19);
    this.directionalLight.position.set(0, 0, 1);
    this.scene.add(this.directionalLight);
  
    // Create three spotlights to add color variety to nebula texture and add all to scene
    // Green light
    this.redLight = new THREE.PointLight(0xed190e, 10, 550, 5);
    this.redLight.position.set(-50, 100, -150);
    this.scene.add(this.redLight);
    // Pink light
    this.pinkLight = new THREE.PointLight(0xef56dd, 10, 450, 2);
    this.pinkLight.position.set(-150, 150, -150);
    this.scene.add(this.pinkLight);
    // Purple light
    this.purpleLight = new THREE.PointLight(0xcf6df9, 10, 550, 2);
    this.purpleLight.position.set(-100, 200, -150);
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
    this.mouse = new THREE.Vector2(-1, -1);
    
    // ANIMATION VALUES
    // Initialize values to be used when animating the small sphere's orbit around the big sphere
    this.r1 = 9;
    this.r2 = -7;
    this.r3 = 11;
    this.theta1 = 0;
    this.theta2 = 5;
    this.theta3 = 0;
    this.dTheta1 = 3 * Math.PI / 1000;
    this.dTheta2 = 6 * Math.PI / 1000;
    this.dTheta3 = 4 * Math.PI / 1000;
    this.center = new THREE.Vector3();
    this.dz = 0.3;
  };
  
  onMouseClick = event => { 
    // Calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    this.mouse.x = (event.clientX / this.mount.current.clientWidth) * 2 - 1; 
    this.mouse.y = - (event.clientY / this.mount.current.clientHeight) * 2 + 1; 
  } 
  
  // Decided to remove the texture background, but leaving in code as reference
  // createSpace = () => {
  //   // SPACE
  //   // Create loader to load space texture
  //   const loader = new THREE.TextureLoader();
    
  //   // Load space texture and have it wrap with repeating enabled
  //   loader.load(space, texture => {
  //       texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  //       texture.offset.set(0, 0);
  //       texture.repeat.set(3, 3);
  //       // Create new sphere geometry and map the space texture to both sides of it.
  //       const spaceGeometry = new THREE.BoxGeometry(1000, 1000, 1000);
  //       const spaceMaterial = new THREE.MeshLambertMaterial({
  //       map: texture,
  //       side: THREE.DoubleSide
  //     });
      
  //     // Add space geometry to the scene
  //     this.space = new THREE.Mesh(spaceGeometry, spaceMaterial);
  //     this.space.opacity = 0.8;
  //     this.scene.add(this.space);
  //   });
  // };
  
  createNebula = () => {
    // NEBULA EFFECT
    // Create loader to load nebula texture
    const loader = new THREE.TextureLoader();
    
    // Create array to hold each nebula particle
    this.nebulaParticles = [];
    
    // Use same loader from space texture to load nebula cloud texture
    loader.load(nebula, texture => {
      const nebulaGeometry = new THREE.PlaneBufferGeometry(500,500);
      const nebulaMaterial = new THREE.MeshLambertMaterial({
        map: texture,
        transparent: true
      });
      
      // Generate 12 nebula and set their positions to be random
      for(let p = 0; p < 12; p++) {
        let nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
        nebula.position.set(
          Math.random() * 400 - 150,
          Math.random() * 400 - 150,
          -200
        );
        
        // Set opacity of each nebula to allow for them to overlay each other
        nebula.material.opacity = 0.15;
        
        // Add each nebula to array and scene
        this.nebulaParticles.push(nebula);
        this.scene.add(nebula);
      }
    });
  };
  
  createPlanet = () => {
    // PLANET
    // Create empty 3D object to act as a group for holding more than one mesh
    this.planetGroup = new THREE.Object3D();
    
    // Create planet mesh with icosahedron geometry and phong material
    const planetGeometry = new THREE.IcosahedronGeometry(7, 1);
    const planetMaterial = new THREE.MeshPhongMaterial({
      color: 0x80B1FF,
      shading: FlatShading
    });
    this.planet = new THREE.Mesh(planetGeometry, planetMaterial);
    this.planet.position.set(0, 0, 0);
    
    // Add planet mesh to planetGroup
    this.planetGroup.add(this.planet);
    
    // Repeat same process of creating the planet's wireframe mesh
    const planetWireframe = new THREE.IcosahedronGeometry(8.5, 1);
    const planetWireframeMaterial = new THREE.MeshPhongMaterial({
      color: 0xFFFFFF,
      shading: FlatShading,
      wireframe: true,
      side: THREE.DoubleSide
    });
    this.planetWireframe = new THREE.Mesh(planetWireframe, planetWireframeMaterial);
    this.planetWireframe.position.set(0, 0, 0);
    
    // Add planet wireframe mesh to the planetGroup
    this.planetGroup.add(this.planetWireframe);
    
    // Set planetGroup a bit higher on the screen
    this.planetGroup.position.y = 2;
    
    // Add planetGroup to the scene
    this.scene.add(this.planetGroup);
  };
  
  createMoons = () => {
    // MOON
    // Create empty 3D objects to act as a groups for holding two meshes for a moon
      this.moonGroup1 = new THREE.Object3D();
      this.moonGroup2 = new THREE.Object3D();
      this.moonGroup3 = new THREE.Object3D();
      
      // Create separate materials for the moons so they can be changed individually when user clicks on them
      const moonMaterial1 = new THREE.MeshPhongMaterial({
        color: 0xD680FF,
        shading: FlatShading
      });
      
      const moonMaterial2 = new THREE.MeshPhongMaterial({
        color: 0xD680FF,
        shading: FlatShading
      });
      
      const moonMaterial3 = new THREE.MeshPhongMaterial({
        color: 0xD680FF,
        shading: FlatShading
      });
      
      // Create moon wireframe material. This can be shared amongst all moons since it does not need to be interactive
      const moonWireframeMaterial = new THREE.MeshPhongMaterial({
        color: 0xFFFFFF,
        shading: FlatShading,
        wireframe: true,
        side: THREE.DoubleSide
      });
    
      // Create moon1 mesh with tetrahedron geometry and moonMaterial1
      const moon1 = new THREE.TetrahedronGeometry(1.75, 1);
      this.moon1 = new THREE.Mesh(moon1, moonMaterial1);
 
      // Repeat same process of creating the moon1's wireframe mesh, making it slightly bigger so the moon can fit inside it
      const moonWireframe1 = new THREE.TetrahedronGeometry(2, 1);
      this.moonWireframe1 = new THREE.Mesh(moonWireframe1, moonWireframeMaterial);
      
      // Add moon1 & moonWireframe1 meshes to moonGroup1
      this.moonGroup1.add(this.moon1);
      this.moonGroup1.add(this.moonWireframe1);
      
      // Repeat steps above to make moonGroup2 and moonGroup3, but with different sizes
      // Create moon2 mesh with tetrahedron geometry and moonMaterial2
      const moon2 = new THREE.TetrahedronGeometry(0.5, 1);
      this.moon2 = new THREE.Mesh(moon2, moonMaterial2);
 
      // Repeat same process of creating the moon2's wireframe mesh, making it slightly bigger so the moon can fit inside it
      const moonWireframe2 = new THREE.TetrahedronGeometry(0.75, 1);
      this.moonWireframe2 = new THREE.Mesh(moonWireframe2, moonWireframeMaterial);
      
      // Add moon2 & moonWireframe2 meshes to moonGroup2
      this.moonGroup2.add(this.moon2);
      this.moonGroup2.add(this.moonWireframe2);
      
     // Create moon3 mesh with tetrahedron geometry and moonMaterial3
      const moon3 = new THREE.TetrahedronGeometry(1, 1);
      this.moon3 = new THREE.Mesh(moon3, moonMaterial3);

     // Repeat same process of creating the moon3's wireframe mesh, making it slightly bigger so the moon can fit inside it
      const moonWireframe3 = new THREE.TetrahedronGeometry(1.25, 1);
      this.moonWireframe3 = new THREE.Mesh(moonWireframe3, moonWireframeMaterial);
     
     // Add moon3 & moonWireframe3 meshes to moonGroup3
      this.moonGroup3.add(this.moon3);
      this.moonGroup3.add(this.moonWireframe3);

     // Add all moonGroups to the scene
      this.scene.add(this.moonGroup1);
      this.scene.add(this.moonGroup2);
      this.scene.add(this.moonGroup3);
     
  };
  
  createText = () => {
    // TEXT
    // Create font loader
    const fontLoader = new THREE.FontLoader();
    
    // Use parse instead of load the font since the font is being imported as json and does not need to be loaded with an async call.
    const font = fontLoader.parse(verano);
    
    // Create text geometry with string and options object
    const textGeometry = new THREE.TextGeometry('Click on 3D objects\nto change the color!', {
      font,
      size: 1.25,
      height: 0.5,
      curveSegments: 20,
      bevelEnabled: false
    } );
    
    // Create text material
    const textMaterial = new THREE.MeshPhongMaterial({
      color: 0xFFFFFF,
      shading: FlatShading
    });
    
    // Create text mesh, position it under the animated logo, and add to scene
    this.text = new THREE.Mesh(textGeometry, textMaterial);
    this.text.position.set(-7.5, -12, 0);
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
    // Rotate nebula particles so they appear floating
    this.nebulaParticles.forEach(nebulaParticle => {
      nebulaParticle.rotation.z -= 0.001;
    });
    if (this.camera.position.z > 45) {
      // Move camera for zoom-out effect on z-axis
      this.camera.position.z += this.dz;
    } else {
      // Stop camera from zooming out any further once it reaches a position of 45 on z-axis
      this.camera.position.set(0, 0, 45);
    }
    // Have camera always facing the center at the origin (0,0,0)
    this.camera.lookAt(this.center);
    
    // Have moon groups spin on their axis and orbit around the planet
    this.theta1 += this.dTheta1;
    this.theta2 += this.dTheta2;
    this.theta3 -= this.dTheta3;
    
    this.moonGroup1.position.x = this.r1 * Math.cos(this.theta1) * 1.05;
    this.moonGroup1.position.y = this.r1 * Math.cos(this.theta1) * 0.75;
    this.moonGroup1.position.z = this.r1 * Math.sin(this.theta1) * 1.25;
    this.moonGroup1.rotation.y -= this.r1 * 0.0010;
    this.moonGroup1.rotation.z -= this.r1 * 0.0010;
    
    this.moonGroup2.position.x = this.r2 * Math.cos(this.theta2) * -1.25;
    this.moonGroup2.position.y = this.r2 * Math.cos(this.theta2);
    this.moonGroup2.position.z = this.r2 * Math.sin(this.theta2) * -1;
    this.moonGroup2.rotation.y -= this.r2 * 0.0050;
    this.moonGroup2.rotation.z -= this.r2 * 0.0025;
    
    this.moonGroup3.position.x = this.r3 * Math.cos(this.theta3) * 0.3;
    this.moonGroup3.position.y = this.r3 * Math.sin(this.theta3);
    this.moonGroup3.position.z = this.r3 * Math.cos(this.theta3);
    this.moonGroup3.rotation.y -= this.r3 * 0.0015;
    this.moonGroup3.rotation.z -= this.r3 * 0.0025;
    
    
    // Have planet always rotating on x and y axis
    this.planetGroup.rotation.x -= 0.0020;
    this.planetGroup.rotation.y -= 0.0030;
    
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
      // (Only the planet and moons should be intersected, not the moonGroups which include the wireframe!)
      const intersects = this.raycaster.intersectObjects([this.planet, this.moon1, this.moon2, this.moon3, this.text]);
      
      // Loop through the intersects array 
      for (let i = 0; i < intersects.length; i++) {
          // If there are any 3D objects the user's mouse intersected with, change that object's color to a random color
          intersects[i].object.material.color.setRGB(Math.random(), Math.random(), Math.random());
      }
      
      // Reset mouse's vector again to (-1, -1) so user can click on any object again
      this.mouse = new THREE.Vector2(-1, -1);
    }
    
    // Render with scene and camera
    this.renderer.render(this.scene, this.camera);
  }
  
  // Render the scene with the mount ref
  render() {
      return (
        <div
          className="scene"
          ref={this.mount}
        />
      );
    }
}

Scene.propTypes = {
  menu: PropTypes.bool.isRequired
};

