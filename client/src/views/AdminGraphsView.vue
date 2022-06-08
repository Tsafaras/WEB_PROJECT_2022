<template>
  <PageContent>
    <Container title="Total numbers">
      <ActionButton text="Fetch again"/>
      <BarChart :dataset="datasets"/>
<!--      :chart-data="fetchData({})"-->
    </Container>

    <Container title="POIs ranked">
      <ActionButton text="Fetch again"/>
    </Container>

    <Container title="In a month or in a week">
      <Datepicker v-model="pickedWeekMonth" :autoRange="6 * !monthPicker"
                  :class="{'w-64': !monthPicker, 'w-40': monthPicker}"
                  :enableTimePicker="false" :format="format" :maxDate="today" :minDate="firstCOVIDCase"
                  :monthPicker="monthPicker" :range="!monthPicker">
      </Datepicker>
      <div class="text-lg flex justify-between items-center w-4/5 mx-auto">
        <p>Month</p>
        <ToggleSwitch @change="toggled"/>
        <p>Week</p>
      </div>
      <ActionButton text="Fetch data"/>
    </Container>

    <Container title="In a single day">
      <Datepicker v-model="datePicked" :enableTimePicker="false" :format="'yyyy/MM/dd'"
                  :maxDate="today" :minDate="firstCOVIDCase" :showNowButton="true" class="w-40">
      </Datepicker>
      <ActionButton text="Fetch data"/>
    </Container>
  </PageContent>
</template>

<script>
import {CalendarIcon} from '@heroicons/vue/solid'
import ToggleSwitch from "../components/ToggleSwitch.vue";
import BarChart from "../components/BarChart.vue";
import axios from "axios";

const dataset = [{
  label: 'Visits',
  backgroundColor: 'rgb(99, 255, 132)',
  borderColor: 'rgb(99, 255, 132)',
  data: [100],
  order: 0
}, {
  label: 'Cases',
  backgroundColor: 'rgb(132, 99, 255)',
  borderColor: 'rgb(132, 99, 255)',
  data: [45],
  order: 1
}, {
  label: 'Active Cases',
  backgroundColor: 'rgb(255, 99, 132)',
  borderColor: 'rgb(255, 99, 132)',
  data: [20],
  order: 2
},]

export default {
  name: "AdminGraphsView",
  data() {
    return {
      pickedWeekMonth: null,
      monthPicker: true,
      datePicked: null,
      format: null,
      today: new Date(),
      firstCOVIDCase: Date.parse('2019-12-01'),
      datasets: dataset
    }
  }, methods: {
    toggled() {
      this.monthPicker = !this.monthPicker;
      this.pickedWeekMonth = null;
      this.format = this.monthPicker ? 'yyy/MM' : 'yyyy/MM/dd'
    }
  },
  components: {
    BarChart,
    CalendarIcon, ToggleSwitch
  },
  mounted() {
    this.emitter.emit('show', {
      header: 'Responsive graphs!',
      text: 'By clicking on a graph\'s particular legend, you toggle the display of the corresponding data.'
    })
  }
}
</script>
