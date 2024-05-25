import { Space, Typography, Spin } from 'antd';
import { useCallback } from 'react';

const { Title, Text } = Typography;

/*
The WeatherResult component is to display the result weather information.
  weatherData: object {City: str, Country: str, Group: str, Description: str, Temperature: str, Humidity: str, Time: str}
                weatherData is null means not need to display
                if Error is inside weatherData, then display Error text (e.g. Not Found)
  loading: whether weatherData is in loading. Display Spin icon on weatherData loading
*/
const WeatherResult = ({ weatherData, loading }) => {
  const renderWeatherDataFields = useCallback(() => {
    const fieldNames = ["Description", "Temperature", "Humidity", "Time"];
    let maxFieldWidth = 0;
    for (const fieldName of fieldNames) {
      maxFieldWidth = Math.max(maxFieldWidth, fieldName.length);
    }
    return fieldNames.map((fieldName) => {
      return (
        <tr key={fieldName}>
          <td width={`${maxFieldWidth + 90}px`}>{fieldName}:</td>
          <td>{weatherData[fieldName]}</td>
        </tr>
      );
    });
  }, [weatherData]);

  // weatherData is null, nothing displayed
  if (!weatherData) {
    return <></>;
  }

  if (loading) {
    return <Spin size="large" />;
  }

  // Display error info
  if ("Error" in weatherData) {
    return (
      <Space.Compact direction="vertical" style={{ width: "100%", marginBottom: "3%" }}>
        <Text
          style={{ backgroundColor: "#F7E1E1", borderColor: "#E78788", borderStyle: "solid" }}
        >
          &nbsp;&nbsp;{weatherData.Error}
        </Text>
      </Space.Compact>
    );
  }

  return (
    <Space.Compact direction="vertical" style={{ marginLeft: "2%" }}>
      <Text>{`${weatherData.City}, ${weatherData.Country}`}</Text>
      <Title level={1} style={{ margin: 0, marginBottom: "5%" }}>
        {weatherData.Group}
      </Title>
      <table>
        <tbody>
          {renderWeatherDataFields()}
        </tbody>
      </table>
    </Space.Compact>
  );
};

export default WeatherResult;
