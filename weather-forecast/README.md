# Weather Forecast for Jakarta (5 Days)

Menampilkan prakiraan cuaca kota Jakarta untuk 5 hari ke depan menggunakan OpenWeatherMap API gratis (5 Day / 3 Hour Forecast).

## Persyaratan
- Node.js (v18+)

## Cara Menjalankan

1. Dapatkan API Key gratis di [OpenWeatherMap](https://openweathermap.org/api).
2. Anda dapat menyediakan API Key melalui salah satu cara berikut:

### Opsi A: Menggunakan file `.env` (Direkomendasikan)
Salin `.env.example` ke `.env` lalu isi API key Anda:
```bash
cp weather-forecast/.env.example weather-forecast/.env
```
Isi file `weather-forecast/.env`:
```env
OPENWEATHER_API_KEY=api_key_anda
```
Lalu jalankan:
```bash
node weather-forecast/index.js
```

### Opsi B: Menggunakan Environment Variable
```bash
OPENWEATHER_API_KEY=api_key_anda node weather-forecast/index.js
```

### Opsi C: Menggunakan Argumen CLI
```bash
node weather-forecast/index.js api_key_anda
```

## Contoh Output
```text
Weather Forecast:
Fri, 23 Apr 2021: 16.72°C
Sat, 24 Apr 2021: 18.57°C
Sun, 25 Apr 2021: 22.35°C
Mon, 26 Apr 2021: 20.42°C
Tue, 27 Apr 2021: 23.46°C
Wed, 28 Apr 2021: 22.07°C
```
