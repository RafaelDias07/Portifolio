import * as THREE from 'three'

// Campo de estrelas: pontos espalhados num cubo de 600 unidades ao redor do computador
export function createStars(count = 12000) {
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < positions.length; i++) {
    positions[i] = THREE.MathUtils.randFloatSpread(600)
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.8, sizeAttenuation: true })
  return new THREE.Points(geometry, material)
}

// Naves coloridas que cruzam o fundo de tempos em tempos
export function createSquadron(scene) {
  const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00]
  const geometry = new THREE.ConeGeometry(0.1, 0.5, 3)

  const ships = colors.map((color) => {
    const mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0 }),
    )
    mesh.add(new THREE.PointLight(color, 1, 5))
    mesh.visible = false
    scene.add(mesh)

    return { mesh, active: false, timer: Math.random() * 1000, speed: 0.15 + Math.random() * 0.2 }
  })

  function update() {
    for (const ship of ships) {
      const { mesh } = ship

      if (!ship.active) {
        ship.timer--
        if (ship.timer <= 0) {
          ship.active = true
          mesh.visible = true
          mesh.position.set(-20, Math.random() * 4 + 1, Math.random() > 0.5 ? 3 : -3)
          mesh.rotation.z = -Math.PI / 2
          mesh.material.opacity = 0
        }
        continue
      }

      mesh.position.x += ship.speed
      mesh.rotation.x += 0.1

      // Aparece e some aos poucos nas pontas do trajeto
      if (mesh.position.x < -10) mesh.material.opacity = Math.min(1, mesh.material.opacity + 0.02)
      else if (mesh.position.x > 10) mesh.material.opacity = Math.max(0, mesh.material.opacity - 0.02)
      else mesh.material.opacity = 1

      if (mesh.position.x > 20) {
        ship.active = false
        mesh.visible = false
        ship.timer = Math.random() * 1000 + 200
      }
    }
  }

  return { update }
}
