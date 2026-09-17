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