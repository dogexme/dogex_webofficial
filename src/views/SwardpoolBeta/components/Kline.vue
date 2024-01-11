<script setup lang="ts">
import { getKline } from '@/services/sword'
import { KlineType } from '@/types.d'
import moment from 'moment'
import VChart from 'vue-echarts'
import createEchartOptions from '../echartOptions'
import np from 'number-precision'
import { MoveTipParams, InitEchartParams } from '../types.d'

const emit = defineEmits<{
  (event: 'init', params: InitEchartParams): void
  (event: 'hideTip', params: InitEchartParams): void
  (event: 'moveTip', params: MoveTipParams): void
}>()

const klineOpts = [
  {
    label: '10m',
    limit: 400,
  },
  {
    label: '1h',
    limit: 400,
  },
  {
    label: '12h',
    limit: 400,
  },
  {
    label: '1d',
    limit: 400,
  },
]

const timeStrategy = {
  [KlineType._1h]() {
    return {
      currentTime: moment().minute(0).second(0),
      timeType: 'hours',
      timeNum: 1,
    }
  },
  [KlineType._12h]() {
    return {
      currentTime: moment().minute(0).second(0),
      timeType: 'hours',
      timeNum: 12,
    }
  },
  [KlineType._10m]() {
    return {
      currentTime: moment()
        .minute(parseInt(String(moment().minute() / 10)) * 10)
        .second(0),
      timeNum: 10,
      timeType: 'minutes',
    }
  },
  [KlineType._1d]() {
    return {
      currentTime: moment(),
      timeNum: 1,
      timeType: 'days',
    }
  },
}

const vchart = ref(VChart)

const currentKline = ref(klineOpts[0])
const curKlinePoint = ref()
const echatLoading = ref(false)

const klineData = ref<any[]>([])

const k = computed(() => {
  const { r = 0, o = 0, h = 0, l = 0, c = 0, tav = 0 } = curKlinePoint.value || {}
  return {
    r: np.round(r, 4),
    o: np.round(o, 4),
    h: np.round(h, 4),
    l: np.round(l, 4),
    c: np.round(c, 4),
    tav: np.round(tav, 4),
  }
})

async function loadKline() {
  const { label, limit } = currentKline.value
  try {
    echatLoading.value = true
    const res = await getKline({
      interval: label,
      limit: limit,
    })

    let data = res.data.data
    let currentData = [] as any[]

    let t = {
      currentTime: moment(),
      timeType: 'hours',
      timeNum: 1,
    }

    data = klineData.value = data

    t = timeStrategy[label as KlineType]()

    const xLabels = Array.from({ length: limit }).map((_, i) => {
      let formatTime = t.currentTime.format('YYYY-MM-DD HH:mm')
      if (label == KlineType._1d) {
        formatTime = t.currentTime.format('YYYY-MM-DD')
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      t.currentTime = t.currentTime.subtract(t.timeNum, t.timeType)

      const prev = data[i + 1]
      const cur = data[i]
      const curPrice = cur?.c || 0
      const prevPrice = prev?.c || 0

      data[i] = cur ? Object.assign(cur, { r: (curPrice - prevPrice) / prevPrice }) : cur

      currentData[i] = {
        custom: cur,
        value: [formatTime, curPrice],
      }

      return formatTime
    })
    const currentRate = klineData.value[0]?.r || 0
    loadTransferData(xLabels.reverse(), currentData.reverse())
    emit('init', {
      currentRate,
    })
  } finally {
    echatLoading.value = false
  }
}

function loadTransferData(xLabels: any[], data: any[]) {
  const tipMove = ({ price, rate }: MoveTipParams) => {
    emit('moveTip', { price, rate })
  }

  vchart.value.setOption(
    createEchartOptions(
      xLabels,
      data,
      {
        curKlinePoint,
        currentKline,
      },
      tipMove
    ),
    true
  )
}

async function changeKline(k: any) {
  currentKline.value = k
  loadKline()
}

function hideTipHandle() {
  const currentRate = klineData.value[0]?.r || 0
  emit('hideTip', {
    currentRate,
  })
}

function hideHideTipOrPointerEvent(e: Event) {
  if ((e.target as HTMLElement).tagName != 'CANVAS') {
    vchart.value.dispatchAction({
      type: 'hideTip',
    })
    vchart.value.dispatchAction({
      type: 'updateAxisPointer',
      currTrigger: 'leave',
    })
  }
}

onMounted(() => {
  document.documentElement.addEventListener('touchstart', hideHideTipOrPointerEvent)
  loadKline()
})

onUnmounted(() => {
  document.documentElement.removeEventListener('touchstart', hideHideTipOrPointerEvent)
})
</script>
<template>
  <el-col :span="24" :md="12" v-loading="echatLoading">
    <div class="flex justify-between items-center mb-4">
      <ul class="flex text-xs font-bold">
        <li
          class="inline-block w-8 text-center rounded-md cursor-pointer py-2 mp ml-2 hover:bg-yellow-300"
          :style="[currentKline.label == k.label ? { 'background-color': 'rgb(255, 194, 0)', color: '#fff' } : {}]"
          v-for="k in klineOpts"
          @click="changeKline(k)"
          :key="k.label"
        >
          {{ k.label }}
        </li>
      </ul>
      <div class="text-center">
        <el-link href="https://dogim.defieyes.io/" style="font-size: 12px; color: #a8a8a8" target="_blank"> dogim.defieyes.io </el-link>
      </div>
    </div>
    <el-row
      class="text-xs text-center"
      flex
      justify="center"
      :gutter="12"
      style="min-height: 20px"
      :style="[{ color: (k.r || 0) < 0 ? 'rgb(255, 90, 80)' : 'rgb(64, 180, 105)', visibility: curKlinePoint ? 'visible' : 'hidden' }]"
    >
      <el-col class="mb-2" :span="3" :xs="8" :md="8" :lg="3">
        <span>O</span>:<span>{{ k.o }}</span>
      </el-col>
      <el-col class="mb-2" :span="3" :xs="8" :md="8" :lg="3">
        <span>H</span>:<span>{{ k.h }}</span>
      </el-col>
      <el-col class="mb-2" :span="3" :xs="8" :md="8" :lg="3">
        <span>L</span>:<span>{{ k.l }}</span>
      </el-col>
      <el-col class="mb-2" :span="6" :xs="{ span: 12 }">
        <span>C</span>:<span>{{ k.c }}</span>
        <span class="ml-2">{{ k.r < 0 ? '-' : '+' }}{{ Math.abs(np.round(k.r * 100, 2)) }}%</span>
      </el-col>
      <el-col class="mb-2" :span="3" :xs="12">
        <span>Vol</span>:<span>{{ k.tav }}</span>
      </el-col>
    </el-row>
    <v-chart ref="vchart" style="height: 200px" autoresize @hideTip="hideTipHandle" />
  </el-col>
</template>
