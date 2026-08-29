const heroMenuLinks=document.querySelectorAll('.hero-menu-link[data-target]');
const heroMenuSections=document.querySelectorAll('main section');
heroMenuLinks.forEach(link=>link.addEventListener('click',()=>{const target=document.getElementById(link.dataset.target);if(target)target.scrollIntoView({behavior:'smooth',block:'start'})}));
const heroMenuObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){heroMenuLinks.forEach(link=>link.classList.toggle('active',link.dataset.target===entry.target.id))}})},{threshold:.35});
heroMenuSections.forEach(section=>heroMenuObserver.observe(section));
