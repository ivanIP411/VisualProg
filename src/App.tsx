import { useState, useEffect } from 'react';
import CurrentWeather from './components/Current';
import WeatherDetails from './components/detail';
import HourlyForecast from './components/Hours';
import DailyForecast from './components/Days';
import CitySelector from './components/City';
import { getCoordinates, getCurrentWeather, getForecast } from './api/Api';
import './App.css';

function App() {
    const [current, setCurrent] = useState<any>(null);
    const [hourly, setHourly] = useState<any[]>([]);
    const [daily, setDaily] = useState<any[]>([]);
    const [city, setCity] = useState('Москва');
    const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);

    const fetchAllData = async (cityName: string) => {
        try {
            const geo = await getCoordinates(cityName);
            setCity(geo.name);
            setCoords({ lat: geo.lat, lon: geo.lon });
            
            const weather = await getCurrentWeather(geo.lat, geo.lon);
            setCurrent(weather);
            
            const forecast = await getForecast(geo.lat, geo.lon);
            setHourly(forecast.hourly);
            setDaily(forecast.daily);
        } catch (err) {
            console.error('Ошибка:', err);
        }
    };

    useEffect(() => {
        if (!coords) return;
        const interval = setInterval(async () => {
            const weather = await getCurrentWeather(coords.lat, coords.lon);
            const forecast = await getForecast(coords.lat, coords.lon);
            setCurrent(weather);
            setHourly(forecast.hourly);
            setDaily(forecast.daily);
        }, 3 * 60 * 60 * 1000);
        return () => clearInterval(interval);
    }, [coords]);

    useEffect(() => {
        fetchAllData('Москва');
    }, []);

    const bgClass = current?.weather[0]?.main === 'Clear' ? 'sunny' : current?.weather[0]?.main === 'Clouds' ? 'clouds' : current?.weather[0]?.main === 'Rain' ? 'rain' : current?.weather[0]?.main === 'Snow' ? 'snow' : 'default';
    return (
        <div className="app">
            <div className={`phone ${bgClass}`}>
                <CitySelector onSelect={fetchAllData} />
                {current && <CurrentWeather data={current} city={city} />}
                {hourly.length > 0 && <HourlyForecast data={hourly} />}
                {current && <WeatherDetails weather={current} />}
                {daily.length > 0 && <DailyForecast data={daily} />}
            </div>
        </div>
    );
}

export default App;