<template>
  <PageContent>
    <Container title="View your check-in history">

      <ActionButton text="Fetch data"/>
    </Container>
    <Container title="View your COVID history">

      <ActionButton text="Fetch data"/>
    </Container>
    <Container title="Change your credentials" subtitle="Your old ones will be replaced">
      <form class="items-center" >
        <div v-for="item in changeCred" :key="item" class="">
          <label class="whitespace-nowrap"> {{item.label}} </label>
          <input :placeholder="item.placeholder" :type="item.type" v-model="item.newValue"
                 class="w-full block border border-gray-300 placeholder-gray-500 text-gray-900
             rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"/>
          <p class="text-xs text-gray-500 text-right italic">{{item.sublabel}}</p>
        </div>
      </form>
      <ActionButton text="Change"/>
    </Container>
  </PageContent>
</template>

<script>
export default {
  name: "UserProfileView",
  data() {
    return {
      changeCred: {
        usernameField: {placeholder: 'New username', type: 'text', label: 'Username', sublabel: 'your old one',
          newValue: ''},
        email: {placeholder: 'New email', type: 'email', label: 'Email', sublabel: 'your old one', newValue: ''},
        password: {placeholder: 'New password', type: 'password', label: 'Password', sublabel: 'we don\'t even know it',
          newValue:
              ''}
      },
    }
  }

}
</script>
