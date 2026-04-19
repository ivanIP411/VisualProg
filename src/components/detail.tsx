import type { WeatherData } from '../type/weather';

function WeatherDetails({ weather }: { weather: WeatherData }) {
    const pressureMm = Math.round(weather.pressure * 0.750062);
    
    return (
        <div className="weather-details">
            <div className="detail-item">
                <span className="detail-label">Humidity</span>
                <strong className="detail-value">{weather.humidity}%</strong>
            </div>
            <div className="detail-item">
                <span className="detail-label">Wind</span>
                <strong className="detail-value">{weather.wind_speed} m/s</strong>
            </div>
            <div className="detail-item">
                <span className="detail-label">Air Pressure</span>
                <strong className="detail-value">{pressureMm} mm</strong>
            </div>
            <div className="detail-item">
                <span className="detail-label">UV</span>
                <strong className="detail-value">—</strong>
            </div>
        </div>
    );
}

export default WeatherDetails;