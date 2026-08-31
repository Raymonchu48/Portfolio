(() => {
  'use strict';
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const sections = ['hero','about','projects','skills','timeline','certifications','contact'];
  const navTriggers = $$('.nav-trigger[data-target]');
  const railItems = $$('.rail-item[data-target]');
  const boot = $('#bootScreen');
  const startTime = performance.now();
  let autoTimer = null;
  let autoIndex = 0;

  $$('a[href="Resumen_CV-2026.pdf"]').forEach(link => {
    if (!link.hasAttribute('download')) link.href = 'cv.html';
  });

  window.addEventListener('load', () => setTimeout(() => boot?.classList.add('done'), 900));

  function showView(id, scroll=true, focusId=''){
    const target = document.getElementById(id) || document.getElementById('hero');
    sections.forEach(sectionId => {
      const el = document.getElementById(sectionId);
      if (!el) return;
      el.classList.toggle('view-active', el === target);
      el.setAttribute('aria-hidden', el === target ? 'false' : 'true');
    });
    railItems.forEach(item => item.classList.toggle('active', item.dataset.target === target.id));
    if (scroll) requestAnimationFrame(() => target.scrollIntoView({behavior:'smooth',block:'start'}));
    $$('.stack-list article').forEach(item => item.classList.remove('is-focused'));
    if(focusId){
      const focused=document.getElementById(focusId);
      if(focused){
        focused.classList.add('is-focused');
        setTimeout(()=>focused.scrollIntoView({behavior:'smooth',block:'center'}),220);
      }
    }
    if (target.id === 'certifications') activateCertFilter('all');
  }
  navTriggers.forEach(btn => btn.addEventListener('click', () => {
    stopAuto();
    showView(btn.dataset.target,true,btn.dataset.focus||'');
  }));

  function tickClock(){
    const now = new Date();
    const clock = $('#localClock');
    if (clock) clock.textContent = now.toLocaleTimeString('es-ES',{hour12:false});
    const elapsed = Math.floor((performance.now()-startTime)/1000);
    const h = String(Math.floor(elapsed/3600)).padStart(2,'0');
    const m = String(Math.floor((elapsed%3600)/60)).padStart(2,'0');
    const s = String(elapsed%60).padStart(2,'0');
    const mission = $('#missionElapsed'); if (mission) mission.textContent = `${h}:${m}:${s}`;
  }
  setInterval(tickClock,1000); tickClock();

  function updateViewport(){const el=$('#viewportValue');if(el)el.textContent=`${innerWidth} × ${innerHeight}`}
  addEventListener('resize',updateViewport);updateViewport();

  let frames=0, fpsStart=performance.now();
  function fpsLoop(now){frames++;if(now-fpsStart>=1000){const fps=Math.round(frames*1000/(now-fpsStart));const el=$('#fpsValue');if(el)el.textContent=String(fps);frames=0;fpsStart=now}requestAnimationFrame(fpsLoop)}requestAnimationFrame(fpsLoop);

  const canvas = $('#networkCanvas');
  if(canvas){
    const ctx = canvas.getContext('2d');
    let w=0,h=0,dpr=1,points=[];
    function resize(){dpr=Math.min(devicePixelRatio||1,2);w=innerWidth;h=innerHeight;canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);const count=Math.max(28,Math.min(85,Math.round((w*h)/23000)));points=Array.from({length:count},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.18,vy:(Math.random()-.5)*.18,r:Math.random()*1.2+.45}))}
    function draw(){ctx.clearRect(0,0,w,h);for(let i=0;i<points.length;i++){const p=points[i];p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h)p.vy*=-1;for(let j=i+1;j<points.length;j++){const q=points[j],dx=p.x-q.x,dy=p.y-q.y,dist=Math.hypot(dx,dy);if(dist<125){ctx.strokeStyle=`rgba(0,116,121,${(1-dist/125)*.13})`;ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke()}}ctx.fillStyle='rgba(0,116,121,.32)';ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill()}requestAnimationFrame(draw)}
    resize();draw();addEventListener('resize',resize);
  }

  const coreNodes=$$('.core-stage .node');
  const readout=$('#coreReadout');
  function selectCoreNode(node){
    if(!node)return;
    coreNodes.forEach(item=>item.classList.toggle('active',item===node));
    const code=$('#coreReadoutCode'),title=$('#coreReadoutTitle'),copy=$('#coreReadoutCopy');
    if(code)code.textContent=node.dataset.code||'--';
    if(title)title.textContent=node.dataset.title||node.textContent.trim();
    if(copy)copy.textContent=node.dataset.copy||'';
    readout?.classList.remove('is-changing');
    void readout?.offsetWidth;
    readout?.classList.add('is-changing');
  }
  coreNodes.forEach(node=>{
    node.addEventListener('pointerenter',()=>selectCoreNode(node));
    node.addEventListener('focus',()=>selectCoreNode(node));
    node.addEventListener('pointerdown',()=>selectCoreNode(node));
  });

  const coreStage=$('#coreStage'), sphere=$('.core-sphere');
  if(coreStage&&sphere){
    let dragging=false,rx=0,ry=0,lastX=0,lastY=0,lastFrame=performance.now();
    const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarsePointer=matchMedia('(pointer:coarse)').matches;
    const apply=()=>{
      coreStage.style.transform=`rotateX(${ry}deg) rotateY(${rx}deg)`;
      sphere.style.transform='translate(-50%,-50%)';
    };
    const endDrag=e=>{
      dragging=false;
      coreStage.classList.remove('is-touching');
      if(e?.pointerId!==undefined&&coreStage.hasPointerCapture?.(e.pointerId))coreStage.releasePointerCapture(e.pointerId);
    };
    coreStage.addEventListener('pointerdown',e=>{
      if(e.target.closest('button,a'))return;
      dragging=true;lastX=e.clientX;lastY=e.clientY;
      coreStage.classList.add('is-touching');
      coreStage.setPointerCapture?.(e.pointerId);
    });
    coreStage.addEventListener('pointermove',e=>{
      if(!dragging)return;
      rx+=(e.clientX-lastX)*.055;
      ry-=(e.clientY-lastY)*.045;
      rx=Math.max(-8,Math.min(8,rx));
      ry=Math.max(-6,Math.min(6,ry));
      lastX=e.clientX;lastY=e.clientY;apply();
    });
    coreStage.addEventListener('pointerup',endDrag);
    coreStage.addEventListener('pointercancel',endDrag);
    coreStage.addEventListener('lostpointercapture',()=>{dragging=false;coreStage.classList.remove('is-touching')});
    if(matchMedia('(pointer:fine)').matches){
      coreStage.addEventListener('mousemove',e=>{
        if(dragging)return;
        const r=coreStage.getBoundingClientRect();
        rx=((e.clientX-r.left)/r.width-.5)*3.6;
        ry=-((e.clientY-r.top)/r.height-.5)*2.8;
      });
      coreStage.addEventListener('mouseleave',()=>{if(!dragging){rx=0;ry=0}});
    }
    function animateCore(now){
      const dt=Math.min(40,now-lastFrame);lastFrame=now;
      if(!dragging&&!reducedMotion&&document.getElementById('hero')?.classList.contains('view-active')){
        if(coarsePointer){
          rx=Math.sin(now*.00055)*1.65;
          ry=Math.cos(now*.00043)*1.05;
        }else{
          rx*=Math.pow(.992,dt/16);
          ry*=Math.pow(.992,dt/16);
        }
        apply();
      }
      requestAnimationFrame(animateCore);
    }
    apply();requestAnimationFrame(animateCore);
  }

  function activateCertFilter(filter){
    const buttons=$$('.cert-filter');const cards=$$('.cert-card');
    if(!buttons.length)return;
    buttons.forEach(btn=>btn.classList.toggle('active',btn.dataset.filter===filter));
    cards.forEach(card=>card.classList.toggle('hidden',filter!=='all'&&card.dataset.category!==filter));
  }
  $$('.cert-filter').forEach(btn=>btn.addEventListener('click',()=>activateCertFilter(btn.dataset.filter)));
  activateCertFilter('all');

  const overlay=$('#terminalOverlay'), input=$('#terminalInput'), output=$('#terminalOutput'), closeBtn=$('#terminalClose');
  function openTerminal(){overlay?.classList.add('open');overlay?.setAttribute('aria-hidden','false');setTimeout(()=>input?.focus(),30)}
  function closeTerminal(){overlay?.classList.remove('open');overlay?.setAttribute('aria-hidden','true')}
  closeBtn?.addEventListener('click',closeTerminal);overlay?.addEventListener('click',e=>{if(e.target===overlay)closeTerminal()});
  const commands={
    help:()=>`Available commands: <span class="term-accent">about, skills, projects, certifications, contact, cv, home, clear</span>`,
    about:()=>{showView('about');closeTerminal();return 'Opening profile module...'},
    skills:()=>{showView('skills');closeTerminal();return 'Opening technical stack...'},
    projects:()=>{showView('projects');closeTerminal();return 'Opening projects module...'},
    certifications:()=>{showView('certifications');closeTerminal();return 'Opening credentials registry...'},
    contact:()=>{showView('contact');closeTerminal();return 'Opening contact channel...'},
    home:()=>{showView('hero');closeTerminal();return 'Returning to core...'},
    cv:()=>{window.open('cv.html','_blank','noopener');return 'Opening CV viewer...'},
    clear:()=>{if(output)output.innerHTML='';return ''}
  };
  input?.addEventListener('keydown',e=>{if(e.key!=='Enter')return;const value=input.value.trim().toLowerCase();if(!value)return;const line=document.createElement('p');line.innerHTML=`<span class="term-accent">raymond@portfolio:~$</span> ${value}`;output?.appendChild(line);const result=commands[value]?commands[value]():`Command not found: <b>${value}</b>. Type <b>help</b>.`;if(result){const reply=document.createElement('p');reply.innerHTML=result;output?.appendChild(reply)}input.value='';if(output)output.scrollTop=output.scrollHeight});

  function toggleHud(){document.body.classList.toggle('hud-off');const btn=$('[data-action="hud"]');const enabled=!document.body.classList.contains('hud-off');btn?.classList.toggle('active',enabled);btn?.setAttribute('aria-pressed',String(enabled))}
  function stopAuto(){if(autoTimer){clearInterval(autoTimer);autoTimer=null}const btn=$('[data-action="auto"]');btn?.classList.remove('active');btn?.setAttribute('aria-pressed','false')}
  function startAuto(){
    if(autoTimer){stopAuto();return}
    showView('hero');
    const btn=$('[data-action="auto"]');btn?.classList.add('active');btn?.setAttribute('aria-pressed','true');
    autoIndex=0;selectCoreNode(coreNodes[autoIndex]);
    autoTimer=setInterval(()=>{autoIndex=(autoIndex+1)%coreNodes.length;selectCoreNode(coreNodes[autoIndex])},2400);
  }
  $$('[data-action]').forEach(btn=>btn.addEventListener('click',()=>{const a=btn.dataset.action;if(a==='terminal')openTerminal();if(a==='hud')toggleHud();if(a==='explore')showView('about');if(a==='auto')startAuto()}));

  addEventListener('keydown',e=>{
    if(e.key==='Escape'){closeTerminal();stopAuto();return}
    if((e.target instanceof HTMLInputElement)||(e.target instanceof HTMLTextAreaElement))return;
    const key=e.key.toLowerCase();
    if(key==='t'){e.preventDefault();openTerminal()}
    if(key==='h'){e.preventDefault();toggleHud()}
    const map={'1':'about','2':'projects','3':'skills','4':'timeline','5':'certifications','6':'contact','0':'hero'};
    if(map[e.key])showView(map[e.key]);
  });
})();
