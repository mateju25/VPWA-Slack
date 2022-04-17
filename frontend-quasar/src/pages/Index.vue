<template>
  <q-page class='q-pa-md container' v-if='userLoaded && messagesLoaded'>
    <UserLeavingDialog :confirm='confirm' @updateConfirm='updateConfirm'/>
    <q-infinite-scroll id='chat' @load='onLoad' class='full-width overflow-auto' reverse>
      <template v-slot:loading>
        <div class='row justify-center q-my-md'>
          <q-spinner color='primary' name='dots' size='20px' />
        </div>
      </template>

      <div v-for='message in alreadyTyped' v-bind:key='message.id'>
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
    <div v-if='currentlyTyping.length !== 0' class='typing q-mt-md'
         :class="Dark.isActive ? 'input-bottom-dark' : 'input-bottom-white'">
      <div :class="Dark.isActive ? 'yellow-text' : 'black-text'" class='typing-font q-ml-sm typing-hover cursor-pointer'
           v-for='(message, index) in currentlyTyping' v-bind:key='message.id'>
        <p>{{ message.user.username }} <span v-if='index !== currentlyTyping.length - 1'>,</span></p>

        <div class='text' :class="Dark.isActive ? 'input-bottom-dark' : 'input-bottom-white'">
          <p class='q-ma-lg' :class="Dark.isActive ? '' : 'black-text'">{{ message.text }}</p>
        </div>

      </div>
      <p class='typing-font q-ml-sm' :class="Dark.isActive ? 'yellow-text' : 'black-text'">is typing...</p>
    </div>
    <q-form
      @submit='submit'
      class='my-form'
    >
      <div>
        <q-input
          class='chat-input'
          square filled
          type='textarea'
          v-model='myMessage'
          placeholder='Message'
          @keyup.ctrl.enter='submit'
        />
        <p class='sent-hint'>Ctrl + Enter to send message</p>
      </div>
      <div :class="Dark.isActive ? 'input-bottom-dark' : 'input-bottom-white'">
        <div class='row justify-between'>
          <q-btn color='secondary' class='menu-actions' icon='code' flat>
            <q-menu
              transition-show='scale'
              transition-hide='scale'
            >
              <q-list class='menu-actions'>
                <q-btn
                  v-for='btn in actions'
                  :key='btn'
                  flat
                  :color="Dark.isActive ? 'white' : 'black'"
                  :label='btn'
                  @click='addCommandToInput(btn)'
                />
              </q-list>
            </q-menu>
          </q-btn>
          <div class='row'>
            <q-btn
              class='menu-btns'
              v-for='btn in actions'
              :key='btn'
              flat
              :color="Dark.isActive ? 'white' : 'black'"
              :label='btn'
              @click='addCommandToInput(btn)'
            />
          </div>
          <q-btn
            :disable='myMessage.length === 0 || loading'
            icon='send'
            type='submit'
            v-on:keypress.ctrl.enter='submit'
            color='secondary'
            size='md'
            flat
            class='float-right q-pa-xs q-px-md'
          />
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import { Dark, date } from 'quasar';
import { Message } from 'components/models';
import { User } from 'src/components/models';
import Avatar from 'components/Avatar.vue';
import { mapActions } from 'vuex';
import { AppVisibility } from 'quasar';
import UserLeavingDialog from 'components/UserLeavingDialog.vue';


export default defineComponent({
  name: 'PageIndex',
  components: { Avatar, UserLeavingDialog },
  data() {
    return {
      Dark: Dark,
      date: date,
      myMessage: '',
      confirm: false,
      loading: false
    };
  },
  computed: {
    isGeneral() {
      return this.$store.state.channelStore.activeChannel?.name === 'General';
    },
    iAmMember() {
      return this.$store.state.channelStore.activeChannel?.members.find(member => member.id === this.$store.state.authStore.user?.id) !== undefined;
    },
    isPublic() {
      return this.$store.state.channelStore.activeChannel?.isPrivate === false;
    },
    iAmOwner() {
      return this.$store.state.channelStore.activeChannel?.owners.find(owner => owner.id === this.$store.state.authStore.user?.id) !== undefined;
    },
    actions() {
      if (this.isGeneral) {
        return ['@', '/join', '/list'];
      }
      if (this.iAmMember && !this.isPublic) {
        return ['@', '/join', '/list', '/cancel'];
      }
      if (this.iAmOwner && !this.isPublic) {
        return ['@', '/join', '/list', '/invite', '/revoke', '/kick', '/quit', '/cancel'];
      }
      if (this.iAmMember && this.isPublic) {
        return ['@', '/join', '/list', '/kick', '/cancel'];
      }
      if (this.iAmOwner && this.isPublic) {
        return ['@', '/join', '/list', '/kick', '/quit', '/cancel'];
      }
      return [];
    },
    error(): string | null {
      return this.$store.state.channelStore.error;
    },
    notifications(): Message[] {
      return this.$store.state.channelStore.notifications;
    },
    messagesLoaded(): boolean {
      return !this.$store.state.channelStore.loading && this.$store.state.channelStore.statusChannel === 'success';
    },
    userLoaded(): boolean {
      return this.$store.state.authStore.user !== null;
    },
    loggedUser() {
      return this.$store.state.authStore.user as unknown as User;
    },
    alreadyTyped: function(): Message[] {
      if (this.$store.state.channelStore.activeChannel === null) {
        return [];
      }
      return this.$store.state.channelStore.messages[this.$store.state.channelStore.activeChannel!.name];
    },
    currentlyTyping: function(): Message[] {
      return [];
    }
  },
  methods: {
    updateConfirm(newValue: boolean) {
      this.confirm = newValue;
    },
    prepareMessage(message: string): string {
      return message.replace('@' + (this.loggedUser as User).username, '<strong class="mention underlined-text">' + (this.loggedUser as User).username + '</strong>');
    },
    async submit() {
      this.loading = true;
      if (this.myMessage.includes('/list') && this.actions.includes('/list')) {
        this.$emit('commandList');
      } else if (this.myMessage.includes('/quit') && this.actions.includes('/quit')) {
        this.confirm = true;
      } else if (this.myMessage.includes('/cancel') && this.actions.includes('/cancel')) {
        this.confirm = true;
      } else if (this.myMessage.includes('/join') && this.actions.includes('/join')) {
        let split = this.myMessage.split('/join');
        let name = '';
        if (split.length > 1) {
          name = split[1].trim();
        } else {
          name = split[0].trim();
        }
        let isPrivate = name.includes('private');
        name = name.split('private')[0].trim();
        if (name !== '') {
          await this.$store.dispatch('channelStore/addChannel', {
            name: name,
            isPrivate: isPrivate
          });
        }
      } else if (this.myMessage.includes('/kick') && this.actions.includes('/kick')) {
        let split = this.myMessage.split('/kick');
        let name = '';
        if (split.length > 1) {
          name = split[1].trim();
        } else {
          name = split[0].trim();
        }
        if (name !== '') {
          await this.$store.dispatch('channelStore/kickFromChannel', {
            kickedUser: name,
            channel: this.$store.state.channelStore.activeChannel
          });
        }
      } else {
        await this.addMessage({ channel: this.$store.state.channelStore.activeChannel!.name, message: this.myMessage });
      }
      this.myMessage = '';
      this.loading = false;
    },
    scrollToBottom() {
      setTimeout(() => {
        if (document.getElementById('chat') !== null) {
          let objDiv = document.getElementById('chat') as HTMLElement;
          objDiv.scrollTop = objDiv.scrollHeight;
        }
      }, 20);
    },
    ...mapActions('channelStore', ['addMessage']),
    onLoad(index: number, done: () => void) {
      // setTimeout(() => {
      //   // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      //   done()
      // }, 2000)
      done();
    },
    addCommandToInput(action: string): void {
      this.myMessage = this.myMessage.concat(' ', action);
    }
  },
  watch: {
    error: {
      handler() {
        if (this.$store.state.channelStore.error !== null) {
          this.$q.notify({
            color: 'red-4',
            textColor: 'white',
            position: 'top',
            icon: 'warning',
            message: this.$store.state.channelStore.error as string
          });
          this.$store.commit('channelStore/SET_ERROR', null);
        }
      },
      deep: true
    },
    notifications: {
      handler() {
        if (!AppVisibility.appVisible) {
          this.notifications.forEach(notification => {
            console.log(this.$store.state.authStore.user?.preference.notificationsOn)
            if (!this.$store.state.authStore.user?.preference.notificationsOn || notification.text.includes('@')) {
              let message =
                `<b style='color: black'>Channel: ${notification.channel.name}</b></br>
             <b style='color: black'>User: ${notification.user.username}</b></br>
             <p style='color: black' class='q-mt-md'>${notification.text}</p>`;
              this.$q.notify({
                color: 'blue-4',
                textColor: 'white',
                position: 'top',
                html: true,
                type: 'info',
                message: message
              });
            }
          });
          if (this.notifications.length > 0) {
            this.$store.commit('channelStore/REMOVE_NOTIFICATIONS');
          }
        }
      },
      deep: true
    },
    alreadyTyped: {
      handler() {
        this.$nextTick(() => this.scrollToBottom());
      },
      deep: true
    }
  }

})
;
</script>

<style>
.menu-actions {
  display: block;
}

.menu-btns {
  display: none;
}

.menu-actions .q-btn__content {
  margin-top: 2px;
}

@media (min-width: 1270px) {
  .menu-actions {
    display: none;
  }

  .menu-btns {
    display: block;
  }
}

#chat {
  height: 86%;
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
}

.q-field__control {
  padding: 0 !important;
}

.q-textarea .q-field__native {
  padding: 0.8em;
}

.text {
  max-width: 40%;
  font-size: 16px;
  position: absolute;
  bottom: 180px;
  color: white;
  background: var(--q-dark);
  box-shadow: 0 0px 8px var(--q-secondary), 0 2px 2px rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 12%) !important;
}

.input-bottom-dark {
  background-color: var(--q-dark);
}

.input-bottom-white {
  background-color: #d9d9d9;
}

.typing {
  height: 20px;
  display: flex;
}

.typing-font {
  font-size: 12px;
}

.yellow-text {
  color: #f3ce7a;
}

.black-text {
  color: black;
}

.typing-hover .text {
  visibility: hidden;
  opacity: 0;
  transition: .3s;
}

.typing-hover:hover .text {
  visibility: visible;
  opacity: 1;
  transition: .3s;
}

.chat-input {
  width: 100%;
}

.chat-input textarea {
  height: 90px;
  max-height: 200px;
  resize: none !important;
}

.mention {
  background: var(--q-secondary);
  border-radius: 5px;
  padding: 2px;
}

.sent-hint {
  color: rgba(128, 128, 128, 0.45);
  position: absolute;
  right: 5px;
  top: 70px;
}
</style>
