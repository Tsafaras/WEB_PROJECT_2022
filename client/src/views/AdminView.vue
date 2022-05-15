<template>
  <div class="shadow sm:rounded-md sm:overflow-hidden">
    <div class="px-4 py-5 bg-white space-y-6 sm:p-6 grid sm:grid-cols-2">
      <div class="grid justify-around w-full gap-2 sm:border-r sm:border-b-0 sm:pb-0 border-b pb-4 border-gray-200">
        <label class="block text-sm font-medium text-gray-700"> Upload more data </label>
        <div class="flex justify-center px-5 pt-2 pb-3 border-2 border-gray-300 border-dashed rounded-md">
          <div class="space-y-1 text-center grid justify-items-center">
            <div class="text-sm text-gray-600">
              <label class="cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500
              focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500
              grid justify-items-center"
                     for="file-upload">
                <FolderAddIcon class="h-12 w12"/>
                Select a file or drag and drop
                <input id="file-upload" class="sr-only" type="file"/>
              </label>
            </div>
            <p class="text-xs text-gray-500">JSON format only</p>
          </div>
        </div>
        <div class="text-center sm:px-6">
          <button
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              type="submit">
            Upload
          </button>
        </div>
      </div>

      <!--      <div aria-hidden="true" class="hidden sm:block">-->
      <!--        <div class="py-5">-->
      <!--          <div class="sm:border-t sm:border-gray-200"/>-->
      <!--        </div>-->
      <!--      </div>-->

      <div class="flex flex-col justify-center items-center gap-2">
        <label class="block text-sm font-medium text-gray-700"> Delete all data </label>
        <button
            class="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            type="submit">
          Purge
        </button>
        <p class="italic text-sm text-gray-600">This cannot be undone!</p>
      </div>

      <div class="grid gap-2">
        <div>Generate users</div>
        <form>
          <input
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900
              rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Amount of users" type="number"/>
        </form>
        <button
            class="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            type="submit">
          Generate
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {FolderAddIcon} from '@heroicons/vue/outline';

export default {
  name: "AdminView",
  components: {
    FolderAddIcon
  },
}
</script>
