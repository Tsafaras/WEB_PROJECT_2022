<template>
  <PageContent>
    <Container title="Total Visits and Cases">
      <ActionButton text="Fetch again"/>
    </Container>

    <Container title="Total active cases">
      <ActionButton text="Fetch again"/>
    </Container>

    <Container title="POIs ranked">
      <ActionButton text="Fetch again"/>
    </Container>

    <Container title="In a month or in a week">
      <Datepicker v-model="pickedWeekMonth" :autoRange="6 * !monthPicker" :enableTimePicker="false"
                  :format="format" :monthPicker="monthPicker" :maxDate="today" :minDate="firstCOVIDCase"
                  :range="!monthPicker" :class="{'w-64': !monthPicker, 'w-40': monthPicker}">
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
                  :showNowButton="true" class="w-40" :maxDate="today" :minDate="firstCOVIDCase">
      </Datepicker>
      <ActionButton text="Fetch data"/>
    </Container>
  </PageContent>
</template>

<script>
import {CalendarIcon} from '@heroicons/vue/solid'
import ToggleSwitch from "../components/ToggleSwitch.vue";

export default {
  name: "AdminGraphsView",
  data() {
    return {
      pickedWeekMonth: null,
      monthPicker: true,
      datePicked: null,
      format: null,
      today: new Date(),
      firstCOVIDCase: Date.parse('2019-12-01')
    }
  }, methods: {
    toggled() {
      this.monthPicker = !this.monthPicker;
      this.pickedWeekMonth = null;
      this.format = this.monthPicker ? 'yyy/MM' : 'yyyy/MM/dd'
    }
  },
  components: {
    CalendarIcon, ToggleSwitch
  }
}
</script>
