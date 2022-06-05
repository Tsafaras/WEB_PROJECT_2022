<template>
  <div class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!--      TODO Turn form input into component -->
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900" v-text="header"></h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          {{ ' ' }}
          <a class="font-medium text-indigo-600 hover:text-indigo-500" href="#" @click="exists" v-text="subtext"></a>
        </p>
      </div>
      <form class="mt-8 space-y-6" method="POST">
        <input name="remember" type="hidden" value="true"/>
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <input id="username" v-model="username" autocomplete="username"
                   class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                   name="username" placeholder="Username"
                   required=""
                   type="text"/>
          </div>
          <div v-if="!existing">
            <input id="email-address" v-model="email" autocomplete="email"
                   class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                   name="email" placeholder="Email address"
                   required=""
                   type="email"/>
          </div>
          <div>
            <input id="password" v-model="password" autocomplete="current-password"
                   class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                   name="password"
                   placeholder="Password" required=""
                   type="password"
                   @input="passwordCheck"/>
          </div>
          <p v-for="error of v$.$errors" v-if="v$.$error" :key="error.$uid">
            {{ error.$message }}
          </p>
        </div>
        <!--        TODO When a password is entered, show requirements-->
        <div>
          <RouterLink v-if="existing" to="/">
            <input :disabled="username === '' || password === ''"
                   class="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                         disabled:cursor-not-allowed disabled:bg-indigo-400 hover:cursor-pointer"
                   type="submit" value="Sign in" @click="login">
          </RouterLink>
          <button v-else :disabled="username === '' || password === '' || email === ''"
                  class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                         disabled:cursor-not-allowed disabled:bg-indigo-400" type="button" @click="signup">
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
            </span>
            Sign up
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import useVuelidate from '@vuelidate/core'
import {email, helpers} from '@vuelidate/validators'
import {hashIt, passwordCheck} from "../helpers";

const original_header = "Sign in to your acount";
const original_action = "sign-up";
const pass_fail_msg = "Password must contain at least:"

export default {
  name: "Login",
  setup() {
    return {v$: useVuelidate()}
  },
  validations() {
    return {
      email: helpers.withMessage("Not a valid email address", email)
    }
  },
  data() {
    return {
      username: '',
      email: '',
      password: '',
      existing: true,
      header: original_header,
      subtext: original_action,
      has_uppercase: false,
      has_number: false,
      has_special: false,
      pass: false,
    }
  },
  methods: {
    exists() {
      this.existing = !this.existing;
      this.header = this.existing ? original_header : "Create a new account";
      this.subtext = this.existing ? original_action : "sign-in";
    },
    async login() {

      await axios.post('api/cred/login', {
        params: {
          username: this.username,
          password: this.password
        }
      }).then((response) => {
        if (!response.data.success) {
          this.emitter.emit('show',
              {
                header: "Oops!",
                text: "Wrong usernmame/password combination. Try again.",
              });
        } else if (response.data.success === 'admin') {
          this.$emit('auth', {privilege: true, username: this.username})
        } else {
          this.$emit('auth', {privilege: false, username: this.username})
        }

      })
          .catch(function (error) {
            console.log(error);
          });
    },
    async signup() {
      // const isFormCorrect = await this.v$.$validate()
      // if (!isFormCorrect) {
      //   console.log(this.v$);
      //   return;
      // } // TODO Check email validator on signup

      await axios.post('api/cred/signup', {
        params: {
          username: this.username,
          password: hashIt(this.password),
          email: this.email
        }
      }).then((response) => {
        if (!response.data.success)
          return this.emitter.emit('show',
              {
                header: "Oops!",
                text: `This ${response.data.duplicate} is already in use. Try another one.`,
              });

        this.$emit('auth', {privilege: false, username: this.username})
      }).catch(function (error) { console.log(error)});
    },
    passwordCheck() {
      this.pass = passwordCheck(this.password);
    },
  },
}
</script>
