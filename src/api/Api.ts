const API_KEY = 'c0910348ec4b66b6c405f249bd3a7f3b';

export async function getCoordinates(cityName: string) {
    const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}&lang=ru`);
    const data = await res.json();
    return {
        lat: data[0].lat,
        lon: data[0].lon,
        name: data[0].name,
        country: data[0].country
    };
}

export async function getCurrentWeather(lat: number, lon: number) {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=ru`);
    const data = await res.json();
    return {
        temp: Math.round(data.main.temp),
        humidity: data.main.humidity,
        wind_speed: data.wind.speed,
        pressure: data.main.pressure,
        weather: [{
            icon: data.weather[0].icon,
            main: data.weather[0].main}]
    };
}

export async function getForecast(lat: number, lon: number) {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=ru`);
    const data = await res.json();
    
    const hourly = data.list.slice(0, 6).map((item: any) => ({
        dt: item.dt,
        temp: Math.round(item.main.temp),
        weather: [{ icon: item.weather[0].icon }]}));
    
    const dailyMap = new Map();
    data.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000);
        const dayKey = date.toLocaleDateString('ru-RU');
        if (!dailyMap.has(dayKey)) {
            dailyMap.set(dayKey, {
                dt: item.dt,
                temp: { day: Math.round(item.main.temp) },
                weather: [{ icon: item.weather[0].icon }]
            });
        }
    });
    const daily = Array.from(dailyMap.values()).slice(0, 5);
    
    return { hourly, daily };
}