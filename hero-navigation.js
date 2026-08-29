const heroMenuLinks=document.querySelectorAll('.hero-menu-link[data-target]');
const heroMenuSections=document.querySelectorAll('main section');
heroMenuLinks.forEach(link=>link.addEventListener('click',()=>{const target=document.getElementById(link.dataset.target);if(target)target.scrollIntoView({behavior:'smooth',block:'start'})}));
const heroMenuObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){heroMenuLinks.forEach(link=>link.classList.toggle('active',link.dataset.target===entry.target.id))}})},{threshold:.35});
heroMenuSections.forEach(section=>heroMenuObserver.observe(section));

(function setupSkillsVideoScene(){
  const skills=document.getElementById('skills');
  if(!skills||skills.classList.contains('skills-video-ready'))return;
  skills.classList.add('skills-video-scene','skills-video-ready');

  const existingChildren=[...skills.children];
  const background=document.createElement('div');
  background.className='skills-video-bg';
  background.setAttribute('aria-hidden','true');

  const iframe=document.createElement('iframe');
  iframe.className='skills-video-pin';
  iframe.src='https://assets.pinterest.com/ext/embed.html?id=779615385529847234&autoplay=1&loop=1&muted=1';
  iframe.title='Vídeo tecnológico de fondo de la sección Habilidades';
  iframe.setAttribute('tabindex','-1');
  iframe.setAttribute('frameborder','0');
  iframe.setAttribute('scrolling','no');
  iframe.setAttribute('allow','autoplay; fullscreen; picture-in-picture');
  iframe.setAttribute('loading','lazy');
  background.appendChild(iframe);

  const card=document.createElement('div');
  card.className='skills-video-card';
  existingChildren.forEach(child=>card.appendChild(child));

  skills.append(background,card);

  const style=document.createElement('style');
  style.id='skills-video-scene-styles';
  style.textContent=`
    #skills.skills-video-scene{
      position:relative;
      overflow:hidden;
      isolation:isolate;
      background:#05070a;
      box-shadow:0 24px 60px rgba(15,23,42,.18);
      padding:4.2rem 4.6rem;
      min-height:calc(100vh - 8.5rem);
      border-radius:2rem;
    }
    #skills.skills-video-scene.view-active{
      display:flex;
      align-items:center;
      justify-content:center;
    }
    #skills .skills-video-bg{
      position:absolute;
      inset:0;
      z-index:0;
      overflow:hidden;
      border-radius:2rem;
      background:radial-gradient(circle at 72% 48%,#172033 0,#070b12 35%,#020305 78%);
    }
    #skills .skills-video-pin{
      position:absolute;
      left:50%;
      top:50%;
      width:345px;
      height:714px;
      border:0;
      pointer-events:none;
      transform:translate(-50%,-50%) scale(5.15);
      transform-origin:center center;
      filter:saturate(.88) contrast(1.08) brightness(.76);
    }
    #skills .skills-video-bg::after{
      content:"";
      position:absolute;
      inset:0;
      pointer-events:none;
      background:linear-gradient(90deg,rgba(2,3,5,.58),rgba(2,3,5,.26) 50%,rgba(2,3,5,.55)),radial-gradient(circle at 50% 50%,transparent 0,rgba(0,0,0,.10) 54%,rgba(0,0,0,.50) 100%);
    }
    #skills .skills-video-card{
      position:relative;
      z-index:2;
      width:min(1120px,90%);
      background:rgba(255,255,255,.96);
      border:1px solid rgba(255,255,255,.84);
      border-radius:2rem;
      padding:2.35rem 2.55rem;
      box-shadow:0 32px 78px rgba(0,0,0,.50),0 0 0 1px rgba(201,255,0,.07);
      backdrop-filter:blur(4px);
      -webkit-backdrop-filter:blur(4px);
      animation:skillsCardFloat 7s ease-in-out infinite;
    }
    #skills .skills-grid{position:relative;z-index:2}
    #skills .skill-card{background:rgba(249,250,251,.95);box-shadow:0 10px 26px rgba(15,23,42,.07)}
    @keyframes skillsCardFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
    @media(max-width:1080px){
      #skills.skills-video-scene{padding:3rem;min-height:calc(100vh - 8rem)}
      #skills .skills-video-card{width:min(1080px,92%)}
      #skills .skills-video-pin{transform:translate(-50%,-50%) scale(3.55)}
    }
    @media(max-width:820px){
      #skills.skills-video-scene{padding:2rem 1.6rem;min-height:calc(100vh - 7rem);border-radius:1.5rem}
      #skills .skills-video-bg{border-radius:1.5rem}
      #skills .skills-video-card{width:94%;padding:1.7rem 1.55rem;border-radius:1.55rem}
      #skills .skills-video-pin{transform:translate(-50%,-50%) scale(2.55)}
    }
    @media(max-width:480px){
      #skills.skills-video-scene{padding:1.15rem;min-height:calc(100vh - 6.5rem);border-radius:1.2rem}
      #skills .skills-video-bg{border-radius:1.2rem}
      #skills .skills-video-card{width:100%;padding:1.35rem 1.15rem;border-radius:1.25rem;animation:none}
      #skills .skills-video-pin{transform:translate(-50%,-50%) scale(1.95);filter:saturate(.8) contrast(1.05) brightness(.68)}
    }
    @media(prefers-reduced-motion:reduce){#skills .skills-video-card{animation:none}}
  `;
  document.head.appendChild(style);
})();

(function addSkillsBackdropMotion(){
  if(document.getElementById('skills-backdrop-motion'))return;
  const style=document.createElement('style');
  style.id='skills-backdrop-motion';
  style.textContent=`
    #skills .skills-video-bg{
      transform-origin:center center;
      animation:skillsBackdropMotion 30s ease-in-out infinite alternate;
      will-change:transform;
    }
    @keyframes skillsBackdropMotion{
      0%{transform:scale(1.06) translate3d(-1.2%,-.6%,0)}
      50%{transform:scale(1.11) translate3d(1.2%,.8%,0)}
      100%{transform:scale(1.075) translate3d(-.4%,1.1%,0)}
    }
    @media(prefers-reduced-motion:reduce){#skills .skills-video-bg{animation:none;transform:none}}
  `;
  document.head.appendChild(style);
})();
