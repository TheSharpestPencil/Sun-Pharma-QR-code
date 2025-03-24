// Event configuration
const EVENT_CONFIG = {
  startDate: '2025-03-07', // Monday
  endDate: '2025-04-11',   // Friday
  images: {
    '2025-04-07': 'Day 1.jpg',
    '2025-04-08': 'Day 2.jpg',
    '2025-04-09': 'Day 3.jpg',
    '2025-04-10': 'Day 4.jpg',
    '2025-04-11': 'Day 5.jpg',
  },
  defaultImage: 'Comming soon message.jpg' // Fallback image in case of failure
};

// Elements
const gifContainer = document.getElementById('gif-container');
const imageContainer = document.getElementById('image-container');
const eventImage = document.getElementById('event-image');

// Function to fetch the current date and show event
function init() {
  // Try fetching the time for Johannesburg (South Africa)
  fetch('https://worldtimeapi.org/api/timezone/Africa/Johannesburg')
    .then(response => response.json())
    .then(data => {
      const currentDate = new Date(data.datetime);
      showEvent(currentDate);
    })
    .catch(() => {
      // If the API fails, use local time and show default image
      console.log('Time API failed, using local time.');
      showEvent(new Date());
    });
}

// Function to display the event
function showEvent(date) {
  const formattedDate = date.toISOString().split('T')[0]; // Format the date as YYYY-MM-DD
  
  // Determine which day's agenda image to show, default if outside event range
  let imageSrc = EVENT_CONFIG.images[formattedDate] || EVENT_CONFIG.defaultImage;

  // Show GIF first
  gifContainer.style.opacity = '1';
  gifContainer.style.visibility = 'visible';
  imageContainer.style.opacity = '0';
  imageContainer.style.visibility = 'hidden';

  // Wait for 3 seconds before fading in the image
  setTimeout(() => {
    eventImage.src = imageSrc;
    eventImage.onload = () => {
      gifContainer.style.opacity = '0';
      gifContainer.style.visibility = 'hidden';
      imageContainer.style.opacity = '1';
      imageContainer.style.visibility = 'visible';
    };
  }, 2000); // 3 seconds animation time
}

// Start the show
window.onload = init;

