<template>
  <div class="npmAnalyzeView">
    <div class="main" ref="echartsRef"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import useNpmAnalyzeStore from '../store/npmAnalyze/npmAnalyze'
import { onMounted, ref } from 'vue';

const npmAnalyzeStore = useNpmAnalyzeStore()


// echarts
const echartsRef = ref<HTMLElement>()

// 因为init函数需要绑定dom所以需要在onMounted中执行确保绑定前dom已经被渲染出来
onMounted(() => {
  npmAnalyzeStore.getNpmAnalyzeAction().then(res => {
    const myChart = echarts.init(echartsRef.value, 'light', { renderer: 'canvas' })
    myChart.showLoading();
    myChart.hideLoading();
    myChart.setOption({
      title: {
        text: 'NPM Dependencies',
        textStyle: {
          color: '	#1E90FF'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: function(params: any) {
          let name = params.data.name;
          let value = params.data.value;
          if(params.data.value) {
            return '<ul style="list-style-type: disc; color: #333; font-weight: bold; margin-left: -22px;">' +
            '<li style="text-align: left;">依赖名称：' + name + '</li>' +
            '<li style="text-align: left;">依赖版本：' + value + '</li>' +
            '</ul>';
          } else {
            return '';
          }
        }
      },
      animationDuration: 1500, // 缩小动画的持续时间，单位为毫秒
      animationEasing: 'quadraticInOut', // 缩小动画的缓动效果
      series: [
        {
          type: 'graph',
          layout: 'force',
          label: {
            show: true,
            position: 'right',
            formatter: '{b}'
          },
          labelLayout: {
            hideOverlap: true
          },
          scaleLimit: {
            min: 1,
            max: 5
          },
          data: res.nodes.map(function (node: any) {
            return {
              id: node.id,
              name: node.name,
              value: node.value,
              symbolSize: node.size,
              itemStyle: {
                color: node.color
              }
            };
          }),
          edges: res.edges.map(function (edge: any) {
            return {
              source: edge.sourceID,
              target: edge.targetID
            };
          }),
          emphasis: {
            focusNodeAdjacency: true, // 开启节点间的高亮连线
            lineStyle: {
              width: 3 // 高亮连线的宽度
            },
            focus: 'adjacency',
            label: {
              position: 'right',
              show: true,
              formatter: (params: any) => params.name
            }
          },
          roam: true,
          lineStyle: {
            curveness: 0,
            width: 3
        }
        }
      ]
    })
  }
)})
</script>

<style lang="less" scoped>
.npmAnalyzeView {
  width: 100%;
  
}
.main {
  width: 1200px;
  height: 800px;
}
</style>
