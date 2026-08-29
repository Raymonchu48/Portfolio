(function setupPortfolioVideoScenes(){
  const sceneConfig={
    ptd:{
      section:document.getElementById('ptd'),
      bgSelector:'.scene-bg',
      cardSelector:'.section-scene-card',
      src:'media/ptd-tech-bg.mp4',
      videoClass:'ptd-video-media'
    },
    skills:{
      section:document.getElementById('skills'),
      bgSelector:'.skills-video-bg',
      cardSelector:'.skills-video-card',
      src:'media/skills-tech-bg.mp4',
      videoClass:'skills-video-media'
    }
  };

  function buildVideoScene(key,config){
    const {section,bgSelector,src,videoClass}=config;
    if(!section)return;
    const background=section.querySelector(bgSelector);
    if(!background)return;

    section.classList.add('portfolio-video-scene',`${key}-video-scene`);
    background.classList.add('portfolio-video-bg');

    // Retira cualquier embed antiguo de Pinterest para evitar capas duplicadas.
    background.querySelectorAll('iframe').forEach(frame=>frame.remove());

    let video=background.querySelector('video');
    if(!video){
      video=document.createElement('video');
      background.prepend(video);
    }

    video.className=`portfolio-video-media ${videoClass}`;
    video.autoplay=true;
    video.muted=true;
    video.defaultMuted=true;
    video.loop=true;
    video.playsInline=true;
    video.preload='auto';
    video.setAttribute('muted','');
    video.setAttribute('autoplay','');
    video.setAttribute('loop','');
    video.setAttribute('playsinline','');
    video.setAttribute('aria-hidden','true');
    video.setAttribute('tabindex','-1');
    video.removeAttribute('style');

    let source=video.querySelector('source');
    if(!source){
      source=document.createElement('source');
      video.appendChild(source);
    }
    const sourceChanged=!source.getAttribute('src')||!source.getAttribute('src').endsWith(src);
    source.src=src;
    source.type='video/mp4';

    video.addEventListener('canplay',()=>section.classList.add('video-loaded'));
    video.addEventListener('error',()=>section.classList.add('video-error'));

    if(sourceChanged)video.load();

    const syncPlayback=()=>{
      if(section.classList.contains('view-active')){
        video.play().catch(()=>{});
      }else{
        video.pause();
      }
    };

    new MutationObserver(syncPlayback).observe(section,{attributes:true,attributeFilter:['class']});
    syncPlayback();
  }

  Object.entries(sceneConfig).forEach(([key,config])=>buildVideoScene(key,config));

  if(!document.getElementById('portfolio-video-scenes-css')){
    const style=document.createElement('style');
    style.id='portfolio-video-scenes-css';
    style.textContent=`
      #ptd.portfolio-video-scene,
      #skills.portfolio-video-scene{
        position:relative!important;
        overflow:hidden!important;
        isolation:isolate!important;
        background:#03070a!important;
        box-shadow:0 24px 60px rgba(15,23,42,.18)!important;
        padding:4.2rem 4.6rem!important;
        min-height:calc(100vh - 8.5rem)!important;
        border-radius:2rem!important;
        align-items:center!important;
        justify-content:center!important;
      }

      #ptd.portfolio-video-scene.view-active,
      #skills.portfolio-video-scene.view-active{
        display:flex!important;
      }

      #ptd .portfolio-video-bg,
      #skills .portfolio-video-bg{
        position:absolute!important;
        inset:0!important;
        z-index:0!important;
        width:100%!important;
        height:100%!important;
        overflow:hidden!important;
        border-radius:2rem!important;
        background:radial-gradient(circle at 65% 45%,#0a2530 0,#050b10 40%,#010203 82%)!important;
      }

      #ptd .portfolio-video-media,
      #skills .portfolio-video-media{
        position:absolute!important;
        inset:0!important;
        z-index:1!important;
        display:block!important;
        width:100%!important;
        height:100%!important;
        max-width:none!important;
        object-fit:cover!important;
        object-position:center!important;
        border:0!important;
        pointer-events:none!important;
        transform:scale(1.035)!important;
        filter:saturate(.9) contrast(1.08) brightness(.74)!important;
      }

      #ptd .portfolio-video-bg::after,
      #skills .portfolio-video-bg::after{
        content:""!important;
        position:absolute!important;
        inset:0!important;
        z-index:2!important;
        pointer-events:none!important;
        background:
          linear-gradient(90deg,rgba(1,4,7,.56),rgba(1,4,7,.18) 50%,rgba(1,4,7,.54)),
          radial-gradient(circle at 50% 50%,transparent 0,rgba(0,0,0,.08) 55%,rgba(0,0,0,.45) 100%)!important;
      }

      #ptd .section-scene-card,
      #skills .skills-video-card{
        position:relative!important;
        z-index:3!important;
        width:min(1120px,90%)!important;
        max-width:1120px!important;
        background:rgba(255,255,255,.96)!important;
        border:1px solid rgba(255,255,255,.84)!important;
        border-radius:2rem!important;
        padding:2.35rem 2.55rem!important;
        box-shadow:0 32px 78px rgba(0,0,0,.50),0 0 0 1px rgba(201,255,0,.07)!important;
        backdrop-filter:blur(4px)!important;
        -webkit-backdrop-filter:blur(4px)!important;
        animation:portfolioCardFloat 7s ease-in-out infinite!important;
      }

      #skills .skill-card{
        background:rgba(249,250,251,.95)!important;
        box-shadow:0 10px 26px rgba(15,23,42,.07)!important;
      }

      @keyframes portfolioCardFloat{
        0%,100%{transform:translateY(0)}
        50%{transform:translateY(-5px)}
      }

      @media(max-width:1080px){
        #ptd.portfolio-video-scene,#skills.portfolio-video-scene{padding:3rem!important;min-height:calc(100vh - 8rem)!important}
        #ptd .section-scene-card,#skills .skills-video-card{width:min(1080px,92%)!important}
      }

      @media(max-width:820px){
        #ptd.portfolio-video-scene,#skills.portfolio-video-scene{padding:2rem 1.6rem!important;min-height:calc(100vh - 7rem)!important;border-radius:1.5rem!important}
        #ptd .portfolio-video-bg,#skills .portfolio-video-bg{border-radius:1.5rem!important}
        #ptd .section-scene-card,#skills .skills-video-card{width:94%!important;padding:1.7rem 1.55rem!important;border-radius:1.55rem!important}
      }

      @media(max-width:480px){
        #ptd.portfolio-video-scene,#skills.portfolio-video-scene{padding:1.15rem!important;min-height:calc(100vh - 6.5rem)!important;border-radius:1.2rem!important}
        #ptd .portfolio-video-bg,#skills .portfolio-video-bg{border-radius:1.2rem!important}
        #ptd .section-scene-card,#skills .skills-video-card{width:100%!important;padding:1.35rem 1.15rem!important;border-radius:1.25rem!important;animation:none!important}
        #ptd .portfolio-video-media,#skills .portfolio-video-media{filter:saturate(.84) contrast(1.05) brightness(.68)!important}
      }

      @media(prefers-reduced-motion:reduce){
        #ptd .section-scene-card,#skills .skills-video-card{animation:none!important}
      }
    `;
    document.head.appendChild(style);
  }
})();
