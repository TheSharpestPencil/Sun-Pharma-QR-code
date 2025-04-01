// Event configuration
const EVENT_CONFIG = {
  startDate: '2025-03-31', // Monday
  endDate: '2025-04-04',   // Friday
  images: {
    '2025-03-31': [
      'Sun-Pharma-Infinite-Logo-Loop-2.gif_V2.gif',
      'Day 1.jpg',
      'Agenda-1.jpg',
      'Ruans-Birthday-Message.jpg'
    ],
    '2025-04-01': [
      'Sun-Pharma-Infinite-Logo-Loop-2.gif_V2.gif',
      'Day 2.jpg',
      'Infinte Agenda_test_V2_Page_2.jpg',
      'bonfire-flames-by-night-combustion-and-flammable-2025-01-27-16-27-56-utc.jpg'
    ],
    '2025-04-02': [
      'Sun-Pharma-Infinite-Logo-Loop-2.gif_V2.gif',
      'Welcome-Letter-3.jpg',
      'Agenda-3.jpg',
    ],
    '2025-04-03': [
      'Sun-Pharma-Infinite-Logo-Loop-2.gif_V2.gif',
      'Welcome-Letter-4.jpg',
      'Agenda-4.jpg',
      'Nitashas-Birthday-Message.jpg'
    ]
  },
  defaultImage: 'Coming soon message.jpg'
};

// Elements
const gifContainer = document.getElementById('gif-container');
const imageContainer = document.getElementById('image-container');
const eventImage = document.getElementById('event-image');
const logoImage = document.getElementById('logo-image'); // Add <img id="logo-image"> to your HTML

// Function to fetch the current date and show event
function init() {
  fetch('https://worldtimeapi.org/api/timezone/Africa/Johannesburg')
    .then(response => response.json())
    .then(data => {
      const currentDate = new Date(data.datetime);
      showEvent(currentDate);
    })
    .catch(() => {
      console.log('Time API failed, using local time.');
      showEvent(new Date());
    });
}

// Function to display the event for a given date
function showEvent(date) {
  const formattedDate = date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
  let images = EVENT_CONFIG.images[formattedDate] || [EVENT_CONFIG.defaultImage];

  // Extract the logo (first image) and remaining images
  const logo = images[0] || EVENT_CONFIG.defaultImage;
  let remainingImages = images.slice(1);
  if (remainingImages.length === 0) {
    remainingImages = [EVENT_CONFIG.defaultImage];
  }

  // Set up the logo display
  logoImage.src = logo;
  logoImage.onload = () => {
    // Show logo container first
    gifContainer.style.opacity = '1';
    gifContainer.style.visibility = 'visible';
    imageContainer.style.opacity = '0';
    imageContainer.style.visibility = 'hidden';

    // Transition to images after 2 seconds (GIF logo)
    setTimeout(() => {
      gifContainer.style.opacity = '0';
      gifContainer.style.visibility = 'hidden';
      imageContainer.style.opacity = '1';
      imageContainer.style.visibility = 'visible';

      let index = 0;
      
      function cycleImages() {
        if (index < remainingImages.length) {
          eventImage.src = remainingImages[index];
          eventImage.onerror = () => {
            eventImage.src = EVENT_CONFIG.defaultImage;
          };
          index++;
          setTimeout(cycleImages, 10000); // Transition every 2 seconds
        } else {
          // Restart image cycle if all images have been shown
          index = 0;
          setTimeout(cycleImages, 2000); // Restart the cycle
        }
      }

      // Start cycling through remaining images
      cycleImages();
    }, 10000); // Delay before transitioning to main images
  };

  // Error handling for logo image
  logoImage.onerror = () => {
    logoImage.src = EVENT_CONFIG.defaultImage;
  };
}

// Start the show
window.onload = init;
