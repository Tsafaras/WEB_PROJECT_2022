<template>
  <PageContent>
    <Container subtitle="Any existing POIs will be overwritten!" title="Upload data (POIs)">
      <div class="flex justify-center px-5 pt-2 pb-3 border-2 border-gray-300 border-dashed rounded-md">
        <div class="space-y-1 text-center grid justify-items-center">
          <form enctype="multipart/form-data">
            <div class="text-sm text-gray-600">
              <label class="cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500
              focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500
              grid justify-items-center"
                     for="file-upload">
                <FolderAddIcon class="h-12 w12"/>
                Select a file
                <input id="file-upload" ref="file" accept=".json" class="sr-only" type="file" @change="checkFile"/>
              </label>
            </div>
            <p class="text-xs text-gray-500">JSON format only</p>
          </form>
        </div>
      </div>
      <ActionButton text="Upload" @click="upload"/>
    </Container>

    <Container subtitle="This cannot be undone!"
               title="Delete all data (except users)">
      <ActionButton text="Purge" @click="purge"/>
    </Container>

    <Container title="Generate data">
      <input v-model="num_of_users"
             class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900
              rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
             placeholder="Amount of users" type="number"/>
      <Datepicker v-model="pickedRange" :enableTimePicker="false" :format="'yyyy/MM/dd'" :maxDate="today"
                  :minDate="firstCOVIDCase" :placeholder="'Date range, from - to'" :range="true" class="w-64">
      </Datepicker>
      <ActionButton text="Generate" @click="generate"/>
    </Container>
  </PageContent>
</template>

<script>
import {FolderAddIcon} from '@heroicons/vue/outline';
import axios from "axios";

export default {
  name: "AdminView",
  beforeMount() {
    this.emitter.on('accept', (evt) => {
      this.conf_purge();
    })
  },
  data() {
    return {
      file: '',
      pickedRange: null,
      num_of_users: null,
      today: new Date(),
      firstCOVIDCase: new Date(import.meta.env.VITE_FIRST_COVID_CASE)
    }
  },
  components: {
    FolderAddIcon
  },
  methods: {
    checkFile() {
      let file = document.getElementById("file-upload").files[0];
      if (file.type !== "application/json")
        return this.emitter.emit('show', {
          header: "Wrong file type",
          text: `The file you selected is of type ${file.type}. We need JSON.`,
          btn_txt: "Let me try that again."
        })

      this.file = this.$refs.file.files[0];
    },
    async upload() {
      let form = new FormData();
      form.append('file', this.file);

      await axios.post('api/admin/data', form).then((response) => {
        if (response.data.uploaded)
          return this.emitter.emit('show', {
            header: "Hooray!",
            text: "Files uploaded successfully.",
          })

        this.emitter.emit('show', {
          header: "Oh-oh!",
          text: "This files doesn't seem to contain a valid json object"
        })
      })
    },
    purge() {
      this.emitter.emit('show',
          {
            header: "Are you sure?",
            text: "This cannot be undone. I cannot stress this enough.",
            btn_txt: "Oh, I'm sure.",
            secondary: true
          });
    },
    async conf_purge() {
      this.accept = false;
      await axios.delete('api/admin/data').then((res) => {
        this.emitter.emit('show', {
          header: "Success? 🤷‍♂️",
          text: "All data was removed.",
          btn_txt: "That's what I wanted 🤨"
        })
      });
    },
    async generate() {
      if (!this.num_of_users)
        return this.emitter.emit('show', {
          header: "Enter a number first!",
          text: "You must enter a valid number, 1 or greater.",
        })

      if (!this.pickedRange || !this.pickedRange[1])
        return this.emitter.emit('show', {
          header: "Pick a date range first!",
          text: "You must pick a starting date AND an ending date.",
        })

      const params = {
        num_of_users: this.num_of_users,
        date_start: this.getUTCMiliSec(this.pickedRange[0]),
        date_end: this.getUTCMiliSec(this.pickedRange[1]),
      }

      await axios.post('api/admin/generate', params).then((res) => {
        let visits = typeof res.data.visits === 'object' ? 0 : res.data.visits;
        let popup = {
          header: 'All done!',
          text: `Generated ${res.data.users} users, ${res.data.cases} cases and ${visits} visits.`
        }

        if (!visits)
          popup.text +=
              ' Looks like there are no POIs, so we couldn\'t generate visits. Upload some first and try again.'

        this.emitter.emit('show', popup)
      })
    },
    /**
     *
     * @param date {Date}
     * @returns {number}
     */
    getUTCMiliSec(date) {
      return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).getTime()
    }
  }
}
</script>
