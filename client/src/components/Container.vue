<template>
  <div
      class="flex flex-col justify-center items-center gap-2 py-3 sm:p-6 border-gray200 even:sm:border-y-0 even:sm:border-l
even:border-y odd:last:sm:col-span-2 odd:last:sm:border-t odd:last:sm:mx-auto text-center">
    <div class="grid gap-4 justify-items-center">
      <label
          class="text-xl font-medium text-gray-700 border-gray-300 underline-offset-2 underline decoration-gray-300 decoration-1">
        {{ title }}
      </label>
      <slot></slot>
      <p class="italic text-sm text-gray-600">
        {{ subtitle }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Container",
  props: {
    title: String,
    subtitle: String,
  }
}
</script>
