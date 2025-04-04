// Enhanced event configuration with agenda duration
const EVENT_CONFIG = {
  startDate: '2025-04-04',
  endDate: '2025-04-08',
  images: {
    '2025-04-04': [
      { src: 'Sun-Pharma-Infinite-Logo-Loop-2.gif_V2.gif', duration: 6000 },
      { src: 'welcome letter_V4.jpg', duration: 40000 },
      { src: '321909 Conference Agenda_V5_Monday.jpg', duration: 60000 },
      { src: 'Team building event.jpg', duration: 7500 },
      { src: 'Group 1 (1).jpg', duration: 7500 },
      { src: 'Group 1 (2).jpg', duration: 7500 },
      { src: 'Group 1 (3).jpg', duration: 7500 },
      { src: 'Group 1 (4).jpg', duration: 7500 },
      { src: 'Group 1 (5).jpg', duration: 7500 },
      { src: 'Group 1 (6).jpg', duration: 7500 },
      { src: 'Group 1 (7).jpg', duration: 7500 },
      { src: 'Group 1 (8).jpg', duration: 7500 },
      { src: 'Group 1 (9).jpg', duration: 7500 },
      { src: 'Group 1 (10).jpg', duration: 7500 },
      { src: 'Group 1 (11).jpg', duration: 7500 },
      { src: 'Group 1 (12).jpg', duration: 7500 },
      { src: 'Team rules_01.jpg', duration: 7500 },
      { src: 'Happy birthday_02.jpg', duration: 6000 },
      { src: '321909 Conference Agenda_V5_Monday.jpg' }
    ],
    '2025-04-05': [
      { src: 'Sun-Pharma-Infinite-Logo-Loop-2.gif_V2.gif', duration: 6000 },
      { src: 'welcome letter_V4.jpg', duration: 10000 },
      { src: '321909 Conference Agenda_V3.jpg', isAgenda: true },
      { src: '321909-Conference-Name-Tag_V2.gif', duration: 45000 }
    ],
    '2025-04-06': [
      { src: 'Sun-Pharma-Infinite-Logo-Loop-2.gif_V2.gif', duration: 6000 },
      { src: 'welcome letter_V4.jpg', duration: 40000 },
      { src: '321909 Conference Agenda_V3.jpg', isAgenda: true }
    ],
    '2025-04-07': [
      { src: 'Sun-Pharma-Infinite-Logo-Loop-2.gif_V2.gif', duration: 6000 },
      { src: 'welcome letter_V4.jpg', duration: 40000 },
      { src: '321909 Conference Agenda_V3.jpg', isAgenda: true }
    ],
    '2025-04-08': [
      { src: 'Sun-Pharma-Infinite-Logo-Loop-2.gif_V2.gif', duration: 7000 },
      { src: 'Happy birthday_01.jpg', duration: 25000 },
      { src: '321909 Conference Agenda_V3.jpg', isAgenda: true }
    ]
  },
};

// Improved element handling
const elements = {
  eventImage: document.getElementById('event-image'),
  imageContainer: document.getElementById('image-container'),
  agendaContainer: Object.assign(document.createElement('div'), {
    id: 'agenda-container',
    style: 'height:100vh; display:none;'
  }),
  agendaImage: Object.assign(document.createElement('img'), {
    id: 'agenda-image',
    style: 'width:100%; display:block;'
  })
};

document.body.appendChild(elements.agendaContainer);
elements.agendaContainer.appendChild(elements.agendaImage);

// Improved time handling
async function getCurrentTime() {
  try {
    const response = await fetch('https://worldtimeapi.org/api/timezone/Africa/Johannesburg');
    const data = await response.json();
    return new Date(data.datetime);
  } catch (error) {
    console.warn('Using local time:', error);
    return new Date();
  }
}

// Enhanced schedule processing
function createSchedule(date) {
  const formattedDate = date.toISOString().split('T')[0];
  let schedule = EVENT_CONFIG.images[formattedDate] || [];

  if (formattedDate === '2025-04-08') {
    const currentTimeInMinutes = date.getHours() * 60 + date.getMinutes();
    const changeTimeInMinutes = 12 * 60;
    if (currentTimeInMinutes < changeTimeInMinutes) {
      schedule.splice(1, 0, { src: 'welcome letter_V2.jpg', duration: 60000 });
      schedule.splice(2, 0, { src: '321909 Conference Agenda_V3.jpg', duration: 60000 });
    } else {
      schedule.splice(1, 0, { src: '321909-Conference-Name-Tag_V2.gif', duration: 45000 });
      schedule.splice(2, 0, { src: '321909 Conference Agenda_V3.jpg', duration: 60000 });
    }
  }
  
  return schedule.map(item => (Object.assign({ duration: item.duration }, item)));
}

// Improved slideshow controller with fade transitions
class Slideshow {
  constructor() {
    this.currentIndex = 0;
    this.timeoutId = null;
    this.schedule = [];
  }

  async start() {
    const currentDate = await getCurrentTime();
    this.schedule = createSchedule(currentDate);
    this.showNextItem();
  }

  showNextItem() {
    clearTimeout(this.timeoutId);
    if (this.currentIndex >= this.schedule.length) return;

    const item = this.schedule[this.currentIndex++];
    this.displayItem(item);
    this.timeoutId = setTimeout(() => this.showNextItem(), item.duration);
  }

  displayItem(item) {
    if (item.src !== 'Sun-Pharma-Infinite-Logo-Loop-2.gif_V2.gif') {
      elements.eventImage.style.transition = 'opacity 1s';
    } else {
      elements.eventImage.style.transition = 'Sun-Pharma-Infinite-Logo-Loop-2.gif_V2.gif';
    }
    
    elements.eventImage.style.opacity = 0;
    setTimeout(() => {
      if (item.isAgenda) {
        elements.imageContainer.style.display = 'none';
        elements.agendaContainer.style.display = 'block';
        elements.agendaImage.src = item.src;
      } else {
        elements.imageContainer.style.display = 'flex';
        elements.agendaContainer.style.display = 'none';
        elements.eventImage.src = item.src;
      }
      elements.eventImage.style.opacity = 1;
    }, 1000);
  }
}

// Initialize slideshow
window.addEventListener('DOMContentLoaded', () => {
  const slideshow = new Slideshow();
  slideshow.start();
});
