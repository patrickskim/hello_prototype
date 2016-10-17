export default {
  Physics: {
    size: 40,
    options: {
      label: 'Die',
      frictionAir: 0.025,
      restitution: 0.7,
      density: 0.07,
      collisionFilter: {
        category: 0x0002
      }
    }
  },
  Emitter: {
    alpha: {
      start: 1,
      end: 1
    },
    scale: {
      start: 1,
      end: 0.05
    },
    color: {
      start: 'ffffff',
      end: 'ffea34'
    },
    speed: {
      start: 100,
      end: 0
    },
    startRotation: {
      min: 0,
      max: 360
    },
    noRotation: true,
    rotationSpeed: {
      min: 0,
      max: 0
    },
    lifetime: {
      min: 0.1,
      max: 0.5
    },
    frequency: 0.008,
    emitterLifetime: -1,
    maxParticles: 20,
    pos: {
      x: 0,
      y: 0
    },
    addAtBack: true,
    spawnType: 'circle',
    spawnCircle: {
      x: 0,
      y: 0,
      r: 10
    }
  }
};
