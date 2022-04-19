<template>
  <q-infinite-scroll id='chat' @load='onLoad' ref='infiniteScroll' class='full-width overflow-auto' reverse :offset='5' :initial-index='0'>
    <template v-slot:loading>
      <div class='row justify-center q-my-md'>
        <q-spinner color='primary' name='dots' size='20px' />
      </div>
    </template>

    <div v-for='message in messages' v-bind:key='message.id'>
      <q-chat-message
        v-if='message.user.username === loggedUser.username'
        :name='message.user.username'
        :text='[prepareMessage(message.text)]'
        :text-html='true'
        sent
        :stamp="date.formatDate(date.extractDate(message.createdAt, 'YYYY-MM-DDTHH:mm:ss.SSSZ'), 'HH:mm DD.MM.YYYY')"
      >
        <template v-slot:avatar>
          <Avatar class='q-mx-md' :contact='message.user' :in-header='false' :noBadge='true' />
        </template>
      </q-chat-message>
      <q-chat-message
        v-else
        :name='message.user.username'
        :text='[prepareMessage(message.text)]'
        :text-html='true'
        received
        :stamp="date.formatDate(date.extractDate(message.createdAt, 'YYYY-MM-DDTHH:mm:ss.SSSZ'), 'HH:mm DD.MM.YYYY')"
      >
        <template v-slot:avatar>
          <Avatar class='q-mx-md' :contact='message.user' :in-header='false' :noBadge='true' />
        </template>
      </q-chat-message>

    </div>
  </q-infinite-scroll>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import { date } from 'quasar';
import { Message, User } from 'components/models';
import Avatar from 'components/Avatar.vue';

export default defineComponent({
  name: 'InfiniteMessageScroll',
  components: { Avatar },
  data() {
    return {
      date: date,
    };
  },
  props: {
    messages: {
      type: Array as () => Message[],
      required: true,
    },
  },
  computed: {
    loggedUser() {
      return this.$store.state.authStore.user as unknown as User;
    },
  },
  methods: {
    prepareMessage(message: string): string {
      return message.replace('@' + (this.loggedUser as User).username, '<strong class="mention underlined-text">' + (this.loggedUser as User).username + '</strong>');
    },
    onLoad(index: number, done: (stop: boolean) => void) {
      setTimeout(() => {
        this.$store.dispatch('channelStore/loadMoreMessages', {
          channel: this.$store.state.channelStore.activeChannel!.name,
          pagination: index
        }).then(() => {
          done(false);
        }).catch(() => {
          done(true);
        });
      }, 200);
    },
  }
});
</script>

<style>

</style>
