<template>
  <div>
    <Login v-if="!logged_in" @auth="logged"/>
    <NavBar v-else-if="!privilege" :items="[
    {title: 'Map', description: 'View the map and check out capacity at places and check-in.', href: '/user',
    icon: MapIcon},
    {title: 'COVID', description:
    'Declare a COVID diagnosis and see possible contacts with people who have COVID.',
    href:'/covid',
    icon: UserGroupIcon},
    {title: 'Profile', description: 'Manage your info, view your check-ins and diagnosis history.', href:
    '/profile', icon: UserIcon},]"
            @signout="logout"
    />
    <NavBar v-else :items="[
    {title: 'Database', description: 'Manage the database', href: '/admin', icon: DatabaseIcon},
    {title: 'Graphs', description: 'Charts and graphs', href: '/graphs', icon: ChartPieIcon}]"
            @signout="logout"
    />
    <Popup/>
  </div>
</template>

<script>
import {RouterLink, RouterView} from 'vue-router'
import Login from "./views/Login.vue";
import NavBar from "./components/NavBar.vue";
import {ChartPieIcon, DatabaseIcon, HomeIcon, MapIcon, UserGroupIcon, UserIcon} from '@heroicons/vue/outline';

export default {
  beforeMount() {
    this.privilege = this.checkPrivy();
    this.username = this.checkUsername();
    this.logged_in = !!this.username; // if a username exists ('admin' or other), we are logged in.
  },
  data() {
    return {
      logged_in: false,
      privilege: false,
      username: '',
      ChartPieIcon, HomeIcon, DatabaseIcon,
      UserIcon, MapIcon, UserGroupIcon
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
    /**
     * sessionStorage stores 'String' only, so we have to parse it into a 'boolean'.
     * @returns {boolean}
     */
    checkPrivy() {
      return JSON.parse(sessionStorage.getItem("privilege")) === true;
    },
    checkUsername() {
      return sessionStorage.getItem("username");
    },
    logout() {
      this.logged_in = false;
      this.privilege = false;
      this.username = '';
      sessionStorage.clear();
    }
  },
}
</script>
