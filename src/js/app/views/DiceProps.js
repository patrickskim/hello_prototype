export default {
  Physics: {
    size: 40,
    options: {
      label: 'Die',
      frictionAir: 0.025,
      restitution: 0,
      density: 0.07
    }
  },
  Emitter: {
    alpha: {
      start: 0.8,
      end: 0.1
    },
    scale: {
      start: 1,
      end: 0.01
    },
    color: {
      start: 'fb1010',
      end: 'f5b830'
    },
    speed: {
      start: 200,
      end: 20
    },
    startRotation: {
      min: 90,
      max: 70
    },
    noRotation: true,
    rotationSpeed: {
      min: 0,
      max: 0
    },
    lifetime: {
      min: 0.2,
      max: 0.8
    },
    frequency: 0.008,
    emitterLifetime: -1,
    maxParticles: 20,
    pos: {
      x: 0,
      y: 0
    },
    addAtBack: false,
    spawnType: 'circle',
    spawnCircle: {
      x: 6,
      y: 0,
      r: 11
    }
  }
};
