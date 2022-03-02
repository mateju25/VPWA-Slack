<template>
  <q-page>
    <div class="q-pa-md column almost-window-height content-between">
      <q-infinite-scroll @load="onLoad" class="full-width chat overflow-auto" reverse>
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner color="primary" name="dots" size="40px" />
          </div>
        </template>

        <q-chat-message
          label="Sunday, 19th"
        />

        <q-chat-message
          name="me"
          avatar="https://cdn.quasar.dev/img/avatar4.jpg"
          :text="['hey, how are you?']"
          sent
          stamp="7 minutes ago"
        />
        <q-chat-message
          name="Jane"
          avatar="https://cdn.quasar.dev/img/avatar3.jpg"
          :text="['doing fine, how r you?']"
          stamp="4 minutes ago"
        />
        <q-chat-message
          name="me"
          avatar="https://cdn.quasar.dev/img/avatar4.jpg"
          :text="['hey, how are you?']"
          sent
          stamp="7 minutes ago"
        />
        <q-chat-message
          name="Jane"
          avatar="https://cdn.quasar.dev/img/avatar3.jpg"
          :text="['doing fine, how r you?']"
          stamp="4 minutes ago"
        />
        <q-chat-message
          name="me"
          avatar="https://cdn.quasar.dev/img/avatar4.jpg"
          :text="['hey, how are you?']"
          sent
          stamp="7 minutes ago"
        />
        <q-chat-message
          name="Jane"
          avatar="https://cdn.quasar.dev/img/avatar3.jpg"
          :text="['doing fine, how r you?']"
          stamp="4 minutes ago"
        />
        <q-chat-message
          name="me"
          avatar="https://cdn.quasar.dev/img/avatar4.jpg"
          :text="['hey, how are you?']"
          sent
          stamp="7 minutes ago"
        />
        <q-chat-message
          name="Jane"
          avatar="https://cdn.quasar.dev/img/avatar3.jpg"
          :text="['doing fine, how r you?']"
          stamp="4 minutes ago"
        />
        <q-chat-message
          name="me"
          avatar="https://cdn.quasar.dev/img/avatar4.jpg"
          :text="['hey, how are you?']"
          sent
          stamp="7 minutes ago"
        />
        <q-chat-message
          name="Jane"
          avatar="https://cdn.quasar.dev/img/avatar3.jpg"
          :text="['doing fine, how r you?']"
          stamp="4 minutes ago"
        />
        <q-chat-message
          name="me"
          avatar="https://cdn.quasar.dev/img/avatar4.jpg"
          :text="['hey, how are you?']"
          sent
          stamp="7 minutes ago"
        />
        <q-chat-message
          name="Jane"
          avatar="https://cdn.quasar.dev/img/avatar3.jpg"
          :text="['doing fine, how r you?']"
          stamp="4 minutes ago"
        />
      </q-infinite-scroll>
      <div class="full-width q-mt-sm">
        <q-form
          @submit="onSubmit"
          @reset="onReset"
          class="q-gutter-md"
        >
          <q-input
            filled
            v-model="name"
            placeholder="Message"
          />

          <div>
            <q-btn label="Submit" type="submit" color="primary"/>
          </div>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script>
import {defineComponent} from 'vue';
export default defineComponent({
  name: 'PageIndex',
});
</script>

<style>
.almost-window-height {
  height: 94vh !important;
}
.chat {
  height: 78vh;
}
</style>
