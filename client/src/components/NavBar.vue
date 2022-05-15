<template>
  <Popover class="relative bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      <div class="flex justify-between items-center border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
        <div class="flex justify-start lg:w-0 lg:flex-1">
          <a href="#">
            <span class="sr-only">Workflow</span>
            <img alt="" class="h-8 w-auto sm:h-10" src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"/>
          </a>
        </div>
        <div class="-mr-2 -my-2 md:hidden">
          <PopoverButton
              class="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
            <span class="sr-only">Open menu</span>
            <MenuIcon aria-hidden="true" class="h-6 w-6"/>
          </PopoverButton>
        </div>
        <PopoverGroup as="nav" class="hidden md:flex space-x-10">
          <RouterLink v-for="item in items" :key="item" :to="item.href">
            <a class="text-base font-medium text-gray-500 hover:text-gray-900">
              {{ item.title }}
            </a>
          </RouterLink>

        </PopoverGroup>
        <div class="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
          <a class="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
             href="#" @click="$emit('signout')">
            Sign out </a>
        </div>
      </div>
    </div>

    <transition enter-active-class="duration-200 ease-out" enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100" leave-active-class="duration-100 ease-in"
                leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
      <PopoverPanel class="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden" focus>
        <div class="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
          <div class="pt-5 pb-6 px-5">
            <div class="flex items-center justify-between">
              <div>
                <img alt="Workflow" class="h-8 w-auto"
                     src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"/>
              </div>
              <div class="-mr-2">
                <PopoverButton
                    class="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                  <span class="sr-only">Close menu</span>
                  <XIcon aria-hidden="true" class="h-6 w-6"/>
                </PopoverButton>
              </div>
            </div>
            <div class="mt-6">
              <nav class="grid gap-y-8">
                <RouterLink v-for="item in items" :key="item" :to="item.href" class="w-max">
                  <PopoverButton class="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50">
                    <component :is="item.icon" aria-hidden="true" class="flex-shrink-0 h-6 w-6 text-indigo-600"/>
                    <span class="ml-3 text-base font-medium text-gray-900">
                    {{ item.description }}
                  </span>
                  </PopoverButton>
                </RouterLink>
              </nav>
            </div>
          </div>
          <div class="py-6 space-y-6 flex justify-center">
              <button type="submit" class="max-w-xs group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Sign out
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <LogoutIcon class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
            </span>
              </button>
          </div>
        </div>
      </PopoverPanel>
    </transition>
  </Popover>
  <RouterView/>
</template>

<script>
import {Popover, PopoverButton, PopoverGroup, PopoverPanel} from '@headlessui/vue'
import {MenuIcon, XIcon, LogoutIcon} from '@heroicons/vue/outline'

export default {
  components: {
    Popover, PopoverButton, PopoverGroup, PopoverPanel,
    MenuIcon, XIcon, LogoutIcon,
  },
  props: {
    items: Array
  },
  mounted() {
    this.$router.push(this.items[0].href);
  }
}
</script>
