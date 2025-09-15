export function normalizeWeather(json) {

  const { location, current, forecast } = json;

return {
    location: {

      name: location?.name, 
      region: location?.region, 
    country: location?.country,
      lat: location?.lat, 
    lon: location?.lon, 
    tz_id: location?.tz_id, 
    localtime: location?.localtime

    },

    current: current && {
      last_updated: current.last_updated, 
      temp_c: current.temp_c, 
      temp_f: current.temp_f, 
      is_day: current.is_day,
      condition_text: current.condition?.text, 
      condition_icon: current.condition?.icon,
      wind_kph: current.wind_kph, 
      wind_dir: current.wind_dir, 
      pressure_mb: current.pressure_mb,
      precip_mm: current.precip_mm, 
      humidity: current.humidity, 
      cloud: current.cloud,
      feelslike_c: current.feelslike_c, 
      feelslike_f: current.feelslike_f, 
      vis_km: current.vis_km, uv: current.uv

    },

    days: (forecast?.forecastday || []).map(d => ({
      date: d.date,
      astro: { 
        sunrise: d.astro?.sunrise, 
        sunset: d.astro?.sunset, 
        moon_phase: d.astro?.moon_phase },

      day: {
        maxtemp_c: d.day?.maxtemp_c, 
        mintemp_c: d.day?.mintemp_c, 
        avghumidity: d.day?.avghumidity,
        daily_will_it_rain: d.day?.daily_will_it_rain, 
        daily_chance_of_rain: d.day?.daily_chance_of_rain,
        maxwind_kph: d.day?.maxwind_kph, uv: d.day?.uv, 
        condition_text: d.day?.condition?.text, 
        condition_icon: d.day?.condition?.icon

      }

    }))

  };
}