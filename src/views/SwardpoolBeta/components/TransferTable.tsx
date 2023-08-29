import DogTable from '@/components/DogTable/DogTable'
import DogLink from '@/components/DogLink.vue'

export default defineComponent({
  props: {
    data: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const statusType = {
      0: 'wait',
      1: 'success',
      2: 'fail'
    }

    const originColumns = [
      {
        title: 'Status',
        dataIndex: 'status',
        render(text: 0 | 1 | 2) {
          return statusType[text]
        }
      },
      {
        title: 'Txid',
        dataIndex: 'txid',
        render(text: string) {
          return <>{text && <DogLink is-copy to={`https://chain.so/tx/DOGE/${text}`} label={omitCenterString(text, 24)} value={text}></DogLink>}</>
        },
      },
      {
        title: 'Address',
        dataIndex: 'address',
        render(text: string) {
          return <DogLink is-copy label={text} value={text}></DogLink>
        },
      },
      {
        title: 'Gas',
        dataIndex: 'gas',
      },
      {
        title: 'BalanceA',
        dataIndex: 'balanceA',
      },
      {
        title: 'BalanceB',
        dataIndex: 'balanceB',
      },
      // {
      //   title: 'Old BalanceA',
      //   dataIndex: 'old_balance_a',
      // },
      // {
      //   title: 'Old BalanceB',
      //   dataIndex: 'old_balance_b',
      // },
      {
        title: 'In TokenA',
        dataIndex: 'inTokenA',
      },
      {
        title: 'In TokenB',
        dataIndex: 'inTokenB',
      },
      {
        title: 'Out TokenA',
        dataIndex: 'outTokenA',
      },
      {
        title: 'Out TokenB',
        dataIndex: 'outTokenB',
      },
    ]

    const columns = ref(originColumns)

    return () => <DogTable rowkey="id" loading={props.loading} dataSource={props.data} columns={columns.value} total={100} currentPage={1} showPagination={false} refresh={false}/>
  },
})
