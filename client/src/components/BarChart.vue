<template>
  <Bar :chart-data="chartData"
       :chart-options="chartOptions"
       :css-classes="cssClasses"
       :dataset-id-key="datasetIdKey"
       :styles="styles"
  />
</template>

<script>
import {Bar} from 'vue-chartjs'
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip,} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale,)

export default {
  name: 'BarChart',
  components: {Bar},
  props: {
    datasetIdKey: {
      type: String,
      default: 'bar'
    },
    cssClasses: {
      default: '',
      type: String
    },
    styles: {
      type: Object,
      default: () => {
      }
    },
    dataset: {
      type: [Object],
      default: [{},]
    },
    labels: {
      type: [String],
      default: ['Total',]
    }
  },
  data() {
    return {
      chartData: {
        labels: this.labels,
        datasets: this.dataset
      },
      chartOptions: {
        plugins: {
          legend: {
            position: 'bottom'
          }
        }, transitions: {
          show: {
            animations: {
              x: {
                from: 0
              },
              y: {
                from: 0
              }
            }
          },
          hide: {
            animations: {
              x: {
                to: 0
              },
              y: {
                to: 0
              }
            }
          }
        }
      },
    }
  }
}
</script>
