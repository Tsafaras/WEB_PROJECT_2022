<template>
  <PageContent>
    <Container title="Declare a COVID diagnosis">
      <Datepicker v-model="pickedDate" :enableTimePicker="false" :format="'yyyy/MM/dd'" :maxDate="today"
                  :minDate="firstCOVIDCase" :placeholder="'Pick a date'" class="w-64">
      </Datepicker>
      <ActionButton text="Declare" @click="declare"/>
    </Container>

    <Container title="View your COVID history">
      <TableFromData :data="covidHistory" :headers="['Date (UTC)']"/>
      <ActionButton text="Fetch data" @click="getCases"/>
    </Container>

    <Container title="COVID - Possible contacts">
      <TableFromData :data="contacts" :headers="['Date (UTC)', 'POI', 'Address']"/>
      <ActionButton text="Fetch data" @click="getContacts"/>
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
      covidHistory: null,
      possibleContact: null,
      contacts: null
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
        date: new Date(
            Date.UTC(this.pickedDate.getFullYear(),
                this.pickedDate.getMonth(),
                this.pickedDate.getDate())
        )
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
        if (res.data.length === 0)
          return this.emitter.emit('show', {
            header: "No diagnoses found.",
            text: "It appears that you haven't declared any COVID diagnoses."
          })

        this.covidHistory = res.data;
      })
    },
    async getContacts() {
      this.possibleContact = new Date();
      const today = new Date(Date.UTC(
          this.possibleContact.getFullYear(),
          this.possibleContact.getMonth(),
          this.possibleContact.getDate())
      )
      console.log(today);
      await axios.get('api/user/contacts', {
        params: {
          username: sessionStorage.getItem('username'),
          date: today
        }
      }).then((res) => {
        if (res.data.length === 0)
          return this.emitter.emit('show', {
            header: "No contacts found.",
            text: "It appears that you haven't had contact with a COVID-positive person in the past 7 days."
          })

        this.contacts = res.data;
      })
    }
  }
}
</script>
