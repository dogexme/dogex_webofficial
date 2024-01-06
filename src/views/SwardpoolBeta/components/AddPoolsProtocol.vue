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
  <el-dialog class="custom-dialog" style="background-color: #fff; height: 500px; overflow: auto" v-model="visible" :width="inputDialogWidth" append-to-body>
    <v-md-preview :text="text"></v-md-preview>
    <template #footer>
      <div class="dialog-footer">
        <p>
          <el-checkbox v-model="isAgree" label="I already know."></el-checkbox>
        </p>
        <el-button @click="visible = false">No</el-button>
        <el-button type="primary" @click="confirm" :disabled="!isAgree"> Yes </el-button>
      </div>
    </template>
  </el-dialog>
</template>
