// Enhanced event configuration with agenda duration
const EVENT_CONFIG = {
  startDate: '2025-06-18',
  endDate: '2025-06-22',
  images: {
    '2025-06-18': [
      { src: 'Sun-Pharma-Infinite-Logo-Loop-2.gif_V2.gif', duration: 6000 },
      { src: 'welcome letter_V4.jpg', duration: 45000 },
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
      { src: '321909 Conference Agenda_V6.jpg',isAgenda: true  }
    ],
    '2025-06-19': [
      { src: 'Sun-Pharma-Infinite-Logo-Loop-2.gif_V2.gif', duration: 6000 },
      { src: 'welcome letter_V4.jpg', duration: 10000 },
      { src: '321909 Conference Agenda_V6.jpg', isAgenda: true },
      { src: 'Pop-up-shop--UA-logo-&-message.gif', duration: 45000 }
    ],
    '2025-06-20': [
      { src: 'Sun-Pharma-Infinite-Logo-Loop-2.gif_V2.gif', duration: 6000 },
      { src: 'welcome letter_V4.jpg', duration: 40000 },
      { src: '321909 Conference Agenda_V6.jpg', isAgenda: true }
    ],
    '2025-06-21': [
      { src: 'Sun-Pharma-Infinite-Logo-Loop-2.gif_V2.gif', duration: 6000 },
      { src: 'welcome letter_V4.jpg', duration: 40000 },
      { src: '321909 Conference Agenda_V6.jpg', isAgenda: true }
    ],
    '2025-06-22': [
      { src: 'Sun-Pharma-Infinite-Logo-Loop-2.gif_V2.gif', duration: 7000 },
      { src: 'Happy birthday_01.jpg', duration: 25000 },
      { src: '321909 Conference Agenda_V6.jpg', isAgenda: true }
    ]
  },
};

// Improved element handling
const elements = {
  eventImage: document.getElementById('event-image'),
  imageContainer: document.getElementById('image-container'),
  agendaContainer: document.getElementById('agenda-container'),
  agendaImage: document.getElementById('agenda-image'),
  prevBtn: document.getElementById('prev-btn'),
  nextBtn: document.getElementById('next-btn'),
  downloadBtn: document.getElementById('download-btn'),
  controls: document.getElementById('controls')
};

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

  if (formattedDate === '2025-06-22') {
    const currentTimeInMinutes = date.getHours() * 60 + date.getMinutes();
    const noonInMinutes = 12 * 60; // 12:00 PM (Noon)
    
    if (currentTimeInMinutes >= noonInMinutes) {
      // After 12:00 PM schedule
      schedule = [
        { src: 'Sun-Pharma-Infinite-Logo-Loop-2.gif_V2.gif', duration: 7000 },
        { src: 'Pop-up-shop--UA-logo-&-message.gif', duration: 45000 },
        { src: '321909 Conference Agenda_V6.jpg', isAgenda: true }
      ];
    } else {
      // Before 12:00 PM schedule
      schedule = [
        { src: 'Sun-Pharma-Infinite-Logo-Loop-2.gif_V2.gif', duration: 7000 },
        { src: 'welcome letter_V4.jpg', duration: 25000 },
        { src: '321909 Conference Agenda_V6.jpg', isAgenda: true }
      ];
    }
  }
  
  return schedule.map(item => (Object.assign({ duration: item.duration || 10000 }, item)));
}

// Improved slideshow controller with mobile optimizations
class Slideshow {
  constructor() {
    this.currentIndex = 0;
    this.timeoutId = null;
    this.schedule = [];
    this.isAutoPlaying = true;
    this.isGifPlaying = false;
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.isTransitioning = false;
  }

  async start() {
    const currentDate = await getCurrentTime();
    this.schedule = createSchedule(currentDate);
    this.setupControls();
    this.setupTouchControls();
    this.showNextItem();
  }

  setupControls() {
    elements.prevBtn.addEventListener('click', () => this.showPreviousItem());
    elements.nextBtn.addEventListener('click', () => this.showNextItem());
    elements.downloadBtn.addEventListener('click', () => this.downloadCurrentImage());
  }

  setupTouchControls() {
    elements.imageContainer.addEventListener('touchstart', (e) => {
      this.touchStartX = e.touches[0].clientX;
    }, { passive: true });

    elements.imageContainer.addEventListener('touchmove', (e) => {
      if (this.isGifPlaying || this.isTransitioning) return;
      this.touchEndX = e.touches[0].clientX;
    }, { passive: true });

    elements.imageContainer.addEventListener('touchend', () => {
      if (this.isGifPlaying || this.isTransitioning) return;
      const swipeDistance = this.touchEndX - this.touchStartX;
      
      if (Math.abs(swipeDistance) > 50) {
        if (swipeDistance > 0) {
          this.showPreviousItem();
        } else {
          this.showNextItem();
        }
      }
    }, { passive: true });
  }

  showPreviousItem() {
    if (this.isTransitioning || this.isGifPlaying) return;
    clearTimeout(this.timeoutId);
    if (this.currentIndex > 0) {
      this.currentIndex--;

      const item = this.schedule[this.currentIndex];
      // Skip GIF when going back
      if (item.src === 'Sun-Pharma-Infinite-Logo-Loop-2.gif_V2.gif') {
        if (this.currentIndex > 0) {
          this.currentIndex--;
          this.displayItem(this.schedule[this.currentIndex]);
        } else {
          this.currentIndex = 0;
        }
      } else {
        this.displayItem(item);
      }
    }
  }

  showNextItem() {
    if (this.isTransitioning || this.isGifPlaying) return;
    clearTimeout(this.timeoutId);
    if (this.currentIndex < this.schedule.length) {
      const item = this.schedule[this.currentIndex++];
      this.displayItem(item);
      
      if (this.currentIndex < this.schedule.length && !item.isAgenda) {
        this.timeoutId = setTimeout(() => this.showNextItem(), item.duration);
      }
    }
  }

  displayItem(item) {
    this.isTransitioning = true;

    if (item.src === 'Sun-Pharma-Infinite-Logo-Loop-2.gif_V2.gif') {
      this.isGifPlaying = true;
      elements.eventImage.style.transition = 'none';
      elements.eventImage.style.opacity = '1';
      elements.imageContainer.style.display = 'flex';
      elements.agendaContainer.style.display = 'none';
      elements.eventImage.src = item.src;
      elements.controls.classList.add('controls-hidden');
      
      setTimeout(() => {
        this.isGifPlaying = false;
        this.isTransitioning = false;
        elements.controls.classList.remove('controls-hidden');
        this.showNextItem();
      }, item.duration);
    } else {
      this.isGifPlaying = false;
      elements.eventImage.style.transition = 'none';
      elements.controls.classList.remove('controls-hidden');
      
      if (item.isAgenda) {
        elements.imageContainer.style.display = 'none';
        elements.agendaContainer.style.display = 'block';
        elements.agendaImage.src = item.src;
        this.isTransitioning = false;
      } else {
        elements.imageContainer.style.display = 'flex';
        elements.agendaContainer.style.display = 'none';
        elements.eventImage.src = item.src;
        elements.eventImage.style.opacity = '1';
        this.isTransitioning = false;
      }
    }
  }

  downloadCurrentImage() {
    const currentItem = this.schedule[this.currentIndex - 1];
    if (!currentItem || this.isTransitioning) return;

    const link = document.createElement('a');
    link.href = currentItem.src;
    link.download = currentItem.src.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// Initialize slideshow with error handling
window.addEventListener('DOMContentLoaded', () => {
  const slideshow = new Slideshow();
  slideshow.start().catch(console.error);
});
