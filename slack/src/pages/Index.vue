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
      class="q-gutter-md chat-input"
    >
      <q-input
        square filled clearable
        type="text"
        v-model="message"
        placeholder="Message"
      />

      <div>
        <q-btn label="" icon="send" type="submit" color="secondary" class="float-right" />
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'PageIndex',
  setup() {
    const messages = ref([]);
    const message = ref('ilkjl');

    const $q = useQuasar()
    // calling here; equivalent to when component is created
    $q.dark.set(true)

    return {
      messages,
      message,
      submit () {
        messages.value.push(message.value);
        let objDiv = document.getElementById('chat');
        objDiv.scrollTop = objDiv.scrollHeight
      }
    };
  }
})
;
</script>

<style>
#chat {
  height: 86%;
}

.container {
  height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
