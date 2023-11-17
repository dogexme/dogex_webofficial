<script setup lang="ts">
import { omitCenterString, numberFormat } from '@/utils'

const props = withDefaults(
  defineProps<{
    visible: boolean
    list: any[]
    icon: string
    loading?: boolean
  }>(),
  {
    loading: false,
  }
)

const emit = defineEmits<{
  (event: 'update:visible', isVisible: boolean): void
  (event: 'select', t: any): void
}>()

const visible = computed({
  get() {
    return props.visible
  },
  set(isVisible) {
    emit('update:visible', isVisible)
  },
})

const maxInputDialogWidth = 1000
const inputDialogWidth = ref(maxInputDialogWidth)

watch(visible, (isVisible) => {
  if (isVisible) {
    inputDialogWidth.value = Math.min(maxInputDialogWidth, window.screen.width - 20)
  }
})
</script>

<template>
  <el-dialog class="custom-dialog" v-model="visible" :width="inputDialogWidth">
    <div class="doge-tokenlist" v-loading="loading">
      <el-row :gutter="8">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="t in list" :key="t.txid">
          <section class="doge-tokenitem" @click="emit('select', t)">
            <div class="doge-tokenitem_ava">
              <img :src="icon" class="doge-tokenitem_avaitem" alt="" />
            </div>
            <div>
              <div class="doge-tokenitem_row">Name: dogim</div>
              <div class="doge-tokenitem_row">
                Txid:
                <DogLink disabledTooltip is-copy :label="omitCenterString(t.txid, 12)" :value="t.txid"></DogLink>
              </div>
              <div class="doge-tokenitem_row">
                Amount:
                {{ numberFormat(t.amt) }}
              </div>
            </div>
          </section>
        </el-col>
      </el-row>
      <el-empty v-if="list.length < 1" description="No data." />
    </div>
  </el-dialog>
</template>
<style lang="scss" scoped>
.doge-tokenlist {
  background-color: #fff;
  min-height: 350px;
  border-radius: 20px;
  overflow: hidden;
  padding: 50px 20px 20px;
}
.doge-tokenitem {
  display: flex;
  flex-direction: column;
  border: 1px solid #000;
  padding: 12px;
  border-radius: 14px;
  margin-bottom: 8px;
  &:hover {
    border-color: #ffa21e;
    background-color: #ffa21e40;
    transition: all 0.2s;
    cursor: pointer;
  }
  &_row {
    margin-bottom: 12px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  &_ava {
    align-self: center;
    margin-bottom: 12px;
  }
  &_avaitem {
    width: 70px;
    height: 70px;
    border-radius: 50%;
  }
  @media screen and (max-width: 768px) {
    flex-direction: row;
    &_ava {
      margin-bottom: 0;
      margin-right: 12px;
    }
  }
}
</style>
