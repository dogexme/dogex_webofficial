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
    path: '/drc20',
    title: 'DRC-20',
  },
  {
    path: '/swordpool',
    title: 'Swordpool',
  },
  // {
  //   name: 'Marketplace',
  //   path: '/marketplace',
  // },
] as Route[]
