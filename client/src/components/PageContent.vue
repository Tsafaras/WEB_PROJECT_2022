<template>
  <div class="shadow sm:rounded-md sm:overflow-hidden mx-auto max-w-7xl">
    <div class="px-4 py-5 bg-white sm:p-6 grid auto-cols-fr gap-y-4">
      <slot>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "PageContent",
  props: {
    intoColumns: false,
  }
}
</script>
