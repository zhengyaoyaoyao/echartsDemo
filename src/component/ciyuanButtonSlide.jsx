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
const CiYunButtonSlide = () => {
  const domRef = useRef()

  const [dataJson, setDataJson] = useState([])
  const [date, setDate] = useState('20230901')
  const option = {
    // backgroundColor: '#000000',
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
        rotationStep: 1,
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
          rotation: function () {
            // 让中间的词不旋转，其他词随机旋转
            return this.name === keyword ? 0 : (Math.random() - 0.5) * 180
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
  }, [dataJson])
  const SubmittedForm = (value) => {
    console.log(value)
    const formData = new FormData()
    if (keyword) {
      formData.append('targetWord', keyword)
      formData.append('frequen1', value.frequen1)
      formData.append('frequen2', value.frequen2)
      formData.append('dependenDistance', value.dependenDistance)
      formData.append('levelOneTopK', lOneTopK)
      formData.append('levelTwoTopK', lTwoTopK)
      formData.append('date', date)
      // formData.append('extraNote', value.extraNote ? value.extraNote : '')
      formData.append('wordType', value.wordType ? value.wordType : [])
      onFinish(formData)
    }
  }
  const onFinish = async (value) => {
    const result = await http.post('/api/sentInfo', value)
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

  //控制
  const OnchangeCarousel = (value) => {
    setDate(value)
    if (form.getFieldValue('targetWord') !== null) {
      // setIsSegmentedDisabled(true) // 禁用Segmented
      //模拟延迟
      // await new Promise((resolve) => setTimeout(resolve, 0))
      const formData = new FormData()
      formData.append('targetWord', keyword)
      formData.append('frequen1', form.getFieldValue('frequen1'))
      formData.append('frequen2', form.getFieldValue('frequen2'))
      formData.append('levelOneTopK', form.getFieldValue('levelOneTopK'))
      formData.append('levelTwoTopK', form.getFieldValue('levelTwoTopK'))
      formData.append(
        'dependenDistance',
        form.getFieldValue('dependenDistance')
      )

      formData.append('date', value)
      // formData.append(
      //   'extraNote',
      //   form.getFieldValue('extraNote') ? form.getFieldValue('extraNote') : ''
      // )
      formData.append(
        'wordType',
        form.getFieldValue('wordType') ? form.getFieldValue('wordType') : []
      )
      console.log(value)
      setDate(value)
      onFinish(formData)
      // setIsSegmentedDisabled(false) // 启用Segmented
    }
  }
  const [form] = Form.useForm()
  //信息控制
  const [keyword, setKeyword] = useState()
  const [lOneTopK, setLOneTopK] = useState()
  const [lTwoTopK, setLTwoTopK] = useState()
  //控制表单
  const [isSegmentedDisabled, setIsSegmentedDisabled] = useState(true)
  const handleTargetWordChangeWord = (_, value) => {
    const targetWord = value.targetWord
    setKeyword(targetWord)
    setIsSegmentedDisabled(!targetWord)
  }
  const handleTargetWordChangeLevelOneTopK = (_, value) => {
    const levelOneTopK = value.levelOneTopK
    setLOneTopK(levelOneTopK)
    setIsSegmentedDisabled(!levelOneTopK)
  }
  const handleTargetWordChangeLevelTwoTopK = (_, value) => {
    const levelTwoTopK = value.levelTwoTopK
    setLTwoTopK(levelTwoTopK)
    setIsSegmentedDisabled(!levelTwoTopK)
  }
  //表单默认值
  const initValue = {
    targetWord: '微信',
    levelOneTopK: 5,
    levelTwoTopK: 10,
    frequen1: 0,
    frequen2: 5000,
    dependenDistance: 10,
    wordType: ['n', 'a', 'd', 'q', 'v'],
  }
  return (
    <>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: '1', padding: '50px', paddingTop: '150px' }}>
          <Form
            name="basic"
            onFinish={SubmittedForm}
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            initialValues={initValue}
            form={form}
            onFieldsChange={(changedFields) => {
              // 监听targetWord字段的变化
              if (changedFields && changedFields.length > 0) {
                handleTargetWordChangeWord(
                  changedFields[0],
                  form.getFieldsValue()
                )
                handleTargetWordChangeLevelOneTopK(
                  changedFields[1],
                  form.getFieldsValue()
                )
                handleTargetWordChangeLevelTwoTopK(
                  changedFields[2],
                  form.getFieldsValue()
                )
              }
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
            <Form.Item
              label="一级Top："
              name="levelOneTopK"
              rules={[
                {
                  required: true,
                  message: '请输入一级Top值',
                },
                {
                  validator: (_, value) => {
                    if (value > 0) {
                      return Promise.resolve()
                    }
                    return Promise.reject('一级Top值必须大于0，否则无信息')
                  },
                },
              ]}>
              <Input></Input>
            </Form.Item>
            <Form.Item
              label="二级Top："
              name="levelTwoTopK"
              rules={[
                {
                  required: true,
                  message: '请输入二级Top值',
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

          <Segmented
            value={date}
            onChange={OnchangeCarousel}
            options={[
              '20230901',
              '20230902',
              '20230903',
              '20230904',
              '20230905',
              '20230906',
              '20230907',
            ]}
            disabled={isSegmentedDisabled}
          />
        </div>
      </div>
    </>
  )
}
export default CiYunButtonSlide
