# todays-weather

This is an app to query current weather for cities in the world. It calls OpenWeather API to get weather information.

## Set Up

Prerequisites:
* [Docker](https://docs.docker.com/get-docker/).
* [Docker Compose](https://docs.docker.com/compose/install/). Please make sure your docker-compose supports Compose file format [version 3.x](https://docs.docker.com/compose/compose-file/compose-versioning/).

To deploy using Docker Compose:

1. Create a `.env` file with content `OPEN_WEATHER_API_KEY=your_open_weather_api_key`. You can also run `export OPEN_WEATHER_API_KEY=your_open_weather_api_key` to set the env var. Please replace `your_open_weather_api_key` with your real API key. You can also use the API key I sent in the email.

2. Run the following command to launch containers:

    ```bash
    docker-compose up
    # or `docker compose up` if docker-compose is installed as a Docker CLI plugin
    ```

3. Now access [http://localhost:11180/ui/](http://localhost:11180/ui/). You should be able to see the Web UI.

In this deployment, [NGINX](https://www.nginx.com/) is used as a reverse proxy for the frontend and backend services.

## Design

Please refer to this [doc](./DESIGN.md).
