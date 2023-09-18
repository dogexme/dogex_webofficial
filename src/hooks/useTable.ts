type ApiType = (
  pageNum: number,
  pageSize: number
) => Promise<{
  total: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
}>

interface TableHookOptions {
  api: ApiType
  pageSize?: number
  first?: boolean
}

export function useTable(options: TableHookOptions) {
  const { api, pageSize = 15, first = true } = options
  const loading = ref(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dataSource = ref<any>([])
  const page = ref(1)
  const total = ref(0)

  async function query(p: number) {
    loading.value = true
    try {
      const { total: tol, data } = await api(p, pageSize)
      dataSource.value = data
      total.value = tol
      page.value = p
    } finally {
      loading.value = false
    }
  }

  function refresh() {
    query(page.value)
  }

  onMounted(() => {
    if (first) {
      query(page.value)
    }
  })

  return {
    loading,
    dataSource,
    page,
    total,
    query,
    refresh,
  }
}
