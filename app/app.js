import { normalizeWeather } from "../model/model.js";

const KEY = "295fecd17f7647a3b6a33104251409";
const BASE = "https://api.weatherapi.com/v1";

const form = document.getElementById("searchForm");
const inputQ = document.getElementById("cityInput");
const inputDays = document.getElementById("daysInput");
const elCurrent = document.getElementById("currentWeather");
const elForecast = document.getElementById("forecastWeather");

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]
));



     async function fetchForecast(q, days) {

const params = new URLSearchParams({ key: KEY, q, days: String(days), aqi: "no", alerts: "no" 

  });
  
  const r = await fetch(`${BASE}/forecast.json?${params}`
);
if (!r.ok) throw new Error(`Weather API error ${r.status}`

  );
  
  return r.json();
}



function renderCurrent({ location, current }) {

elCurrent.innerHTML = `

    <div class="card__header">
     
    <h2>${esc(location.name)}, ${esc(location.region)} — ${esc(location.country)}</h2>
      <div class="meta">Local time: ${esc(location.localtime)} - tz: ${esc(location.tz_id)}</div>
    
    </div>
    
    <div style="display:flex;gap:1rem;align-items:center;flex-wrap:wrap;">
      
 <img src="${esc(current.condition_icon)}" alt="${esc(current.condition_text)}" />
     
    <div>
    
    <div class="temps" style="font-weight:700;font-size:1.1rem;">
          ${current.temp_c}°C / ${current.temp_f}°F (feels ${current.feelslike_c}°C)
</div>
       
        <div class="meta">
          ${esc(current.condition_text)} - Wind ${current.wind_kph} kph ${esc(current.wind_dir)} -
 Humidity ${current.humidity}% - UV ${current.uv} - Pressure ${current.pressure_mb} mb - Vis ${current.vis_km} km
        </div>
     
          </div>
    </div>`;
}

function renderForecast({ days }) {

  elForecast.innerHTML = days.map(d => `
    
<article class="card">
      
    <div class="meta">${esc(d.date)} - Sunrise ${esc(d.astro.sunrise)} - Sunset ${esc(d.astro.sunset)} - Moon ${esc(d.astro.moon_phase)}</div>
  
 <div style="display:flex;gap:.5rem;align-items:center;">
      
    <img src="${esc(d.day.condition_icon)}" alt="${esc(d.day.condition_text)}" />
        <div>
          
    <div>${esc(d.day.condition_text)}</div>
        
      <div class="temps">Max ${d.day.maxtemp_c}°C - Min ${d.day.mintemp_c}°C - Hum ${d.day.avghumidity}%</div>
        
        <div class="meta">Rain? ${d.day.daily_will_it_rain ? "Yes" : "No"} (${d.day.daily_chance_of_rain || 0}%) - Wind ${d.day.maxwind_kph} kph - UV ${d.day.uv}</div>
      
    </div>
</div>
    
    </article>

  `).join("");
}

async function run(q, days) {

  try {
  elForecast.innerHTML = "";
   
  const d = Math.min(10, Math.max(1, Number(days) || 1));
    const data = normalizeWeather(await fetchForecast(q, d));
   
  renderCurrent(data); 
  renderForecast(data);

  } catch (e) {

    elCurrent.innerHTML = `<div class="card" style="color:#ffb4b4;">${esc(e.message)}</div>`;

  }
}

form.addEventListener("submit", e => {

  e.preventDefault();
  run(inputQ.value.trim(), inputDays.value);

});

window.addEventListener("DOMContentLoaded", () => run(inputQ.value, inputDays.value));
