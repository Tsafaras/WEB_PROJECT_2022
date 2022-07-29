<template>
  <div>
    <apexchart
        :options="chartOptions"
        :series="series"
        type="line"
        width="500"
    ></apexchart>
  </div>
</template>

<script>
import VueApexCharts from "vue3-apexcharts";

export default {
  name: 'LineChart',
  components: {
    apexchart: VueApexCharts
  },
  props: {
    data: null,
    showDiff: false,
  },
  data() {
    return {
      chartOptions: {
        xaxis: {
          title: {
            text: 'Hour of day (24h)'
          },
          type: 'category'
        },
        colors:
            ['rgba(45,212,191,0.8)', 'rgba(168,85,247,0.8)'],
        dataLabels: {
          enabled: true,
          formatter: this.showDiff ? function(value, { seriesIndex, dataPointIndex, w }) {
            if (dataPointIndex > 0)
              return w.config.series[seriesIndex].data[dataPointIndex].y -
            w.config.series[seriesIndex].data[dataPointIndex - 1].y

            return w.config.series[seriesIndex].data[0].y
          } : function (value) {
            return value;
          }
        },
      },
      series: [
        {
          name: "Cases",
          data: this.data.simple
        },
        {
          name: "Active cases",
          data: this.data.active,
        }
      ],
    };
  }
}
</script>
