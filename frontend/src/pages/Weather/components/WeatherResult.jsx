import { Space, Typography } from 'antd';
import { useCallback } from 'react';

const { Title, Text } = Typography;

const WeatherResult = ({ weatherData, style }) => {
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

  if (!weatherData) {
    return <></>;
  }

  if (!("City" in weatherData)) {
    return (
      <Space.Compact direction="vertical" style={{ width: "100%", marginBottom: "3%" }}>
        <Text
          style={{ backgroundColor: "#F7E1E1", borderColor: "#E78788", borderStyle: "solid" }}
        >
          &nbsp;&nbsp;Not Found
        </Text>
      </Space.Compact>
    );
  }

  return (
    <Space.Compact direction="vertical" style={{ marginLeft: "2%" }}>
      <Text>{`${weatherData["City"]}, ${weatherData["Country"]}`}</Text>
      <Title level={1} style={{ margin: 0, marginBottom: "5%" }}>
        Cloudy
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
