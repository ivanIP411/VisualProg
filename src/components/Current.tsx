import type { WeatherData } from '../type/weather';

function CurrentWeather({data, city}: {data: WeatherData; city: string}) {
    const date = new Date();
    const day = date.toLocaleDateString('ru-RU', {weekday: 'long', day: 'numeric', month: 'long'});
    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    
    return (
        <div className="current">
            <div className="date">{day}</div>
            <div className="main-row">
                <div className="temp-city">
                    <div className="city">{city}</div>
                    <div className="temp">{data.temp}°</div>
                </div>
                <div className="weather-icon">
                    <img src={iconUrl} alt="" />
                </div>
            </div>
        </div>
    );
}

export default CurrentWeather;