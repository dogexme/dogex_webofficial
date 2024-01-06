<script setup lang="ts">
import { getSwordProtocol } from '@/services/sword'

const props = withDefaults(
  defineProps<{
    visible: boolean
  }>(),
  {}
)

const emit = defineEmits<{
  (event: 'update:visible', isVisible: boolean): void
  (event: 'confirm'): void
}>()

const visible = computed({
  get() {
    return props.visible
  },
  set(isVisible) {
    emit('update:visible', isVisible)
  },
})

const maxInputDialogWidth = 800
const inputDialogWidth = ref(maxInputDialogWidth)
const text = ref(``)

const isAgree = ref(false)

watch(visible, async (visible) => {
  if (visible) {
    inputDialogWidth.value = Math.min(maxInputDialogWidth, document.documentElement.offsetWidth - 20)
    if (!text.value) {
      const markdown = await getSwordProtocol()
      text.value = markdown.data
    }
  }
})

function confirm() {
  visible.value = false
  localStorage.setItem('isAgree', '1')
  emit('confirm')
}
</script>
<template>
  <el-dialog class="custom-dialog" style="overflow: auto" v-model="visible" :width="inputDialogWidth" append-to-body>
    <div style="background-color: #fff; border-radius: 20px; overflow: hidden; padding: 50px 20px 20px">
      <p class="text-base" style="text-indent: 2em">
        Liquidity management is currently in the beta stage. Please be aware of the risks, and before that, please read our rules link carefully. Thank you for your understanding.
      </p>
      <div class="flex flex-col items-end">
        <!-- <p><el-link type="primary">Swordpool Rule</el-link></p> -->
        <el-link href="https://github.com/dpalwallet/swordpool" style="font-size: 14px; font-weight: bold" target="_blank">
          <img class="mr-2" style="width: 18px" src="@/assets/img/logo32.png" alt="" />
          Swordpool Rule
        </el-link>
        <p>
          <el-checkbox v-model="isAgree" label="I already know."></el-checkbox>
        </p>
        <div class="flex">
          <el-button @click="visible = false">No</el-button>
          <el-button type="primary" @click="confirm" :disabled="!isAgree"> Yes </el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
