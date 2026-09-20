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

// =========================================================
// SCROLL PROGRESS BAR
// =========================================================

const scrollProgress = document.getElementById('scrollProgress');

if (scrollProgress) {

  function updateScrollProgress() {

    const scrollTop = window.scrollY;

    const documentHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    const progress =
      documentHeight > 0
        ? (scrollTop / documentHeight) * 100
        : 0;

    scrollProgress.style.width = `${progress}%`;
  }

  window.addEventListener('scroll', updateScrollProgress, {
    passive: true
  });

  window.addEventListener('resize', updateScrollProgress);

  updateScrollProgress();
}

// =========================================================
// ELASTIC PEN TOOL — FINAL INTERACTIVE VERSION
// =========================================================

const elasticLine =
  document.getElementById('elasticPenLine');

const elasticHitPath =
  document.getElementById('elasticHitPath');

const elasticPath =
  document.getElementById('elasticPath');

if (
  elasticLine &&
  elasticHitPath &&
  elasticPath
) {

  let dragging = false;

  const startX = 80;
  const endX = 920;
  const centerY = 90;

  /* Point where the user originally clicks */
  let grabX = 500;
  let grabY = centerY;


  /*
    Draw line while keeping
    the clicked point attached
    to the mouse.
  */

  function drawElastic(mouseX, mouseY) {

    /*
      Keep the endpoints fixed.
    */

    const leftX = startX;
    const rightX = endX;

    /*
      Calculate how much the
      clicked point moved.
    */

    const dx = mouseX - grabX;
    const dy = mouseY - grabY;


    /*
      The clicked point itself
      follows the mouse.
    */

    const pointX =
      Math.max(
        leftX + 15,
        Math.min(
          rightX - 15,
          grabX + dx
        )
      );

    const pointY =
      centerY + dy;


    /*
      Strong smooth curve.

      The closer the click is to
      an endpoint, the smaller the
      affected section becomes.
    */

    const leftDistance =
      pointX - leftX;

    const rightDistance =
      rightX - pointX;


    const leftControlX =
      leftX +
      leftDistance * 0.5;

    const rightControlX =
      pointX +
      rightDistance * 0.5;


    const leftControlY =
      centerY +
      (pointY - centerY) * 0.65;

    const rightControlY =
      centerY +
      (pointY - centerY) * 0.65;


    /*
      Build two connected curves.
    */

    const path = `
      M ${leftX} ${centerY}

      C
      ${leftControlX} ${leftControlY},
      ${pointX - leftDistance * 0.18} ${pointY},
      ${pointX} ${pointY}

      C
      ${pointX + rightDistance * 0.18} ${pointY},
      ${rightControlX} ${rightControlY},
      ${rightX} ${centerY}
    `;


    elasticPath.setAttribute(
      'd',
      path
    );

    elasticHitPath.setAttribute(
      'd',
      path
    );
  }


  /*
    CLICK ON LINE
  */

  elasticHitPath.addEventListener(
    'pointerdown',
    event => {

      dragging = true;


      const rect =
        elasticLine.getBoundingClientRect();


      /*
        Convert mouse position
        into SVG coordinates.
      */

      const x =
        ((event.clientX - rect.left) /
        rect.width) * 1000;

      const y =
        ((event.clientY - rect.top) /
        rect.height) * 180;


      /*
        Save the exact point
        where the user clicked.
      */

      grabX =
        Math.max(
          startX + 15,
          Math.min(
            endX - 15,
            x
          )
        );


      grabY = y;


      elasticHitPath.setPointerCapture(
        event.pointerId
      );


      event.preventDefault();

    }
  );


  /*
    DRAG
  */

  elasticHitPath.addEventListener(
    'pointermove',
    event => {

      if(!dragging) return;


      const rect =
        elasticLine.getBoundingClientRect();


      const mouseX =
        ((event.clientX - rect.left) /
        rect.width) * 1000;


      const mouseY =
        ((event.clientY - rect.top) /
        rect.height) * 180;


      /*
        Calculate movement from
        the original clicked point.
      */

      const dx =
        mouseX - grabX;

      const dy =
        mouseY - grabY;


      /*
        New point follows mouse.
      */

      const newX =
        grabX + dx;

      const newY =
        grabY + dy;


      drawElastic(
        newX,
        newY
      );

    }
  );


  /*
    RELEASE
    → ELASTIC BOUNCE
  */

  elasticHitPath.addEventListener(
    'pointerup',
    event => {

      if(!dragging) return;

      dragging = false;


      try{

        elasticHitPath.releasePointerCapture(
          event.pointerId
        );

      }catch(e){}


      /*
        Get release position.
      */

      const rect =
        elasticLine.getBoundingClientRect();


      const releaseX =
        ((event.clientX - rect.left) /
        rect.width) * 1000;


      const releaseY =
        ((event.clientY - rect.top) /
        rect.height) * 180;


      /*
        How far the clicked point
        was stretched.
      */

      const stretchX =
        releaseX - grabX;

      const stretchY =
        releaseY - grabY;


      const startTime =
        performance.now();


      const duration =
        1000;


      /*
        Elastic animation.
      */

      function bounce(time){

        const elapsed =
          time - startTime;


        const progress =
          Math.min(
            elapsed / duration,
            1
          );


        /*
          Strong elastic oscillation
        */

        const decay =
          Math.exp(
            -5 * progress
          );


        const wave =
          Math.cos(
            progress *
            Math.PI *
            7
          );


        const amount =
          decay * wave;


        /*
          Point returns toward
          its original position.
        */

        const x =
          grabX +
          stretchX * amount;


        const y =
          grabY +
          stretchY * amount;


        drawElastic(
          x,
          y
        );


        if(progress < 1){

          requestAnimationFrame(
            bounce
          );

        }else{

          /*
            Final straight line
          */

          const normalPath =
            `M ${startX} ${centerY}
             C 350 ${centerY},
               650 ${centerY},
               ${endX} ${centerY}`;


          elasticPath.setAttribute(
            'd',
            normalPath
          );

          elasticHitPath.setAttribute(
            'd',
            normalPath
          );

        }

      }


      requestAnimationFrame(
        bounce
      );

    }
  );


  /*
    Initial straight state
  */

  const normalPath =
    `M ${startX} ${centerY}
     C 350 ${centerY},
       650 ${centerY},
       ${endX} ${centerY}`;


  elasticPath.setAttribute(
    'd',
    normalPath
  );

  elasticHitPath.setAttribute(
    'd',
    normalPath
  );

}