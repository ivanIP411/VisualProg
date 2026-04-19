export type WeatherData = {
    temp: number;
    humidity: number;
    wind_speed: number;
    pressure: number;
    uvi?: number;
    weather: {
        icon: string;
        main: string;
    }[];
};

export type HoursData = {
    dt: number;
    temp: number;
    weather: { icon: string }[];
};

export type DaysData = {
    dt: number;
    temp: { day: number };
    weather: { icon: string }[];
};