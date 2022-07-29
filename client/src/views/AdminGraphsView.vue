<template>
  <PageContent>
    <Container title="Total numbers">
      <ActionButton text="Fetch data" @click="fetchTotal"/>
      <BarChart v-if="totalCount" :key="totalCount" :data="totalCount"/>
    </Container>

    <Container title="POIs' categories ranked">
      <ActionButton text="Fetch data" @click="fetchCategories"/>
      <GroupBarChart v-if="poisRanked" :key="poisRanked" :data="poisRanked"/>
    </Container>

    <Container title="In a month or in a week">
      <Datepicker v-if="monthPicker" v-model="pickedMonth" :autoRange="6" :class="'w-40'"
                  :enableTimePicker="false"
                  :format="'yyyy/MM'" :maxDate="today" :minDate="firstCOVIDCase" :monthPicker="true"
                  :placeholder="'Pick a month'">
      </Datepicker>
      <Datepicker v-else v-model="pickedWeek" :autoRange="6" :class="'w-64'" :enableTimePicker="false"
                  :format="'yyyy/MM/dd'" :maxDate="today" :minDate="firstCOVIDCase"
                  :placeholder="'Pick a 7-day period'" :range="true">
      </Datepicker>
      <div class="text-lg flex justify-between items-center w-4/5 mx-auto">
        <p>Month</p>
        <ToggleSwitch @change="toggled"/>
        <p>Week</p>
      </div>
      <LineChart v-if="dayByDay" :key="dayByDay" :data="dayByDay"/>
      <ActionButton v-if="monthPicker" text="Fetch data" @click="fetchMonth"/>
      <ActionButton v-else text="Fetch data" @click="fetchWeek"/>
    </Container>

    <Container title="In a single day">
      <Datepicker v-model="pickedDay" :enableTimePicker="false" :format="'yyyy/MM/dd'" :maxDate="today"
                  :minDate="firstCOVIDCase" :placeholder="'Pick a day'" :showNowButton="true"
                  class="w-40">
      </Datepicker>
      <ActionButton text="Fetch data" @click="fetchDay"/>
      <LineChart v-if="hourByHour" :key="hourByHour" :data="hourByHour" :showDiff="true"/>
    </Container>
  </PageContent>
</template>

<script>
import {CalendarIcon} from '@heroicons/vue/solid'
import ToggleSwitch from "../components/ToggleSwitch.vue";
import BarChart from "../components/BarChart.vue";
import axios from "axios";

export default {
  name: "AdminGraphsView",
  data() {
    return {
      pickedMonth: null,
      pickedWeek: null,
      monthPicker: true,
      pickedDay: null,
      today: new Date(),
      firstCOVIDCase: new Date(import.meta.env.VITE_FIRST_COVID_CASE),
      totalCount: null,
      poisRanked: null,
      dayByDay: null,
      hourByHour: null,
    }
  }, methods: {
    toggled() {
      this.monthPicker = !this.monthPicker;
      this.pickedMonth = null;
      this.pickedWeek = null;
    },
    async fetchTotal(filter = {startDate: null, endDate: null}) {
      await axios.get('api/admin/data', {
        params: {
          filter: filter,
        }
      }).then((res) => {
        this.totalCount = res.data;
      })
    },
    async fetchCategories() {
      await axios.get('api/admin/categories')
          .then((res) => {
            this.poisRanked = res.data;
          })
    },
    async fetchMonth() {
      if (!this.pickedMonth)
        return this.emitter.emit('show', {
          header: "Empty date!",
          text: "You must pick a month.",
        })

      await axios.get('api/admin/data/range', {
        params: {
          dateStart: new Date(Date.UTC(this.pickedMonth.year, this.pickedMonth.month, 1)),
          dateEnd: new Date(Date.UTC(this.pickedMonth.year, this.pickedMonth.month + 1, 0)),
        }
      }).then((res) => {
        if (res.data.simple.length === 0)
          return this.emitter.emit('show', {
            header: "Empty!",
            text: `There are no data for this month.`,
          })
        this.dayByDay = res.data;
      })
    },
    async fetchWeek() {
      if (!this.pickedWeek)
        return this.emitter.emit('show', {
          header: "Empty date!",
          text: "You must pick a week.",
        })

      await axios.get('api/admin/data/range', {
        params: {
          dateStart:
              new Date(
                  Date.UTC(this.pickedWeek[0].getFullYear(),
                      this.pickedWeek[0].getMonth(),
                      this.pickedWeek[0].getDate())
              ),
          dateEnd:
              new Date(
                  Date.UTC(this.pickedWeek[1].getFullYear(),
                      this.pickedWeek[1].getMonth(),
                      this.pickedWeek[1].getDate())
              ),
        }
      }).then((res) => {
        if (res.data.simple.length === 0)
          return this.emitter.emit('show', {
            header: "Empty!",
            text: `There are no data for this week.`,
          })
        this.dayByDay = res.data;
      })
    },
    async fetchDay() {
      if (!this.pickedDay)
        return this.emitter.emit('show', {
          header: "Empty date!",
          text: "You must pick a day.",
        })

      await axios.get('api/admin/data/day', {
        params: {
          date: new Date(
              Date.UTC(this.pickedDay.getFullYear(),
                  this.pickedDay.getMonth(),
                  this.pickedDay.getDate())
          )
        }
      }).then((res) => {
        if (res.data.simple.length === 0)
          return this.emitter.emit('show', {
            header: "Empty!",
            text: `There are no data for this day.`,
          })
        this.hourByHour = res.data;
      })
    }
  },
  components: {
    BarChart,
    CalendarIcon, ToggleSwitch
  },
  mounted() {
    this.emitter.emit('show', {
      header: 'The graphs are responsive. 📊',
      text:
          'Hover over data to take a closer look, click on legends to toggle their display or use the menu on each graph\'s top-right corner to download the data.'
    })
  },
  async beforeMount() {
    await this.fetchTotal();
    await this.fetchCategories();
  }
}
</script>
