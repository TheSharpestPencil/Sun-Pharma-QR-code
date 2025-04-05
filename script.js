// Event configuration
const EVENT_CONFIG = {
  startDate: '2025-04-04',
  endDate: '2025-04-08',
  images: {
    '2025-04-04': [
      { src: 'Sun-Pharma-Infinite-Logo-Loop-2.gif_V2.gif', duration: 6000 },
      { src: 'welcome letter_V2.jpg', duration: 4000 },
      { src: '321909 Conference Agenda_V3.jpg', duration: 6000 },
      { src: 'Group 1 (1).jpg', duration: 7500 },
      { src: 'Group 1 (2).jpg', duration: 7500 },
      { src: 'Group 1 (3).jpg', duration: 7500 },
      { src: 'rules.jpg', duration: 7500 },
      { src: 'Happy birthday_02.jpg', duration: 60000 }
    ],
    '2025-04-05': [
      { src: 'Sun-Pharma-Infinite-Logo-Loop-2.gif_V2.gif', duration: 6000 },
      { src: 'welcome letter_V2.jpg', duration: 10000 },
      { src: '321909 Conference Agenda_V3.jpg', isAgenda: true },
      { src: '321909-Conference-Name-Tag_V2.gif', duration: 45000 }
    ],
    '2025-04-06': [
      { src: 'Sun-Pharma-Infinite-Logo-Loop-2.gif_V2.gif', duration: 6000 },
      { src: 'welcome letter_V2.jpg', duration: 40000 },
      { src: '321909 Conference Agenda_V3.jpg', isAgenda: true }
    ],
    '2025-04-07': [
      { src: 'Sun-Pharma-Infinite-Logo-Loop-2.gif_V2.gif', duration: 6000 },
      { src: 'welcome letter_V2.jpg', duration: 40000 },
      { src: '321909 Conference Agenda_V3.jpg', isAgenda: true }
    ],
    '2025-04-08': [
      { src: 'Sun-Pharma-Infinite-Logo-Loop-2.gif_V2.gif', duration: 7000 },
      { src: 'Happy birthday_01.jpg', duration: 25000 },
      { src: '321909 Conference Agenda_V3.jpg', isAgenda: true }
    ]
  },
  defaultImage: 'Coming-soon-message.jpg'
};

// Elements
const eventImage = document.getElementById('event-image');
const imageContainer = document.getElementById('image-container');
const agendaContainer = document.createElement('div');
const agendaImage = document.createElement('img');

// Set attributes for agenda container
agendaContainer.id = 'agenda-container';
agendaImage.id = 'agenda-image';
agendaContainer.appendChild(agendaImage);
document.body.appendChild(agendaContainer);

// Initialize function
function init() {
  fetch('https://worldtimeapi.org/api/timezone/Africa/Johannesburg')
    .then(response => response.json())
    .then(data => {
      const currentDate = new Date(data.datetime);
      showEvent(currentDate);
    })
    .catch(() => {
      console.log('Using local time');
      showEvent(new Date());
    });
}

// Show event logic
function showEvent(initialDate) {
  const formattedDate = initialDate.toISOString().split('T')[0];
  let schedule = EVENT_CONFIG.images[formattedDate]
    ? [...EVENT_CONFIG.images[formattedDate]]
    : [{ src: EVENT_CONFIG.defaultImage, duration: 10000 }];

  // Get current time in minutes (24-hour format)
  const currentHours = initialDate.getHours();
  const currentMinutes = initialDate.getMinutes();
  const currentTimeInMinutes = currentHours * 60 + currentMinutes;
  const changeTimeInMinutes = 12 * 60; // 12:00 PM (Noon)

  if (formattedDate === '2025-04-08') {
    if (currentTimeInMinutes < changeTimeInMinutes) {
      // Before 12:00 PM (Noon)
      schedule.splice(1, 0, { src: 'welcome letter_V2.jpg', duration: 60000 });
      schedule.splice(2, 0, { src: '321909 Conference Agenda_V3.jpg', duration: 60000 });
    } else {
      // After 12:00 PM (Noon)
      schedule.splice(1, 0, { src: '321909-Conference-Name-Tag_V2.gif', duration: 45000 });
      schedule.splice(2, 0, { src: '321909 Conference Agenda_V3.jpg', duration: 60000 });
    }
  }

  let currentIndex = 0;

  function processNextItem() {
    if (currentIndex >= schedule.length) return;

    const item = schedule[currentIndex];

    if (item.isAgenda) {
      // Show agenda mode
      imageContainer.style.display = 'none';
      agendaContainer.style.display = 'block';
      agendaImage.src = item.src;
      agendaImage.onload = () => {
        agendaContainer.scrollTo({ top: 0, behavior: 'smooth' });
      };
    } else {
      // Normal slideshow mode
      imageContainer.style.display = 'flex';
      agendaContainer.style.display = 'none';
      
      // Check if this is the GIF file that should not have transitions
      if (item.src === 'Sun-Pharma-Infinite-Logo-Loop-2.gif_V2.gif') {
        eventImage.classList.add('no-transition');
        eventImage.src = item.src;
        setTimeout(processNextItem, item.duration);
      } else {
        // Remove no-transition class if it exists
        eventImage.classList.remove('no-transition');
        
        // Fade out current image
        eventImage.classList.remove('fade-in');
        
        // Wait for fade out to complete
        setTimeout(() => {
          eventImage.src = item.src;
          eventImage.onload = () => {
            // Fade in new image
            eventImage.classList.add('fade-in');
            
            // Schedule next item
            setTimeout(() => {
              // Fade out before next image
              eventImage.classList.remove('fade-in');
              setTimeout(processNextItem, 1000); // Wait for fade out
            }, item.duration - 1000); // Subtract fade out time
          };
          eventImage.onerror = () => {
            eventImage.src = EVENT_CONFIG.defaultImage;
            eventImage.classList.add('fade-in');
          };
        }, 1000); // Wait for fade out to complete
      }
    }

    currentIndex++;
  }

  // Start processing
  processNextItem();
}

// Initialize
window.onload = init;
