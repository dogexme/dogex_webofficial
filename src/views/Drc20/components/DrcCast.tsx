import DogTabs from '@/components/DogTabs/DogTabs'
import DogTabsItem from '@/components/DogTabs/DogTabsItem'
import DrcListed from './DrcListed'
import DrcUnlist from './DrcUnlist'

export type ListType = 'listed' | 'unlist'

export default defineComponent({
  emits: ['search'],
  setup() {
    const route = useRoute()
    const router = useRouter()
    const type = route.query.type as ListType | undefined
    const queryTypeVal = ref(type || 'listed')
    const tables = reactive<any>({})
    const tabs = [
      {
        label: 'Listed',
        value: 'listed',
      },
      {
        label: 'Unlist',
        value: 'unlist',
      },
    ]

    const loading = ref(false)

    async function changeTab(tabVal: ListType) {
      if (loading.value) return
      queryTypeVal.value = tabVal
      router.replace(`/drc20?type=${queryTypeVal.value}`)
      nextTick(reload)
    }

    function reload() {
      tables[queryTypeVal.value]?.reload?.()
    }

    onMounted(reload)

    return () => (
      <div class="mt-4">
        <DogTabs keep-dom modelValue={queryTypeVal.value} tabs={tabs} onChange={changeTab}>
          <DogTabsItem value="listed">
            <DrcListed ref={(ref) => (tables['listed'] = ref)} v-model:loading={loading.value} type="listed"></DrcListed>
          </DogTabsItem>
          <DogTabsItem value="unlist">
            <DrcUnlist ref={(ref) => (tables['unlist'] = ref)} v-model:loading={loading.value} type="unlist"></DrcUnlist>
          </DogTabsItem>
        </DogTabs>
      </div>
    )
  },
})
