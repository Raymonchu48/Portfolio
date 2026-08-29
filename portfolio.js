const sections=[...document.querySelectorAll('main section')];
const hero=document.getElementById('hero');
const viewSections=sections.filter(section=>section.id!=='hero');
const heroMenuLinks=[...document.querySelectorAll('.hero-menu-link[data-target]')];
const dots=[...document.querySelectorAll('.side-dot[data-target]')];

function ensureAboutBackground(){
  const about=document.getElementById('about');
  if(!about||about.querySelector('.about-pin-bg'))return;
  const iframe=document.createElement('iframe');
  iframe.className='about-pin-bg';
  iframe.src='https://assets.pinterest.com/ext/embed.html?id=1135188649854476815';
  iframe.title='Fondo visual tecnológico de la sección Sobre mí';
  iframe.setAttribute('aria-hidden','true');
  iframe.setAttribute('tabindex','-1');
  iframe.setAttribute('loading','lazy');
  iframe.setAttribute('frameborder','0');
  iframe.setAttribute('scrolling','no');
  about.prepend(iframe);
}

function ensureBackButtons(){
  viewSections.forEach(section=>{
    if(section.querySelector('.view-back'))return;
    const button=document.createElement('button');
    button.type='button';
    button.className='view-back';
    button.textContent='← Volver al inicio';
    button.setAttribute('aria-label','Volver a la portada del portfolio');
    button.addEventListener('click',()=>showView('hero'));
    section.prepend(button);
  });
}

function setNavigationState(targetId){
  heroMenuLinks.forEach(link=>link.classList.toggle('active',link.dataset.target===targetId));
  dots.forEach(dot=>dot.classList.toggle('active',dot.dataset.target===targetId));
}

function showTimelineItems(){
  if(!document.getElementById('timeline')?.classList.contains('view-active'))return;
  document.querySelectorAll('.timeline-item').forEach((item,index)=>{
    setTimeout(()=>item.classList.add('visible'),index*90);
  });
}

function showView(targetId,{scroll=true}={}){
  const target=document.getElementById(targetId)||hero;
  const isHome=target.id==='hero';

  viewSections.forEach(section=>{
    const active=!isHome&&section===target;
    section.classList.toggle('view-active',active);
    section.setAttribute('aria-hidden',active?'false':'true');
  });

  hero.classList.toggle('hero-collapsed',!isHome);
  hero.setAttribute('aria-expanded',isHome?'true':'false');
  setNavigationState(target.id);

  if(target.id==='timeline')requestAnimationFrame(showTimelineItems);

  if(scroll){
    requestAnimationFrame(()=>{
      const destination=isHome?hero:target;
      destination.scrollIntoView({behavior:'smooth',block:'start'});
    });
  }
}

ensureAboutBackground();
ensureBackButtons();
heroMenuLinks.forEach(link=>link.addEventListener('click',()=>showView(link.dataset.target)));
dots.forEach(dot=>dot.addEventListener('click',()=>showView(dot.dataset.target)));
showView('hero',{scroll:false});

const filters=document.querySelectorAll('.cert-filter');
const certCards=document.querySelectorAll('.cert-card');
const certResults=document.getElementById('certResults');
const certResultsTitle=document.getElementById('certResultsTitle');
const certFilters=document.getElementById('certFilters');
const certClose=document.getElementById('certClose');
const certCloseBottom=document.getElementById('certCloseBottom');

const closeCertResults=()=>{
  if(!certResults)return;
  certResults.classList.remove('open');
  certResults.setAttribute('aria-hidden','true');
  filters.forEach(filter=>{
    filter.classList.remove('active');
    filter.setAttribute('aria-expanded','false');
  });
  setTimeout(()=>certFilters?.scrollIntoView({behavior:'smooth',block:'center'}),40);
};

filters.forEach(button=>button.addEventListener('click',()=>{
  const isSameOpen=button.classList.contains('active')&&certResults?.classList.contains('open');
  if(isSameOpen){closeCertResults();return;}
  filters.forEach(filter=>{
    filter.classList.remove('active');
    filter.setAttribute('aria-expanded','false');
  });
  button.classList.add('active');
  button.setAttribute('aria-expanded','true');
  const selected=button.dataset.filter;
  certCards.forEach(card=>card.classList.toggle('hidden',selected!=='all'&&card.dataset.category!==selected));
  if(certResultsTitle)certResultsTitle.textContent=selected==='all'?'Todas las certificaciones':button.textContent.trim();
  if(certResults){
    certResults.classList.add('open');
    certResults.setAttribute('aria-hidden','false');
    requestAnimationFrame(()=>certResults.scrollIntoView({behavior:'smooth',block:'start'}));
  }
}));

certClose?.addEventListener('click',closeCertResults);
certCloseBottom?.addEventListener('click',closeCertResults);

const heroMain=document.querySelector('.hero-main');
const heroProfile=document.querySelector('.hero-profile');
if(hero&&heroMain&&heroProfile&&window.matchMedia('(pointer:fine)').matches){
  hero.addEventListener('mousemove',event=>{
    if(hero.classList.contains('hero-collapsed'))return;
    const rect=hero.getBoundingClientRect();
    const x=(event.clientX-rect.left)/rect.width-.5;
    const y=(event.clientY-rect.top)/rect.height-.5;
    heroMain.style.transform=`translate(${x*-10}px,${y*-6}px)`;
    heroProfile.style.transform=`translate(${x*10}px,${y*6}px)`;
  });
  hero.addEventListener('mouseleave',()=>{
    heroMain.style.transform='translate(0,0)';
    heroProfile.style.transform='translate(0,0)';
  });
}

(function(){
  const container=document.querySelector('.hero-digital-layer');
  if(!container)return;
  const canvas=document.createElement('canvas');
  container.appendChild(canvas);
  const ctx=canvas.getContext('2d');
  let width=0,height=0,columns=0,drops=[],fontSize=16;
  const chars='01';
  function resizeCanvas(){
    const rect=container.getBoundingClientRect();
    const dpr=window.devicePixelRatio||1;
    width=rect.width;height=rect.height;
    canvas.width=Math.max(1,width*dpr);canvas.height=Math.max(1,height*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    fontSize=Math.max(12,Math.min(20,width/30));
    columns=Math.max(1,Math.floor(width/fontSize));
    drops=Array.from({length:columns},()=>Math.random()*-20);
  }
  function draw(){
    if(!hero.classList.contains('hero-collapsed')){
      ctx.fillStyle='rgba(0,0,0,.18)';ctx.fillRect(0,0,width,height);
      ctx.fillStyle='#7CFF00';ctx.font=fontSize+'px monospace';
      for(let i=0;i<columns;i++){
        const text=chars.charAt(Math.floor(Math.random()*chars.length));
        const x=i*fontSize,y=drops[i]*fontSize;
        ctx.fillText(text,x,y);
        if(y>height&&Math.random()>.975)drops[i]=Math.random()*-10;else drops[i]+=1;
      }
    }
    requestAnimationFrame(draw);
  }
  resizeCanvas();draw();window.addEventListener('resize',resizeCanvas);
})();
