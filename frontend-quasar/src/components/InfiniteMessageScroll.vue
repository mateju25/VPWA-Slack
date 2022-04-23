<template>
  <q-infinite-scroll id='chat' @scroll='onScroll' @load='onLoad' ref='infiniteScroll' class='full-width overflow-auto'
                     reverse :offset='50' :initial-index='0'>
    <template v-slot:loading>
      <div class='row justify-center q-my-md'>
        <q-spinner color='primary' name='dots' size='20px' v-if='!allLoaded'/>
      </div>
    </template>
    <p class='full-width text-center nomoremessages' v-if='allLoaded'>No more messages</p>

    <div v-for='message in messages' v-bind:key='message.id'>
      <q-chat-message
        v-if='message.user.username === loggedUser.username'
        :name='message.user.username'
        :text='[prepareMessage(message.text)]'
        :text-html='true'
        sent
        :class='Dark.isActive ? "myCustomMessageBlack" : "myCustomMessageWhite"'
        :stamp="date.formatDate(date.extractDate(message.createdAt, 'YYYY-MM-DDTHH:mm:ss.SSSZ'), 'HH:mm DD.MM.YYYY')"
      >
        <template v-slot:avatar>
          <Avatar class='q-mx-md' :contact='message.user' :in-header='false' :noBadge='true' />
        </template>
      </q-chat-message>
      <q-chat-message
        v-else
        :class='Dark.isActive ? "myCustomMessageBlack" : "myCustomMessageWhite"'
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
    <div :class='scrollToBottomClass + (Dark.isActive ? " showMoreButtonDark" : "")'  >
      <q-btn icon='expand_more' @click='scrollToBottom' :class='Dark.isActive ? "showMoreButtonBlack" : "showMoreButtonWhite"'>
        Scroll to bottom
      </q-btn>
    </div>
  </q-infinite-scroll>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import { Dark, date } from 'quasar';
import { Message, User } from 'components/models';
import Avatar from 'components/Avatar.vue';

export default defineComponent({
  name: 'InfiniteMessageScroll',
  components: { Avatar },
  data() {
    return {
      date: date,
      Dark: Dark,
      scrollToBottomClass: 'showMoreButtonHidden'
    };
  },
  props: {
    messages: {
      type: Array as () => Message[],
      required: true
    }
  },
  computed: {
    clonedMessages() {
      return JSON.parse(JSON.stringify(this.messages));
    },
    loggedUser() {
      return this.$store.state.authStore.user as unknown as User;
    },
    notifications(): Message[] {
      return this.$store.state.channelStore.notifications;
    },
    allLoaded(): boolean {
      if (this.$store.state.channelStore.activeChannel === null) {
        return false;
      }
      return this.$store.state.channelStore.messages[this.$store.state.channelStore.activeChannel!.name].allLoaded;
    }
  },
  watch: {
    clonedMessages: {
      handler(value, oldValue) {
        let diff = value.length - oldValue.length
        if (diff == 1) {
          this.$nextTick(() => this.scrollToBottom());
        }
      },
      deep: true
    }
  },
  methods: {
    onScroll() {
      if (document.getElementById('chat') !== null) {
        let objDiv = document.getElementById('chat') as HTMLElement;
        if (objDiv.scrollTop + window.innerHeight - 200 >= objDiv.scrollHeight)
          this.scrollToBottomClass = 'showMoreButtonHidden';
        else
          this.scrollToBottomClass = 'showMoreButton';
      } else {
        this.scrollToBottomClass = 'showMoreButtonHidden';
      }
    },
    scrollToBottom(): void {
      setTimeout(() => {
        if (document.getElementById('chat') !== null) {
          let objDiv = document.getElementById('chat') as HTMLElement;
          objDiv.scroll({
            top: objDiv.scrollHeight,
            behavior: 'smooth'
          })
          // objDiv.scrollTop = objDiv.scrollHeight;
        }
      }, 20);
    },
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
    }
  }
});
</script>

<style>
.nomoremessages {
  color: rgba(128, 128, 128, 0.45);
}
.showMoreButton {
  display: flex;
  position: absolute;
  bottom: 160px;
  width: 96%;
  height: 20px;
  justify-content: center;
  z-index: 20;
}
.showMoreButtonBlack {
  background: #1d1d1d;
}
.showMoreButtonWhite {
  background: #ffffff;
}
.showMoreButton button {
  padding: 0 10px 0 10px;
  font-size: 11px;
  border-radius: 25px;
  box-shadow: 0px 1px 2px var(--q-secondary) !important;
}

.showMoreButtonHidden {
  display: none;
}
.showMoreButtonDark button {
  background-color: #232323;
}
.q-message-container > div {
  max-width: 60%;
}
.myCustomMessageWhite .q-message-text--received {
  color: #d9d9d9;
}
.myCustomMessageWhite .q-message-text--sent{
  color: #d9d9d9;
}
.myCustomMessageWhite .q-message-text-content--sent {
  color: #000000;
}
.myCustomMessageWhite .q-message-text-content--received {
  color: #000000;
}
.myCustomMessageBlack .q-message-text--received {
  color: #1e1d1d;
}
.myCustomMessageBlack .q-message-text--sent{
  color: #1e1d1d;
}
.myCustomMessageBlack .q-message-text-content--sent {
  color: #FFFFFF;
}
.myCustomMessageBlack .q-message-text-content--received {
  color: #FFFFFF;
}
.q-message-text:last-child:before {
  content: none !important;
}
</style>
