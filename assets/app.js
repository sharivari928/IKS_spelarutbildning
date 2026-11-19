(()=>{
  const t=document.getElementById('theme-toggle');
  if(t){
    const label=t.querySelector('.theme-label');
    const meta=document.querySelector('meta[name="theme-color"]');
    function apply(theme,persist=false){
      const dark=theme==='dark'; document.documentElement.dataset.theme=dark?'dark':'light';
      t.setAttribute('aria-pressed',String(dark));
      t.setAttribute('aria-label',dark?'Aktivera ljust läge':'Aktivera mörkt läge');
      label.textContent=dark?'Ljust läge':'Mörkt läge';
      if(meta)meta.content=dark?'#0D1220':'#000000';
      if(persist)try{localStorage.setItem('sirius-p14u-theme',theme)}catch(e){}
    }
    t.addEventListener('click',()=>apply(document.documentElement.dataset.theme==='dark'?'light':'dark',true));
    apply(document.documentElement.dataset.theme);
  }
  const data={"4231": {"name": "1–4–2–3–1", "source": "The Sirius Way", "players": [["9", "nine", 180, 63], ["7", "wide", 68, 156], ["10", "ten", 180, 156], ["11", "wide", 292, 156], ["6", "six", 130, 245], ["8", "eight", 230, 245], ["YB", "yb", 49, 340], ["IB", "ib", 134, 340], ["IB", "ib", 226, 340], ["YB", "yb", 311, 340], ["1", "gk", 180, 427]]}, "3421": {"name": "1–3–4–2–1", "source": "P14U · Mitt spelsystem", "players": [["9", "nine", 180, 65], ["10", "ten", 132, 155], ["10", "ten", 228, 155], ["WB", "wb", 45, 245], ["6", "six", 130, 245], ["8", "eight", 230, 245], ["WB", "wb", 315, 245], ["IB", "ib", 96, 340], ["IB", "ib", 180, 340], ["IB", "ib", 264, 340], ["1", "gk", 180, 427]]}};
  const pitch=document.getElementById('pitch');
  const group=document.getElementById('players');
  const tabs=[...document.querySelectorAll('[data-formation]')];
  const role=document.body.dataset.currentRole;
  let initial='4231';
  try{const saved=localStorage.getItem('sirius-p14u-formation');if(data[saved])initial=saved}catch(e){}
  function draw(key){
    if(!group||!data[key])return;
    group.replaceChildren();const f=data[key]; const ns='http://www.w3.org/2000/svg';
    let matched=0;
    f.players.forEach(([label,roleId,x,y])=>{
      const active=roleId===role && role!=='';
      if(active)matched++;
      const g=document.createElementNS(ns,'g');
      g.setAttribute('class','player'+((active || (role==='' && roleId==='gk'))?' goalkeeper':''));
      g.setAttribute('transform',`translate(${x} ${y})`);
      const circ=document.createElementNS(ns,'circle');circ.setAttribute('class','player-circle');circ.setAttribute('r',active?'19':'15');
      const txt=document.createElementNS(ns,'text');txt.setAttribute('class','player-label');txt.textContent=label;
      g.append(circ,txt);group.append(g);
    });
    const name=document.getElementById('formation-name'),source=document.getElementById('formation-source');
    if(name)name.textContent=f.name;if(source)source.textContent=f.source;
    tabs.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.formation===key)));
    const note=document.getElementById('formation-note');
    if(note)note.textContent=(role && matched===0)?'Den här rollen har ingen egen utgångsposition i vald formation. Växla formation för att se den markerad.': 'Illustrationen visar förenklade utgångspositioner – inte fasta platser under spelet.';
    const legend=document.getElementById('primary-legend');
    if(legend)legend.textContent=role?(matched?'Markerad roll':'Målvakt (referens)'):'Målvakt (1)';
    if(pitch)pitch.setAttribute('aria-label',`Utgångsformation ${f.name}, ${matched} spelare i vald roll markerade`);
    try{localStorage.setItem('sirius-p14u-formation',key)}catch(e){}
  }
  tabs.forEach(b=>b.addEventListener('click',()=>draw(b.dataset.formation)));
  draw(initial);
  const filters=[...document.querySelectorAll('[data-filter]')];
  const cards=[...document.querySelectorAll('[data-role-card]')];
  function filter(which){
    let count=0;
    cards.forEach(c=>{let visible=which==='all'||c.dataset.in.split(',').includes(which); c.hidden=!visible;if(visible)count++});
    filters.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===which)));
    const counter=document.getElementById('role-count');if(counter)counter.textContent=`${count} roller visas`;
    if(which!=='all')draw(which);
  }
  filters.forEach(b=>b.addEventListener('click',()=>filter(b.dataset.filter)));
  if(filters.length)filter(initial);
})();