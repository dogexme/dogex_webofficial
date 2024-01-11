import { KlineType } from '@/types.d'
import np from 'number-precision'
import { MoveTipParams } from './types'

export default (
  xLabels: string[],
  data: any[],
  { curKlinePoint, currentKline }: { [k: string]: Ref<any> },
  tipMove: ({ price, rate }: MoveTipParams) => void
) => {
  return {
    title: {
      show: false,
    },
    grid: {
      left: 40,
      right: 10,
      top: 20,
      bottom: 20,
    },
    dataZoom: [
      {
        id: 'dataZoomX',
        type: 'inside',
        xAxisIndex: [0],
        minSpan: 50,
        start: 0,
        end: 100,
      },
    ],
    tooltip: {
      trigger: 'axis',
      formatter: function (params: any) {
        const opts = params[0]
        const [date, value] = opts.value
        const { custom } = opts.data
        curKlinePoint.value = custom
        tipMove({
          price: value,
          rate: custom?.r || 0,
        })
        return `${date} Ð ${np.round(value, 6)}`
      },
    },
    xAxis: {
      type: 'category',
      show: true,
      data: xLabels,
      splitLine: {
        show: false,
      },
      scale: true,
      axisLabel: {
        showMinLabel: false,
        showMaxLabel: false,
        color: '#aeaeae',
        fontSize: 10,
        formatter(value: string) {
          const { label } = currentKline.value
          return label == KlineType._1d ? value : value.slice(0, -6)
        },
      },
      axisTick: {
        length: 2,
        lineStyle: {
          color: '#aeaeae',
        },
      },
      axisLine: {
        lineStyle: {
          color: '#aeaeae',
        },
      },
    },
    yAxis: {
      show: true,
      type: 'value',
      axisLabel: {
        showMinLabel: false,
        color: '#aeaeae',
        fontSize: 10,
      },
      scale: true,
      splitLine: {
        show: false,
      },
    },
    series: [
      {
        name: 'price',
        type: 'line',
        showSymbol: false,
        animation: false,
        lineStyle: {
          color: '#ba77ff',
        },
        data,
      },
    ],
  }
}
