<template>
  <table v-if="data" class="table-auto shadow">
    <tr>
      <th class="bg-green-500 text-center" v-for="head in headers" :key="head">{{ head }}</th>
    </tr>
    <tr v-for="item in data" :key="item" class="even:bg-gray-200/90 hover:bg-orange-300/80">
      <td class="text-left break-words px-2" v-if="headers.length > 1"
          v-for="value in item"
          :key="value">
        {{ value }}
      </td>
      <td class="text-left " v-else>
        {{ item }}
      </td>
    </tr>
  </table>
</template>

<script>
export default {
  name: "TableFromData",
  props: {
    data: {
      type: Array,
      required: true
    },
    headers: {
      type: Array,
      required: true
    }
  }
}
</script>
