let deviceOrientationData = { alpha: 0, beta: 0, gamma: 0 };

document.addEventListener("DOMContentLoaded", function () {
  // Select the container element
  const container = document.querySelector(".container");

  // Function to handle device motion/orientation
  function handleMotion(event) {
    // Access motion/orientation data from event
    const { alpha, beta, gamma } = event;

    // Store the data in the global variable
    deviceOrientationData = { alpha, beta, gamma };
  }

  // Add event listener for device motion/orientation
  window.addEventListener("deviceorientation", handleMotion);
});
