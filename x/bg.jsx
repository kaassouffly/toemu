import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const CyberpunkCityBackground = () => {
  const mountRef = useRef(null);
  
  useEffect(() => {
    const currentMount = mountRef.current;
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000011, 0.002);
    
    // Camera setup - bird's eye view
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      500
    );
    camera.position.set(0, 80, 0);
    camera.rotation.x = -Math.PI / 2;
    
    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: false
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000011);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    currentMount.appendChild(renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x1a1a3e, 0.3);
    scene.add(ambientLight);
    
    // City parameters
    const blockSize = 30;
    const streetWidth = 8;
    const cityBlocks = 6;
    const cityExtent = cityBlocks * blockSize / 2;
    
    // Base ground
    const groundSize = cityBlocks * blockSize + 100;
    const groundGeometry = new THREE.PlaneGeometry(groundSize, groundSize);
    const groundMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x0a0a0f
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    scene.add(ground);
    
    // Create streets - simple grid
    const streetMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x222233
    });
    
    // Street coordinates
    const streetCoords = [];
    for (let i = -cityBlocks/2; i <= cityBlocks/2; i++) {
      streetCoords.push(i * blockSize);
    }
    
    // Horizontal streets
    streetCoords.forEach(coord => {
      const street = new THREE.PlaneGeometry(groundSize, streetWidth);
      const streetMesh = new THREE.Mesh(street, streetMaterial);
      streetMesh.rotation.x = -Math.PI / 2;
      streetMesh.position.set(0, 0.01, coord);
      scene.add(streetMesh);
      
      // Street lines
      const lineGeometry = new THREE.PlaneGeometry(groundSize, 0.2);
      const lineMaterial = new THREE.MeshBasicMaterial({ color: 0x555566 });
      
      const line1 = new THREE.Mesh(lineGeometry, lineMaterial);
      line1.rotation.x = -Math.PI / 2;
      line1.position.set(0, 0.02, coord + streetWidth/2 - 0.5);
      scene.add(line1);
      
      const line2 = new THREE.Mesh(lineGeometry, lineMaterial);
      line2.rotation.x = -Math.PI / 2;
      line2.position.set(0, 0.02, coord - streetWidth/2 + 0.5);
      scene.add(line2);
    });
    
    // Vertical streets
    streetCoords.forEach(coord => {
      const street = new THREE.PlaneGeometry(streetWidth, groundSize);
      const streetMesh = new THREE.Mesh(street, streetMaterial);
      streetMesh.rotation.x = -Math.PI / 2;
      streetMesh.position.set(coord, 0.01, 0);
      scene.add(streetMesh);
      
      // Street lines
      const lineGeometry = new THREE.PlaneGeometry(0.2, groundSize);
      const lineMaterial = new THREE.MeshBasicMaterial({ color: 0x555566 });
      
      const line1 = new THREE.Mesh(lineGeometry, lineMaterial);
      line1.rotation.x = -Math.PI / 2;
      line1.position.set(coord + streetWidth/2 - 0.5, 0.02, 0);
      scene.add(line1);
      
      const line2 = new THREE.Mesh(lineGeometry, lineMaterial);
      line2.rotation.x = -Math.PI / 2;
      line2.position.set(coord - streetWidth/2 + 0.5, 0.02, 0);
      scene.add(line2);
    });
    
    // Street lamps - only at some intersections
    const lampIntersections = [];
    for (let x = -cityBlocks/2; x <= cityBlocks/2; x += 2) {
      for (let z = -cityBlocks/2; z <= cityBlocks/2; z += 2) {
        lampIntersections.push({ x: x * blockSize, z: z * blockSize });
      }
    }
    
    lampIntersections.forEach(pos => {
      // Place 4 lamps around intersection
      const offsets = [
        { x: streetWidth/2 + 2, z: streetWidth/2 + 2 },
        { x: -streetWidth/2 - 2, z: streetWidth/2 + 2 },
        { x: streetWidth/2 + 2, z: -streetWidth/2 - 2 },
        { x: -streetWidth/2 - 2, z: -streetWidth/2 - 2 }
      ];
      
      offsets.forEach(offset => {
        // Lamp pole
        const poleGeometry = new THREE.CylinderGeometry(0.2, 0.3, 10);
        const poleMaterial = new THREE.MeshLambertMaterial({ color: 0x333344 });
        const pole = new THREE.Mesh(poleGeometry, poleMaterial);
        pole.position.set(pos.x + offset.x, 5, pos.z + offset.z);
        scene.add(pole);
        
        // Lamp light
        const lampLight = new THREE.PointLight(0xffaa66, 1, 30);
        lampLight.position.set(pos.x + offset.x, 10, pos.z + offset.z);
        scene.add(lampLight);
        
        // Lamp bulb
        const bulbGeometry = new THREE.SphereGeometry(0.5);
        const bulbMaterial = new THREE.MeshBasicMaterial({ 
          color: 0xffaa66,
          emissive: 0xffaa66
        });
        const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
        bulb.position.copy(lampLight.position);
        scene.add(bulb);
      });
    });
    
    // Buildings - only in blocks, not on streets
    const buildings = [];
    for (let bx = -cityBlocks/2; bx < cityBlocks/2; bx++) {
      for (let bz = -cityBlocks/2; bz < cityBlocks/2; bz++) {
        // Block center
        const blockX = bx * blockSize + blockSize/2;
        const blockZ = bz * blockSize + blockSize/2;
        
        // Usable space in block (leaving margin from streets)
        const usableSize = blockSize - streetWidth - 4;
        
        // 1-3 buildings per block
        const numBuildings = 1 + Math.floor(Math.random() * 3);
        
        for (let i = 0; i < numBuildings; i++) {
          const width = 4 + Math.random() * 6;
          const depth = 4 + Math.random() * 6;
          const height = 20 + Math.random() * 40;
          
          const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
          const buildingMaterial = new THREE.MeshLambertMaterial({
            color: new THREE.Color(0.1, 0.1, 0.15),
            emissive: new THREE.Color(0.02, 0.02, 0.04)
          });
          
          const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
          
          // Random position within usable block area
          const xOffset = (Math.random() - 0.5) * (usableSize - width);
          const zOffset = (Math.random() - 0.5) * (usableSize - depth);
          
          building.position.set(
            blockX + xOffset,
            height / 2,
            blockZ + zOffset
          );
          
          building.castShadow = true;
          building.receiveShadow = true;
          
          // Simple windows
          const floors = Math.floor(height / 3);
          for (let f = 1; f < floors; f++) {
            // Random lit windows
            if (Math.random() > 0.5) {
              const windowColor = Math.random() > 0.5 ? 0x00ffff : 0xff00ff;
              const windowLight = new THREE.PointLight(windowColor, 0.5, 10);
              windowLight.position.set(
                building.position.x + (Math.random() - 0.5) * width,
                f * 3,
                building.position.z + (Math.random() - 0.5) * depth
              );
              scene.add(windowLight);
            }
          }
          
          buildings.push(building);
          scene.add(building);
        }
      }
    }
    
    // Vehicles with bright lights
    const vehicles = [];
    
    const createVehicle = () => {
      const vehicleGroup = new THREE.Group();
      
      // Car body
      const bodyGeometry = new THREE.BoxGeometry(2, 1, 4);
      const bodyColor = new THREE.Color(
        0.2 + Math.random() * 0.3,
        0.1 + Math.random() * 0.2,
        0.1 + Math.random() * 0.2
      );
      const bodyMaterial = new THREE.MeshLambertMaterial({ color: bodyColor });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.y = 0.5;
      vehicleGroup.add(body);
      
      // BRIGHT HEADLIGHTS
      const headlightGeometry = new THREE.SphereGeometry(0.3);
      const headlightMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 1
      });
      
      // Left headlight
      const leftHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
      leftHeadlight.position.set(-0.6, 0.5, 2);
      vehicleGroup.add(leftHeadlight);
      
      // Right headlight
      const rightHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
      rightHeadlight.position.set(0.6, 0.5, 2);
      vehicleGroup.add(rightHeadlight);
      
      // BRIGHT headlight beams
      const headlightBeam = new THREE.SpotLight(0xffffff, 2, 30, Math.PI / 6, 0.5);
      headlightBeam.position.set(0, 0.5, 2);
      headlightBeam.target.position.set(0, 0, 10);
      vehicleGroup.add(headlightBeam);
      vehicleGroup.add(headlightBeam.target);
      
      // Additional point light for glow
      const glowLight = new THREE.PointLight(0xffffff, 1, 20);
      glowLight.position.set(0, 0.5, 2);
      vehicleGroup.add(glowLight);
      
      // Tail lights
      const taillightMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xff0000,
        emissive: 0xff0000
      });
      
      const leftTaillight = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.2, 0.1),
        taillightMaterial
      );
      leftTaillight.position.set(-0.7, 0.5, -2);
      vehicleGroup.add(leftTaillight);
      
      const rightTaillight = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.2, 0.1),
        taillightMaterial
      );
      rightTaillight.position.set(0.7, 0.5, -2);
      vehicleGroup.add(rightTaillight);
      
      return vehicleGroup;
    };
    
    // Create vehicles on specific streets
    const vehicleRoutes = [
      // Horizontal streets
      { street: -60, direction: 'horizontal', lane: 2 },
      { street: -60, direction: 'horizontal', lane: -2 },
      { street: -30, direction: 'horizontal', lane: 2 },
      { street: -30, direction: 'horizontal', lane: -2 },
      { street: 0, direction: 'horizontal', lane: 2 },
      { street: 0, direction: 'horizontal', lane: -2 },
      { street: 30, direction: 'horizontal', lane: 2 },
      { street: 30, direction: 'horizontal', lane: -2 },
      { street: 60, direction: 'horizontal', lane: 2 },
      { street: 60, direction: 'horizontal', lane: -2 },
      // Vertical streets
      { street: -60, direction: 'vertical', lane: 2 },
      { street: -60, direction: 'vertical', lane: -2 },
      { street: -30, direction: 'vertical', lane: 2 },
      { street: -30, direction: 'vertical', lane: -2 },
      { street: 0, direction: 'vertical', lane: 2 },
      { street: 0, direction: 'vertical', lane: -2 },
      { street: 30, direction: 'vertical', lane: 2 },
      { street: 30, direction: 'vertical', lane: -2 },
      { street: 60, direction: 'vertical', lane: 2 },
      { street: 60, direction: 'vertical', lane: -2 }
    ];
    
    // Create 15 vehicles
    for (let i = 0; i < 15; i++) {
      const vehicle = createVehicle();
      const route = vehicleRoutes[Math.floor(Math.random() * vehicleRoutes.length)];
      
      // Initial position
      if (route.direction === 'horizontal') {
        vehicle.position.set(
          Math.random() * 200 - 100,
          0,
          route.street + route.lane
        );
        vehicle.rotation.y = route.lane > 0 ? Math.PI / 2 : -Math.PI / 2;
      } else {
        vehicle.position.set(
          route.street + route.lane,
          0,
          Math.random() * 200 - 100
        );
        vehicle.rotation.y = route.lane > 0 ? 0 : Math.PI;
      }
      
      vehicle.userData = {
        speed: 0.3 + Math.random() * 0.2,
        route: route
      };
      
      vehicles.push(vehicle);
      scene.add(vehicle);
    }
    
    // Neon signs
    buildings.forEach((building, idx) => {
      if (idx % 5 === 0) {
        const neonGeometry = new THREE.BoxGeometry(3, 1, 0.1);
        const neonColor = [0xff0088, 0x00ffff, 0xffff00][Math.floor(Math.random() * 3)];
        const neonMaterial = new THREE.MeshBasicMaterial({ 
          color: neonColor,
          emissive: neonColor
        });
        
        const neon = new THREE.Mesh(neonGeometry, neonMaterial);
        neon.position.set(
          building.position.x,
          building.position.y / 2 + 5,
          building.position.z + building.geometry.parameters.depth / 2 + 0.5
        );
        
        const neonLight = new THREE.PointLight(neonColor, 1, 20);
        neonLight.position.copy(neon.position);
        scene.add(neonLight);
        scene.add(neon);
      }
    });
    
    // Animation
    const clock = new THREE.Clock();
    let cameraAngle = 0;
    
    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      
      // VERY SLOW camera rotation
      cameraAngle += delta * 0.05; // Very slow rotation
      const radius = 40;
      camera.position.x = Math.sin(cameraAngle) * radius;
      camera.position.z = Math.cos(cameraAngle) * radius;
      camera.position.y = 80 + Math.sin(cameraAngle * 0.5) * 10;
      camera.lookAt(0, 0, 0);
      
      // Move vehicles ONLY on their streets
      vehicles.forEach(vehicle => {
        const route = vehicle.userData.route;
        
        if (route.direction === 'horizontal') {
          // Move along X axis
          vehicle.position.x += vehicle.userData.speed * (route.lane > 0 ? 1 : -1);
          
          // Keep on street
          vehicle.position.z = route.street + route.lane;
          
          // Wrap around
          if (vehicle.position.x > 100) vehicle.position.x = -100;
          if (vehicle.position.x < -100) vehicle.position.x = 100;
          
        } else {
          // Move along Z axis
          vehicle.position.z += vehicle.userData.speed * (route.lane > 0 ? 1 : -1);
          
          // Keep on street
          vehicle.position.x = route.street + route.lane;
          
          // Wrap around
          if (vehicle.position.z > 100) vehicle.position.z = -100;
          if (vehicle.position.z < -100) vehicle.position.z = 100;
        }
      });
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      currentMount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);
  
  return (
    <div 
      ref={mountRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1
      }}
    />
  );
};

export default CyberpunkCityBackground;