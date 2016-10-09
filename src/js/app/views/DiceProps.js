export default {
  Physics: {
    size: 40,
    options: {
      label: 'Die',
      frictionAir: 0.025,
      restitution: 0.3,
      density: 0.07
    }
  },
  Emitter: {
    alpha: {
      start: 0.5,
      end: 0.0
    },
    scale: {
      start: 0.4,
      end: 0.1
    },
    color: {
      start: 'ffffff',
      end: 'ffffff'
    },
    speed: {
      start: 100,
      end: 5
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
