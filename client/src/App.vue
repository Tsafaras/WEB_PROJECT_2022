<template>
  <header>
  </header>
  <body>
  <Login v-if="!logged_in" @auth="logged"/>
  <div v-else-if="!privilege">
    <NavBar @signout="logout()"/>
  </div>
  <div v-else>
    <NavBar @signout="logout"
        :items="[{title: 'Database', description: 'Manage the database', href: '/admin', icon: DatabaseIcon},
            {title: 'Graphs', description: 'Charts and graphs', href: '/graphs', icon: ChartPieIcon}]"
    />
  </div>
  </body>
</template>

<script>
import {RouterLink, RouterView} from 'vue-router'
import Login from "./views/Login.vue";
import NavBar from "./components/NavBar.vue";
import {ChartPieIcon, HomeIcon, DatabaseIcon} from '@heroicons/vue/outline';

export default {
  data() {
    return {
      logged_in: this.checkSession(),
      privilege: this.checkPrivy(),
      username: this.checkUsername(),
      ChartPieIcon, HomeIcon, DatabaseIcon
    }
  },
  components: {NavBar, Login, RouterLink, RouterView},
  methods: {
    logged(info) {
      this.privilege = info.privilege;
      this.username = info.username;
      this.logged_in = true;
      sessionStorage.setItem("privilege", this.privilege);
      sessionStorage.setItem("username", this.username);
    },
    checkSession() {
      if (sessionStorage.getItem("privilege")) {
        this.privilege = true;
        return true;
      }
      return false;
    },
    checkPrivy(){
      return sessionStorage.getItem("privilege");
    },
    checkUsername(){
      return sessionStorage.getItem("username");
    },
    logout() {
      this.logged_in = false;
      sessionStorage.clear();
    },
  },
}
</script>
