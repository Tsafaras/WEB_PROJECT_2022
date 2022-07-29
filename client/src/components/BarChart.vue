<template>
  <div>
    <apexchart
        :options="chartOptions"
        :series="series"
        type="bar"
        width="500"
    ></apexchart>
  </div>
</template>

<script>
import VueApexCharts from "vue3-apexcharts";

export default {
  name: 'BarChart',
  components: {
    apexchart: VueApexCharts
  },
  props: {
    data: Array,
  },
  data() {
    return {
      chartOptions: {
        xaxis: {
          type: 'category',
        },
        yaxis: {
          logarithmic: true,
          logBase: 2,
        },
        colors:
            ['rgba(45,212,191,0.8)', 'rgba(56,189,248,0.8)', 'rgba(168,85,247,0.8)'],
        stroke: {
          colors: ['transparent'],
          width: 40,
        },
        dataLabels: {
          position: 'top',
          style: {
            fontSize: '1rem',
            colors: ['#ffffff']
          },
          formatter: function(value, { seriesIndex, w }) {
            return w.config.series[seriesIndex].data[0].y
          }
        },
      },
      series: [
        {
          name: this.data[0].x,
          data: [this.data[0]]
        },
        {
          name: this.data[1].x,
          data: [this.data[1]],
        },
        {
          name: this.data[2].x,
          data: [this.data[2]],
        }
      ],
    };
  }
}
</script>
