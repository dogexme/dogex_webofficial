import NP from 'number-precision'

export const calculate_output_a = (inputB: number, balanceA: number, balanceB: number) => {
  const o_a = NP.times(NP.round(NP.times(inputB, NP.divide(balanceA, NP.plus(balanceB, inputB))), 2))
  return o_a
}

export const calculate_output_b = (inputA: number, balanceA: number, balanceB: number) => {
  let _input_a = NP.times(inputA)
  _input_a = _input_a < 0 ? 0 : _input_a
  const o_b = NP.round(NP.times(_input_a, NP.divide(balanceB, NP.plus(balanceA, _input_a))), 0)
  return o_b
}
