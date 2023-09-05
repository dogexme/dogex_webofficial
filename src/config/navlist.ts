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
    path: '/swordpoolBeta',
    title: 'Swordpool Beta',
  },
  // {
  //   name: 'Marketplace',
  //   path: '/marketplace',
  // },
] as Route[]
