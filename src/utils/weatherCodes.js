// Mapeo de códigos del clima de Open-Meteo a Meteocons
export const getWeatherIcon = (code, isDay = true) => {
  const timePrefix = isDay ? 'day' : 'night';
  
  // WMO Weather interpretation codes (WW)
  const weatherMap = {
    0: 'clear', // Clear sky
    1: 'partly-cloudy', // Mainly clear
    2: 'partly-cloudy', // partly cloudy
    3: 'cloudy', // overcast
    45: 'fog', // Fog
    48: 'fog', // depositing rime fog
    51: 'drizzle', // Drizzle: Light
    53: 'drizzle', // Drizzle: moderate
    55: 'drizzle', // Drizzle: dense intensity
    56: 'hail', // Freezing Drizzle: Light
    57: 'hail', // Freezing Drizzle: dense intensity
    61: 'rain', // Rain: Slight
    63: 'rain', // Rain: moderate
    65: 'rain', // Rain: heavy intensity
    66: 'sleet', // Freezing Rain: Light
    67: 'sleet', // Freezing Rain: heavy intensity
    71: 'snow', // Snow fall: Slight
    73: 'snow', // Snow fall: moderate
    75: 'snow', // Snow fall: heavy intensity
    77: 'snow', // Snow grains
    80: 'rain', // Rain showers: Slight
    81: 'rain', // Rain showers: moderate
    82: 'rain', // Rain showers: violent
    85: 'snow', // Snow showers slight
    86: 'snow', // Snow showers heavy
    95: 'thunderstorms', // Thunderstorm: Slight or moderate
    96: 'thunderstorms', // Thunderstorm with slight hail
    99: 'thunderstorms' // Thunderstorm with heavy hail
  };

  const condition = weatherMap[code] || 'clear';
  
  // Iconos que no diferencian día/noche
  const noTimeIcons = ['cloudy', 'fog', 'rain', 'snow', 'hail', 'thunderstorms', 'drizzle', 'sleet'];
  
  if (noTimeIcons.includes(condition)) {
    return condition;
  }
  
  // Combina prefijo de tiempo con condición si es necesario
  if (condition === 'clear') {
    return timePrefix === 'day' ? 'clear-day' : 'clear-night';
  }
  
  return `${timePrefix}-${condition}`; // ej. day-partly-cloudy
};

export const getWeatherDescription = (code) => {
  const descriptions = {
    0: 'Despejado',
    1: 'Mayormente despejado',
    2: 'Parcialmente nublado',
    3: 'Nublado',
    45: 'Niebla',
    48: 'Niebla con escarcha',
    51: 'Llovizna ligera',
    53: 'Llovizna moderada',
    55: 'Llovizna densa',
    56: 'Llovizna helada ligera',
    57: 'Llovizna helada densa',
    61: 'Lluvia ligera',
    63: 'Lluvia moderada',
    65: 'Lluvia fuerte',
    66: 'Lluvia helada ligera',
    67: 'Lluvia helada fuerte',
    71: 'Nieve ligera',
    73: 'Nieve moderada',
    75: 'Nieve fuerte',
    77: 'Granizo de nieve',
    80: 'Chubascos de lluvia ligeros',
    81: 'Chubascos de lluvia moderados',
    82: 'Chubascos de lluvia violentos',
    85: 'Chubascos de nieve ligeros',
    86: 'Chubascos de nieve fuertes',
    95: 'Tormenta eléctrica',
    96: 'Tormenta eléctrica con granizo ligero',
    99: 'Tormenta eléctrica con granizo fuerte'
  };

  return descriptions[code] || 'Desconocido';
};
