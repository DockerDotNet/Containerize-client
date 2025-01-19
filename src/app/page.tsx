"use client";
import {Card, Col, Flex, Row, Typography} from "antd";
import {FaChartPie, FaLaptopCode, FaLayerGroup, FaNetworkWired, FaServer} from "react-icons/fa6";
import {GrStorage} from "react-icons/gr";

const { Title } = Typography;

export default function Home() {
  return (
      <Row gutter={[16,16]}>
          <Col span={6}>
              <Card>
                  <Flex align="center" gap={16}>
                      <div className="text-2xl flex items-center justify-center rounded-md h-12 w-12 bg-red-200">
                          <FaServer />
                      </div>
                      <div>
                          <Title level={4} style={{ marginBottom: 0 }}>
                              24
                          </Title>
                          <Typography>Containers</Typography>
                      </div>
                  </Flex>
              </Card>
          </Col>
          <Col span={6}>
              <Card>
                  <Flex align="center" gap={16}>
                      <div className="text-2xl flex items-center justify-center rounded-md h-12 w-12 bg-green-200">
                          <FaLaptopCode />
                      </div>
                      <div>
                          <Title level={4} style={{ marginBottom: 0 }}>
                              56
                          </Title>
                          <Typography>Images</Typography>
                      </div>
                  </Flex>
              </Card>
          </Col>
          <Col span={6}>
              <Card>
                  <Flex align="center" gap={16}>
                      <div className="text-2xl flex items-center justify-center rounded-md h-12 w-12 bg-yellow-200">
                          <GrStorage />
                      </div>
                      <div>
                          <Title level={4} style={{ marginBottom: 0 }}>
                              17
                          </Title>
                          <Typography>Volumes</Typography>
                      </div>
                  </Flex>
              </Card>
          </Col>
          <Col span={6}>
              <Card>
                  <Flex align="center" gap={16}>
                      <div className="text-2xl flex items-center justify-center rounded-md h-12 w-12 bg-blue-200">
                          <FaNetworkWired />
                      </div>
                      <div>
                          <Title level={4} style={{ marginBottom: 0 }}>
                              3
                          </Title>
                          <Typography>Networks</Typography>
                      </div>
                  </Flex>
              </Card>
          </Col>
          <Col span={6}>
              <Card>
                  <Flex align="center" gap={16}>
                      <div className="text-2xl flex items-center justify-center rounded-md h-12 w-12 bg-blue-200">
                          <FaLayerGroup />
                      </div>
                      <div>
                          <Title level={4} style={{ marginBottom: 0 }}>
                              3
                          </Title>
                          <Typography>Stack</Typography>
                      </div>
                  </Flex>
              </Card>
          </Col>
          <Col span={6}>
              <Card>
                  <Flex align="center" gap={16}>
                      <div className="text-2xl flex items-center justify-center rounded-md h-12 w-12 bg-blue-200">
                          <FaChartPie />
                      </div>
                      <div>
                          <Title level={4} style={{ marginBottom: 0 }}>
                              3 GB
                          </Title>
                          <Typography>Storage</Typography>
                      </div>
                  </Flex>
              </Card>
          </Col>
      </Row>
  );
}
