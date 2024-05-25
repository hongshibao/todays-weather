# todays-weather

## Design

Architecture and Flow:

![Architecture](todays-weather-flow.jpg "Overall Architecture")

This code repo includes both frontend and backend.

### Backend

The backend is implemented using Python:

* [FastAPI](https://fastapi.tiangolo.com/) is used as the web framework for building APIs due to its high performance.
* Redis is used to cache `/weather` API results with TTL.

### Frontend

The frontend is implemented using [React.js](https://react.dev/), and [Vite](https://vitejs.dev/) is used to generate the project template.

* Search history data is stored in `localStorage` of browsers.
* The `Weather` page component is inside [frontend/src/pages](./frontend/src/pages/) folder. It includes sub components `CityForm`, `WeatherResult`, and `SearchHistory`, to handle the three main business logic: city and country input and submit, weather info display, and search history management.

## UI Walk Through

0. The first time accessing the web UI:

![ui-0](./images/ui-0.jpg "ui-0")

1. Input City to query current weather:

![ui-1](./images/ui-1.jpg "ui-1")

2. Input City and Country to query current weather:

![ui-2](./images/ui-2.jpg "ui-2")

3. Input an invalid City:

![ui-3](./images/ui-3.jpg "ui-3")

4. Click the delete button of the first entry in Search History:

![ui-4](./images/ui-4.jpg "ui-4")

5. Click the search button of the second entry in Search History:

![ui-5](./images/ui-5.jpg "ui-5")

6. Slow query of weather info, a spin icon will display:

![ui-6](./images/ui-6.jpg "ui-6")

7. Mock backend error:

![ui-7](./images/ui-7.jpg "ui-7")
