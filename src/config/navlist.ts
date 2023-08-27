interface Route {
  path: string
  title: string
  children?: Route[]
}

export default [
  {
    path: '/',
    title: 'Home',
  },
  {
    path: '/swap',
    title: 'Swap',
  },
  // {
  //   name: 'Marketplace',
  //   path: '/marketplace',
  // },
] as Route[]
