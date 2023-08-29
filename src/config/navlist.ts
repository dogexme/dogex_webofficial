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
    path: '/swardpoolBeta',
    title: 'Swardpool Beta',
  },
  // {
  //   name: 'Marketplace',
  //   path: '/marketplace',
  // },
] as Route[]
