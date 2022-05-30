<template>
  <div class="text-center sm:px-6">
    <button
        class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md
        text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
        w-25 max-w-max"
        type="button">
      <span>{{ text }}</span>
    </button>
  </div>
</template>

<script>
export default {
  name: "ActionButton",
  props: {
    text: String
  },
}
</script>
