import s from './DogTabs.module.scss'
import DogCard from './DogCard.vue'

interface TabOptions {
  label: string
  value: string | number
}

export default defineComponent({
  name: 'DogTabs',
  props: {
    modelValue: {
      type: [String, Number],
      required: true,
    },
    tabs: {
      type: Array as PropType<Array<TabOptions>>,
      required: true,
    },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit, slots }) {
    const tabValue = computed({
      get() {
        return props.modelValue
      },
      set(value) {
        emit('update:modelValue', value)
        emit('change', value)
      },
    })

    function changeTab(value: TabOptions['value']) {
      if (value === tabValue.value) {
        return
      }
      tabValue.value = value
    }

    return () => {
      const children = slots.default?.().filter((vnode) => {
        return tabValue.value === vnode.props?.value
      })

      return (
        <div class={s['dog-tabs']}>
          <ul class={s['dog-tabmenu']}>
            {props.tabs.map((t) => {
              return (
                <li class={[s['dog-tabmenu_item'], tabValue.value == t.value && s['dog-tabmenu_item--active']]} key={t.value} onClick={() => changeTab(t.value)}>
                  {t.label}
                </li>
              )
            })}
          </ul>
          <DogCard class={s['dog-tabs_content']}>{children}</DogCard>
        </div>
      )
    }
  },
})
