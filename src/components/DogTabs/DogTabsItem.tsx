export default defineComponent({
  name: 'DogTabsItem',
  props: {
    value: {
      type: [String, Number],
      required: true,
    },
    show: {
      type: Boolean,
      default: true,
    },
  },
  setup(_props, { slots }) {
    return () => {
      return <div class="dog-tabs-item">{slots.default?.()}</div>
    }
  },
})
