import type { HoursData } from '../type/weather';

function HourlyForecast({ data }: { data: HoursData[] }) {
    return (
        <div className="hourly-grid">
            {data.map((item, idx) => {
                const date = new Date(item.dt * 1000);
                const hour = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
                const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;
                return (
                    <div key={idx} className="hourly-card">
                        <div className="hour">{hour}</div>
                        <img src={iconUrl} alt="" />
                        <div className="hourly-temp">{item.temp}°</div>
                    </div>
                );
            })}
        </div>
    );
}

export default HourlyForecast;