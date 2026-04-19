import type { DaysData } from '../type/weather';

function Days({ data }: { data: DaysData[] }) {
    return (
        <div className="daily-list">
            {data.map((item, idx) => {
                const date = new Date(item.dt * 1000);
                const day = date.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric' });
                const icon = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;
                return (
                    <div key={idx} className="daily-card">
                        <span className="day">{day}</span>
                        <div className="daily-right">
                            <img src={icon} alt="" />
                            <span className="daily-temp">{Math.round(item.temp.day)}°</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default Days;