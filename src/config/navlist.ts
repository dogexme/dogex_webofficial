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
    path: '/swordpool',
    title: 'Swordpool',
  },
  // {
  //   name: 'Marketplace',
  //   path: '/marketplace',
  // },
] as Route[]
