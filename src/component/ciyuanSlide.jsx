import React, { useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'
import 'echarts-wordcloud'
import { Content } from 'antd/es/layout/layout'
import {
  Form,
  Layout,
  Input,
  DatePicker,
  Select,
  Button,
  Row,
  Col,
  Segmented,
  Carousel,
} from 'antd'
import Sider from 'antd/es/layout/Sider'
import axios from 'axios'
import moment from 'moment'
import { http } from '../utils/http'

const CiYunSlide = () => {
  // const domRef = useRef()
  const [dataJson, setDataJson] = useState([])
  const option = {
    title: {
      text: '词云',
    },
    tooltip: {},
    series: [
      {
        type: 'wordCloud',
        shape: 'square',
        keepAspect: false,
        width: '50%',
        height: '50%',
        sizeRange: [20, 50],
        rotationRange: [-90, 90],
        rotationStep: 45,
        gridSize: 5,
        shrinkToFit: false,
        layoutAnimation: true,
        textStyle: {
          fontFamily: 'sans-serif',
          fontWeight: 'bold',
          color: (params) => {
            // 创建一个包含十种不同黄色的颜色数组
            //level1
            const yellowColors = [
              '#FFFF00',
              '#FFEC8B',
              '#FFD700',
              '#FFC125',
              '#FFA500',
              '#FF8C00',
              '#FF7F00',
              '#FF6347',
              '#FF4500',
              '#FF0000',
            ]
            //level2
            const blueColors = [
              '#0000FF',
              '#1E90FF',
              '#00BFFF',
              '#87CEEB',
              '#4682B4',
              '#5F9EA0',
              '#B0E0E6',
              '#ADD8E6',
              '#87CEFA',
              '#00CED1',
            ]
            // 根据 level 值选择相应的颜色
            if (params.data.level === 1) {
              return yellowColors[params.dataIndex % yellowColors.length]
            } else {
              return blueColors[params.dataIndex % blueColors.length] // 你可以设置其他颜色作为冷色系
            }
          },
        },
        emphasis: {
          focus: 'self',
          textStyle: {
            textShadowBlur: 10,
            textShadowColor: '#333',
          },
        },
        data: dataJson,
      },
    ],
    tooltip: {
      formatter: function (params) {
        // 自定义悬浮提示内容
        return (
          '词：' +
          params.name +
          '<br>值:' +
          params.value +
          '<br>词频：' +
          params.data.freq +
          '<br>词性：' +
          params.data.pos +
          '<br>级别：' +
          params.data.level
        )
      },
    },
  }
  const onFinish = async (value) => {
    console.log(value)

    const formData = new FormData()
    formData.append('targetWord', value.targetWord)
    formData.append('frequen1', value.frequen1)
    formData.append('frequen2', value.frequen2)
    formData.append('dependenDistance', value.dependenDistance)
    formData.append(
      'date',
      value.date
        ? moment(value.date.$d).format('YYYYMMDD')
        : moment().format('YYYYMMDD')
    )
    formData.append('extraNote', value.extraNote ? value.extraNote : '')
    formData.append('wordType', value.wordType ? value.wordType : [])
    const result = await http.post('/api/sentInfo', formData)
    if (result.data) {
      console.log('返回的数据：', result.data)
      setDataJson(result.data)
    } else {
      console.log('返回的数据:', result)
    }
  }
  //类型选择
  const options = [
    {
      label: '名词',
      value: 'n',
    },
    {
      label: '形容词',
      value: 'a',
    },
    {
      label: '动词',
      value: 'v',
    },
    {
      label: '副词',
      value: 'd',
    },
    {
      label: '量词',
      value: 'q',
    },
  ]
  const handleChange = (value) => {
    console.log(value)
  }
  //确保轮播图渲染
  const [carouselRendered, setCarouselRendered] = useState(false)
  // 初始化 ECharts 图表
  var chartItem1 = null
  var chartItem2 = null
  const chart1 = useRef(null)
  const chart2 = useRef(null)

  const chartRef1 = useRef()
  const chartRef2 = useRef()

  useEffect(() => {
    if (chartRef1.current && chartRef2.current && carouselRendered) {
      if (!chart1.current) {
        chart1.current = echarts.init(chartRef1.current)
      }
      if (!chart2.current) {
        chart2.current = echarts.init(chartRef2.current)
      }
      updateChart(0)
    }
  }, [chartRef1.current, chartRef2.current, carouselRendered])

  //控制Segmented
  const [segmentedValue, setSegmentedValue] = useState('9月1日')
  const beforeChange = (currentSlide) => {}
  const onChangeSegment = (currentSlide) => {
    console.log(currentSlide)
    setSegmentedValue(`9月${currentSlide + 1}日`)
  }
  const updateChart = (index) => {
    debugger
    if (index === 0 && chartItem1) {
      chartItem1.setOption(option)
    } else if (index === 1 && chartItem2) {
      chartItem2.setOption(option)
    }
  }
  //控制Carousel
  const contentStyle = {
    margin: 0,
    width: '1000px',
    height: '500px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
  }
  //引用Carousel
  const domRefCarousel = useRef()
  const OnchangeCarousel = (value) => {
    console.log(value)
    switch (value) {
      case '9月1日':
        domRefCarousel.current.goTo(0)
        break
      case '9月2日':
        domRefCarousel.current.goTo(1)
        break
      case '9月3日':
        domRefCarousel.current.goTo(2)
        break
      case '9月4日':
        domRefCarousel.current.goTo(3)
        break
      case '9月5日':
        domRefCarousel.current.goTo(4)
        break
      case '9月6日':
        domRefCarousel.current.goTo(5)
        break
      default:
        domRefCarousel.current.goTo(6)
        break
    }
    setSegmentedValue(value)
  }
  return (
    <>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: '1', padding: '50px', paddingTop: '150px' }}>
          <Form
            name="basic"
            onFinish={onFinish}
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}>
            <Form.Item
              label="输入"
              name="targetWord"
              rules={[
                {
                  required: true,
                  message: '请输入关键词',
                },
              ]}>
              <Input></Input>
            </Form.Item>
            <Form.Item label="频率区间">
              <Row gutter={8}>
                <Col span={10}>
                  <Form.Item
                    name="frequen1"
                    style={{ maxWidth: 'none' }}
                    rules={[
                      {
                        pattern: /^(\d+|\d+\.\d+)$/,
                        message: '请输入有效的数字',
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const frequen2Value = getFieldValue('frequen2')
                          if (
                            !value ||
                            !frequen2Value ||
                            parseFloat(value) < parseFloat(frequen2Value)
                          ) {
                            return Promise.resolve()
                          }
                          return Promise.reject('取值范围错误')
                        },
                      }),
                    ]}>
                    <Input></Input>
                  </Form.Item>
                </Col>
                <Col span={4}>-</Col>
                <Col span={10}>
                  <Form.Item
                    name="frequen2"
                    style={{ maxWidth: 'none' }}
                    rules={[
                      {
                        pattern: /^(\d+|\d+\.\d+)$/,
                        message: '请输入有效的数字',
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const frequen1Value = getFieldValue('frequen1')
                          if (
                            !value ||
                            !frequen1Value ||
                            parseFloat(value) > parseFloat(frequen1Value)
                          ) {
                            return Promise.resolve()
                          }
                          return Promise.reject('取值范围错误')
                        },
                      }),
                    ]}>
                    <Input></Input>
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>
            <Form.Item
              label="匹配词长度"
              name="dependenDistance"
              rules={[
                {
                  pattern: /^(\d+|\d+\.\d+)$/,
                  message: '请输入有效的数字',
                },
              ]}>
              <Input></Input>
            </Form.Item>
            <Form.Item label="额外信息" name="extraNote">
              <Input></Input>
            </Form.Item>
            <Form.Item label="日期" name="date">
              <DatePicker />
            </Form.Item>
            <Form.Item label="词类型" name="wordType">
              <Select
                mode="multiple"
                allowClear
                style={{
                  width: '100%',
                }}
                placeholder="Please select"
                onChange={handleChange}
                options={options}
              />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form>
        </div>
        <div
          style={{
            flex: '2',
            height: '500px',
            width: '500px',
            padding: '50px',
            paddingTop: '150px',
          }}>
          <Carousel
            ref={domRefCarousel}
            afterChange={(current) => {
              //更新segment
              onChangeSegment(current)
              //更新图表
              updateChart(current)
            }}>
            <div>
              <div ref={chartRef1} style={contentStyle}></div>
            </div>
            <div>
              <div ref={chartRef2} style={contentStyle}></div>
            </div>
            <div>
              <h3 style={contentStyle}>9月3日</h3>
            </div>
            <div>
              <h3 style={contentStyle}>9月4日</h3>
            </div>
            <div>
              <h3 style={contentStyle}>9月5日</h3>
            </div>
            <div>
              <h3 style={contentStyle}>9月6日</h3>
            </div>
            <div>
              <h3 style={contentStyle}>9月7日</h3>
            </div>
          </Carousel>
          <Segmented
            value={segmentedValue}
            onChange={OnchangeCarousel}
            options={[
              '9月1日',
              '9月2日',
              '9月3日',
              '9月4日',
              '9月5日',
              '9月6日',
              '9月7日',
            ]}
          />
        </div>
      </div>
    </>
  )
}
export default CiYunSlide
