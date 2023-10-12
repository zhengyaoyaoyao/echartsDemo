import React, { useCallback, useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'
import 'echarts-wordcloud'
import {
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  Segmented,
  Switch,
  Space,
  message,
  Slider,
  InputNumber,
} from 'antd'
import { http } from '../utils/http'
const CiYunButtonSlideGraphExpand = () => {
  //图表
  let myChart
  const domRef = useRef()
  //是否存在当天日期
  //放关系图的数据
  const [forceDataJson, setForceDataJson] = useState()
  const [links, setLinks] = useState()
  //放词云图数据
  const [cloudData, setCloudData] = useState()

  const [date, setDate] = useState('20230901')
  const categories = [{ name: '0' }, { name: '1' }, { name: '2' }]
  //关系图的Option
  const forceOption = {
    // 图的标题
    title: {
      text: '关系图',
    },
    // 提示框的配置
    tooltip: {
      // x.data.name
      formatter: function (params) {
        if (params.dataType === 'node') {
          // 节点的提示内容
          return (
            '词：' +
            params.data.name +
            '<br>值:' +
            params.data.symbolSize +
            '<br>词频：' +
            params.data.freq +
            '<br>词性：' +
            params.data.pos +
            '<br>级别：' +
            params.data.category
          )
        } else if (params.dataType === 'edge') {
          // 边的提示内容
          return '边的提示内容：' + params.data.name
        }
      },
    },
    // 工具箱
    toolbox: {
      // 显示工具箱
      show: true,
      feature: {
        mark: {
          show: true,
        },
        // 保存为图片
        saveAsImage: {
          show: true,
        },
      },
    },
    series: [
      {
        type: 'graph', // 类型:关系图
        layout: 'force', //图的布局，类型为力导图
        symbolSize: 20, // 调整节点的大小
        zoom: 0.25,
        roam: true, // 是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移,可以设置成 'scale' 或者 'move'。设置成 true 为都开启
        edgeSymbol: ['circle', 'arrow'],
        edgeSymbolSize: [2, 10],
        legend: [
          {
            selectedMode: 'none',
            data: categories.map(function (a) {
              return a.name
            }),
          },
        ],
        edgeLabel: {
          normal: {
            show: false,
          },
        },
        force: {
          repulsion: 3000,
          edgeLength: [20, 300],
          layoutAnimation: false,
        },
        draggable: false,
        lineStyle: {
          normal: {
            width: 2,
            color: '#4b565b',
          },
        },
        edgeLabel: {
          normal: {
            show: false,
            formatter: function (x) {
              return x.data.name
            },
          },
        },
        label: {
          normal: {
            show: true,
            // textStyle: {},
            formatter: function (params) {
              // params.data 包含了节点的信息，可以根据 params.data.category 来判断节点的类别
              if (params.data.category === 0) {
                return '{a|' + params.name + '}' // 使用自定义样式 a
              } else if (params.data.category === 1) {
                return '{b|' + params.name + '}' // 使用自定义样式 b
              } else {
                return '{c|' + params.name + '}' // 默认样式
              }
            },
            rich: {
              // 定义不同类别的字体样式
              a: {
                fontSize: 30, // 类别为 0 的字体大小
                // 可以设置其他样式...
              },
              b: {
                fontSize: 20, // 类别为 1 的字体大小
                // 可以设置其他样式...
              },
              c: {
                fontSize: 10,
              },
              // 可以继续定义其他类别的样式...
            },
          },
          emphasis: {
            show: true, // 鼠标悬停时显示标签
            fontSize: 20, // 鼠标悬停时的字体大小
          },
        },
        // 数据
        data: forceDataJson,
        links: links,
        categories: categories,
      },
    ],
  }
  //放扩展图的数据
  const [expandData, setExpandData] = useState()
  const [expandLinks, setExpandLinks] = useState()
  //扩展图的option
  const expandOption = {
    // 图的标题
    title: {
      text: '扩展图',
    },
    // 提示框的配置
    tooltip: {
      // x.data.name
      formatter: function (params) {
        if (params.dataType === 'node') {
          // 节点的提示内容
          return (
            '词：' +
            params.data.name +
            '<br>值:' +
            params.data.symbolSize +
            '<br>词频：' +
            params.data.freq +
            '<br>词性：' +
            params.data.pos +
            '<br>级别：' +
            params.data.category
          )
        } else if (params.dataType === 'edge') {
          // 边的提示内容
          return '边的提示内容：' + params.data.name
        }
      },
    },
    legend: {
      data: ['0', '1', '2', '3', '4', '5', '6'],
      // 设置图例的样式等其他属性...
    },
    // 工具箱
    toolbox: {
      // 显示工具箱
      show: true,
      feature: {
        mark: {
          show: true,
        },
        // 保存为图片
        saveAsImage: {
          show: true,
        },
      },
    },
    series: [
      {
        type: 'graph', // 类型:关系图
        layout: 'force', //图的布局，类型为力导图
        symbolSize: 5, // 调整节点的大小
        zoom: 0.15,
        roam: true, // 是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移,可以设置成 'scale' 或者 'move'。设置成 true 为都开启
        edgeSymbol: ['circle', 'arrow'],
        edgeSymbolSize: [2, 5],
        legend: [
          {
            selectedMode: 'none',
            data: categories.map(function (a) {
              return a.name
            }),
          },
        ],
        edgeLabel: {
          normal: {
            show: false,
          },
        },
        force: {
          repulsion: 4000,
          edgeLength: [30, 1000],
          layoutAnimation: false,
        },
        draggable: false,
        lineStyle: {
          normal: {
            width: 2,
            color: '#4b565b',
          },
        },
        edgeLabel: {
          normal: {
            show: false,
            formatter: function (x) {
              return x.data.name
            },
          },
        },
        label: {
          normal: {
            show: true,
            // textStyle: {},
            formatter: function (params) {
              // params.data 包含了节点的信息，可以根据 params.data.category 来判断节点的类别
              if (params.data.category === 0) {
                return '{a|' + params.name + '}' // 使用自定义样式 a
              } else if (params.data.category === 1) {
                return '{b|' + params.name + '}' // 使用自定义样式 b
              } else {
                return '{c|' + params.name + '}' // 默认样式
              }
            },
            rich: {
              // 定义不同类别的字体样式
              a: {
                fontSize: 10, // 类别为 0 的字体大小
                // 可以设置其他样式...
              },
              b: {
                fontSize: 10, // 类别为 1 的字体大小
                // 可以设置其他样式...
              },
              c: {
                fontSize: 10,
              },
              // 可以继续定义其他类别的样式...
            },
          },
          emphasis: {
            show: true, // 鼠标悬停时显示标签
            fontSize: 20, // 鼠标悬停时的字体大小
          },
        },
        // 数据
        data: expandData,
        links: expandLinks,
        categories: [
          {
            name: '0', // 第一级节点的类别
            itemStyle: {
              color: '#cccccc', // 设置第一级节点的颜色为
            },
            repulsion: 4000,
          },
          {
            name: '1', // 第二级节点的类别
            itemStyle: {
              color: '#d9f0a3', // 设置第二级节点的颜色为蓝色
            },
            // 设置第二级节点的 repulsion 值，这里可以根据需要调整
            repulsion: 8000,
          },
          {
            name: '2', // 第二级节点的类别
            itemStyle: {
              color: '#a6d96a', // 设置第二级节点的颜色为蓝色
            },
            // 设置第二级节点的 repulsion 值，这里可以根据需要调整
            repulsion: 8000,
          },
          {
            name: '3', // 第二级节点的类别
            itemStyle: {
              color: '#66bd63', // 设置第二级节点的颜色为蓝色
            },
            // 设置第二级节点的 repulsion 值，这里可以根据需要调整
            repulsion: 8000,
          },
          {
            name: '4', // 第二级节点的类别
            itemStyle: {
              color: '#1a9850', // 设置第二级节点的颜色为蓝色
            },
            // 设置第二级节点的 repulsion 值，这里可以根据需要调整
            repulsion: 8000,
          },
          {
            name: '5', // 第二级节点的类别
            itemStyle: {
              color: '#006837', // 设置第二级节点的颜色为蓝色
            },
            // 设置第二级节点的 repulsion 值，这里可以根据需要调整
            repulsion: 8000,
          },
          {
            name: '6', // 第二级节点的类别
            itemStyle: {
              color: '#004529', // 设置第二级节点的颜色为蓝色
            },
            // 设置第二级节点的 repulsion 值，这里可以根据需要调整
            repulsion: 8000,
          },
        ],
        nodes: [
          //第一级节点：
          {
            name: 'Node0',
            category: 0,
          },
          {
            name: 'Node1',
            category: 1, // 设置节点的 category 为 1
          },
          {
            name: 'Node2',
            category: 2, // 设置节点的 category 为 1
          },
          {
            name: 'Node3',
            category: 3, // 设置节点的 category 为 1
          },
          {
            name: 'Node4',
            category: 4, // 设置节点的 category 为 1
          },
          {
            name: 'Node5',
            category: 5, // 设置节点的 category 为 1
          },
          {
            name: 'Node6',
            category: 6, // 设置节点的 category 为 1
          },
        ],
      },
    ],
  }

  //词云图的option
  const cloudOption = {
    // backgroundColor: '#000000',
    title: {
      text: '词云图',
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
        data: cloudData,
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

  const SubmittedForm = (value) => {
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
  //请求关系图
  const getForceGraphRequest = async (value) => {
    let result = null
    try {
      result = await http.post('/api/getForceData', value)
    } catch (error) {
      if (error.response && error.response.status === 400) {
        //收到400错误响应
        message.error('当天不存在此目标词')
        if (myChart) {
          myChart.clear()
        }
      } else {
        console.error('请求关系图时发生错误', error)
      }
    }
    debugger
    if (Object.keys(result.data).length > 0) {
      // console.log('关系图返回的数据', result.data)
      form.setFieldValue('targetWord', value.get('targetWord'))
      //接收link
      setForceDataJson(result.data.data)
      setLinks(result.data.links)
    } else {
      message.warning('当天没有信息，自动加载下一天')
      nextDay(value)
    }
  }
  //请求扩展图
  const getExpandGraph = async (value) => {
    //请求扩展图 需要keyword，需要点的json和links
    //衍生词：expandWord
    let result = null
    if (!expandData && !expandLinks) {
      console.log('扩展词：', value.get('expand'))
      message.info('初始化扩展图')
      console.log('扩展图信息缺失', forceDataJson, links, value.get('expand'))
      try {
        result = await http.post('/api/getExpandData', value)
      } catch (error) {
        if (error.response && error.response.status === 400) {
          //收到400错误响应
          message.error('当天不存在此目标词')
          if (myChart) {
            myChart.clear()
          }
        } else {
          console.error('请求关系图时发生错误', error)
        }
      }
      if (Object.keys(result.data).length > 0) {
        console.log('扩展图返回的数据', result.data)
        form.setFieldValue('targetWord', value.get('targetWord'))
        //接收link
        setExpandData(result.data.data)
        setExpandLinks(result.data.links)
      } else {
        message.warning('当天没有信息，自动加载下一天')
        nextDay(value)
        console.log('扩展图没有返回的数据:', result)
      }
      return
    }
    if (value.get('expandWord') === null) {
      //说明是日期切换，或者提交了表单。这些请求expandWord都是空
      console.log('扩展词：', value.get('expand'))
      // message.error('切换日期或者表单提交')
      console.log('扩展图信息缺失', forceDataJson, links, value.get('expand'))
      try {
        result = await http.post('/api/getExpandData', value)
      } catch (error) {
        if (error.response && error.response.status === 400) {
          //收到400错误响应
          message.error('当天不存在此目标词')
          if (myChart) {
            myChart.clear()
          }
        } else {
          console.error('请求关系图时发生错误', error)
        }
      }
      if (Object.keys(result.data).length > 0) {
        console.log('扩展图返回的数据', result.data)
        form.setFieldValue('targetWord', value.get('targetWord'))
        //接收link
        setExpandData(result.data.data)
        setExpandLinks(result.data.links)
      } else {
        message.warning('当天没有信息，自动加载下一天')
        nextDay(value)
        console.log('扩展图没有返回的数据:', result)
      }
      return
    }
    const expandDataJsonString = JSON.stringify(expandData)
    const linksJsonString = JSON.stringify(expandLinks)
    value.append('expandDataJson', expandDataJsonString)
    value.append('links', linksJsonString)
    value.append('expandWord', value.get('expandWord'))
    try {
      const result = await http.post('/api/getExpandNodeData', value)
      if (result.data) {
        form.setFieldValue('targetWord', value.get('targetWord'))
        //接收link
        setExpandData(result.data.data)
        setExpandLinks(result.data.links)
        console.log('扩展图返回的数据')
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        //收到400错误响应
        message.error('当天不存在此目标词')
        if (myChart) {
          myChart.clear()
        }
      } else {
        console.error('请求扩展图发生的错误:', error)
      }
    }
  }
  //执行这个函数，那肯定inputValue和nextDay不一样。并且要差1
  const nextDay = (value) => {
    if (myChart) {
      myChart.clear()
    }
    let curDate = value.get('date')
    let curValue = 1
    for (let key in dateMapping) {
      if (dateMapping[key] === curDate) {
        curValue = key // 找到匹配的值，返回对应的键
        break
      }
    }
    console.log('执行了下一天，目前的inputValue', inputValue)
    let nextDay = parseInt(curValue) + 1
    const dateValue = dateMapping[nextDay]
    if (nextDay <= 15) {
      setInputValue(nextDay)
      OnchangeCarousel(dateValue)
    } else {
      message.error('已经是最后一天啦！')
    }
  }
  //得到词云图
  const getCloudGraph = async (value) => {
    let result = null
    try {
      result = await http.post('/api/getCloudData', value)
    } catch (error) {
      if (error.response && error.response.status === 400) {
        //收到400错误响应
        message.error('当天不存在此目标词')
        onChangeDate(inputValue + 1)
        if (myChart) {
          myChart.clear()
        }
      } else {
        console.error('请求词云图发生的错误:', error)
      }
    }
    if (result.data.length > 0) {
      // console.log('词云图返回的数据', result.data)
      form.setFieldValue('targetWord', keyword)
      setCloudData(result.data)
    } else {
      message.warning('当天没有信息，自动加载下一天')
      //如果是空的，就去执行一个函数。
      nextDay(value)
    }
  }
  const onFinish = async (value) => {
    if (graphModel === '关系图') {
      //请求关系图
      getForceGraphRequest(value)
    } else if (graphModel === '词云图') {
      //请求词云图
      getCloudGraph(value)
    } else {
      console.log('请求的日期：', value.get('date'))
      getExpandGraph(value)
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
    {
      label: '代词',
      value: 'r',
    },
    {
      label: '介词',
      value: 'p',
    },
    {
      label: '连词',
      value: 'c',
    },
    {
      label: '助词',
      value: 'u',
    },
    {
      label: '其他虚词',
      value: 'xc',
    },
    {
      label: '标点符号',
      value: 'w',
    },
  ]
  const handleChange = (value) => {
    console.log(value)
  }
  //点击节点的触发事件
  const changeNodeKeyNameSubmitForm = (value) => {
    setKeyword(value)
    const formValues = form.getFieldsValue()
    if (form.getFieldValue('date') !== null) {
      const formData = new FormData()
      formData.append('targetWord', value)
      formData.append('frequen1', formValues.frequen1)
      formData.append('frequen2', form.getFieldValue('frequen2'))
      formData.append('levelOneTopK', form.getFieldValue('levelOneTopK'))
      formData.append('levelTwoTopK', form.getFieldValue('levelTwoTopK'))
      formData.append(
        'dependenDistance',
        form.getFieldValue('dependenDistance')
      )

      formData.append('date', date)
      formData.append(
        'wordType',
        form.getFieldValue('wordType') ? form.getFieldValue('wordType') : []
      )
      // console.log(value)
      onFinish(formData)
    }
  }
  //扩展边：
  const expandNodeInfo = (value) => {
    if (!value && value === keyword) {
      return
    }
    const formValues = form.getFieldsValue()
    if (form.getFieldValue('date') !== null) {
      const formData = new FormData()
      formData.append('targetWord', keyword)
      formData.append('frequen1', formValues.frequen1)
      formData.append('frequen2', form.getFieldValue('frequen2'))
      formData.append('levelOneTopK', form.getFieldValue('levelOneTopK'))
      formData.append('levelTwoTopK', form.getFieldValue('levelTwoTopK'))
      formData.append(
        'dependenDistance',
        form.getFieldValue('dependenDistance')
      )

      formData.append('date', date)
      formData.append(
        'wordType',
        form.getFieldValue('wordType') ? form.getFieldValue('wordType') : []
      )
      formData.append('expandWord', value)
      // console.log(value)
      onFinish(formData)
    }
  }

  //控制日期
  const OnchangeCarousel = (value) => {
    setDate(value)
    if (form.getFieldValue('targetWord') !== null) {
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
      formData.append(
        'wordType',
        form.getFieldValue('wordType') ? form.getFieldValue('wordType') : []
      )
      setDate(value)
      onFinish(formData)
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

  //改变词云图和关系图模式
  //设置模式
  const [graphModel, setGraphModel] = useState('关系图')
  //模式修改时的触发动作
  const changeModelFunction = () => {
    if (form.getFieldValue('targetWord') !== null) {
      const formData = new FormData()
      formData.append('targetWord', form.getFieldValue('targetWord'))
      formData.append('frequen1', form.getFieldValue('frequen1'))
      formData.append('frequen2', form.getFieldValue('frequen2'))
      formData.append('levelOneTopK', form.getFieldValue('levelOneTopK'))
      formData.append('levelTwoTopK', form.getFieldValue('levelTwoTopK'))
      formData.append(
        'dependenDistance',
        form.getFieldValue('dependenDistance')
      )

      formData.append('date', date)
      formData.append(
        'wordType',
        form.getFieldValue('wordType') ? form.getFieldValue('wordType') : []
      )
      onFinish(formData)
    }
  }
  //改成滑动显示
  const [inputValue, setInputValue] = useState(1)
  const onChangeDate = (newValue) => {
    const dateValue = dateMapping[newValue]
    setInputValue(newValue)
    OnchangeCarousel(dateValue)
  }
  //日期生成
  const generateDateMapping = (startDate, endDate) => {
    const dateMapping = {}
    const startDateObj = new Date(startDate)
    const endDateObj = new Date(endDate)

    const currentDate = new Date(startDateObj)

    let dayIncrementer = 1

    while (currentDate <= endDateObj) {
      const formattedDate = formatDate(currentDate) // Implement a function to format the date as 'YYYYMMDD'
      dateMapping[dayIncrementer] = formattedDate
      currentDate.setDate(currentDate.getDate() + 1)
      dayIncrementer++
    }

    return dateMapping
  }
  const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}${month}${day}`
  }
  const startDate = '2023-09-01' // Start date in 'YYYY-MM-DD' format
  const endDate = '2023-09-15' // End date in 'YYYY-MM-DD' format

  const dateMapping = generateDateMapping(startDate, endDate)
  //滑动的样式
  const formatter = (value) => `9月${value}日`

  useEffect(() => {
    //     // 定义事件处理函数
    const handleNodeClick = (params) => {
      if (params.dataType === 'node') {
        changeNodeKeyNameSubmitForm(params.data.name)
      } else {
        // console.log('点击了边', params)
      }
    }
    const handleExpandClick = (params) => {
      if (params.dataType === 'node') {
        // console.log('扩展图的节点名字', params.data.name)
        expandNodeInfo(params.data.name)
      } else {
        // console.log('点击了边', params)
      }
    }
    if (domRef.current) {
      if (!myChart) {
        myChart = echarts.init(domRef.current)
      }
    }
    // 绘制图表
    if (graphModel === '关系图') {
      if (myChart) {
        myChart.clear()
        myChart.setOption(forceOption, false)
        myChart.on('dblclick', handleNodeClick)
      }
    } else if (graphModel === '词云图') {
      if (myChart) {
        myChart.clear()
        myChart.setOption(cloudOption, false)
      }
    } else {
      if (myChart) {
        myChart.clear()
        myChart.setOption(expandOption, false)
        myChart.on('dblclick', handleExpandClick)
      }
    }
    return () => {
      if (myChart) {
        myChart.dispose()
      }
    }
  }, [forceDataJson, cloudData, expandData])
  return (
    <>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: '1', padding: '50px', paddingTop: '150px' }}>
          <Space style={{ padding: '10px' }}>
            <Segmented
              options={['词云图', '关系图', '扩展图']}
              value={graphModel}
              onChange={setGraphModel}></Segmented>
          </Space>
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
              label="一级Top:"
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
              label="二级Top:"
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
          <div
            ref={domRef}
            style={{
              width: '100%',
              height: '100%',
              // border: '3px double black',
            }}></div>
          <br />
          <div>
            <Row>
              {!isSegmentedDisabled ? (
                <Col span={3}>滑动选择日期</Col>
              ) : (
                <Col span={3}></Col>
              )}
              <Col span={18}>
                <Slider
                  tooltip={{ formatter, open: true }}
                  min={1}
                  max={15}
                  onChange={onChangeDate}
                  disabled={isSegmentedDisabled}
                  value={
                    typeof inputValue === 'number' ? inputValue : 0
                  }></Slider>
              </Col>
              <Col span={3}>
                <InputNumber
                  min={1}
                  max={15}
                  style={{
                    margin: '0 16px',
                  }}
                  value={inputValue}
                  onChange={onChangeDate}
                  formatter={(value) => `9月${value}日`}
                  disabled={isSegmentedDisabled}
                />
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </>
  )
}
export default CiYunButtonSlideGraphExpand
