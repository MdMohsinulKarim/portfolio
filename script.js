// mobile drawer
const drawer = document.getElementById('drawer');
const scrim = document.getElementById('scrim');
const openDrawer = document.getElementById('openDrawer');
const closeDrawerBtn = document.getElementById('closeDrawer');

if (drawer && scrim && openDrawer && closeDrawerBtn) {
  openDrawer.addEventListener('click', ()=>{
    drawer.classList.add('open');
    scrim.classList.add('show');
  });

  closeDrawerBtn.addEventListener('click', closeDrawer);
  scrim.addEventListener('click', closeDrawer);

  function closeDrawer(){
    drawer.classList.remove('open');
    scrim.classList.remove('show');
  }

  drawer.querySelectorAll('a').forEach(a=>{
    a.addEventListener('click', closeDrawer);
  });
}

// theme toggle
const themeBtn = document.getElementById('themeToggle');

// Load saved theme
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'light') {
  document.body.classList.add('light');
}

if (themeBtn) {

  // Set correct icon on page load
  themeBtn.innerHTML = document.body.classList.contains('light')
    ? '<i class="fa-solid fa-sun"></i>'
    : '<i class="fa-regular fa-moon"></i>';

  themeBtn.addEventListener('click', ()=>{

    document.body.classList.toggle('light');

    const isLight = document.body.classList.contains('light');

    // Save theme preference
    localStorage.setItem('theme', isLight ? 'light' : 'dark');

    // Update icon
    themeBtn.innerHTML = isLight
      ? '<i class="fa-solid fa-sun"></i>'
      : '<i class="fa-regular fa-moon"></i>';
  });
}

// project filters + search
document.addEventListener('click', function(e){

  const btn = e.target.closest('.filter, .filter-btn');

  if (!btn) return;

  const filterBtns = document.querySelectorAll('.filter, .filter-btn');

  filterBtns.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  applyProjectFilter();

});


// project search
const projectSearch = document.getElementById('projectSearch');

if (projectSearch) {
  projectSearch.addEventListener('input', function(){
    applyProjectFilter();
  });
}


// filter + search function
function applyProjectFilter(){

  const activeBtn = document.querySelector('.filter.active, .filter-btn.active');

  const filter = activeBtn
    ? activeBtn.dataset.filter
    : 'all';

  const searchText = projectSearch
    ? projectSearch.value.toLowerCase().trim()
    : '';

  const projCards = document.querySelectorAll('.project-item, .proj-card');

  let visibleCount = 0;

  projCards.forEach(card => {

    const category =
      card.dataset.category ||
      card.dataset.cat ||
      '';

    const cardText = card.textContent.toLowerCase();

    const matchesFilter =
      filter === 'all' ||
      category === filter;

    const matchesSearch =
      searchText === '' ||
      cardText.includes(searchText);

    const showCard =
      matchesFilter &&
      matchesSearch;

    card.hidden = !showCard;

    if (showCard) {
      visibleCount++;
    }

  });


  // project count
  const projectCount = document.getElementById('projectCount');

  if (projectCount) {

    projectCount.textContent =
      `Showing ${visibleCount} project${visibleCount !== 1 ? 's' : ''}`;

  }


  // empty projects message
  const emptyProjects =
    document.getElementById('emptyProjects');

  if (emptyProjects) {

    emptyProjects.style.display =
      visibleCount === 0
        ? 'block'
        : 'none';

  }

}


// initial project count
document.addEventListener('DOMContentLoaded', function(){
  applyProjectFilter();
});
// initial project count
const initialCount = document.getElementById('projectCount');
const allProjects = document.querySelectorAll('.project-item, .proj-card');

if (initialCount) {
  const count = allProjects.length;

  initialCount.textContent =
    `Showing ${count} project${count !== 1 ? 's' : ''}`;
}

// active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navA = document.querySelectorAll('.nav-links a, .mobile-drawer a');
window.addEventListener('scroll', ()=>{
  let current = '';
  sections.forEach(s=>{
    if(window.scrollY >= s.offsetTop - 120) current = s.getAttribute('id');
  });
  navA.forEach(a=>{
    a.classList.toggle('active', a.getAttribute('href') === '#'+current);
  });
});

// back to top
const backTop = document.getElementById('backTop');

if (backTop) {
  backTop.addEventListener('click', ()=>{
    window.scrollTo({
      top:0,
      behavior:'smooth'
    });
  });
}
// scroll reveal animation
const revealItems = document.querySelectorAll('.project-item');

if (revealItems.length) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold:0.12
  });

  revealItems.forEach((item, index) => {
    item.classList.add('reveal');
    item.style.setProperty('--reveal-delay', `${index * 0.08}s`);
    revealObserver.observe(item);
  });
}

// =========================================================
// SMART IRRIGATION DEMO INTERACTION
// =========================================================

const iotValves = document.querySelectorAll('.iot-valve-page');

if (iotValves.length) {

  const progressFill = document.querySelector('.iot-progress-bar span');
  const progressValue = document.querySelector('.iot-progress-head strong');
  const progressRemaining = document.querySelector('.iot-progress-head > span');
  const wateringStatus = document.querySelectorAll('.iot-info-card strong')[3];

  iotValves.forEach(valve => {

    valve.addEventListener('click', () => {

      // Toggle valve
      valve.classList.toggle('active');

      const state = valve.querySelector('.valve-state');

      // Update ON / OFF text
      if (valve.classList.contains('active')) {
        state.textContent = 'ON';
      } else {
        state.textContent = 'OFF';
      }

      // Count active valves
      const activeValves =
        document.querySelectorAll('.iot-valve-page.active').length;

      // Calculate progress
      const progress = activeValves * 25;

      // Update progress bar
      progressFill.style.width = `${progress}%`;

      // Update percentage
      progressValue.textContent = `${progress}%`;

      // Update remaining time
      const remaining = Math.max(0, 48 - (activeValves * 12));
      progressRemaining.textContent =
        `${remaining} sec remaining`;

      // Update watering status
      if (activeValves > 0) {
        wateringStatus.textContent = 'Active';
      } else {
        wateringStatus.textContent = 'Standby';
      }

    });

  });

}

// =========================================================
// SMART IRRIGATION — AUTOMATIC WATERING CYCLE
// =========================================================

if (iotValves.length) {

  let wateringProgress = 68;
  let wateringTimer = null;

  const progressFill =
    document.querySelector('.iot-progress-bar span');

  const progressValue =
    document.querySelector('.iot-progress-head strong');

  const progressRemaining =
    document.querySelector('.iot-progress-head > span');

  const wateringStatus =
    document.querySelectorAll('.iot-info-card strong')[3];

  function updateWateringCycle() {

    const activeValves =
      document.querySelectorAll('.iot-valve-page.active').length;

    // No active valve
    if (activeValves === 0) {
      clearInterval(wateringTimer);

      wateringStatus.textContent = 'Standby';
      progressRemaining.textContent = 'System paused';

      return;
    }

    // Start / continue cycle
    wateringStatus.textContent = 'Active';

    wateringProgress += 1;

    if (wateringProgress > 100) {
      wateringProgress = 0;
    }

    progressFill.style.width = `${wateringProgress}%`;
    progressValue.textContent = `${wateringProgress}%`;

    const remainingSeconds =
      Math.max(0, Math.round((100 - wateringProgress) * 0.7));

    progressRemaining.textContent =
      `${remainingSeconds} sec remaining`;
  }

  function startWateringCycle() {

    clearInterval(wateringTimer);

    wateringTimer = setInterval(() => {
      updateWateringCycle();
    }, 1000);
  }

  // Start automatically if any valve is already ON
  if (
    document.querySelectorAll('.iot-valve-page.active').length
  ) {
    startWateringCycle();
  }

  // Restart cycle whenever valve state changes
  iotValves.forEach(valve => {

    valve.addEventListener('click', () => {

      const activeValves =
        document.querySelectorAll('.iot-valve-page.active').length;

      if (activeValves > 0) {
        startWateringCycle();
      } else {
        clearInterval(wateringTimer);
      }

    });

  });

}

// =========================================================
// SMART IRRIGATION — LIVE ACTIVITY LOG
// =========================================================

const activityList = document.getElementById('iotActivityList');

if (activityList && iotValves.length) {

  function getCurrentTime() {
    const now = new Date();

    return now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  function addActivity(title, description, icon = 'fa-droplet') {

    const activity = document.createElement('div');

    activity.className = 'iot-activity-item';

    activity.innerHTML = `
      <span class="activity-icon">
        <i class="fa-solid ${icon}"></i>
      </span>

      <div>
        <strong>${title}</strong>
        <span>${description}</span>
      </div>

      <time>${getCurrentTime()}</time>
    `;

    // Add newest activity at the top
    activityList.prepend(activity);

    // Keep only latest 5 activities
    const activities =
      activityList.querySelectorAll('.iot-activity-item');

    if (activities.length > 5) {
      activities[activities.length - 1].remove();
    }
  }

  iotValves.forEach(valve => {

    valve.addEventListener('click', () => {

      const valveNumber =
        valve.dataset.valve;

      const isActive =
        valve.classList.contains('active');

      if (isActive) {

        addActivity(
          `Valve ${valveNumber} activated`,
          `Water flow started for Zone ${valveNumber}`,
          'fa-droplet'
        );

      } else {

        addActivity(
          `Valve ${valveNumber} deactivated`,
          `Water flow stopped for Zone ${valveNumber}`,
          'fa-power-off'
        );

      }

    });

  });

}