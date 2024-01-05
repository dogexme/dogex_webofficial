export type MoveTipParams = {
  price: number
  rate: number
}

export type InitEchartParams = { currentRate: number }

export enum PoolCtrlType {
  adda = 1,
  addb,
  removea,
  removeb,
}
