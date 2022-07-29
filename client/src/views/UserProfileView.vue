<template>
  <PageContent>
    <Container title="View your check-in history">
      <TableFromData :data="checkIns" v-if="checkIns" :headers="['Date (UTC)', 'POI', 'Address']"/>
      <ActionButton text="Fetch data" @click="getVisits"/>
    </Container>
    <Container title="Change your credentials" subtitle="Previous values will be replaced and gone forever.">
      <form class="" >
        <div v-for="item in changeCred" :key="item">
          <p class="text-left font-bold text-sm">{{item.label}}</p>
          <input :placeholder="item.placeholder" :type="item.type" v-model="item.newValue"
                 class="w-full block border border-gray-300 placeholder-gray-500 text-gray-900
             rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"/>
          <p class="text-xs text-gray-500 text-right italic">Current: {{item.sublabel}}</p>
          <ActionButton text="Change" @click="change(item)" class="my-1.5"/>
        </div>
      </form>
    </Container>
  </PageContent>
</template>

<script>
import axios from "axios";
import {passwordCheck, hashIt} from "../helpers";

export default {
  name: "UserProfileView",
  data() {
    return {
      changeCred: {
        usernameField: {placeholder: 'New username', type: 'text', label: 'Username', sublabel:
              sessionStorage.getItem('username'),
          newValue: ''},
        // email: {placeholder: 'New email', type: 'email', label: 'Email', sublabel: 'your old one', newValue: ''},
        password: {placeholder: 'New password', type: 'password', label: 'Password', sublabel: 'we don\'t even know it',
          newValue:
              ''}
      }, checkIns: null
    }
  },
  methods: {
    async change(item) {
      if (!item.newValue)
        return this.emitter.emit('show', {
          header: "Empty field!",
          text: "You must fill the field first.",
        })

      let field = item.label.toLowerCase();
      if (field === 'password' && !passwordCheck(item.newValue))
        return this.emitter.emit('show', {
          header: "Unmet criteria.",
          text:
              "Password must contain of at least: 8 characters in total, 1 uppercase letter, 1 number and 1 special character."
        })

      const params = {
        username: sessionStorage.getItem('username'),
        field: field,
        value: field === 'password' ? hashIt(item.newValue) : item.newValue
      }

      await axios.post('api/cred/change', params).then( response => {
        this.emitter.emit('show', {
          header: 'Field changed.',
          text: `Your ${field} has been changed successfully.`
        })
      })

      if (field === 'username') {
        sessionStorage.setItem('username', item.newValue);
        this.changeCred.usernameField.sublabel = item.newValue;
      }
    },
    async getVisits() {
      await axios.get('api/user/visit', {
        params: {
          username: sessionStorage.getItem('username')
        }
      }).then((res) => {
        this.checkIns = res.data;
      })
    }
  }

}
</script>
