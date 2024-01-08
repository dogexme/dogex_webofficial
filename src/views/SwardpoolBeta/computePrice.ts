import NP from 'number-precision'

export const calculateOutA = (inputB: number, balanceA: number, balanceB: number, price = 0) => {
  const _inputB = NP.round(NP.minus(inputB, NP.times(inputB, 0.01)), 0)
  const o_a = NP.times(_inputB, balanceB == 0 ? 0 : NP.divide(balanceA, NP.plus(balanceB, _inputB)))
  return NP.round(o_a, price)
}

export const calculateOutB = (inputA: number, balanceA: number, balanceB: number, price = 0) => {
  const _inputA = NP.minus(inputA, NP.times(inputA, 0.01))
  const o_b = NP.times(inputA, balanceA == 0 ? 0 : NP.divide(balanceB, NP.plus(balanceA, _inputA)))
  return NP.round(o_b, price)
}
