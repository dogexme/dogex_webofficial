import HelloWord from './HelloWord.vue'
import { mount } from '@vue/test-utils'
function sum(a: number, b: number) {
  return a + b
}

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3)
})

test('hello', () => {
  const wrapper = mount(HelloWord)
  const a = ref(1)
  expect(a.value).toBe(1)
})
