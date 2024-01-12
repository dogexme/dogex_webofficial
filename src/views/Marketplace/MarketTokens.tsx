import DogPageHeader from '@/components/DogPageHeader.vue'
import DogTokenBuyItem from '@/components/DogTokenBuyItem.vue'
import DogTokenBuyContentItem from '@/components/DogTokenBuyContentItem.vue'
import DogList from '@/components/DogList'
import { ElDialog, ElButton, ElResult } from 'element-plus'
import s from './index.module.scss'
import { useAppStore } from '@/store'

export default defineComponent({
  setup() {
    // const router = useRouter()
    // const route = useRoute()
    const appStore = useAppStore()
    const { connectDpal } = appStore
    const address = computed(() => appStore.address)
    const defaultPageSize = 15
    const { loading, dataSource, page, total, query, refresh } = useTable({
      api,
      pageSize: defaultPageSize,
    })
    // const columns = [
    //   {
    //     title: 'Collection',
    //     dataIndex: 'collection',
    //   },
    //   {
    //     title: 'Floor Price',
    //     dataIndex: 'floorPrice',
    //   },
    //   {
    //     title: 'Unit Price',
    //     dataIndex: 'unitPrice',
    //   },
    //   {
    //     title: 'Listed',
    //     dataIndex: 'listed',
    //   },
    // ]

    enum SHOW_STATUS {
      'SHOW',
      'SUCCESS',
      'FAIL',
    }
    const minDialogWidth = 600
    const visible = ref(false)
    const dialogWidth = ref(minDialogWidth)
    const isBuyLoading = ref(false)
    const showStatus = ref<SHOW_STATUS>(SHOW_STATUS.SHOW)

    function openBuy() {
      visible.value = true
      dialogWidth.value = Math.min(minDialogWidth, document.documentElement.offsetWidth - 20)
    }

    function handleConnectDpal() {
      connectDpal()
        .then(() => {
          console.log(address.value)
        })
        .catch(() => {
          console.log('123')
        })
    }

    function buy() {
      isBuyLoading.value = true
      setTimeout(() => {
        showStatus.value = SHOW_STATUS.SUCCESS
        // isBuyLoading.value = false
      }, 2000)
    }

    function handleDialogClose() {
      showStatus.value = SHOW_STATUS.SHOW
      isBuyLoading.value = false
    }

    async function api() {
      return {
        data: [
          { collection: 'dogim', floorPrice: 12, unitPrice: 132, listed: 789 },
          { collection: 'dogetomoon', floorPrice: 132, unitPrice: 1231, listed: 32 },
          { collection: 'owls', floorPrice: 31, unitPrice: 112, listed: 35 },
          { collection: 'dogecheck', floorPrice: 231, unitPrice: 123, listed: 42 },
        ],
        total: 1,
      }
    }

    return () => (
      <div>
        <DogPageHeader isBack title="Tokens / Detail"></DogPageHeader>
        <DogList
          dataSource={dataSource.value}
          currentPage={page.value}
          defaultPageSize={defaultPageSize}
          loading={loading.value}
          total={total.value}
          onCurrent-change={query}
          onRefresh={refresh}
          v-slots={{
            default: (dataSource: [{ tokenid: string; txid: string; baseuri: string }]) => (
              <div class={s['dog-token-grid']}>
                {dataSource.map(() => (
                  <DogTokenBuyItem onClick-buy={openBuy}></DogTokenBuyItem>
                ))}
              </div>
            ),
          }}
        ></DogList>
        <ElDialog
          title="Checkout"
          width={dialogWidth.value}
          align-center
          append-to-body
          v-model={visible.value}
          onClosed={handleDialogClose}
          v-slots={{
            footer: () => {
              return (
                <>
                  {showStatus.value === SHOW_STATUS.SHOW && (
                    <span class="dialog-footer">
                      <ElButton onClick={() => (visible.value = false)}>Cancel</ElButton>
                      {!address.value ? (
                        <ElButton type="primary" onClick={handleConnectDpal}>
                          Connect Wallet
                        </ElButton>
                      ) : (
                        <ElButton type="primary" loading={isBuyLoading.value} onClick={buy}>
                          Buy
                        </ElButton>
                      )}
                    </span>
                  )}
                </>
              )
            },
          }}
        >
          <div class={s['dog-buy-token']}>
            <DogTokenBuyContentItem style="width: 200px" />
          </div>
          {showStatus.value === SHOW_STATUS.SHOW && (
            <div>
              <div class={[s['dog-buy-amount'], s['dog-buy-amount--first']]}>
                <span>Price</span>
                <span>$12.2</span>
              </div>
              <div class={s['dog-buy-amount']}>
                <span>You Pay</span>
                <div class={s['dog-buy-amount_youpay']}>
                  <span>12.2 ÐOGE</span>
                  <span>$12.2</span>
                </div>
              </div>
            </div>
          )}
          {showStatus.value === SHOW_STATUS.SUCCESS && (
            <div class={s['dog-buy-result']}>
              <ElResult icon="success" title="Payment success"></ElResult>
            </div>
          )}
          {showStatus.value === SHOW_STATUS.FAIL && (
            <div class={s['dog-buy-result']}>
              <ElResult icon="error" title="Sorry, Transaction Failed"></ElResult>
            </div>
          )}
        </ElDialog>
      </div>
    )
  },
})
