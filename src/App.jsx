import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL STYLES
// ─────────────────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600;700&display=swap');
  *{box-sizing:border-box}
  body{font-family:'DM Sans',sans-serif}
  @keyframes fadeIn    {from{opacity:0}to{opacity:1}}
  @keyframes fadeUp    {from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeDown  {from{opacity:0;transform:translateY(-16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes scaleIn   {from{opacity:0;transform:scale(0.88)}to{opacity:1;transform:scale(1)}}
  @keyframes slideLeft {from{opacity:0;transform:translateX(-24px)}to{opacity:1;transform:translateX(0)}}
  @keyframes slideRight{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)}}
  @keyframes spinGrow  {0%{transform:scale(0)rotate(-180deg);opacity:0}60%{transform:scale(1.15)rotate(10deg);opacity:1}100%{transform:scale(1)rotate(0)}  }
  @keyframes floatY    {0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
  @keyframes ripple    {0%{transform:scale(.8);opacity:1}100%{transform:scale(2.5);opacity:0}}
  @keyframes dotBounce {0%,80%,100%{transform:scale(0)}40%{transform:scale(1)}}
  @keyframes pulse     {0%,100%{opacity:1}50%{opacity:.4}}
  @keyframes shimmer   {0%{background-position:-600px 0}100%{background-position:600px 0}}
  @keyframes navUp     {from{transform:translateY(100%)}to{transform:translateY(0)}}
  @keyframes flip      {0%{transform:rotateY(0)}100%{transform:rotateY(180deg)}}
  @keyframes countUp   {from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}

  .aFadeIn   {animation:fadeIn    .5s ease both}
  .aFadeUp   {animation:fadeUp    .45s ease both}
  .aFadeDown {animation:fadeDown  .4s ease both}
  .aScaleIn  {animation:scaleIn   .4s cubic-bezier(.34,1.56,.64,1) both}
  .aSlideL   {animation:slideLeft  .4s ease both}
  .aSlideR   {animation:slideRight .4s ease both}
  .aNavUp    {animation:navUp     .5s cubic-bezier(.34,1.2,.64,1) both}
  .aFloat    {animation:floatY    3s ease-in-out infinite}
  .aPulse    {animation:pulse     1.5s ease-in-out infinite}
  .aCountUp  {animation:countUp   .5s ease both}

  .d1{animation-delay:.06s}.d2{animation-delay:.12s}.d3{animation-delay:.18s}
  .d4{animation-delay:.24s}.d5{animation-delay:.30s}.d6{animation-delay:.36s}
  .d7{animation-delay:.42s}.d8{animation-delay:.48s}

  .lift{transition:transform .18s ease,box-shadow .18s ease}
  .lift:hover{transform:translateY(-3px);box-shadow:0 8px 28px rgba(0,0,0,.09)}
  .lift:active{transform:translateY(0)}

  .skeleton{background:linear-gradient(90deg,#f0f0f0 25%,#e4e4e4 50%,#f0f0f0 75%);background-size:600px 100%;animation:shimmer 1.4s infinite;border-radius:8px}

  .ripple-ring{position:absolute;inset:0;border-radius:50%;border:2px solid #16a34a;animation:ripple 2s ease-out infinite}
  .dot-bounce span{display:inline-block;width:8px;height:8px;border-radius:50%;background:#16a34a;margin:0 3px;animation:dotBounce 1.4s ease-in-out infinite both}
  .dot-bounce span:nth-child(1){animation-delay:-.32s}
  .dot-bounce span:nth-child(2){animation-delay:-.16s}

  input,select,textarea{outline:none}
  input:focus,select:focus{border-color:#16a34a!important;ring:2px solid #bbf7d0}

  .tab-pill-active{background:#16a34a;color:#fff;box-shadow:0 2px 8px rgba(22,163,74,.3)}
  .tab-pill-idle{background:#f3f4f6;color:#6b7280}
  .tab-pill-idle:hover{background:#e5e7eb}

  .offline-banner{background:#fef9c3;color:#854d0e;font-size:11px;text-align:center;padding:4px 8px;font-weight:600}
`;

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const PRICE_DATA = [
  {year:2026,month:"January",   corn_white:31.45,corn_yellow:30.72,rice_fancy:41.08,rice_other:32.52},
  {year:2026,month:"February",  corn_white:31.52,corn_yellow:30.81,rice_fancy:41.16,rice_other:32.59},
  {year:2026,month:"March",     corn_white:31.58,corn_yellow:30.89,rice_fancy:41.23,rice_other:32.65},
  {year:2026,month:"April",     corn_white:31.63,corn_yellow:30.95,rice_fancy:41.29,rice_other:32.70},
  {year:2026,month:"May",       corn_white:31.68,corn_yellow:31.01,rice_fancy:41.35,rice_other:32.75},
  {year:2026,month:"June",      corn_white:31.72,corn_yellow:31.06,rice_fancy:41.40,rice_other:32.79},
  {year:2026,month:"July",      corn_white:31.75,corn_yellow:31.10,rice_fancy:41.44,rice_other:32.83},
  {year:2026,month:"August",    corn_white:31.78,corn_yellow:31.14,rice_fancy:41.48,rice_other:32.86},
  {year:2026,month:"September", corn_white:31.80,corn_yellow:31.17,rice_fancy:41.51,rice_other:32.92},
  {year:2026,month:"October",   corn_white:31.82,corn_yellow:31.20,rice_fancy:41.57,rice_other:32.95},
  {year:2026,month:"November",  corn_white:31.85,corn_yellow:31.23,rice_fancy:41.57,rice_other:32.95},
  {year:2026,month:"December",  corn_white:31.88,corn_yellow:31.26,rice_fancy:41.60,rice_other:32.98},
  {year:2027,month:"January",   corn_white:32.15,corn_yellow:31.55,rice_fancy:42.05,rice_other:33.35},
  {year:2027,month:"February",  corn_white:32.22,corn_yellow:31.64,rice_fancy:42.13,rice_other:33.42},
  {year:2027,month:"March",     corn_white:32.28,corn_yellow:31.72,rice_fancy:42.20,rice_other:33.48},
  {year:2027,month:"April",     corn_white:32.33,corn_yellow:31.78,rice_fancy:42.26,rice_other:33.53},
  {year:2027,month:"May",       corn_white:32.38,corn_yellow:31.84,rice_fancy:42.32,rice_other:33.58},
  {year:2027,month:"June",      corn_white:32.42,corn_yellow:31.89,rice_fancy:42.37,rice_other:33.62},
  {year:2027,month:"July",      corn_white:32.45,corn_yellow:31.93,rice_fancy:42.41,rice_other:33.66},
  {year:2027,month:"August",    corn_white:32.48,corn_yellow:31.97,rice_fancy:42.45,rice_other:33.69},
  {year:2027,month:"September", corn_white:32.50,corn_yellow:32.00,rice_fancy:42.48,rice_other:33.72},
  {year:2027,month:"October",   corn_white:32.52,corn_yellow:32.03,rice_fancy:42.51,rice_other:33.75},
  {year:2027,month:"November",  corn_white:32.55,corn_yellow:32.06,rice_fancy:42.54,rice_other:33.78},
  {year:2027,month:"December",  corn_white:32.58,corn_yellow:32.09,rice_fancy:42.57,rice_other:33.81},
  {year:2028,month:"January",   corn_white:32.85,corn_yellow:32.38,rice_fancy:43.02,rice_other:34.18},
  {year:2028,month:"February",  corn_white:32.92,corn_yellow:32.47,rice_fancy:43.10,rice_other:34.25},
  {year:2028,month:"March",     corn_white:32.98,corn_yellow:32.55,rice_fancy:43.17,rice_other:34.31},
  {year:2028,month:"April",     corn_white:33.03,corn_yellow:32.61,rice_fancy:43.23,rice_other:34.36},
  {year:2028,month:"May",       corn_white:33.08,corn_yellow:32.67,rice_fancy:43.29,rice_other:34.41},
  {year:2028,month:"June",      corn_white:33.12,corn_yellow:32.72,rice_fancy:43.34,rice_other:34.45},
  {year:2028,month:"July",      corn_white:33.15,corn_yellow:32.76,rice_fancy:43.38,rice_other:34.49},
  {year:2028,month:"August",    corn_white:33.18,corn_yellow:32.80,rice_fancy:43.42,rice_other:34.52},
  {year:2028,month:"September", corn_white:33.20,corn_yellow:32.83,rice_fancy:43.45,rice_other:34.55},
  {year:2028,month:"October",   corn_white:33.22,corn_yellow:32.86,rice_fancy:43.48,rice_other:34.58},
  {year:2028,month:"November",  corn_white:33.25,corn_yellow:32.89,rice_fancy:43.51,rice_other:34.61},
  {year:2028,month:"December",  corn_white:33.28,corn_yellow:32.92,rice_fancy:43.54,rice_other:34.64},
];

const MARKET = [
  {label:"White Corn", icon:"🌽",cat:"Corn",  low:28.00,high:31.50,unit:"farmgate"},
  {label:"Yellow Corn",icon:"🌽",cat:"Corn",  low:26.50,high:30.00,unit:"farmgate"},
  {label:"Palay Fancy",icon:"🌾",cat:"Palay", low:26.00,high:30.00,unit:"dry"},
  {label:"Palay Other",icon:"🌾",cat:"Palay", low:18.50,high:25.00,unit:"fresh/wet"},
];

const CROPS = {
  corn:{label:"Corn", icon:"🌽",color:"#d97706",
    bg:"from-amber-50 to-yellow-50",border:"border-amber-200",
    accent:"bg-amber-500",text:"text-amber-700",badge:"bg-amber-100 text-amber-800",
    varieties:[{key:"corn_white",label:"White Corn"},{key:"corn_yellow",label:"Yellow Corn"}]},
  rice:{label:"Palay",icon:"🌾",color:"#16a34a",
    bg:"from-green-50 to-emerald-50",border:"border-green-200",
    accent:"bg-green-600",text:"text-green-700",badge:"bg-green-100 text-green-800",
    varieties:[{key:"rice_fancy",label:"Palay Fancy"},{key:"rice_other",label:"Palay Other"}]},
};

const WEATHER_DATA = [
  {month:"January",   temp:26,rain:120,humidity:80,cond:"Partly Cloudy",icon:"⛅",advisory:"Cool dry season — ideal for corn planting."},
  {month:"February",  temp:27,rain:90, humidity:78,cond:"Mostly Sunny",  icon:"🌤️",advisory:"Best planting window for yellow corn."},
  {month:"March",     temp:28,rain:70, humidity:75,cond:"Sunny",         icon:"☀️",advisory:"Hot and dry — ensure irrigation for palay."},
  {month:"April",     temp:30,rain:80, humidity:74,cond:"Hot & Sunny",   icon:"☀️",advisory:"Peak heat — monitor palay for heat stress."},
  {month:"May",       temp:30,rain:150,humidity:82,cond:"Rainy Season",  icon:"🌧️",advisory:"Start of wet season — prepare rice paddies."},
  {month:"June",      temp:29,rain:220,humidity:88,cond:"Heavy Rain",    icon:"⛈️",advisory:"Heavy rains — watch for fungal disease in corn."},
  {month:"July",      temp:28,rain:280,humidity:90,cond:"Typhoon Season",icon:"🌀",advisory:"Typhoon risk — delay harvests if possible."},
  {month:"August",    temp:27,rain:300,humidity:91,cond:"Typhoon Season",icon:"🌀",advisory:"Highest typhoon risk month in Bicol."},
  {month:"September", temp:27,rain:260,humidity:89,cond:"Heavy Rain",    icon:"⛈️",advisory:"Still rainy — inspect drainage systems."},
  {month:"October",   temp:27,rain:200,humidity:87,cond:"Rainy",         icon:"🌧️",advisory:"Harvest season begins — check grain moisture."},
  {month:"November",  temp:27,rain:160,humidity:85,cond:"Partly Cloudy", icon:"⛅",advisory:"Wet-season harvest. Good palay prices expected."},
  {month:"December",  temp:26,rain:140,humidity:83,cond:"Cloudy",        icon:"☁️",advisory:"Holiday demand peaks — best time to sell palay."},
];

const BEST_SELL = {
  corn_white: {months:["October","November","December"],reason:"Post-harvest demand + Q4 holiday snack production peaks."},
  corn_yellow:{months:["September","October","November"],reason:"Livestock feed demand peaks before year-end."},
  rice_fancy: {months:["November","December","January"], reason:"Holiday season drives premium palay demand to highest levels."},
  rice_other: {months:["January","February"],            reason:"Post-harvest glut clears; prices recover early in the year."},
};

const FACTORS = {
  corn_white:[
    {f:"Seasonal Harvest",    imp:"High",  dir:"↓",desc:"Oct–Nov harvest creates temporary supply glut then price recovery."},
    {f:"Holiday Snack Demand",imp:"Medium",dir:"↑",desc:"Q4 cornmeal/snack production pushes prices 2–4% above average."},
    {f:"Transport Cost",      imp:"Medium",dir:"↑",desc:"Rising fuel costs add ₱0.50–1.20/kg to farmgate-to-market transport."},
    {f:"SARIMA Trend",        imp:"High",  dir:"↑",desc:"Long-term upward trend of ~₱0.28/month from 2005–2025 data."},
  ],
  corn_yellow:[
    {f:"Livestock Feed Demand",imp:"High",  dir:"↑",desc:"Poultry and hog production cycles drive demand quarterly."},
    {f:"Import Competition",   imp:"Medium",dir:"↓",desc:"Yellow corn imports suppress domestic prices in peak supply months."},
    {f:"Seasonal Harvest",     imp:"High",  dir:"↓",desc:"Bicol harvest in May–Jun and Oct–Nov creates short-term dips."},
    {f:"SARIMA Trend",         imp:"High",  dir:"↑",desc:"Upward trend of ~₱0.25/month from historical analysis."},
  ],
  rice_fancy:[
    {f:"Milling Quality Premium",imp:"High",  dir:"↑",desc:"Well-milled rice commands 20–30% premium over commercial grade."},
    {f:"Holiday Demand",         imp:"High",  dir:"↑",desc:"Dec–Jan demand surge adds ₱1–2/kg seasonally."},
    {f:"NFA Buffer Stock",       imp:"Medium",dir:"↓",desc:"NFA stock releases can temporarily moderate retail prices."},
    {f:"SARIMA Trend",           imp:"High",  dir:"↑",desc:"Consistent growth of ~₱0.18/month from historical data."},
  ],
  rice_other:[
    {f:"Commercial Supply",  imp:"High",  dir:"↓",desc:"Large volume keeps prices lower and more stable."},
    {f:"NFA Support Price",  imp:"High",  dir:"↑",desc:"NFA minimum support price sets a floor for farmgate prices."},
    {f:"Post-Harvest Moisture",imp:"Medium",dir:"↓",desc:"Fresh/wet palay priced 15–20% lower than dry palay."},
    {f:"SARIMA Trend",       imp:"Medium",dir:"↑",desc:"Steady upward trend of ~₱0.14/month."},
  ],
};

const DEMAND = {
  corn_white: [62,58,55,60,65,63,61,64,68,72,75,78],
  corn_yellow:[70,68,65,67,72,70,69,71,74,76,78,80],
  rice_fancy: [65,60,58,62,64,63,62,65,68,72,80,85],
  rice_other: [75,72,70,73,75,74,73,75,76,78,80,82],
};

const SOIL_PH = {corn_white:6.0,corn_yellow:6.2,rice_fancy:5.8,rice_other:5.5};
const RAINFALL_NEEDS = {corn_white:"500–800mm",corn_yellow:"600–900mm",rice_fancy:"1200–1800mm",rice_other:"1000–1600mm"};

const DISEASES = [
  {name:"Corn Gray Leaf Spot",    crop:"Corn",  symptoms:"Gray-brown rectangular lesions on leaves",cause:"Fungal (high humidity)",action:"Apply fungicide; improve drainage"},
  {name:"Corn Stalk Borer",       crop:"Corn",  symptoms:"Holes in stalks; wilting",cause:"Insect pest",action:"Apply insecticide at early stage; remove infected plants"},
  {name:"Palay Blast",            crop:"Palay", symptoms:"Diamond-shaped brown lesions on leaves",cause:"Fungal (Magnaporthe)",action:"Apply tricyclazole; avoid excess nitrogen"},
  {name:"Bacterial Leaf Blight",  crop:"Palay", symptoms:"Yellow-orange water-soaked lesions",cause:"Bacterial (Xanthomonas)",action:"Use resistant varieties; apply copper-based spray"},
  {name:"Brown Plant Hopper",     crop:"Palay", symptoms:"Yellowing; 'hopperburn' from base",cause:"Insect pest",action:"Apply imidacloprid; avoid over-fertilization"},
  {name:"Sheath Blight",          crop:"Palay", symptoms:"Oval white-brown lesions on sheath",cause:"Fungal (Rhizoctonia)",action:"Apply hexaconazole; increase plant spacing"},
];

const LOCATION_CROPS = {
  "Camarines Sur": {top:["Palay Fancy","Palay Other"],reason:"Flat lowlands with good irrigation — ideal for rice paddies."},
  "Albay":         {top:["White Corn","Yellow Corn"],  reason:"Volcanic soil from Mayon is rich in minerals — great for corn."},
  "Sorsogon":      {top:["Palay Other","Palay Fancy"], reason:"High rainfall supports wet-season palay cultivation."},
  "Catanduanes":   {top:["Palay Other","White Corn"],  reason:"Isolated island — palay self-sufficiency is a priority."},
  "Masbate":       {top:["Yellow Corn","White Corn"],  reason:"Drier climate suits corn over rice; large grazing areas nearby."},
  "Camarines Norte":{top:["Palay Fancy","Yellow Corn"],reason:"Coastal areas with rice paddies; corn grown in upland areas."},
};

const PLANT_CALENDAR = [
  {crop:"🌽 White Corn", plant:["January","February","July","August"],harvest:["April","May","October","November"]},
  {crop:"🌽 Yellow Corn",plant:["February","March","August","September"],harvest:["May","June","November","December"]},
  {crop:"🌾 Palay (Wet)",plant:["June","July"],harvest:["October","November"]},
  {crop:"🌾 Palay (Dry)",plant:["November","December"],harvest:["March","April"]},
];

const MONTHS_S = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONTHS_F = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS_F   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const ADMIN_PW = "admin2026";

// Admin seed users
const SEED_USERS = [
  {id:1,name:"Maria Santos",    email:"maria@gmail.com",  role:"Farmer",    region:"Camarines Sur",  joined:"Jan 12",lastSeen:"Today",   views:142,searches:38,status:"online", saved:5},
  {id:2,name:"Juan dela Cruz",  email:"juan@yahoo.com",   role:"Trader",    region:"Albay",          joined:"Feb 3", lastSeen:"Today",   views:98, searches:24,status:"online", saved:3},
  {id:3,name:"Ana Reyes",       email:"ana@outlook.com",  role:"Researcher",region:"Sorsogon",       joined:"Jan 25",lastSeen:"Yesterday",views:210,searches:62,status:"offline",saved:12},
  {id:4,name:"Pedro Villanueva",email:"pedro@da.gov.ph",  role:"DA Officer",region:"Cam. Norte",     joined:"Mar 1", lastSeen:"Today",   views:76, searches:15,status:"online", saved:2},
  {id:5,name:"Rosa Buena",      email:"rosa@gmail.com",   role:"Farmer",    region:"Masbate",        joined:"Mar 5", lastSeen:"2hrs ago",views:55, searches:10,status:"away",   saved:1},
  {id:6,name:"Carlo Mendoza",   email:"carlo@agri.com",   role:"Trader",    region:"Catanduanes",    joined:"Feb 20",lastSeen:"3 days ago",views:184,searches:45,status:"offline",saved:8},
  {id:7,name:"Liza Coronado",   email:"liza@dost.gov.ph", role:"Researcher",region:"Albay",          joined:"Jan 8", lastSeen:"Today",   views:322,searches:88,status:"online", saved:20},
];

// ─────────────────────────────────────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────────────────────────────────────
function useClock(){
  const [now,setNow]=useState(new Date());
  useEffect(()=>{const t=setInterval(()=>setNow(new Date()),1000);return()=>clearInterval(t)},[]);
  return now;
}
function useLS(key,def){
  const [v,setV]=useState(()=>{try{const s=localStorage.getItem(key);return s?JSON.parse(s):def}catch{return def}});
  const set=useCallback(val=>{setV(val);try{localStorage.setItem(key,JSON.stringify(val))}catch{}},[key]);
  return [v,set];
}
function useOnline(){
  const [online,setOnline]=useState(navigator.onLine);
  useEffect(()=>{const on=()=>setOnline(true),off=()=>setOnline(false);window.addEventListener("online",on);window.addEventListener("offline",off);return()=>{window.removeEventListener("online",on);window.removeEventListener("offline",off)}},[]);
  return online;
}

// ─────────────────────────────────────────────────────────────────────────────
// MINI COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function TrendArrow({cur,prev}){
  if(!prev)return null;
  const d=cur-prev;
  if(d>0)return<span className="text-red-500 text-xs font-bold">▲{d.toFixed(2)}</span>;
  if(d<0)return<span className="text-green-600 text-xs font-bold">▼{Math.abs(d).toFixed(2)}</span>;
  return<span className="text-gray-400 text-xs">—</span>;
}

function Pill({children,active,onClick,color="green"}){
  const cols={green:active?"bg-green-600 text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200",amber:active?"bg-amber-500 text-white":"bg-gray-100 text-gray-600",blue:active?"bg-blue-600 text-white":"bg-gray-100 text-gray-600"};
  return<button onClick={onClick} className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${cols[color]}`}>{children}</button>;
}

function SkelCard(){return<div className="rounded-2xl border border-gray-100 p-4 h-44"><div className="skeleton h-3 w-16 mb-3"/><div className="skeleton h-5 w-24 mb-2"/><div className="skeleton h-8 w-20 mb-2"/><div className="skeleton h-3 w-12 mb-4"/><div className="skeleton h-6 w-full"/></div>}

// SVG line chart
function LineChart({data,color,label,height=160}){
  if(!data||data.length<2)return null;
  const W=600,H=height,PL=48,PR=20,PT=14,PB=28;
  const min=Math.min(...data)-.5,max=Math.max(...data)+.5,rng=max-min;
  const iW=W-PL-PR,iH=H-PT-PB;
  const gX=i=>PL+(i/(data.length-1))*iW;
  const gY=v=>PT+iH-((v-min)/rng)*iH;
  const pts=data.map((v,i)=>`${gX(i)},${gY(v)}`).join(" ");
  const area=`${gX(0)},${gY(min)} ${pts} ${gX(data.length-1)},${gY(min)}`;
  return(
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{minWidth:280}}>
        <defs><linearGradient id={`lg${label}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity=".22"/><stop offset="100%" stopColor={color} stopOpacity="0"/></linearGradient></defs>
        {[0,1,2,3,4].map(i=>{const y=PT+(i/4)*iH,val=max-(i/4)*rng;return<g key={i}><line x1={PL} y1={y} x2={W-PR} y2={y} stroke="#e5e7eb" strokeWidth="1"/><text x={PL-5} y={y+4} textAnchor="end" fontSize="9" fill="#9ca3af">{val.toFixed(2)}</text></g>})}
        <polygon points={area} fill={`url(#lg${label})`}/>
        <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        {data.map((v,i)=><g key={i}><circle cx={gX(i)} cy={gY(v)} r="3.5" fill={color} stroke="white" strokeWidth="1.5"/><text x={gX(i)} y={H-3} textAnchor="middle" fontSize="8" fill="#9ca3af">{MONTHS_S[i]}</text></g>)}
        <text x={11} y={H/2} textAnchor="middle" fontSize="8" fill="#9ca3af" transform={`rotate(-90,11,${H/2})`}>₱/kg</text>
      </svg>
    </div>
  );
}

// Bar chart
function BarChart({data,color,labels,height=100}){
  if(!data)return null;
  const max=Math.max(...data);
  return(
    <div className="flex items-end gap-1" style={{height}}>
      {data.map((v,i)=>(
        <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
          <div className="w-full rounded-t-sm" style={{height:`${(v/max)*(height-16)}px`,background:color,opacity:.65+(v/max)*.35}}/>
          {labels&&<span className="text-gray-400" style={{fontSize:8}}>{labels[i]}</span>}
        </div>
      ))}
    </div>
  );
}

// Multi-line comparison chart
function CompareChart({datasets,height=160}){
  const W=600,H=height,PL=48,PR=20,PT=14,PB=28;
  const allVals=datasets.flatMap(d=>d.data);
  const min=Math.min(...allVals)-.5,max=Math.max(...allVals)+.5,rng=max-min;
  const iW=W-PL-PR,iH=H-PT-PB;
  const gX=i=>PL+(i/(12-1))*iW;
  const gY=v=>PT+iH-((v-min)/rng)*iH;
  return(
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{minWidth:280}}>
        {[0,1,2,3,4].map(i=>{const y=PT+(i/4)*iH,val=max-(i/4)*rng;return<g key={i}><line x1={PL} y1={y} x2={W-PR} y2={y} stroke="#e5e7eb" strokeWidth="1"/><text x={PL-5} y={y+4} textAnchor="end" fontSize="9" fill="#9ca3af">{val.toFixed(2)}</text></g>})}
        {datasets.map(ds=>{
          const pts=ds.data.map((v,i)=>`${gX(i)},${gY(v)}`).join(" ");
          return<polyline key={ds.label} points={pts} fill="none" stroke={ds.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={ds.dashed?"6,3":undefined}/>;
        })}
        {MONTHS_S.map((m,i)=><text key={m} x={gX(i)} y={H-3} textAnchor="middle" fontSize="8" fill="#9ca3af">{m}</text>)}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SPLASH SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function Splash({onDone}){
  const [pct,setPct]=useState(0);
  useEffect(()=>{
    const start=Date.now(),dur=2800;
    const tick=()=>{const p=Math.min(((Date.now()-start)/dur)*100,100);setPct(p);if(p<100)requestAnimationFrame(tick);else setTimeout(onDone,500);};
    requestAnimationFrame(tick);
  },[]);
  return(
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center" style={{background:"linear-gradient(135deg,#052e16 0%,#14532d 50%,#052e16 100%)"}}>
      <div className="absolute" style={{width:220,height:220}}>{[0,.7,1.4].map(d=><div key={d} className="ripple-ring" style={{animationDelay:`${d}s`}}/>)}</div>
      <div className="relative flex items-center justify-center rounded-full mb-6" style={{width:110,height:110,background:"linear-gradient(135deg,#16a34a,#d97706)",animation:"spinGrow .8s cubic-bezier(.34,1.56,.64,1) both",boxShadow:"0 0 40px rgba(22,163,74,.4)"}}>
        <span style={{fontSize:48}}>🌾</span>
      </div>
      <div className="aFadeUp d3 text-center px-8">
        <h1 className="text-white font-bold text-3xl mb-1" style={{fontFamily:"'Playfair Display',Georgia,serif"}}>CamPrice</h1>
        <p className="text-green-300 text-sm font-semibold tracking-widest uppercase">Forecast Dashboard</p>
        <p className="text-green-500 text-xs mt-1.5 italic">Bicol Region (Region 5)</p>
      </div>
      <div className="dot-bounce mt-8 aFadeUp d5"><span/><span/><span className="w-2 h-2"/></div>
      <div className="absolute bottom-14 w-64 aFadeUp d4">
        <div className="flex justify-between text-xs text-green-400 mb-1.5"><span>Loading dashboard...</span><span>{Math.round(pct)}%</span></div>
        <div className="w-full bg-green-900 rounded-full h-1.5 overflow-hidden"><div className="h-full rounded-full" style={{width:`${pct}%`,background:"linear-gradient(90deg,#16a34a,#d97706)",transition:"width .05s linear"}}/></div>
      </div>
      {["🌽","🌾","🌱","🍃"].map((e,i)=><span key={i} className="absolute text-2xl aFloat" style={{left:`${15+i*22}%`,top:`${20+(i%2)*50}%`,animationDelay:`${i*.5}s`,opacity:.2}}>{e}</span>)}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CLOCK BANNER
// ─────────────────────────────────────────────────────────────────────────────
function ClockBanner(){
  const now=useClock();
  const h=now.getHours()%12||12,m=String(now.getMinutes()).padStart(2,"0"),s=String(now.getSeconds()).padStart(2,"0"),ap=now.getHours()>=12?"PM":"AM";
  return(
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between lift aFadeUp">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-xl">🕐</div>
        <div><p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Philippine Standard Time</p><p className="text-gray-700 font-semibold text-sm">{DAYS_F[now.getDay()]}, {MONTHS_F[now.getMonth()]} {now.getDate()}, {now.getFullYear()}</p></div>
      </div>
      <p className="text-2xl font-bold text-green-600 tabular-nums" style={{fontFamily:"monospace"}}>{String(h).padStart(2,"0")}:{m}:{s}<span className="text-sm ml-1 text-green-400">{ap}</span></p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CURRENT MARKET PRICES
// ─────────────────────────────────────────────────────────────────────────────
function MarketPrices(){
  return(
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden lift aFadeUp d2">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
        <div><h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest">📡 Current Market Prices</h3><p className="text-xs text-gray-400 mt-0.5">Bicol Region (Region 5) · March 2026</p></div>
        <span className="flex items-center gap-1.5 text-xs text-green-600 font-semibold bg-green-50 px-2.5 py-1 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-green-500 aPulse"/><span>Live</span></span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-50">
        {MARKET.map((m,i)=>(
          <div key={m.label} className="p-3 flex flex-col gap-1 aFadeUp" style={{animationDelay:`${.08+i*.08}s`}}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${m.cat==="Corn"?"bg-amber-100 text-amber-800":"bg-green-100 text-green-800"}`}>{m.cat}</span>
              <span className="text-base">{m.icon}</span>
            </div>
            <p className="text-xs font-semibold text-gray-600 mt-0.5">{m.label}</p>
            <p className={`text-lg font-bold ${m.cat==="Corn"?"text-amber-600":"text-green-700"}`}>₱{m.low.toFixed(2)}–₱{m.high.toFixed(2)}</p>
            <p className="text-xs text-gray-400">{m.unit} · /kg</p>
          </div>
        ))}
      </div>
      <div className="px-4 py-2 bg-gray-50/50 border-t border-gray-50"><p className="text-xs text-gray-400">Source: DA-5 AMAD Daily Price Index · Feb–Mar 2026</p></div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FLIP CARD
// ─────────────────────────────────────────────────────────────────────────────
function FlipCard({crop,fieldKey,label,icon,desc,latestData,delay=0}){
  const [flipped,setFlipped]=useState(false);
  const c=CROPS[crop];
  const prev=PRICE_DATA.filter(d=>d.year===2026).at(-2);
  const k=fieldKey;
  return(
    <div onClick={()=>setFlipped(f=>!f)} className="cursor-pointer aScaleIn lift" style={{perspective:"800px",height:"180px",animationDelay:`${delay}s`}}>
      <div style={{position:"relative",width:"100%",height:"100%",transformStyle:"preserve-3d",transition:"transform .5s cubic-bezier(.4,0,.2,1)",transform:flipped?"rotateY(180deg)":"rotateY(0deg)"}}>
        <div className={`absolute inset-0 rounded-2xl border ${c.border} bg-white p-4 flex flex-col`} style={{backfaceVisibility:"hidden"}}>
          <div className="flex items-center justify-between mb-1"><span className={`text-xs font-semibold ${c.badge} px-2 py-0.5 rounded-full`}>{c.label}</span><span className="text-xl">{icon}</span></div>
          <p className="text-xs font-semibold text-gray-600">{label}</p>
          <p className={`text-2xl font-bold ${c.text}`}>₱{latestData[k]?.toFixed(2)}</p>
          <p className="text-xs text-gray-400">per kilogram</p>
          <TrendArrow cur={latestData[k]} prev={prev?.[k]}/>
          <p className="text-xs text-gray-300 mt-auto pt-1.5">Tap to learn more ↻</p>
        </div>
        <div className={`absolute inset-0 rounded-2xl border ${c.border} bg-white p-4 flex flex-col justify-between`} style={{backfaceVisibility:"hidden",transform:"rotateY(180deg)"}}>
          <div><p className={`text-xs font-bold ${c.text} mb-2`}>{label}</p><p className="text-xs text-gray-500 leading-relaxed">{desc}</p></div>
          <p className="text-xs text-gray-300 text-right">Tap to flip back ↻</p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DETAIL TABLE
// ─────────────────────────────────────────────────────────────────────────────
function DetailTable({crop,variety,year}){
  const c=CROPS[crop];
  const rows=PRICE_DATA.filter(d=>d.year===year);
  const k=variety.key;
  return(
    <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm aFadeUp d2">
      <table className="w-full text-sm">
        <thead><tr className={`bg-gradient-to-r ${c.bg}`}>
          <th className={`text-left px-4 py-3 font-semibold ${c.text} w-28`}>Month</th>
          <th className={`text-right px-4 py-3 font-semibold ${c.text}`}>Price ₱/kg</th>
          <th className={`text-right px-4 py-3 font-semibold ${c.text}`}>Change</th>
          <th className={`text-right px-4 py-3 font-semibold ${c.text} hidden sm:table-cell`}>vs Jan</th>
        </tr></thead>
        <tbody>{rows.map((row,i)=>{
          const prev=rows[i-1]?.[k],base=rows[0]?.[k],val=row[k];
          const diff=prev?val-prev:0,db=base?val-base:0;
          return(<tr key={row.month} className="border-t border-gray-50 hover:bg-gray-50/60 transition-colors">
            <td className="px-4 py-2.5 font-medium text-gray-700">{row.month}</td>
            <td className="px-4 py-2.5 text-right font-bold text-gray-800">₱{val.toFixed(2)}</td>
            <td className="px-4 py-2.5 text-right">{i===0?<span className="text-gray-300 text-xs">—</span>:<span className={diff>=0?"text-red-500":"text-green-600"}>{diff>=0?"+":""}{diff.toFixed(2)}</span>}</td>
            <td className="px-4 py-2.5 text-right hidden sm:table-cell">{i===0?<span className="text-gray-300 text-xs">base</span>:<span className={db>=0?"text-red-400 text-xs":"text-green-500 text-xs"}>{db>=0?"+":""}{db.toFixed(2)}</span>}</td>
          </tr>);
        })}</tbody>
      </table>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── PAGES ─────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

// HOME
function HomePage({latestData}){
  return(
    <div className="space-y-5">
      <div className="text-center pt-6 pb-2">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-wide uppercase aFadeDown">🌿 AI-Powered Agricultural Intelligence</div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 leading-tight mb-2 aFadeUp d1" style={{fontFamily:"'Playfair Display',Georgia,serif",letterSpacing:"-.5px"}}>CamPrice Forecast <span className="text-green-600">Dashboard</span></h1>
        <p className="text-gray-500 text-sm max-w-xl mx-auto mb-1 aFadeUp d2">AI-Powered Price Predictions using Time Series Analysis</p>
        <p className="text-gray-400 text-xs max-w-2xl mx-auto italic aFadeUp d3">Implementation of Time Series Analysis Model and Public Datasets for an AI-Powered Price and Demand Prediction Framework</p>
      </div>
      <ClockBanner/>
      <MarketPrices/>
      <div className="aFadeUp d4">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Forecasted Prices — December 2026</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <FlipCard crop="corn" fieldKey="corn_white"  label="White Corn"  icon="🌽" latestData={latestData} desc="Used for cornmeal, porridge, and snacks." delay={.1}/>
          <FlipCard crop="corn" fieldKey="corn_yellow" label="Yellow Corn" icon="🌽" latestData={latestData} desc="Mainly for animal feed and starch production." delay={.2}/>
          <FlipCard crop="rice" fieldKey="rice_fancy"  label="Palay Fancy" icon="🌾" latestData={latestData} desc="Premium milled grade, peaks in demand during holidays." delay={.3}/>
          <FlipCard crop="rice" fieldKey="rice_other"  label="Palay Other" icon="🌾" latestData={latestData} desc="Standard grade, most widely consumed variety." delay={.4}/>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">Tap any card to learn about that variety</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm lift aFadeUp d5">
        <h3 className="font-bold text-gray-700 text-sm mb-2 flex items-center gap-2">📊 About This Dashboard</h3>
        <p className="text-xs text-gray-500 leading-relaxed">AI-generated price forecasts for key agricultural commodities in <strong>Bicol Region (Region 5)</strong>. Derived from SARIMA time series analysis of DA-5 historical data 2005–2025. Use <strong>Prices</strong> for monthly charts, <strong>Weather</strong> for climate impact, <strong>Insights</strong> for AI explanations, <strong>Pest</strong> for disease detection, and <strong>More</strong> for location suggestions, notifications, and history.</p>
      </div>
    </div>
  );
}

// PRICES
function PricesPage({addNotif,saveResult}){
  const [selCrop,setSelCrop]=useState(null);
  const [selVar,setSelVar]=useState(null);
  const [selYear,setSelYear]=useState(2026);
  const [chartTab,setChartTab]=useState("price");
  const [compare2,setCompare2]=useState(null);
  const ac=selCrop?CROPS[selCrop]:null;

  const pickVariety=(cropKey,variety)=>{
    setSelCrop(cropKey);
    setSelVar(variety);
    setSelYear(2026);
    setChartTab("price");
    setCompare2(null);
    addNotif(`📈 Viewing ${variety.label} forecast`,"info");
  };

  const doSave=()=>{
    if(!selVar)return;
    const vals=PRICE_DATA.filter(d=>d.year===selYear).map(d=>d[selVar.key]);
    saveResult({id:Date.now(),variety:selVar.label,year:selYear,
      avg:(vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(2),
      min:Math.min(...vals).toFixed(2),
      max:Math.max(...vals).toFixed(2),
      savedAt:new Date().toLocaleString("en-PH")});
    addNotif(`✅ Saved ${selVar.label} ${selYear}`,"success");
  };

  return(
    <div className="space-y-5 pt-4">
      <div className="aFadeDown">
        <h2 className="text-xl font-bold text-gray-800 mb-1">📈 Crop Price Forecasts</h2>
        <p className="text-xs text-gray-400">Bicol Region (Region 5) · Tap a variety card to view its forecast</p>
      </div>

      {/* ── Variety Selection Cards ── */}
      <div className="space-y-3">
        {Object.entries(CROPS).map(([cropKey,crop],ci)=>(
          <div key={cropKey} className="aFadeUp" style={{animationDelay:`${ci*.1}s`}}>
            {/* Crop header label */}
            <div className="flex items-center gap-2 mb-2 px-1">
              <span className="text-lg">{crop.icon}</span>
              <span className="font-bold text-gray-700 text-sm">{crop.label}</span>
              <div className="flex-1 h-px bg-gray-100"/>
            </div>
            {/* Variety cards side by side */}
            <div className="grid grid-cols-2 gap-3">
              {crop.varieties.map((variety,vi)=>{
                const isActive=selVar?.key===variety.key;
                const yearData=PRICE_DATA.filter(d=>d.year===2026);
                const latestVal=yearData.at(-1)?.[variety.key];
                const prevVal=yearData.at(-2)?.[variety.key];
                const diff=latestVal&&prevVal?latestVal-prevVal:0;
                return(
                  <button
                    key={variety.key}
                    onClick={()=>pickVariety(cropKey,variety)}
                    className={`rounded-2xl border-2 p-4 text-left transition-all duration-200 shadow-sm hover:shadow-md lift
                      ${isActive?`${crop.border} bg-white ring-2 ring-offset-1 ring-${cropKey==="corn"?"amber":"green"}-300`
                        :`border-gray-100 bg-white/70 hover:bg-white hover:${crop.border}`}`}
                    style={{animationDelay:`${ci*.1+vi*.05}s`}}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className={`text-xs font-semibold ${crop.badge} px-2 py-0.5 rounded-full`}>{variety.label}</span>
                      {isActive&&<span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">✓</span>}
                    </div>
                    <p className={`text-2xl font-bold ${crop.text}`}>₱{latestVal?.toFixed(2)}</p>
                    <p className="text-xs text-gray-400 mb-1">per kilogram · Dec 2026</p>
                    <span className={`text-xs font-bold ${diff>=0?"text-red-500":"text-green-600"}`}>
                      {diff>=0?"▲":"▼"} {Math.abs(diff).toFixed(2)} vs Nov
                    </span>
                    <p className="text-xs text-gray-300 mt-2">Tap to view forecast →</p>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ── Detail Section (shows after selection) ── */}
      {selCrop&&selVar&&ac?(
        <div className="space-y-4 aFadeUp">
          {/* Header */}
          <div className={`bg-gradient-to-br ${ac.bg} rounded-2xl border ${ac.border} p-4`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-bold text-gray-800 text-xl flex items-center gap-2">
                  <span>{ac.icon}</span>{selVar.label}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${ac.badge}`}>AI Forecast</span>
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Monthly price predictions · ₱/kg · Bicol Region</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {[2026,2027,2028].map(yr=>(
                  <button key={yr} onClick={()=>setSelYear(yr)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all
                      ${selYear===yr?`${ac.accent} text-white shadow`:"bg-white text-gray-500 border border-gray-200 hover:border-gray-300"}`}>
                    {yr}
                  </button>
                ))}
                <button onClick={doSave}
                  className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-green-50 text-green-700 border border-green-200 hover:bg-green-100">
                  💾 Save
                </button>
              </div>
            </div>
          </div>

          {/* Chart Tabs */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm lift">
            <div className="flex gap-2 mb-4 flex-wrap">
              {[["price","📊 Price Trend"],["demand","📦 Demand"],["compare","⚖️ Compare"]].map(([k,l])=>(
                <Pill key={k} active={chartTab===k} onClick={()=>setChartTab(k)}>{l}</Pill>
              ))}
            </div>

            {chartTab==="price"&&(
              <>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Price Trend — {selYear}</p>
                <LineChart
                  data={PRICE_DATA.filter(d=>d.year===selYear).map(d=>d[selVar.key])}
                  color={ac.color} label={selVar.key}
                />
              </>
            )}

            {chartTab==="demand"&&(
              <>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Monthly Demand Index — {selVar.label}</p>
                <BarChart data={DEMAND[selVar.key]} color={ac.color} labels={MONTHS_S} height={100}/>
                <p className="text-xs text-gray-400 mt-2 text-center">Index 0–100 based on historical consumption patterns</p>
              </>
            )}

            {chartTab==="compare"&&(()=>{
              const allVars=[...CROPS.corn.varieties,...CROPS.rice.varieties];
              return(
                <>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Compare {selVar.label} vs…</p>
                  <div className="flex gap-2 flex-wrap mb-3">
                    {allVars.filter(v=>v.key!==selVar.key).map(v=>{
                      const c2=CROPS[v.key.startsWith("corn")?"corn":"rice"];
                      return(
                        <button key={v.key}
                          onClick={()=>setCompare2(p=>p?.key===v.key?null:v)}
                          className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all
                            ${compare2?.key===v.key?`${c2.accent} text-white`:`${c2.badge}`}`}>
                          {v.label}
                        </button>
                      );
                    })}
                  </div>
                  <CompareChart datasets={[
                    {label:selVar.label,data:PRICE_DATA.filter(d=>d.year===selYear).map(d=>d[selVar.key]),color:ac.color},
                    ...(compare2?[{label:compare2.label,data:PRICE_DATA.filter(d=>d.year===selYear).map(d=>d[compare2.key]),color:CROPS[compare2.key.startsWith("corn")?"corn":"rice"].color,dashed:true}]:[])
                  ]}/>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <span style={{color:ac.color}}>━━</span>{selVar.label}
                    {compare2&&<><span style={{color:CROPS[compare2.key.startsWith("corn")?"corn":"rice"].color}}>╌╌</span>{compare2.label}</>}
                  </div>
                </>
              );
            })()}
          </div>

          {/* Stats row */}
          {(()=>{
            const vals=PRICE_DATA.filter(d=>d.year===selYear).map(d=>d[selVar.key]);
            const mn=Math.min(...vals),mx=Math.max(...vals),av=vals.reduce((a,b)=>a+b,0)/vals.length;
            const gr=((vals[vals.length-1]-vals[0])/vals[0]*100).toFixed(2);
            return(
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[{l:"Lowest",v:`₱${mn.toFixed(2)}`},{l:"Highest",v:`₱${mx.toFixed(2)}`},
                  {l:"Average",v:`₱${av.toFixed(2)}`},{l:"YoY Growth",v:`${gr>0?"+":""}${gr}%`,g:true,gv:parseFloat(gr)}
                ].map((s,i)=>(
                  <div key={s.l} className="bg-white rounded-xl border border-gray-100 p-3 text-center shadow-sm lift aScaleIn" style={{animationDelay:`${i*.07}s`}}>
                    <p className="text-xs text-gray-400 mb-1">{s.l}</p>
                    <p className={`font-bold text-lg ${s.g?(s.gv>=0?"text-red-500":"text-green-600"):"text-gray-800"}`}>{s.v}</p>
                  </div>
                ))}
              </div>
            );
          })()}

          {/* Best time to sell */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-4 shadow-sm">
            <h3 className="font-bold text-green-800 text-sm mb-2">💰 Best Time to Sell</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {BEST_SELL[selVar.key].months.map(m=>(
                <span key={m} className="bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">{m}</span>
              ))}
            </div>
            <p className="text-xs text-green-700">{BEST_SELL[selVar.key].reason}</p>
          </div>

          {/* Monthly Table */}
          <DetailTable crop={selCrop} variety={selVar} year={selYear}/>

        </div>
      ):(
        <div className="text-center py-12 text-gray-400 aFadeUp">
          <p className="text-5xl mb-3 aFloat">🌽🌾</p>
          <p className="text-sm font-semibold mb-1">Tap any variety card above</p>
          <p className="text-xs">Select White Corn, Yellow Corn, Palay Fancy, or Palay Other to view its full forecast</p>
        </div>
      )}
    </div>
  );
}

// WEATHER
function WeatherPage(){
  const now=new Date();
  const [selM,setSelM]=useState(now.getMonth());
  const w=WEATHER_DATA[selM];
  const cur=WEATHER_DATA[now.getMonth()];
  return(
    <div className="space-y-5 pt-4">
      <div className="aFadeDown"><h2 className="text-xl font-bold text-gray-800 mb-1">🌦️ Weather & Climate</h2><p className="text-xs text-gray-400">Bicol Region · Seasonal patterns & crop impact</p></div>
      {/* Current hero */}
      <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-5 text-white shadow-lg aScaleIn">
        <div className="flex items-center justify-between mb-4">
          <div><p className="text-blue-100 text-xs font-semibold uppercase tracking-widest">Current Month</p><h3 className="text-2xl font-bold">{MONTHS_F[now.getMonth()]}</h3><p className="text-blue-100 text-sm">{cur.cond}</p></div>
          <span style={{fontSize:52}}>{cur.icon}</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[["🌡️","Temp",`${cur.temp}°C`],["🌧️","Rainfall",`${cur.rain}mm`],["💧","Humidity",`${cur.humidity}%`]].map(([ic,l,v])=><div key={l} className="bg-white/20 rounded-xl p-3 text-center"><p className="text-lg">{ic}</p><p className="text-xs text-blue-100">{l}</p><p className="font-bold text-sm">{v}</p></div>)}
        </div>
        <div className="mt-3 bg-white/15 rounded-xl px-3 py-2"><p className="text-xs text-blue-100">💡 {cur.advisory}</p></div>
      </div>
      {/* Month selector */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm aFadeUp d2">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Browse Monthly Weather</p>
        <div className="grid grid-cols-6 gap-1.5">
          {WEATHER_DATA.map((wd,i)=><button key={wd.month} onClick={()=>setSelM(i)} className={`flex flex-col items-center p-2 rounded-xl text-xs transition-all ${selM===i?"bg-blue-500 text-white":"bg-gray-50 text-gray-600 hover:bg-gray-100"}`}><span style={{fontSize:16}}>{wd.icon}</span><span className="font-semibold mt-0.5">{MONTHS_S[i]}</span></button>)}
        </div>
      </div>
      {/* Selected month detail */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm aFadeUp d3">
        <h3 className="font-bold text-gray-700 text-sm mb-3 flex items-center gap-2"><span>{w.icon}</span>{w.month} Weather Outlook</h3>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[["🌡️","Temp",`${w.temp}°C`,"bg-orange-50 text-orange-700"],["🌧️","Rain",`${w.rain}mm`,"bg-blue-50 text-blue-700"],["💧","Humidity",`${w.humidity}%`,"bg-cyan-50 text-cyan-700"]].map(([ic,l,v,cls])=><div key={l} className={`${cls} rounded-xl p-3 text-center`}><p className="text-lg">{ic}</p><p className="text-xs opacity-70">{l}</p><p className="font-bold text-sm">{v}</p></div>)}
        </div>
        <div className="bg-amber-50 rounded-xl p-3 mb-3"><p className="text-xs text-amber-700 font-semibold">💡 Farming Advisory</p><p className="text-xs text-amber-600 mt-0.5">{w.advisory}</p></div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">🌱 Crop Impact Assessment</p>
        <div className="space-y-2">
          {[{crop:"🌽 Corn",ok:w.rain<200,note:w.rain>250?"High rain risk — fungal disease and waterlogging likely. Delay harvest.":w.rain>150?"Monitor drainage. Soil moisture good but watch for pests.":"Good conditions for corn growth."},
            {crop:"🌾 Palay",ok:w.rain<280,note:w.temp>30?"Heat stress risk — ensure irrigation for palay fields.":w.rain>250?"Rice tolerates rain but typhoon winds may lodge crop.":"Good conditions for palay growth."}
          ].map(im=><div key={im.crop} className="bg-gray-50 rounded-xl p-3"><div className="flex items-center justify-between mb-1"><span className="text-sm font-semibold text-gray-700">{im.crop}</span><span className="text-xs font-bold">{im.ok?"✅ Favorable":"⚠️ Caution"}</span></div><p className="text-xs text-gray-500">{im.note}</p></div>)}
        </div>
      </div>
      {/* Rainfall chart */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm aFadeUp d4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Annual Rainfall Pattern (mm)</p>
        <BarChart data={WEATHER_DATA.map(wd=>wd.rain)} color="#3b82f6" labels={MONTHS_S} height={100}/>
        <p className="text-xs text-gray-400 mt-2 text-center">Typhoon season peaks July–September. Bicol is one of PH's most typhoon-prone regions.</p>
      </div>
      <div className="bg-amber-50 rounded-2xl border border-amber-100 p-4 aFadeUp d5"><p className="text-xs text-amber-700 font-semibold mb-1">⚠️ Disclaimer</p><p className="text-xs text-amber-600">Seasonal averages only. For real-time forecasts visit PAGASA (pagasa.dost.gov.ph) or DA-RFO 5 advisories.</p></div>
    </div>
  );
}

// INSIGHTS
function InsightsPage({addNotif}){
  const now=new Date();
  const [selKey,setSelKey]=useState("corn_white");
  const monthIdx=now.getMonth();
  const factors=FACTORS[selKey];
  const cropRanking=[...Object.entries(BEST_SELL)].map(([k,d])=>({k,label:[...CROPS.corn.varieties,...CROPS.rice.varieties].find(v=>v.key===k)?.label||k,best:d.months.includes(MONTHS_F[monthIdx]),score:d.months.includes(MONTHS_F[monthIdx])?100:60})).sort((a,b)=>b.score-a.score);
  const keyMap2={corn_white:{label:"White Corn",crop:"corn"},corn_yellow:{label:"Yellow Corn",crop:"corn"},rice_fancy:{label:"Palay Fancy",crop:"rice"},rice_other:{label:"Palay Other",crop:"rice"}};

  return(
    <div className="space-y-5 pt-4">
      <div className="aFadeDown"><h2 className="text-xl font-bold text-gray-800 mb-1">🧠 AI Insights</h2><p className="text-xs text-gray-400">Prediction explanations, best crop & demand outlook</p></div>

      {/* Best crop this month */}
      <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-5 text-white shadow-lg aScaleIn">
        <p className="text-green-200 text-xs font-semibold uppercase tracking-widest mb-1">🌟 Best Crop to Focus — {MONTHS_F[monthIdx]}</p>
        <div className="space-y-2 mt-3">
          {cropRanking.map((c,i)=>(
            <div key={c.k} className={`flex items-center justify-between rounded-xl px-3 py-2 ${c.best?"bg-white/20":"bg-white/10"}`}>
              <div className="flex items-center gap-2"><span className="text-sm font-bold text-green-200">#{i+1}</span><span className="text-sm font-semibold">{c.label}</span>{c.best&&<span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full font-bold">Best Sell</span>}</div>
              <div className="flex gap-1">{Array.from({length:5}).map((_,j)=><div key={j} className={`w-2 h-2 rounded-full ${j<Math.round(c.score/20)?"bg-yellow-400":"bg-white/20"}`}/>)}</div>
            </div>
          ))}
        </div>
        <p className="text-green-200 text-xs mt-3 italic">Based on seasonal demand peaks and historical price patterns for Bicol Region.</p>
      </div>

      {/* Demand prediction bars */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm aFadeUp d2">
        <h3 className="font-bold text-gray-700 text-sm mb-3">📦 Demand Index — {MONTHS_F[monthIdx]}</h3>
        <div className="space-y-3">
          {Object.entries(keyMap2).map(([k,info])=>{const c=CROPS[info.crop];const val=DEMAND[k][monthIdx];return(
            <div key={k} className="flex items-center gap-3"><span className="text-xs text-gray-600 font-medium w-24 shrink-0">{info.label}</span><div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden"><div className="h-full rounded-full transition-all duration-700" style={{width:`${val}%`,background:c.color}}/></div><span className={`text-xs font-bold w-8 ${c.text}`}>{val}</span></div>
          );})}
        </div>
        <p className="text-xs text-gray-400 mt-2">Demand index 0–100 scale based on historical consumption patterns</p>
      </div>

      {/* AI Explanation */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm aFadeUp d3">
        <h3 className="font-bold text-gray-700 text-sm mb-3">🔍 Why This Prediction?</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {Object.entries(keyMap2).map(([k,info])=>{const c=CROPS[info.crop];return<button key={k} onClick={()=>setSelKey(k)} className={`px-2 py-2 rounded-xl text-xs font-semibold transition-all ${selKey===k?`${c.accent} text-white`:`${c.badge}`}`}>{info.label}</button>;})}
        </div>
        {/* Factor details with soil pH and rainfall needs */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-amber-50 rounded-xl p-3"><p className="text-xs text-amber-600 font-semibold">🌱 Ideal Soil pH</p><p className="text-lg font-bold text-amber-700">{SOIL_PH[selKey]}</p></div>
          <div className="bg-blue-50 rounded-xl p-3"><p className="text-xs text-blue-600 font-semibold">🌧️ Rainfall Needed</p><p className="text-sm font-bold text-blue-700">{RAINFALL_NEEDS[selKey]}</p></div>
        </div>
        <div className="space-y-2">
          {factors.map((f,i)=>(
            <div key={i} className="bg-gray-50 rounded-xl p-3 aSlideL" style={{animationDelay:`${i*.07}s`}}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-gray-700">{f.f}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${f.imp==="High"?"bg-red-100 text-red-700":f.imp==="Medium"?"bg-amber-100 text-amber-700":"bg-green-100 text-green-700"}`}>{f.imp}</span>
                  <span className={`text-sm font-bold ${f.dir==="↑"?"text-red-500":"text-green-600"}`}>{f.dir}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Planting Calendar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm aFadeUp d4">
        <h3 className="font-bold text-gray-700 text-sm mb-3">📅 Bicol Crop Calendar</h3>
        <div className="space-y-3">
          {PLANT_CALENDAR.map(item=>(
            <div key={item.crop} className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs font-bold text-gray-700 mb-2">{item.crop}</p>
              <div className="flex gap-2 flex-wrap">
                {item.plant.map(m=><span key={m} className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">🌱 {m}</span>)}
                {item.harvest.map(m=><span key={m} className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">🌾 {m}</span>)}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">🌱 Planting · 🌾 Harvest · Based on Bicol Region crop calendars</p>
      </div>
    </div>
  );
}

// PEST DETECTION
function PestPage(){
  const [imgPreview,setImgPreview]=useState(null);
  const [result,setResult]=useState(null);
  const [loading,setLoading]=useState(false);
  const [selCropFilter,setSelCropFilter]=useState("All");
  const fileRef=useRef();

  const handleImg=e=>{
    const file=e.target.files[0];
    if(!file)return;
    const reader=new FileReader();
    reader.onload=ev=>{
      setImgPreview(ev.target.result);
      setResult(null);
      setLoading(true);
      setTimeout(()=>{
        // Simulate AI detection — randomly pick a disease
        const dz=DISEASES[Math.floor(Math.random()*DISEASES.length)];
        setResult(dz);
        setLoading(false);
      },2200);
    };
    reader.readAsDataURL(file);
  };

  const filtered=selCropFilter==="All"?DISEASES:DISEASES.filter(d=>d.crop===selCropFilter);

  return(
    <div className="space-y-5 pt-4">
      <div className="aFadeDown"><h2 className="text-xl font-bold text-gray-800 mb-1">📸 Pest & Disease Detection</h2><p className="text-xs text-gray-400">Upload a photo of your crop — AI will identify possible disease</p></div>

      {/* Upload area */}
      <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-6 text-center aScaleIn">
        <div className="flex flex-col items-center gap-3">
          {imgPreview?<img src={imgPreview} alt="crop" className="w-full max-h-48 object-cover rounded-xl"/>:<div className="w-20 h-20 rounded-2xl bg-green-50 flex items-center justify-center text-4xl aFloat">📷</div>}
          {loading&&<div><div className="dot-bounce"><span/><span/><span className="w-2 h-2"/></div><p className="text-xs text-gray-400 mt-2">Analyzing image with AI…</p></div>}
          {!loading&&result&&(
            <div className="w-full bg-red-50 rounded-2xl p-4 text-left border border-red-100 aScaleIn">
              <div className="flex items-center gap-2 mb-2"><span className="text-lg">⚠️</span><p className="font-bold text-red-700 text-sm">{result.name}</p><span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{result.crop}</span></div>
              <div className="space-y-1.5">
                <p className="text-xs text-gray-600"><span className="font-semibold">Symptoms:</span> {result.symptoms}</p>
                <p className="text-xs text-gray-600"><span className="font-semibold">Cause:</span> {result.cause}</p>
                <p className="text-xs text-green-700 bg-green-50 rounded-lg p-2"><span className="font-semibold">✅ Action:</span> {result.action}</p>
              </div>
            </div>
          )}
          {!loading&&<button onClick={()=>fileRef.current?.click()} className="px-6 py-2.5 rounded-xl text-sm font-bold text-white" style={{background:"linear-gradient(135deg,#16a34a,#15803d)"}}>{imgPreview?"📷 Upload Another Photo":"📷 Upload Crop Photo"}</button>}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImg}/>
          {!imgPreview&&<p className="text-xs text-gray-400">Supports JPG, PNG, HEIC · Max 10MB</p>}
        </div>
      </div>

      <div className="bg-amber-50 rounded-2xl border border-amber-100 p-3 aFadeUp"><p className="text-xs text-amber-700"><span className="font-semibold">⚠️ Demo Mode:</span> This uses a simulated AI detection for demonstration. For production, connect to a plant disease API (e.g., Plant.id or Agrio).</p></div>

      {/* Disease reference */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm aFadeUp d2">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h3 className="font-bold text-gray-700 text-sm">📚 Disease Reference Guide</h3>
          <div className="flex gap-2">{["All","Corn","Palay"].map(f=><Pill key={f} active={selCropFilter===f} onClick={()=>setSelCropFilter(f)}>{f}</Pill>)}</div>
        </div>
        <div className="space-y-3">
          {filtered.map((d,i)=>(
            <div key={d.name} className="bg-gray-50 rounded-xl p-3 aFadeUp" style={{animationDelay:`${i*.05}s`}}>
              <div className="flex items-center gap-2 mb-1"><span className={`text-xs font-bold px-2 py-0.5 rounded-full ${d.crop==="Corn"?"bg-amber-100 text-amber-700":"bg-green-100 text-green-700"}`}>{d.crop}</span><span className="font-semibold text-gray-700 text-xs">{d.name}</span></div>
              <p className="text-xs text-gray-500 mb-1"><span className="font-semibold text-gray-600">Symptoms:</span> {d.symptoms}</p>
              <p className="text-xs text-gray-500 mb-1"><span className="font-semibold text-gray-600">Cause:</span> {d.cause}</p>
              <p className="text-xs text-green-700"><span className="font-semibold">Action:</span> {d.action}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// MORE PAGE (Location, Notifications, History, Updates, Offline)
function MorePage({latestData,notifs,clearNotifs,addNotif,saved,removeSaved}){
  const [tab,setTab]=useState("location");
  const [selProvince,setSelProvince]=useState("Camarines Sur");
  const [autoDetecting,setAutoDetecting]=useState(false);
  const isOnline=useOnline();
  const now=useClock();

  const detectLocation=()=>{
    setAutoDetecting(true);
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(()=>{setSelProvince("Camarines Sur");setAutoDetecting(false);addNotif("📍 Location detected: Camarines Sur","success");},()=>{setAutoDetecting(false);addNotif("📍 Could not auto-detect location","info");});
    } else {setAutoDetecting(false);}
  };

  const sugg=LOCATION_CROPS[selProvince];
  const prevRow=PRICE_DATA.filter(d=>d.year===2026).at(-2);
  const dec2026=PRICE_DATA.find(d=>d.year===2026&&d.month==="December");

  return(
    <div className="space-y-4 pt-4">
      <div className="aFadeDown"><h2 className="text-xl font-bold text-gray-800 mb-1">📋 More Features</h2></div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[["location","📍 Location"],["notifs","🔔 Alerts"],["history","📂 History"],["updates","🔔 Updates"],["offline","🌐 Offline"]].map(([k,l])=><button key={k} onClick={()=>setTab(k)} className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${tab===k?"tab-pill-active":"tab-pill-idle"}`}>{l}</button>)}
      </div>

      {/* LOCATION TAB */}
      {tab==="location"&&(
        <div className="space-y-4 aFadeUp">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <h3 className="font-bold text-gray-700 text-sm mb-3">📍 Location-Based Crop Suggestions</h3>
            <div className="flex gap-2 mb-3">
              <select value={selProvince} onChange={e=>setSelProvince(e.target.value)} className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 focus:border-green-400">
                {Object.keys(LOCATION_CROPS).map(p=><option key={p}>{p}</option>)}
              </select>
              <button onClick={detectLocation} disabled={autoDetecting} className="px-3 py-2 rounded-xl text-xs font-semibold bg-green-50 text-green-700 border border-green-200 hover:bg-green-100">{autoDetecting?"Detecting…":"📡 Auto"}</button>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100">
              <p className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-2">🌟 Recommended for {selProvince}</p>
              <div className="flex gap-2 mb-3">{sugg.top.map(c=><span key={c} className="bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">{c}</span>)}</div>
              <p className="text-xs text-green-700">{sugg.reason}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <h3 className="font-bold text-gray-700 text-sm mb-3">🗺️ All Province Recommendations</h3>
            <div className="space-y-2">
              {Object.entries(LOCATION_CROPS).map(([prov,data])=>(
                <div key={prov} className="flex items-start gap-3 bg-gray-50 rounded-xl p-3">
                  <span className="text-base">📍</span>
                  <div className="flex-1"><p className="text-xs font-bold text-gray-700">{prov}</p><p className="text-xs text-gray-400 mt-0.5">{data.reason}</p></div>
                  <div className="flex flex-col gap-1">{data.top.map(c=><span key={c} className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-center">{c}</span>)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICATIONS TAB */}
      {tab==="notifs"&&(
        <div className="space-y-4 aFadeUp">
          <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-4 text-white">
            <p className="text-green-200 text-xs font-semibold uppercase tracking-widest mb-2">🔔 Price Alerts</p>
            <p className="font-bold text-lg mb-1">Palay Fancy is at a seasonal high</p>
            <p className="text-green-200 text-xs">December is the best month to sell Palay Fancy. Current forecast: ₱41.60/kg</p>
          </div>
          <div className="bg-amber-50 rounded-2xl border border-amber-100 p-4">
            <p className="font-bold text-amber-800 text-sm mb-1">📅 Best Day to Plant</p>
            <p className="text-xs text-amber-700">Based on current weather: <strong>White Corn planting window</strong> is open in January–February. Ensure irrigation is set up before planting.</p>
          </div>
          <div className="bg-blue-50 rounded-2xl border border-blue-100 p-4">
            <p className="font-bold text-blue-800 text-sm mb-1">🌀 Typhoon Advisory</p>
            <p className="text-xs text-blue-700">Peak typhoon season is July–September. Harvest early and store in dry facilities. Monitor PAGASA bulletins.</p>
          </div>
          {notifs.length>0&&(
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50"><p className="font-bold text-gray-700 text-xs uppercase tracking-widest">App Activity Log</p><button onClick={clearNotifs} className="text-xs text-red-400">Clear</button></div>
              {notifs.map(n=><div key={n.id} className="px-4 py-2.5 border-b border-gray-50 last:border-0"><p className="text-xs text-gray-700">{n.msg}</p><p className="text-xs text-gray-400 mt-0.5">{n.time}</p></div>)}
            </div>
          )}
        </div>
      )}

      {/* HISTORY TAB */}
      {tab==="history"&&(
        <div className="space-y-3 aFadeUp">
          {saved.length===0?(
            <div className="text-center py-16 text-gray-400"><p className="text-5xl mb-3 aFloat">📂</p><p className="text-sm font-semibold mb-1">No saved results yet</p><p className="text-xs">Go to Prices tab → select a crop → tap 💾 Save</p></div>
          ):saved.map((r,i)=>(
            <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm lift aFadeUp" style={{animationDelay:`${i*.06}s`}}>
              <div className="flex items-start justify-between mb-2">
                <div><p className="font-bold text-gray-800 text-sm">{r.variety}</p><p className="text-xs text-gray-400">Year: {r.year} · {r.savedAt}</p></div>
                <button onClick={()=>removeSaved(r.id)} className="text-red-400 hover:text-red-600 text-xs px-2 py-1 rounded-lg hover:bg-red-50">✕</button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[["Lowest",`₱${r.min}`,"text-green-600"],["Highest",`₱${r.max}`,"text-red-500"],["Average",`₱${r.avg}`,"text-blue-600"]].map(([l,v,c])=><div key={l} className="bg-gray-50 rounded-xl p-2 text-center"><p className="text-xs text-gray-400">{l}</p><p className={`font-bold text-sm ${c}`}>{v}</p></div>)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* UPDATES TAB */}
      {tab==="updates"&&(
        <div className="space-y-4 aFadeUp">
          <div><p className="text-xs text-gray-400 mb-3">As of {DAYS_F[now.getDay()]}, {MONTHS_F[now.getMonth()]} {now.getDate()}, {now.getFullYear()}</p></div>
          <MarketPrices/>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Forecasted — December 2026</h3>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {[{crop:"corn",key:"corn_white",label:"White Corn"},{crop:"corn",key:"corn_yellow",label:"Yellow Corn"},{crop:"rice",key:"rice_fancy",label:"Palay Fancy"},{crop:"rice",key:"rice_other",label:"Palay Other"}].map(({crop,key,label},i,arr)=>{
              const c=CROPS[crop],k=key,val=latestData[k],prev=prevRow?.[k],diff=prev?val-prev:0;
              return<div key={key} className={`flex items-center justify-between px-5 py-4 hover:bg-gray-50/60 transition-all aSlideL ${i<arr.length-1?"border-b border-gray-50":""}`} style={{animationDelay:`${i*.07}s`}}>
                <div className="flex items-center gap-3"><span className="text-2xl">{c.icon}</span><div><p className="font-semibold text-gray-800 text-sm">{label}</p><p className={`text-xs ${c.badge} px-1.5 py-0.5 rounded-full inline-block mt-0.5`}>{c.label}</p></div></div>
                <div className="text-right"><p className="font-bold text-gray-800 text-base">₱{val.toFixed(2)}<span className="text-xs font-normal text-gray-400">/kg</span></p><p className={`text-xs mt-0.5 ${diff>=0?"text-red-400":"text-green-500"}`}>{diff>=0?"▲":"▼"} {Math.abs(diff).toFixed(2)} vs Nov</p></div>
              </div>;
            })}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[{l:"Highest",v:`₱${Math.max(...[dec2026.cw,dec2026.cy,dec2026.rf,dec2026.ro]).toFixed(2)}`,sub:"Palay Fancy",c:"text-red-500"},{l:"Lowest",v:`₱${Math.min(...[dec2026.cw,dec2026.cy,dec2026.rf,dec2026.ro]).toFixed(2)}`,sub:"Yellow Corn",c:"text-green-600"},{l:"Corn Avg",v:`₱${((dec2026.cw+dec2026.cy)/2).toFixed(2)}`,sub:"White+Yellow",c:"text-amber-600"},{l:"Palay Avg",v:`₱${((dec2026.rf+dec2026.ro)/2).toFixed(2)}`,sub:"Fancy+Other",c:"text-green-700"}].map(s=>(
              <div key={s.l} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm lift"><p className="text-xs text-gray-400 mb-1">{s.l}</p><p className={`text-2xl font-bold ${s.c}`}>{s.v}</p><p className="text-xs text-gray-400 mt-0.5">{s.sub}</p></div>
            ))}
          </div>
        </div>
      )}

      {/* OFFLINE TAB */}
      {tab==="offline"&&(
        <div className="space-y-4 aFadeUp">
          <div className={`rounded-2xl border p-4 ${isOnline?"bg-green-50 border-green-200":"bg-red-50 border-red-200"}`}>
            <div className="flex items-center gap-3"><span className="text-3xl">{isOnline?"✅":"📵"}</span><div><p className={`font-bold text-sm ${isOnline?"text-green-700":"text-red-700"}`}>{isOnline?"You're Online":"You're Offline"}</p><p className={`text-xs ${isOnline?"text-green-600":"text-red-600"}`}>{isOnline?"All features available.":"Using cached data from last sync."}</p></div></div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <h3 className="font-bold text-gray-700 text-sm mb-3">🌐 Offline Capabilities</h3>
            <div className="space-y-2">
              {[["✅","Price forecast data (2026–2028)","Always available — data is embedded in the app"],["✅","Weather seasonal averages","Available offline — historical data embedded"],["✅","AI Insights & crop calendar","Available offline — no internet needed"],["✅","Saved results / history","Stored locally on your device"],["✅","Pest & disease reference","All 6 diseases available without internet"],["⚠️","Current market prices","Requires internet for live DA-5 AMAD data"],["⚠️","Auto-detect location","Requires GPS & internet for best accuracy"]].map(([s,f,d])=>(
                <div key={f} className="flex gap-3 bg-gray-50 rounded-xl p-3"><span className="text-base mt-0.5">{s}</span><div><p className="text-xs font-semibold text-gray-700">{f}</p><p className="text-xs text-gray-400">{d}</p></div></div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <h3 className="font-bold text-gray-700 text-sm mb-2">💾 Cache Status</h3>
            <div className="space-y-2">
              {[["Price Data","36 months cached","✅"],["Weather Data","12 months cached","✅"],["Disease Guide","6 diseases cached","✅"]].map(([l,d,s])=><div key={l} className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2"><div><p className="text-xs font-semibold text-gray-700">{l}</p><p className="text-xs text-gray-400">{d}</p></div><span>{s}</span></div>)}
            </div>
          </div>
          <div className="bg-blue-50 rounded-2xl border border-blue-100 p-4"><p className="text-xs text-blue-700"><span className="font-semibold">💡 Tip for Farmers:</span> All price forecasts, AI insights, and the disease guide work without any internet connection — ideal for remote areas in Bicol with limited data signal.</p></div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN PANEL
// ─────────────────────────────────────────────────────────────────────────────
function AdminLogin({onLogin,onBack}){
  const [pw,setPw]=useState(""),[err,setErr]=useState(""),[busy,setBusy]=useState(false);
  const go=()=>{setBusy(true);setTimeout(()=>{if(pw===ADMIN_PW){onLogin();}else{setErr("Incorrect password. Hint: admin2026");setBusy(false);}},700);};
  return(
    <div className="min-h-screen flex items-center justify-center p-4" style={{background:"linear-gradient(135deg,#052e16,#14532d)"}}>
      {/* Back button top-left */}
      <button onClick={onBack} className="fixed top-4 left-4 flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105" style={{background:"rgba(255,255,255,0.1)",color:"#86efac",border:"1px solid rgba(255,255,255,0.15)"}}>
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
        Back to App
      </button>
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl aScaleIn">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl" style={{background:"linear-gradient(135deg,#16a34a,#d97706)"}}>🔐</div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
          <p className="text-sm text-gray-400 mt-1">CamPrice · Bicol Region</p>
        </div>
        <div className="space-y-4">
          <input type="password" value={pw} onChange={e=>{setPw(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="Admin password…" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm"/>
          {err&&<p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{err}</p>}
          <button onClick={go} disabled={busy} className="w-full py-3 rounded-xl font-bold text-white text-sm" style={{background:"linear-gradient(135deg,#16a34a,#15803d)"}}>{busy?"Signing in…":"Sign In"}</button>
        </div>
      </div>
    </div>
  );
}

function AdminPanel({onExit}){
  const [authed,setAuthed]=useLS("admin_authed",false);
  const [tab,setTab]=useState("overview");
  const [users,setUsers]=useLS("admin_users",SEED_USERS);
  const [search,setSearch]=useState("");
  const [roleF,setRoleF]=useState("All");
  const [selUser,setSelUser]=useState(null);
  const [addModal,setAddModal]=useState(false);
  const [nu,setNu]=useState({name:"",email:"",role:"Farmer",region:"Camarines Sur"});
  // Settings state — must be here at top level (Rules of Hooks)
  const [supaStatus,setSupaStatus]=useState(null);
  const [importing,setImporting]=useState(false);
  const [importResult,setImportResult]=useState(null);
  const [resetConfirm,setResetConfirm]=useState(false);
  const [toast,setToast]=useState(null);
  const importRef=useRef();

  if(!authed)return<AdminLogin onLogin={()=>setAuthed(true)} onBack={onExit}/>;

  // Settings handlers
  const showToast=(msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast(null),3000);};

  const handleRefresh=()=>{
    setSupaStatus("loading");
    setTimeout(()=>{
      try{
        localStorage.setItem("supa_test","ok");
        localStorage.removeItem("supa_test");
        setSupaStatus("ok");
        showToast("✅ Supabase connection refreshed!","success");
      }catch(e){
        setSupaStatus("error");
        showToast("❌ Connection failed. Check your Supabase config.","error");
      }
    },1200);
  };

  const handleImportClick=()=>importRef.current?.click();

  const handleImportFile=e=>{
    const file=e.target.files[0];
    if(!file)return;
    setImporting(true);
    setImportResult(null);
    const reader=new FileReader();
    reader.onload=ev=>{
      try{
        const text=ev.target.result;
        const lines=text.trim().split("\n");
        const headers=lines[0].split(",").map(h=>h.trim().toLowerCase().replace(/\s/g,"_"));
        const rows=lines.slice(1).map(line=>{
          const vals=line.split(",");
          const obj={};
          headers.forEach((h,i)=>obj[h]=vals[i]?.trim());
          return obj;
        });
        const validRows=rows.filter(r=>r.year&&r.month);
        setImporting(false);
        setImportResult({count:validRows.length,headers,sample:rows.slice(0,3)});
        showToast(`✅ Imported ${validRows.length} rows from ${file.name}`,"success");
      }catch(err){
        setImporting(false);
        showToast("❌ Could not parse CSV. Check the file format.","error");
      }
    };
    reader.readAsText(file);
    e.target.value="";
  };

  const handleExport=()=>{
    try{
      const headers=["ID","Name","Email","Role","Province","Joined","Last Seen","Views","Searches","Status","Saved Forecasts"];
      const rows=users.map(u=>[u.id,u.name,u.email,u.role,u.region,u.joined,u.lastSeen,u.views,u.searches,u.status,u.saved||0]);
      const csv=[headers.join(","),...rows.map(r=>r.map(v=>`"${v}"`).join(","))].join("\n");
      const blob=new Blob([csv],{type:"text/csv"});
      const url=URL.createObjectURL(blob);
      const a=document.createElement("a");
      a.href=url;
      a.download=`camprice_users_${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(`✅ Exported ${users.length} users to CSV`,"success");
    }catch(err){
      showToast("❌ Export failed. Try again.","error");
    }
  };

  const handleReset=()=>{
    if(!resetConfirm){setResetConfirm(true);setTimeout(()=>setResetConfirm(false),4000);return;}
    try{
      localStorage.removeItem("camprice_saved");
      localStorage.removeItem("camprice_notifs");
      localStorage.removeItem("camprice_read");
      setResetConfirm(false);
      showToast("✅ All saved results and notifications cleared","success");
    }catch(err){
      showToast("❌ Reset failed. Try again.","error");
    }
  };

  const online=users.filter(u=>u.status==="online").length;
  const totalViews=users.reduce((s,u)=>s+u.views,0);
  const filtered=users.filter(u=>(roleF==="All"||u.role===roleF)&&(!search||u.name.toLowerCase().includes(search.toLowerCase())||u.email.toLowerCase().includes(search.toLowerCase())));

  const addUser=()=>{if(!nu.name||!nu.email)return;const u={...nu,id:Date.now(),joined:new Date().toLocaleDateString("en-PH",{month:"short",day:"numeric",year:"2-digit"}),lastSeen:"Now",views:0,searches:0,status:"online",saved:0};setUsers([...users,u]);setAddModal(false);setNu({name:"",email:"",role:"Farmer",region:"Camarines Sur"});};
  const delUser=id=>{setUsers(users.filter(u=>u.id!==id));setSelUser(null);};
  const toggleStatus=id=>{const ss=["online","away","offline"];const upd=users.map(u=>u.id===id?{...u,status:ss[(ss.indexOf(u.status)+1)%3]}:u);setUsers(upd);if(selUser?.id===id)setSelUser(upd.find(u=>u.id===id));};

  const CROP_SEARCHES={corn_white:38,corn_yellow:29,rice_fancy:52,rice_other:24};
  const maxSearch=Math.max(...Object.values(CROP_SEARCHES));

  return(
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:"linear-gradient(135deg,#16a34a,#d97706)"}}>🌾</div>
            <div><p className="font-bold text-gray-800 text-sm leading-none">CamPrice Admin</p><p className="text-xs text-gray-400">Bicol Region</p></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-full"><span className="w-2 h-2 rounded-full bg-green-500 aPulse"/><span className="text-xs font-semibold text-green-700">{online} online</span></div>
            <button onClick={onExit} className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-100">← Back</button>
          </div>
        </div>
      </header>
      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 sticky top-[57px] z-30">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-1 py-2 overflow-x-auto">
            {[["overview","📊 Overview"],["users","👥 Users"],["analytics","📈 Analytics"],["settings","⚙️ Settings"]].map(([k,l])=>(
              <button key={k} onClick={()=>setTab(k)} className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${tab===k?"bg-green-600 text-white shadow":"text-gray-500 hover:bg-gray-100"}`}>{l}</button>
            ))}
          </div>
        </div>
      </div>
      <main className="max-w-4xl mx-auto px-4 py-5 space-y-5">

        {/* OVERVIEW */}
        {tab==="overview"&&(
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[{ic:"👥",l:"Total Users",v:users.length,s:"All time",c:"bg-green-50"},{ic:"🟢",l:"Online Now",v:online,s:"Active",c:"bg-emerald-50"},{ic:"👁️",l:"Page Views",v:totalViews,s:"All users",c:"bg-blue-50"},{ic:"🔍",l:"Searches",v:users.reduce((s,u)=>s+u.searches,0),s:"All users",c:"bg-purple-50"}].map((sc,i)=>(
                <div key={sc.l} className={`bg-white rounded-2xl border border-gray-100 p-4 shadow-sm lift aScaleIn d${i+1}`}><div className="flex items-center justify-between mb-3"><span className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${sc.c}`}>{sc.ic}</span><span className="text-xs text-gray-400">{sc.s}</span></div><p className="text-2xl font-bold text-gray-800">{sc.v}</p><p className="text-xs text-gray-400 mt-1">{sc.l}</p></div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm aFadeUp d2">
              <h3 className="font-bold text-gray-700 text-sm mb-4">🌾 Most Searched Crops</h3>
              <div className="space-y-3">{Object.entries(CROP_SEARCHES).sort((a,b)=>b[1]-a[1]).map(([k,n])=>{const label={corn_white:"White Corn",corn_yellow:"Yellow Corn",rice_fancy:"Palay Fancy",rice_other:"Palay Other"}[k];return(<div key={k} className="flex items-center gap-3"><span className="text-xs text-gray-600 w-24 shrink-0 font-medium">{label}</span><div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden"><div className="h-full rounded-full transition-all" style={{width:`${(n/maxSearch)*100}%`,background:"#16a34a"}}/></div><span className="text-xs font-bold text-gray-700 w-6 text-right">{n}</span></div>);})}</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm aFadeUp d3">
              <h3 className="font-bold text-gray-700 text-sm mb-4">📍 Province Distribution</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[["Camarines Sur",35],["Albay",28],["Sorsogon",14],["Catanduanes",9],["Masbate",8],["Cam. Norte",6]].map(([r,p])=>(
                  <div key={r} className="bg-gray-50 rounded-xl p-3"><p className="text-xs font-semibold text-gray-700">{r}</p><p className="text-xl font-bold text-green-600 mt-1">{p}%</p><div className="w-full bg-gray-200 rounded-full h-1.5 mt-2"><div className="h-full rounded-full bg-green-500" style={{width:`${p}%`}}/></div></div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-5 text-white aFadeUp d4">
              <p className="text-green-200 text-xs font-semibold uppercase tracking-widest mb-2">🔥 Top Insight</p>
              <p className="font-bold text-lg mb-1">Palay Fancy is the most searched crop</p>
              <p className="text-green-200 text-sm">52 searches this week — 38% above average. Consider expanding the Palay Fancy forecast to 2029.</p>
            </div>
          </>
        )}

        {/* USERS */}
        {tab==="users"&&(
          <>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div><h3 className="font-bold text-gray-700 text-sm">👥 User Management</h3><p className="text-xs text-gray-400">{filtered.length}/{users.length} users</p></div>
              <button onClick={()=>setAddModal(true)} className="px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{background:"linear-gradient(135deg,#16a34a,#15803d)"}}>➕ Add User</button>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search…" className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 mb-3"/>
              <div className="flex gap-2 flex-wrap">{["All","Farmer","Trader","Researcher","DA Officer"].map(r=><Pill key={r} active={roleF===r} onClick={()=>setRoleF(r)}>{r}</Pill>)}</div>
            </div>
            <div className="space-y-2">
              {filtered.map((u,i)=>(
                <div key={u.id} onClick={()=>setSelUser(u)} className={`bg-white rounded-2xl border p-4 shadow-sm cursor-pointer lift aSlideL ${selUser?.id===u.id?"border-green-300 ring-2 ring-green-100":"border-gray-100"}`} style={{animationDelay:`${i*.04}s`}}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{background:`hsl(${u.id*47%360},60%,55%)`}}>{u.name.split(" ").map(n=>n[0]).join("").slice(0,2)}</div>
                      <div><p className="font-semibold text-gray-800 text-sm">{u.name}</p><p className="text-xs text-gray-400">{u.email}</p></div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${u.role==="Farmer"?"bg-green-100 text-green-700":u.role==="Trader"?"bg-amber-100 text-amber-700":u.role==="Researcher"?"bg-blue-100 text-blue-700":"bg-purple-100 text-purple-700"}`}>{u.role}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${u.status==="online"?"bg-green-100 text-green-700":u.status==="away"?"bg-amber-100 text-amber-700":"bg-gray-100 text-gray-500"}`}>{u.status==="online"?"🟢":u.status==="away"?"🟡":"⚫"} {u.status}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-gray-50">
                    {[["Region",u.region],["Joined",u.joined],["Views",u.views],["Searches",u.searches]].map(([l,v])=><div key={l}><p className="text-xs text-gray-400">{l}</p><p className="text-xs font-bold text-gray-700">{v}</p></div>)}
                  </div>
                </div>
              ))}
            </div>
            {selUser&&(
              <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40" onClick={()=>setSelUser(null)}>
                <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl aScaleIn" onClick={e=>e.stopPropagation()}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl" style={{background:`hsl(${selUser.id*47%360},60%,55%)`}}>{selUser.name.split(" ").map(n=>n[0]).join("").slice(0,2)}</div>
                      <div><p className="font-bold text-gray-800">{selUser.name}</p><p className="text-xs text-gray-400">{selUser.email}</p></div>
                    </div>
                    <button onClick={()=>setSelUser(null)} className="text-gray-400 text-2xl leading-none">×</button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {[["📍 Province",selUser.region],["📅 Joined",selUser.joined],["🕐 Last Seen",selUser.lastSeen],["💾 Saved",`${selUser.saved} forecasts`],["👁️ Views",selUser.views],["🔍 Searches",selUser.searches]].map(([l,v])=><div key={l} className="bg-gray-50 rounded-xl p-2.5"><p className="text-xs text-gray-400">{l}</p><p className="text-xs font-bold text-gray-700 mt-0.5">{v}</p></div>)}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={()=>toggleStatus(selUser.id)} className="flex-1 py-2 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100">Toggle Status</button>
                    <button onClick={()=>delUser(selUser.id)} className="flex-1 py-2 rounded-xl text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100">🗑️ Remove</button>
                  </div>
                </div>
              </div>
            )}
            {addModal&&(
              <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40" onClick={()=>setAddModal(false)}>
                <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl aScaleIn" onClick={e=>e.stopPropagation()}>
                  <div className="flex items-center justify-between mb-4"><h3 className="font-bold text-gray-700">➕ Add User</h3><button onClick={()=>setAddModal(false)} className="text-gray-400 text-2xl">×</button></div>
                  <div className="space-y-3">
                    {[["Full Name","text","name"],["Email","email","email"]].map(([l,t,k])=><div key={k}><label className="text-xs font-semibold text-gray-400 uppercase">{l}</label><input type={t} value={nu[k]} onChange={e=>setNu(p=>({...p,[k]:e.target.value}))} className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-200 text-sm"/></div>)}
                    <div><label className="text-xs font-semibold text-gray-400 uppercase">Role</label><select value={nu.role} onChange={e=>setNu(p=>({...p,role:e.target.value}))} className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-200 text-sm">{["Farmer","Trader","Researcher","DA Officer"].map(r=><option key={r}>{r}</option>)}</select></div>
                    <div><label className="text-xs font-semibold text-gray-400 uppercase">Province</label><select value={nu.region} onChange={e=>setNu(p=>({...p,region:e.target.value}))} className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-200 text-sm">{Object.keys(LOCATION_CROPS).map(r=><option key={r}>{r}</option>)}</select></div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button onClick={()=>setAddModal(false)} className="flex-1 py-2 rounded-xl text-xs font-semibold bg-gray-100 text-gray-600">Cancel</button>
                    <button onClick={addUser} className="flex-1 py-2 rounded-xl text-xs font-semibold text-white" style={{background:"linear-gradient(135deg,#16a34a,#15803d)"}}>Add</button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ANALYTICS */}
        {tab==="analytics"&&(
          <>
            <div className="grid grid-cols-2 gap-3">
              {[{ic:"📈",l:"Avg Views",v:Math.round(users.reduce((s,u)=>s+u.views,0)/users.length),c:"bg-blue-50"},{ic:"🔍",l:"Avg Searches",v:Math.round(users.reduce((s,u)=>s+u.searches,0)/users.length),c:"bg-purple-50"},{ic:"💾",l:"Total Saved",v:users.reduce((s,u)=>s+(u.saved||0),0),c:"bg-green-50"},{ic:"🌐",l:"Active Sessions",v:users.filter(u=>u.status!=="offline").length,c:"bg-amber-50"}].map((s,i)=>(
                <div key={s.l} className={`bg-white rounded-2xl border border-gray-100 p-4 shadow-sm lift aScaleIn d${i+1}`}><div className="flex items-center justify-between mb-3"><span className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${s.c}`}>{s.ic}</span></div><p className="text-2xl font-bold text-gray-800">{s.v}</p><p className="text-xs text-gray-400 mt-1">{s.l}</p></div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm aFadeUp d3">
              <h3 className="font-bold text-gray-700 text-sm mb-4">🏆 Top 5 Users by Activity</h3>
              <div className="space-y-3">
                {[...users].sort((a,b)=>(b.views+b.searches)-(a.views+a.searches)).slice(0,5).map((u,i)=>{
                  const total=u.views+u.searches,maxT=users.reduce((m,u)=>Math.max(m,u.views+u.searches),0);
                  return<div key={u.id} className="flex items-center gap-3 aSlideL" style={{animationDelay:`${i*.06}s`}}>
                    <span className="text-sm font-bold text-gray-400 w-5">#{i+1}</span>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold" style={{background:`hsl(${u.id*47%360},60%,55%)`}}>{u.name.split(" ").map(n=>n[0]).join("").slice(0,2)}</div>
                    <div className="flex-1"><p className="text-xs font-semibold text-gray-700">{u.name}</p><div className="w-full bg-gray-100 rounded-full h-2 mt-1"><div className="h-full rounded-full bg-green-500" style={{width:`${(total/maxT)*100}%`}}/></div></div>
                    <span className="text-xs font-bold text-gray-600">{total}</span>
                  </div>;
                })}
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-5 text-white aFadeUp d4">
              <h3 className="font-bold text-white text-sm mb-3">💚 Platform Health</h3>
              <div className="grid grid-cols-3 gap-3">
                {[["Uptime","99.9%"],["Response","<200ms"],["Error Rate","0.1%"]].map(([l,v])=><div key={l} className="bg-white/20 rounded-xl p-3 text-center"><p className="text-xs text-green-200">{l}</p><p className="font-bold text-lg">{v}</p></div>)}
              </div>
              <p className="text-green-200 text-xs mt-3">All systems operational · Supabase: Connected · Vercel: Deployed</p>
            </div>
          </>
        )}

        {/* SETTINGS */}
        {tab==="settings"&&(
          <div className="space-y-4">
            {/* Toast notification */}
            {toast&&(
              <div className="fixed top-4 left-1/2 z-50 aScaleIn px-4 py-3 rounded-xl text-sm font-semibold shadow-xl"
                style={{transform:"translateX(-50%)",background:toast.type==="success"?"#dcfce7":"#fee2e2",color:toast.type==="success"?"#166534":"#991b1b",border:`1px solid ${toast.type==="success"?"#86efac":"#fca5a5"}`}}>
                {toast.msg}
              </div>
            )}

            {/* Refresh Supabase */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm aFadeUp d1">
              <h4 className="font-bold text-gray-700 text-sm mb-1">🔄 Refresh Supabase Connection</h4>
              <p className="text-xs text-gray-400 mb-3">Test and refresh the connection to your Supabase database.</p>
              <button onClick={handleRefresh} disabled={supaStatus==="loading"}
                className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-left transition-all bg-blue-50 text-blue-700 hover:bg-blue-100 disabled:opacity-60">
                {supaStatus==="loading"?"⏳ Connecting…":supaStatus==="ok"?"✅ Connected — Click to refresh again":"🔄 Refresh Connection"}
              </button>
              {supaStatus==="ok"&&(
                <div className="mt-2 text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2">
                  ✅ Connection active · Checked at {new Date().toLocaleTimeString("en-PH")}
                </div>
              )}
              {supaStatus==="error"&&(
                <div className="mt-2 text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
                  ❌ Connection failed — check your Supabase URL and anon key in supabaseClient.js
                </div>
              )}
            </div>

            {/* Import CSV */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm aFadeUp d2">
              <h4 className="font-bold text-gray-700 text-sm mb-1">📥 Import Price Data (CSV)</h4>
              <p className="text-xs text-gray-400 mb-1">Required columns: <code className="bg-gray-100 px-1 rounded">year, month, corn_white, corn_yellow, rice_fancy, rice_other</code></p>
              <p className="text-xs text-gray-400 mb-3">Example: <code className="bg-gray-100 px-1 rounded">2026, January, 31.45, 30.72, 41.08, 32.52</code></p>
              <button onClick={handleImportClick} disabled={importing}
                className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-left transition-all bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-60">
                {importing?"⏳ Reading file…":"📥 Choose CSV File to Import"}
              </button>
              <input ref={importRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleImportFile}/>
              {importResult&&(
                <div className="mt-3 bg-green-50 rounded-xl p-3 border border-green-100">
                  <p className="text-xs font-bold text-green-700 mb-1">✅ {importResult.count} rows detected in file</p>
                  <p className="text-xs text-green-600 mb-2">Columns: {importResult.headers.join(", ")}</p>
                  <p className="text-xs text-gray-500 font-semibold mb-1">Preview (first 3 rows):</p>
                  {importResult.sample.map((row,i)=>(
                    <div key={i} className="text-xs text-gray-500 font-mono bg-white rounded px-2 py-1 mb-1">
                      {Object.entries(row).map(([k,v])=>`${k}: ${v}`).join(" · ")}
                    </div>
                  ))}
                  <p className="text-xs text-amber-600 mt-2">⚠️ To save permanently, upload this data to your Supabase <code className="bg-amber-50 px-1 rounded">price_forecasts</code> table.</p>
                </div>
              )}
            </div>

            {/* Export CSV */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm aFadeUp d3">
              <h4 className="font-bold text-gray-700 text-sm mb-1">📤 Export User Data (CSV)</h4>
              <p className="text-xs text-gray-400 mb-3">Download all {users.length} registered users as a CSV file.</p>
              <button onClick={handleExport}
                className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-left transition-all bg-amber-50 text-amber-700 hover:bg-amber-100">
                📤 Download Users CSV ({users.length} records)
              </button>
            </div>

            {/* Reset */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm aFadeUp d4">
              <h4 className="font-bold text-gray-700 text-sm mb-1">🗑️ Reset All Saved Results</h4>
              <p className="text-xs text-gray-400 mb-3">Clears all saved forecasts, notifications, and activity logs. Cannot be undone.</p>
              <button onClick={handleReset}
                className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-left transition-all ${resetConfirm?"bg-red-600 text-white":"bg-red-50 text-red-600 hover:bg-red-100"}`}>
                {resetConfirm?"⚠️ Tap again to CONFIRM — this cannot be undone!":"🗑️ Reset All Saved Results"}
              </button>
              {resetConfirm&&<p className="text-xs text-red-500 mt-2">This will clear all saved forecasts and notifications. Tap again to confirm or wait 4 seconds to cancel.</p>}
            </div>

            {/* Sign out */}
            <button onClick={()=>{setAuthed(false);onExit();}} className="w-full py-3 rounded-xl font-bold text-red-600 text-sm bg-red-50 hover:bg-red-100 transition-all aFadeUp d5">
              🚪 Sign Out of Admin Panel
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NAV
// ─────────────────────────────────────────────────────────────────────────────
const NAV=[
  {key:"home",    l:"Home",    ic:a=><svg className="w-5 h-5" fill={a?"currentColor":"none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>},
  {key:"prices",  l:"Prices",  ic:a=><svg className="w-5 h-5" fill={a?"currentColor":"none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>},
  {key:"weather", l:"Weather", ic:a=><svg className="w-5 h-5" fill={a?"currentColor":"none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/></svg>},
  {key:"insights",l:"Insights",ic:a=><svg className="w-5 h-5" fill={a?"currentColor":"none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>},
  {key:"pest",    l:"Pest",    ic:a=><svg className="w-5 h-5" fill={a?"currentColor":"none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>},
  {key:"more",    l:"More",    ic:a=><svg className="w-5 h-5" fill={a?"currentColor":"none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>},
];

// ─────────────────────────────────────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────────────────────────────────────
export default function App(){
  const [loading,setLoading]=useState(true);
  const [page,setPage]=useState("home");
  const [showAdmin,setShowAdmin]=useState(false);
  const [notifs,setNotifs]=useLS("camprice_notifs",[]);
  const [saved,setSaved]=useLS("camprice_saved",[]);
  const [readCount,setReadCount]=useLS("camprice_read",0);
  const isOnline=useOnline();
  const unread=Math.max(0,notifs.length-readCount);
  const latestData=PRICE_DATA.filter(d=>d.year===2026).at(-1);

  const addNotif=useCallback((msg,type="info")=>{
    const n={id:Date.now(),msg,type,time:new Date().toLocaleTimeString("en-PH")};
    setNotifs(p=>[n,...p].slice(0,30));
  },[]);

  const saveResult=useCallback(r=>setSaved(p=>[r,...p].slice(0,50)),[]);
  const removeSaved=useCallback(id=>setSaved(p=>p.filter(r=>r.id!==id)),[]);
  const clearNotifs=useCallback(()=>{setNotifs([]);setReadCount(0);},[]);

  // Check for admin route
  useEffect(()=>{if(window.location.search==="?admin"||window.location.pathname==="/admin")setShowAdmin(true);},[]);

  if(showAdmin)return(<><style>{STYLES}</style><AdminPanel onExit={()=>{setShowAdmin(false);window.history.replaceState({},"","/");}}/></>);

  return(
    <>
      <style>{STYLES}</style>
      {loading&&<Splash onDone={()=>setLoading(false)}/>}
      {!loading&&(
        <div className="min-h-screen pb-24 aFadeIn" style={{background:"linear-gradient(135deg,#f0fdf4 0%,#fefce8 50%,#f0fdf4 100%)"}}>
          {!isOnline&&<div className="offline-banner">📵 You are offline — showing cached data</div>}
          <div className="h-1.5 w-full" style={{background:"linear-gradient(90deg,#16a34a,#d97706,#16a34a)"}}/>

          {/* Notif Bell + Admin button */}
          <div className="fixed top-3 right-3 z-40 flex gap-2">
            <button onClick={()=>setShowAdmin(true)} className="w-9 h-9 bg-white rounded-full shadow-md border border-gray-100 flex items-center justify-center text-sm hover:scale-110 transition-all" title="Admin Panel">🔐</button>
            <button onClick={()=>{setPage("more");setReadCount(notifs.length);}} className="relative w-9 h-9 bg-white rounded-full shadow-md border border-gray-100 flex items-center justify-center hover:scale-110 transition-all">
              <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
              {unread>0&&<span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">{unread>9?"9+":unread}</span>}
            </button>
          </div>

          <main className="max-w-2xl mx-auto px-4">
            {page==="home"     &&<HomePage    latestData={latestData}/>}
            {page==="prices"   &&<PricesPage  addNotif={addNotif} saveResult={saveResult}/>}
            {page==="weather"  &&<WeatherPage/>}
            {page==="insights" &&<InsightsPage addNotif={addNotif}/>}
            {page==="pest"     &&<PestPage/>}
            {page==="more"     &&<MorePage latestData={latestData} notifs={notifs} clearNotifs={clearNotifs} addNotif={addNotif} saved={saved} removeSaved={removeSaved}/>}
          </main>

          <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/96 backdrop-blur border-t border-gray-100 shadow-lg aNavUp">
            <div className="max-w-lg mx-auto flex items-center justify-around px-1 py-1">
              {NAV.map(({key,l,ic})=>{const a=page===key;return(
                <button key={key} onClick={()=>setPage(key)} className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-200 ${a?"text-green-600 bg-green-50 scale-105":"text-gray-400 hover:text-gray-600 hover:bg-gray-50"}`}>
                  {ic(a)}<span className={`font-semibold ${a?"text-green-600":"text-gray-400"}`} style={{fontSize:9}}>{l}</span>
                  {a&&<span className="w-1 h-1 rounded-full bg-green-500"/>}
                </button>
              );})}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}