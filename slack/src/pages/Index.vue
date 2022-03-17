<template>
  <q-page class="q-pa-md container">
    <q-infinite-scroll id="chat" @load="onLoad" class="full-width overflow-auto" reverse>
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner color="primary" name="dots" size="20px" />
        </div>
      </template>

      <div v-for="message in messages" v-bind:key="message" >
          <q-chat-message
            name="me"
            avatar="https://cdn.quasar.dev/img/avatar4.jpg"
            :text="[message]"
            sent
            stamp="7 minutes ago"
          />

      </div>
    </q-infinite-scroll>
    <q-form
      @submit="submit"
      class="chat-input my-form q-mt-md"
    >
      <q-input
        square filled
        type="textarea"
        autogrow
        v-model="message"
        placeholder="Message"
        style="width: 100%"
      />

      <div class="input-bottom">
        <q-btn
          label=""
          icon="send"
          type="submit"
          color="secondary"
          size="md"
          flat
          class="float-right q-pa-xs q-px-md"
        />
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PageIndex',
  data() {
    return {
      message: '',
      messages: []
    }
  },
  methods: {
    submit () {
      this.messages.push(this.message);
      let objDiv = document.getElementById('chat');
      objDiv.scrollTop = objDiv.scrollHeight
    },
    onLoad (index, done) {
      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        done()
      }, 2000)
    }
  }
})
;
</script>

<style>
#chat {
  height: 92%;
}

.container {
  height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.my-form {
  display: flex;
  flex-direction: column;
  /* align-items: center;
  justify-content: center; */
}

.input-bottom{
  background-color: var(--q-dark);
}

</style>
