import { Card, Typography, Layout, Space } from 'antd';
import CityForm from './components/CityForm';
import WeatherResult from './components/WeatherResult';
import SearchHistory from './components/SearchHistory';
import { getWeather } from '../../services/WeatherAPI';
import { useCallback, useEffect, useState } from 'react';
const { Header, Content, Footer } = Layout;

const { Title } = Typography;

const maxHistoryDataLength = 10;
const localStorageSearchHistoryKey = "search-history";

// Format date input
function formatDate(inputDate, format) {
  if (!inputDate) return '';

  const padZero = (value) => (value < 10 ? `0${value}` : `${value}`);
  const parts = {
    yyyy: inputDate.getUTCFullYear(),
    MM: padZero(inputDate.getUTCMonth() + 1),
    dd: padZero(inputDate.getUTCDate()),
    HH: padZero(inputDate.getUTCHours()),
    hh: padZero(inputDate.getUTCHours() > 12 ? inputDate.getUTCHours() - 12 : inputDate.getUTCHours()),
    mm: padZero(inputDate.getUTCMinutes()),
    ss: padZero(inputDate.getUTCSeconds()),
    tt: inputDate.getUTCHours() < 12 ? 'AM' : 'PM'
  };

  return format.replace(/yyyy|MM|dd|HH|hh|mm|ss|tt/g, (match) => parts[match]);
}

// Timestamp to date string
const timestampToDateString = (ts, timezoneOffset, format) => {
  const d = new Date((ts + timezoneOffset) * 1000);
  return formatDate(d, format);
};

// Weather component for the main Weather page
const Weather = () => {
  const [historyData, setHistoryData] = useState(() => {
    // Getting stored value from localStorage to initialize search historyData
    const saved = localStorage.getItem(localStorageSearchHistoryKey);
    const initialValue = JSON.parse(saved);
    return initialValue || [];
  });
  const [weatherData, setWeatherData] = useState(null);

  // Save search historyData to localStorage
  useEffect(() => {
    localStorage.setItem(localStorageSearchHistoryKey, JSON.stringify(historyData));
  }, [historyData]);

  const cityFormSubmitHandler = useCallback(async (values) => {
    let resp = {};
    // Call weather API
    try {
      resp = await getWeather(values.City, values.Country);
    } catch (err) {
      // Exception found, set Error info
      resp = { Error: "Service Unavailable" }
    }

    let newWeatherData = {};
    if (resp.Error) {
      newWeatherData = { Error: resp.Error };
    } else {
      newWeatherData = { City: values.City, Country: values.Country, ...resp.Report };
      newWeatherData.Time = timestampToDateString(resp.Report.Time, resp.Report.Timezone, "yyyy-MM-dd hh:mm tt");
    }
    // Update weatherData
    setWeatherData(newWeatherData);
    // Update search historyData
    setHistoryData((data) => {
      const currentDate = new Date();
      const newData = [
        {
          City: values.City,
          Country: values.Country,
          Time: timestampToDateString(currentDate.getTime() / 1000, -currentDate.getTimezoneOffset() * 60, "hh:mm:ss tt"),
        },
        ...data
      ];
      if (newData.length > maxHistoryDataLength) {
        newData.pop();
      }
      return newData;
    });
  }, [setWeatherData, setHistoryData]);

  return (
    <Layout>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'white',
          marginBottom: '8px'
        }}
      >
        <Title level={3} style={{ margin: 0 }}>{`Today's Weather`}</Title>
      </Header>
      <Content
        style={{
          padding: '0 8px',
        }}
      >
        <Card>
          <Space direction="vertical" style={{ width: "100%" }}>
            <CityForm submitHandler={cityFormSubmitHandler} />
            <WeatherResult weatherData={weatherData} />
            <SearchHistory
              historyData={historyData}
              setHistoryData={setHistoryData}
              searchHandler={cityFormSubmitHandler}
            />
          </Space>
        </Card>
      </Content>
      <Footer
        style={{
          textAlign: 'center',
        }}
      >
        {`Today's Weather @${new Date().getFullYear()} Created by Shibao Hong`}
      </Footer>
    </Layout>
  );
};

export default Weather;
