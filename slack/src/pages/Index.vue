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
          v-for="btn in actions"
          :key="btn"
          flat
          color="white"
          :label="btn"
          @click="addCommandToInput(btn)"
        />        
        <q-btn 
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

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'PageIndex',
  setup() {
    const messages = ref([]);
    const message = ref('ilkjl');

    return {
      messages,
      message,
      actions: ['@', '/join', '/invite', '/revoke', '/kick', '/quit', '/cancel'],
      submit () {
        messages.value.push(message.value);
        let objDiv = document.getElementById('chat');
        objDiv.scrollTop = objDiv.scrollHeight
      }
    };
  },

  methods: {
    addCommandToInput(action: string): void {
      this.message.concat(' ', action);
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
