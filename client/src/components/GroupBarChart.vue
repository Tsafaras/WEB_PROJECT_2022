<template>
  <div>
    <apexchart
        :options="chartOptions"
        :series="series"
        type="bar"
        width="1000"
    ></apexchart>
  </div>
</template>

<script>
import VueApexCharts from "vue3-apexcharts";

export default {
  name: 'GroupBarChart',
  components: {
    apexchart: VueApexCharts
  },
  props: {
    data: Array,
  },
  data() {
    return {
      series: [{
        name: this.data[0].name,
        data: this.data[0].data,
      }, {
        name: this.data[1].name,
        data: this.data[1].data,
      }],
      chartOptions: {
        chart: {
          stacked: true,
          stackType: '100%',
        },
        colors:
            ['rgba(45,212,191,0.8)', 'rgba(168,85,247,0.8)'],
        plotOptions: {
          bar: {
            horizontal: true,
            dataLabels: {
              position: 'top',
            },
          }
        },
        dataLabels: {
          enabled: true,
          offsetX: -6,
          style: {
            fontSize: '12px',
            colors: ['#ffffff']
          }
        },
        tooltip: {
          shared: true,
          intersect: false
        },
      },
    };
  }
}
</script>
