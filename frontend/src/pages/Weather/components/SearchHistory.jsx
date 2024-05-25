import { Divider, Row, Col, Space, Typography, Button } from 'antd';
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import { useCallback } from 'react';

const { Title, Text } = Typography;

/*
  historyData: Arrary of Object {"city": str, "country": str, "time": number}
*/
const SearchHistory = ({ historyData, setHistoryData, searchHandler }) => {

  const deleteHistoryData = useCallback((targetIdx) => {
    setHistoryData(data => data.filter((item, idx) => idx !== targetIdx));
  }, [setHistoryData]);

  const renderHistoryData = useCallback(() => {
    if (!historyData || historyData.length == 0) {
      return (
        <Text
          style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: "large", margin: "5%" }}
        >
          No Record
        </Text>
      );
    }

    return historyData.map((item, idx) => {
      return (
        <div key={idx}>
          <Row
            style={{ marginTop: "0.8%", marginBottom: "0.5%", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <Col span={16}>
              <Text>{`${idx + 1}. ${item["City"]}, ${item["Country"]}`}</Text>
            </Col>
            <Col span={4}>
              <Text>{item["Time"]}</Text>
            </Col>
            <Col span={2}>
              <Button shape="circle" icon={<SearchOutlined />} style={{ background: "#EAEAEA" }} onClick={() => searchHandler(item)} />
            </Col>
            <Col span={2}>
              <Button shape="circle" icon={<DeleteOutlined />} style={{ background: "#EAEAEA" }} onClick={() => deleteHistoryData(idx)} />
            </Col>
          </Row>
          <Divider style={{ margin: 0, borderBottom: "0.5px solid", opacity: "50%" }} />
        </div>
      );
    });
  }, [historyData, deleteHistoryData, searchHandler]);

  return (
    <Space direction="vertical" style={{ marginLeft: 0, marginTop: "1.2%", width: "100%" }}>
      <Title level={3} style={{ margin: 0 }}>
        Search History
      </Title>
      <Divider style={{ margin: 0, borderBottom: "1.5px solid" }} />
      {renderHistoryData()}
    </Space>
  );
};

export default SearchHistory;