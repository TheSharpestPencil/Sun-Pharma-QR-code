// Enhanced event configuration with agenda duration
const EVENT_CONFIG = {
  startDate: '2025-04-04',
  endDate: '2025-04-08',
  images: {     '2025-04-04': [
    { src: 'Sun-Pharma-Infinite-Logo-Loop-2.gif_V2.gif', duration: 6000 },
    { src: 'welcome letter_V4.jpg', duration: 40000 },
    { src: '321909 Conference Agenda_V3_Monday.jpg', duration: 60000 },
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
    { src: 'Happy birthday_02.jpg', duration: 6000 }, // ✅ Fixed missing comma
    { src: '321909 Conference Agenda_V5_Monday.jpg' } // ✅ Marked as agenda
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
    style: 'overflow-y:scroll; height:100vh; display:none;'
  }),
  agendaImage: Object.assign(document.createElement('img'), {
    id: 'agenda-image',
    style: 'width:100%; display:block;'
  })
};

document.body.appendChild(elements.agendaContainer);
elements.agendaContainer.appendChild(elements.agendaImage);

// Improved time handling with fallback
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
  let schedule = EVENT_CONFIG.images[formattedDate] 
    ? [...EVENT_CONFIG.images[formattedDate]]
    : [{ src: EVENT_CONFIG.defaultImage, duration: EVENT_CONFIG.defaultDuration }];

  // Handle April 8th logic
  if (formattedDate === '2025-04-08') {
    const isAfternoon = date.getHours() >= 12;
    const additionalItems = isAfternoon ? [
      { src: '321909-Conference-Name-Tag_V2.gif', duration: 45000 },
      { src: '321909 Conference Agenda_V3.jpg', isAgenda: true,}
    ] : [
      { src: 'welcome letter_V4.jpg', duration: 60000 },
      { src: '321909 Conference Agenda_V3.jpg', isAgenda: true, }
    ];
    
    schedule.splice(1, 0, ...additionalItems);
  }

  return schedule.map(item => (Object.assign({
    duration: item.duration || EVENT_CONFIG.defaultDuration,
  }, item)));
}

// Improved slideshow controller
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
    if (item.isAgenda) {
      elements.imageContainer.style.display = 'none';
      elements.agendaContainer.style.display = 'block';
      elements.agendaImage.src = item.src;
      elements.agendaContainer.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      elements.imageContainer.style.display = 'flex';
      elements.agendaContainer.style.display = 'none';
      elements.eventImage.src = item.src;
      elements.eventImage.onerror = () => {
        elements.eventImage.src = EVENT_CONFIG.defaultImage;
      };
    }
  }

  reset() {
    clearTimeout(this.timeoutId);
    this.currentIndex = 0;
    elements.imageContainer.style.display = 'flex';
    elements.agendaContainer.style.display = 'none';
    elements.eventImage.src = EVENT_CONFIG.defaultImage;
  }
}

// Initialize slideshow
window.addEventListener('DOMContentLoaded', () => {
  const slideshow = new Slideshow();
  slideshow.start();
});
