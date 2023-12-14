interface Route {
  path: string
  title: string
  value: string
  children?: Route[]
}

export default [
  {
    path: '/',
    title: 'Home',
    value: 'home',
  },
  {
    path: '/drc20',
    title: 'DRC-20',
    value: 'drc20',
  },
  {
    path: '/swordpool',
    title: 'Swordpool',
    value: 'swordpool',
  },
  // {
  //   name: 'Marketplace',
  //   path: '/marketplace',
  // },
] as Route[]
