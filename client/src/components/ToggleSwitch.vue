<template>
  <label class="relative inline-block w-[60px] h-[34px]">
    <input v-model="enabled" class="opacity-0 w-0 h-0 peer" type="checkbox" @change="$emit('input')">
    <span
        class="slider rounded-full before:rounded-full peer-checked:bg-indigo-500 peer-focus:shadow-md bg-indigo-500 before:absolute
              absolute cursor-pointer inset-0 bg-gray-300 duration-500 peer-checked:before:translate-x-[26px] before:content-['']
              before:aspect-square before:w-[26px] before:left-1 before:bottom-1 before:bg-white before:duration-500">
    </span>
  </label>
</template>

<script>
export default {
  name: "ToggleSwitch",
  data() {
    return {
      enabled: false,
    }
  },
}
</script>
