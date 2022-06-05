<template>
  <PageContent>
    <Container title="Declare a COVID diagnosis">
      <Datepicker v-model="pickedDate" :enableTimePicker="false" :format="'yyyy/MM/dd'" :maxDate="today"
                  :minDate="firstCOVIDCase" :placeholder="'Pick a date'" class="w-64">
      </Datepicker>
      <ActionButton text="Declare" @click="declare"/>
    </Container>

    <Container title="View your COVID history">
      <ActionButton text="Fetch data" @click="getCases"/>
<!--      <TimelineChart />-->
    </Container>

    <Container title="COVID - Possible contacts">
      <ActionButton text="Fetch data"/>
    </Container>
  </PageContent>
</template>

<script>
import axios from "axios";

export default {
  name: "UserCovidView",
  data() {
    return {
      firstCOVIDCase: new Date(import.meta.env.VITE_FIRST_COVID_CASE),
      pickedDate: null,
      today: new Date(),
    }
  },
  methods: {
    async declare() {
      if (!this.pickedDate)
        return this.emitter.emit('show', {
          header: "Pick a date first!",
          text: "You must pick a date in order to declare a COVID diagnosis.",
        })

      const params = {
        username: sessionStorage.getItem('username'),
        date: new Date(Date.UTC(this.pickedDate.getFullYear(), this.pickedDate.getMonth(), this.pickedDate.getDate()))
      }

      await axios.post('api/user/covid', params).then((res) => {
        if (res.data.result)
          return this.emitter.emit('show', {
            header: "Success!",
            text: "COVID case was declared successfully!",
          })

        this.emitter.emit('show', {
          header: "Case not declared.",
          text:
              `It seems like you have already declared a case within a 14-day period from: ${params.date.toDateString()}.
              You can check your COVID history on the next section of this page.`
        })
      })
    },
    async getCases() {
      await axios.get('api/user/covid', {
        params: {
          username: sessionStorage.getItem('username')
        }
      }).then((res) => {
        console.log(res.data);
      })
    }
  }
}
</script>
