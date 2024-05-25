import { Card, Typography, Layout, Space, theme } from 'antd';
import CityForm from './components/CityForm';
import WeatherResult from './components/WeatherResult';
import SearchHistory from './components/SearchHistory';
import { useCallback, useEffect, useState } from 'react';
const { Header, Content, Footer } = Layout;

const { Title } = Typography;

const maxHistoryDataLength = 10;
const localStorageSearchHistoryKey = "search-history";

const Weather = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

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

  const cityFormSubmitHandler = useCallback((values) => {
    console.log('Success:', values);
    // Mock API result
    const newWeatherData = {
      "City": values["City"],
      "Country": values["Country"],
      "Description": "Description - value",
      "Temperature": "Temperature - value",
      "Humidity": "Humidity - value",
      "Time": "200022222222222",
    };
    setWeatherData(newWeatherData);
    setHistoryData((data) => {
      const newData = [
        { City: values["City"], Country: values["Country"], Time: new Date().toUTCString() },
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
          padding: '0 28px',
        }}
      >
        <Card
        // style={{
        //   padding: 24,
        //   minHeight: 380,
        //   background: colorBgContainer,
        //   borderRadius: borderRadiusLG,
        // }}
        >
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
