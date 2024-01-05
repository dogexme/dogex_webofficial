import NP from 'number-precision'

export const calculateOutA = (inputB: number, balanceA: number, balanceB: number, price = 0) => {
  const o_a = NP.times(inputB, balanceB == 0 ? 0 : NP.divide(balanceA, balanceB))
  return NP.round(NP.times(o_a, 1 - 0.01), price)
}

export const calculateOutB = (inputA: number, balanceA: number, balanceB: number, price = 0) => {
  const o_b = NP.times(inputA, balanceA == 0 ? 0 : NP.divide(balanceB, balanceA))
  return NP.round(NP.times(o_b, 1 - 0.01), price)
}
