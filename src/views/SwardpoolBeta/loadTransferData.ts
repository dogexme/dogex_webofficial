import np from 'number-precision';
import { vchart } from './SwardpoolBeta.vue';

export function loadTransferData(xLabels: any[], data: any[]) {
vchart.value.setOption(
{
title: {
show: false,
},
grid: {
left: 40,
right: 10,
top: 20,
bottom: 20,
},
// dataZoom: [
//   {
//     id: 'dataZoomX',
//     type: 'inside',
//     xAxisIndex: [0],
//     minSpan: 5,
//     start: 90,
//     end: 100,
//   },
// ],
tooltip: {
trigger: 'axis',
formatter: function (params: any) {
const opts = params[0];
const [date, value] = opts.value;

return `${date} Ð ${np.round(value, 6)}`;
},
},
xAxis: {
type: 'category',
show: true,
data: xLabels,
splitLine: {
show: false,
},
axisLabel: {
formatter(value: string) {
return value.slice(0, -6);
},
},
},
yAxis: {
show: true,
type: 'value',
splitLine: {
show: false,
},
},
series: [
{
name: 'price',
type: 'line',
showSymbol: false,
lineStyle: {
color: 'rgb(238,181,15)',
},
data,
},
],
},
true
);
}
