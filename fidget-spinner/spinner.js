// Fidget Spinner Inertia Physics
document.addEventListener('DOMContentLoaded', () => {
  const spinner = document.getElementById('spinnerBody');
  const currentRpmEl = document.getElementById('currentRpm');
  const peakRpmEl = document.getElementById('peakRpm');

  let angle = 0;
  let velocity = 0;
  let peakRpm = 0;

  spinner.addEventListener('pointerdown', (e) => {
    velocity += 40 + Math.random() * 30;
  });

  function update() {
    angle += velocity;
    velocity *= 0.985; // friction

    if (velocity < 0.05) velocity = 0;

    spinner.style.transform = `rotate(${angle}deg)`;

    const rpm = Math.round((velocity * 60) / 360 * 60);
    currentRpmEl.innerText = `${rpm} RPM`;

    if (rpm > peakRpm) {
      peakRpm = rpm;
      peakRpmEl.innerText = `${peakRpm} RPM`;
    }

    requestAnimationFrame(update);
  }
  update();
});
