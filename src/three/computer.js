import * as THREE from 'three'

// Computador dos anos 90 montado só com formas básicas: gabinete, monitor CRT,
// drives e LEDs. Devolve o grupo e a malha da tela, usada para posicionar a janela XP.
export function createComputer() {
  const group = new THREE.Group()

  // Plástico ABS bege, com pouco brilho, como os gabinetes da época
  const caseMat = new THREE.MeshPhongMaterial({ color: 0xcecece, specular: 0x111111, shininess: 15 })
  const monitorMat = new THREE.MeshPhongMaterial({ color: 0xdedede, specular: 0x222222, shininess: 25 })
  const darkMat = new THREE.MeshPhongMaterial({ color: 0x222222, specular: 0x111111, shininess: 10 })
  const screenMat = new THREE.MeshBasicMaterial({ color: 0x001a0d })
  const trimMat = new THREE.MeshPhongMaterial({ color: 0xaca899, specular: 0x111111, shininess: 30 })
  const slotMat = new THREE.MeshPhongMaterial({ color: 0x111111, specular: 0x333333, shininess: 50 })
  const greenLed = new THREE.MeshBasicMaterial({ color: 0x00ff00 })

  // Gabinete deitado, com o monitor em cima
  const pcCase = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.8, 2.5), caseMat)
  pcCase.position.y = 0.4
  group.add(pcCase)

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.7, 0.15, 16), darkMat)
  base.position.y = 0.875
  group.add(base)

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.1, 16), darkMat)
  neck.position.y = 0.95
  group.add(neck)

  const monitor = new THREE.Mesh(new THREE.BoxGeometry(2, 1.8, 1.8), monitorMat)
  monitor.position.y = 1.9
  monitor.rotation.x = -0.05
  group.add(monitor)

  // A tela é filha do monitor: acompanha a inclinação dele
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.3), screenMat)
  screen.position.set(0, 0.05, 0.91)
  monitor.add(screen)

  // Botões de ajuste e power do monitor
  const monitorButtons = new THREE.Group()
  monitorButtons.position.set(0, -0.75, 0.91)
  monitor.add(monitorButtons)

  const adjustMat = new THREE.MeshPhongMaterial({ color: 0x999999, specular: 0x222222 })
  const adjustGeo = new THREE.BoxGeometry(0.12, 0.04, 0.02)
  for (let i = 0; i < 4; i++) {
    const button = new THREE.Mesh(adjustGeo, adjustMat)
    button.position.set(-0.35 + i * 0.18, 0, 0)
    monitorButtons.add(button)
  }

  const monitorPower = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.02, 16), adjustMat)
  monitorPower.rotation.x = Math.PI / 2
  monitorPower.position.set(0.6, 0, 0)
  monitorButtons.add(monitorPower)

  const monitorLed = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 8), greenLed)
  monitorLed.position.set(0.5, 0, 0)
  monitorButtons.add(monitorLed)

  // Drive de disquete
  const floppy = new THREE.Group()
  floppy.position.set(0, 0.25, 1.251)
  group.add(floppy)
  floppy.add(new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.08, 0.04), trimMat))

  const floppySlotGeo = new THREE.BoxGeometry(0.28, 0.02, 0.03)
  floppySlotGeo.translate(0, 0, -0.015)
  const floppySlot = new THREE.Mesh(floppySlotGeo, slotMat)
  floppySlot.position.z = 0.021
  floppy.add(floppySlot)

  const floppyEject = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.03, 0.03), trimMat)
  floppyEject.position.set(0.18, -0.01, 0.036)
  floppy.add(floppyEject)

  // Botão power e LEDs do gabinete
  const power = new THREE.Group()
  power.position.set(-0.7, 0.15, 1.251)
  group.add(power)

  const powerButtonMat = new THREE.MeshPhongMaterial({ color: 0x7fff00, specular: 0x666666, shininess: 80 })
  const powerButton = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.04, 24), powerButtonMat)
  powerButton.rotation.x = Math.PI / 2
  powerButton.position.z = 0.021
  power.add(powerButton)

  const ledGeo = new THREE.SphereGeometry(0.018, 16, 16)
  const ledPower = new THREE.Mesh(ledGeo, greenLed)
  ledPower.position.set(0.12, 0, 0.016)
  power.add(ledPower)

  const activityMat = new THREE.MeshBasicMaterial({ color: 0xffa500, transparent: true, opacity: 0.7 })
  const ledActivity = new THREE.Mesh(ledGeo, activityMat)
  ledActivity.position.set(0.17, 0, 0.016)
  power.add(ledActivity)

  // Drive de CD-ROM
  const cd = new THREE.Group()
  cd.position.set(0, 0.55, 1.251)
  group.add(cd)
  cd.add(new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.12, 0.05), trimMat))

  const cdSlotGeo = new THREE.BoxGeometry(0.45, 0.03, 0.04)
  cdSlotGeo.translate(0, 0, -0.02)
  const cdSlot = new THREE.Mesh(cdSlotGeo, slotMat)
  cdSlot.position.z = 0.026
  cd.add(cdSlot)

  const cdEject = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.018, 0.025), trimMat)
  cdEject.position.set(0.2, -0.03, 0.036)
  cd.add(cdEject)

  const cdLed = new THREE.Mesh(new THREE.SphereGeometry(0.01, 10, 10), greenLed)
  cdLed.position.set(-0.2, -0.03, 0.03)
  cd.add(cdLed)

  // Grade de ventilação na lateral direita
  const vents = new THREE.Group()
  vents.position.set(1.251, 0.3, 0.5)
  group.add(vents)

  const ventGeo = new THREE.BoxGeometry(0.02, 0.02, 0.8)
  const ventMat = new THREE.MeshBasicMaterial({ color: 0x111111 })
  for (let i = 0; i < 8; i++) {
    const vent = new THREE.Mesh(ventGeo, ventMat)
    vent.position.set(0, i * 0.04, 0)
    vents.add(vent)
  }

  // Plaqueta de metal da marca
  const badgeMat = new THREE.MeshPhongMaterial({ color: 0xaaaaaa, specular: 0xffffff, shininess: 100 })
  const badge = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.08, 0.01), badgeMat)
  badge.position.set(0, 0.65, 1.251)
  group.add(badge)

  const logo = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.03, 0.01),
    new THREE.MeshBasicMaterial({ color: 0x000000 }),
  )
  logo.position.z = 0.005
  badge.add(logo)

  return { group, screen }
}
