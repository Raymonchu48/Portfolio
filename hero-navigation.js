const heroMenuLinks=document.querySelectorAll('.hero-menu-link[data-target]');
const heroMenuSections=document.querySelectorAll('main section');
heroMenuLinks.forEach(link=>link.addEventListener('click',()=>{const target=document.getElementById(link.dataset.target);if(target)target.scrollIntoView({behavior:'smooth',block:'start'})}));
const heroMenuObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){heroMenuLinks.forEach(link=>link.classList.toggle('active',link.dataset.target===entry.target.id))}})},{threshold:.35});
heroMenuSections.forEach(section=>heroMenuObserver.observe(section));

(function ensurePtdBackground(){
  const ptd=document.getElementById('ptd');
  if(!ptd||ptd.querySelector('.ptd-pin-bg'))return;
  const iframe=document.createElement('iframe');
  iframe.className='ptd-pin-bg';
  iframe.src='https://assets.pinterest.com/ext/embed.html?id=1135188649854476815';
  iframe.title='Fondo visual tecnológico del Proyecto PTD';
  iframe.setAttribute('aria-hidden','true');
  iframe.setAttribute('tabindex','-1');
  iframe.setAttribute('loading','lazy');
  iframe.setAttribute('frameborder','0');
  iframe.setAttribute('scrolling','no');
  ptd.prepend(iframe);
})();
