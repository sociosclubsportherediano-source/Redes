
const files = {
  views: ['facebook_visualizaciones.csv','instagram_visualizaciones.csv'],
  viewers: ['facebook_espectadores.csv','instagram_espectadores.csv'],
  interactions: ['facebook_interacciones.csv','instagram_interacciones.csv'],
  clicks: ['facebook_clics.csv','instagram_clics.csv'],
  visits: ['facebook_visitas.csv','instagram_visitas.csv'],
  followers: ['facebook_seguidores.csv','instagram_seguidores.csv']
};
const labels = {views:'Visualizaciones',viewers:'Espectadores diarios acumulados',interactions:'Interacciones',clicks:'Clics en enlaces',visits:'Visitas',followers:'Registros de seguidores'};
const START='2025-09-29', END='2026-10-31';
const fmt = n => new Intl.NumberFormat('es-CR').format(Math.round(n||0));
const short = n => new Intl.NumberFormat('es-CR',{notation:'compact',maximumFractionDigits:2}).format(n||0);
const parseCSV = text => {
  const lines=text.replace(/^\uFEFF/,'').split(/\r?\n/).filter(Boolean);
  const rows=[];
  for(let i=0;i<lines.length;i++){
    if(i<2) continue;
    const parts=lines[i].split(',');
    if(parts.length<2 || parts[0].replaceAll('"','')==='Fecha') continue;
    const date=parts[0].replaceAll('"','').slice(0,10);
    const value=Number(parts[1].replaceAll('"','').replace(',','.'));
    if(date>=START && date<=END && Number.isFinite(value)) rows.push({date,value});
  }
  return rows;
};
function loadMetric(metric){
  const source=window.DASHBOARD_DATA && window.DASHBOARD_DATA[metric];
  if(!source || !source.fb || !source.ig) throw new Error('No se encontraron los datos integrados de '+metric+'. Ejecutá ACTUALIZAR DATOS.bat.');
  return source;
}
const sum = rows=>rows.reduce((a,r)=>a+r.value,0);
const monthKey = date=>date.slice(0,7);
const monthly = rows=>{
  const out={};
  rows.forEach(r=>{const k=monthKey(r.date);out[k]=(out[k]||0)+r.value;});
  return out;
};
const all = {};
function drawChart(metric){
  const canvas=document.getElementById('trend-chart');
  const rect=canvas.getBoundingClientRect(), dpr=window.devicePixelRatio||1;
  canvas.width=Math.max(320,rect.width)*dpr;canvas.height=Math.max(180,rect.height)*dpr;
  const ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);
  const w=canvas.width/dpr,h=canvas.height/dpr;
  const pad={l:48,r:14,t:16,b:38},cw=w-pad.l-pad.r,ch=h-pad.t-pad.b;
  const a=monthly(all[metric].fb),b=monthly(all[metric].ig);
  const keys=Array.from(new Set([...Object.keys(a),...Object.keys(b)])).sort();
  const max=Math.max(1,...keys.map(k=>Math.max(a[k]||0,b[k]||0)));
  const nice=Math.pow(10,Math.floor(Math.log10(max)));
  const top=Math.ceil(max/nice)*nice;
  ctx.clearRect(0,0,w,h);
  ctx.font='10px system-ui';ctx.textBaseline='middle';
  for(let i=0;i<=4;i++){
    const v=top*i/4,y=pad.t+ch-(v/top)*ch;
    ctx.strokeStyle='#ececef';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(w-pad.r,y);ctx.stroke();
    ctx.fillStyle='#858891';ctx.textAlign='right';ctx.fillText(short(v),pad.l-9,y);
  }
  const x=i=>pad.l+(keys.length<=1?0:i/(keys.length-1))*cw;
  const series=(obj,color)=>{
    ctx.strokeStyle=color;ctx.lineWidth=2.5;ctx.lineJoin='round';ctx.lineCap='round';ctx.beginPath();
    keys.forEach((k,i)=>{const y=pad.t+ch-((obj[k]||0)/top)*ch;if(i===0)ctx.moveTo(x(i),y);else ctx.lineTo(x(i),y);});
    ctx.stroke();
  };
  series(a,'#b51f32');series(b,'#e6ae16');
  keys.forEach((k,i)=>{
    if(i%2===0||i===keys.length-1){ctx.fillStyle='#777b83';ctx.textAlign='center';ctx.textBaseline='top';const [yr,mo]=k.split('-');const name=new Date(Number(yr),Number(mo)-1,1).toLocaleDateString('es-CR',{month:'short',year:'2-digit'});ctx.fillText(name,x(i),h-pad.b+12);}
  });
}
function renderTable(){
  const body=document.getElementById('comparison-body');
  const rows=['views','interactions','visits','clicks','followers'];
  body.innerHTML=rows.map(k=>{
    const f=sum(all[k].fb),i=sum(all[k].ig);
    return `<tr><td>${labels[k]}</td><td>${fmt(f)}</td><td>${fmt(i)}</td><td class="total-cell">${fmt(f+i)}</td></tr>`;
  }).join('');
}
function renderInsights(){
  const f=sum(all.views.fb),i=sum(all.views.ig),total=f+i;
  const fi=sum(all.interactions.fb),ii=sum(all.interactions.ig);
  const fv=sum(all.visits.fb),iv=sum(all.visits.ig);
  const fbShare=Math.round(f/total*100),igShare=100-fbShare;
  const items=[
    {n:fmt(total),t:'Visualizaciones en ambas plataformas',p:`Facebook aporta ${fbShare}% e Instagram ${igShare}% del total de visualizaciones registradas.`},
    {n:fmt(fi+ii),t:'Interacciones con el contenido',p:`Se registraron ${fmt(fi)} en Facebook y ${fmt(ii)} en Instagram durante el período.`},
    {n:fmt(fv+iv),t:'Visitas a páginas y perfiles',p:'Las visitas muestran acciones de interés de las personas que llegaron a los espacios institucionales.'}
  ];
  document.getElementById('insights').innerHTML=items.map(x=>`<article class="insight"><div class="number">${x.n}</div><h3>${x.t}</h3><p>${x.p}</p></article>`).join('');
}
async function init(){
 try{
  for(const k of Object.keys(files)) all[k]=await loadMetric(k);
  const totals={
   views:sum(all.views.fb)+sum(all.views.ig),
   interactions:sum(all.interactions.fb)+sum(all.interactions.ig),
   visits:sum(all.visits.fb)+sum(all.visits.ig),
   clicks:sum(all.clicks.fb)+sum(all.clicks.ig),
   followers:sum(all.followers.fb)+sum(all.followers.ig)
  };
  Object.entries(totals).forEach(([k,v])=>document.getElementById('kpi-'+k).textContent=fmt(v));
  const viewerTotal=sum(all.viewers.fb)+sum(all.viewers.ig);
  document.getElementById('audience-total').textContent=fmt(viewerTotal);
  renderTable();renderInsights();drawChart('views');
  document.getElementById('metric-select').addEventListener('change',e=>drawChart(e.target.value));
  window.addEventListener('resize',()=>drawChart(document.getElementById('metric-select').value));
 }catch(err){
  const el=document.getElementById('load-error');el.textContent='No fue posible cargar los archivos estadísticos. Verificá que js/data.js exista y que hayas ejecutado ACTUALIZAR DATOS.bat después de sustituir los CSV. Detalle: '+err.message;el.classList.remove('hidden');
 }
}
init();
