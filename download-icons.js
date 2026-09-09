import fs from 'fs';
import https from 'https';
import path from 'path';

const icons = [
  { name: 'clear-day', url: 'https://raw.githubusercontent.com/basmilius/weather-icons/master/design/fill/animation-ready/clear-day.svg' },
  { name: 'clear-night', url: 'https://raw.githubusercontent.com/basmilius/weather-icons/master/design/fill/animation-ready/clear-night.svg' },
  { name: 'cloudy', url: 'https://raw.githubusercontent.com/basmilius/weather-icons/master/design/fill/animation-ready/cloudy.svg' },
  { name: 'day-partly-cloudy', url: 'https://raw.githubusercontent.com/basmilius/weather-icons/master/design/fill/animation-ready/partly-cloudy-day.svg' },
  { name: 'night-partly-cloudy', url: 'https://raw.githubusercontent.com/basmilius/weather-icons/master/design/fill/animation-ready/partly-cloudy-night.svg' },
  { name: 'rain', url: 'https://raw.githubusercontent.com/basmilius/weather-icons/master/design/fill/animation-ready/rain.svg' },
  { name: 'drizzle', url: 'https://raw.githubusercontent.com/basmilius/weather-icons/master/design/fill/animation-ready/drizzle.svg' },
  { name: 'thunderstorms', url: 'https://raw.githubusercontent.com/basmilius/weather-icons/master/design/fill/animation-ready/thunderstorms.svg' },
  { name: 'snow', url: 'https://raw.githubusercontent.com/basmilius/weather-icons/master/design/fill/animation-ready/snow.svg' },
  { name: 'sleet', url: 'https://raw.githubusercontent.com/basmilius/weather-icons/master/design/fill/animation-ready/sleet.svg' },
  { name: 'fog', url: 'https://raw.githubusercontent.com/basmilius/weather-icons/master/design/fill/animation-ready/fog.svg' },
  { name: 'hail', url: 'https://raw.githubusercontent.com/basmilius/weather-icons/master/design/fill/animation-ready/hail.svg' },
];

const dir = path.join(process.cwd(), 'public', 'meteocons');

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

icons.forEach(icon => {
  const filePath = path.join(dir, `${icon.name}.svg`);
  const file = fs.createWriteStream(filePath);
  
  https.get(icon.url, (response) => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded ${icon.name}.svg`);
    });
  }).on('error', (err) => {
    fs.unlink(filePath, () => {});
    console.error(`Error downloading ${icon.name}.svg: ${err.message}`);
  });
});