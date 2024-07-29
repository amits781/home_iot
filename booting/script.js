async function checkHealth(url, elementId, checkStatus) {
    console.log(`Checking health for ${url}`);
    const healthSpan = document.getElementById(elementId);

    const intervalId = setInterval(async () => {
        try {
            const response = await fetch(url);
            if (response.status === 200) {
                
                healthSpan.textContent = 'UP';
                healthSpan.parentElement.classList.remove('status-fail')
                healthSpan.parentElement.classList.add('status-success')
                healthSpan.classList.remove('blinking-text');
                healthSpan.classList.add('glow-green');
                healthSpan.style.color = '#207e3c'; // Turn text green on success
                healthSpan.style.fontWeight = 900;
                clearInterval(intervalId); // Stop further checks
                checkStatus[elementId] = true; // Update check status
                checkStatus['start'] = checkStatus['end'];
                checkStatus['end'] = checkStatus['end'] + (100/checkStatus['checkCount']);
                move(checkStatus);
                // Check if both health checks are successful
                if (checkStatus['health-frontend'] && checkStatus['health-backend']) {
                    window.location.href = 'http://localhost:3000';
                }
            } else {
                healthSpan.textContent = 'Starting...';
                healthSpan.style.color = '#70acd9'; // Reset text color if not successful
            }
        } catch (error) {
            healthSpan.textContent = 'Starting...';
            healthSpan.style.color = '#70acd9'; // Reset text color if an error occurs
            console.error(`Error fetching health status from ${url}:`, error);
        }
    }, 5000); // Check every 5 seconds
}

function move(checkStatus) {
    var elem = document.getElementById("myBar");   
    var width = checkStatus['start'];
    var id = setInterval(frame, 10);
    function frame() {
      if (width >= checkStatus['end']) {
        clearInterval(id);
      } else {
        width++; 
        var value = '0 ' + (100 - width) +'% 0 0'
        elem.style.setProperty('--inset-value', value);
      }
    }
  }

// Call the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    const checkStatus = {
        'health-frontend': false,
        'health-backend': false,
        'start': 0,
        'end': 0,
        'checkCount': 2
    };

    checkHealth('http://localhost:3000/iot-actuator/health', 'health-frontend', checkStatus);
    checkHealth('http://localhost:8080/iot-actuator/health', 'health-backend', checkStatus);
});

