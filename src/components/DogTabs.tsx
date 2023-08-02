import s from './DogTabs.module.scss'

console.log(s)

interface TabOptions {
  label: string
  value: string | number
}

interface Props {
  modelValue: TabOptions['value']
  tabs: Array<TabOptions>
}
export default defineComponent({
  emits: ['update:modelValue', 'change'],
  setup(props: Props, { emit, slots }) {
    const tabValue = computed({
      get() {
        return props.modelValue
      },
      set(value) {
        emit('update:modelValue', value)
      },
    })

    function changeTab(value: TabOptions['value']) {
      tabValue.value = value
      emit('change', tabValue.value)
    }
    return (
      <div class={s['dog-tabs']}>
        <ul class={s['dot-tabmenu']}>
          {props.tabs.map((t) => {
            return (
              <li class={[s['dot-tabmenu_item'], tabValue.value == t.value && s['dot-tabmenu_item--active']]} key={t.value} onClick={() => changeTab(t.value)}>
                {t.label}
              </li>
            )
          })}
        </ul>
        <div>{slots.default}</div>
      </div>
    )
  },
})
