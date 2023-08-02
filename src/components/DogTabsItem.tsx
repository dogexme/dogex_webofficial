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
  setup(props, { slots }) {
    return () => {
      return (
        <div class="s" style={{ display: props.show ? 'block' : 'none' }}>
          {slots.default?.()}
        </div>
      )
    }
  },
})
