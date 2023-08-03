export default defineComponent({
  props: {
    defaultPageSize: {
      type: Number,
      default: 15,
    },
    total: {
      type: Number,
      default: 15,
      required: true,
    },
    currentPage: {
      type: Number,
      required: true,
    },
  },
  setup(props, { slots }) {
    return () => <div class="dog-list">{slots.default?.()}</div>
  },
})
