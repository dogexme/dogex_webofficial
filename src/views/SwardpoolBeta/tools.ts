oversellStyle.red = 'rgb(255, 90, 80)'
oversellStyle.yellow = 'rgb(255, 194, 0)'
oversellStyle.green = 'rgb(64, 180, 105)'
export function oversellStyle(proportion: number) {
  if (proportion >= 0.5) {
    return oversellStyle.red
  } else if (proportion >= 0.3 && proportion < 0.5) {
    return oversellStyle.yellow
  } else {
    return oversellStyle.green
  }
}
