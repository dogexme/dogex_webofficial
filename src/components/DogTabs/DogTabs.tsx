import s from './DogTabs.module.scss'
import DogCard from '../DogCard.vue'

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
    keepDom: {
      type: Boolean,
      default: false
    }
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

    return () => {
      const values = [] as Array<string>

      let children = slots.default?.().map((itemSlot) => {
        const value = itemSlot.props?.value
        values.push(value)
        if (props.keepDom) {
          return <DogCard style={{ display: value == tabValue.value ? 'block' : 'none' }}>{itemSlot}</DogCard>
        } else {
          return <DogCard>{itemSlot}</DogCard>
        }
      })

      if (!props.keepDom && children) {
        children = children.filter((_vnode, i) => {
          return tabValue.value === values[i]
        })
      }

      return (
        <div class={s['dog-tabs']}>
          <ul class={s['dog-tabmenu']}>
            {props.tabs.map((t) => {
              return (
                <li class={[s['dog-tabmenu_item'], tabValue.value == t.value && s['dog-tabmenu_item--active']]} key={t.value} onClick={() => emit('change', t.value)}>
                  {t.label}
                </li>
              )
            })}
          </ul>
          {children}
        </div>
      )
    }
  },
})
