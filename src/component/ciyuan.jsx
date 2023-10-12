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
} from 'antd'
import Sider from 'antd/es/layout/Sider'
import axios from 'axios'
import moment from 'moment'
import { http } from '../utils/http'
const CiYun = () => {
  const domRef = useRef()

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
        width: '100%',
        height: '100%',
        sizeRange: [20, 70],
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
  useEffect(() => {
    var myChart = echarts.init(domRef.current)
    // 绘制图表
    myChart.setOption(option)
  })
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
    // {
    //   label: '栏1',
    //   options: [
    //     {
    //       label: '普通名词',
    //       value: 'n',
    //     },
    //     {
    //       label: '其他专名',
    //       value: 'nz',
    //     },
    //     {
    //       label: '形容词',
    //       value: 'a',
    //     },
    //     {
    //       label: '数量词',
    //       value: 'm',
    //     },
    //     {
    //       label: '连词',
    //       value: 'c',
    //     },
    //     {
    //       label: '人名',
    //       value: 'PER',
    //     },
    //   ],
    // },
    // {
    //   label: '栏2',
    //   options: [
    //     {
    //       label: '方位名词',
    //       value: 'f',
    //     },
    //     {
    //       label: '普通动词',
    //       value: 'v',
    //     },
    //     {
    //       label: '副形词',
    //       value: 'ad',
    //     },
    //     {
    //       label: '量词',
    //       value: 'q',
    //     },
    //     {
    //       label: '助词',
    //       value: 'u',
    //     },
    //     {
    //       label: '地名',
    //       value: 'LOC',
    //     },
    //   ],
    // },
    // {
    //   label: '栏3',
    //   options: [
    //     {
    //       label: '处所名词',
    //       value: 's',
    //     },
    //     {
    //       label: '动副词',
    //       value: 'vd',
    //     },
    //     {
    //       label: '名形词',
    //       value: 'an',
    //     },
    //     {
    //       label: '代词',
    //       value: 'r',
    //     },
    //     {
    //       label: '其他虚词',
    //       value: 'xc',
    //     },
    //     {
    //       label: '机构名',
    //       value: 'ORG',
    //     },
    //   ],
    // },
    // {
    //   label: '栏4',
    //   options: [
    //     {
    //       label: '作品名',
    //       value: 'nw',
    //     },
    //     {
    //       label: '名动词',
    //       value: 'vn',
    //     },
    //     {
    //       label: '副词',
    //       value: 'd',
    //     },
    //     {
    //       label: '介词',
    //       value: 'p',
    //     },
    //     {
    //       label: '标点符号',
    //       value: 'w',
    //     },
    //     {
    //       label: '时间',
    //       value: 'TIME',
    //     },
    //   ],
    // },
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
          <div ref={domRef} style={{ width: '100%', height: '100%' }}></div>
        </div>
      </div>
    </>
  )
}
export default CiYun
