<template>
  <q-page class='q-pa-md container' v-if='userLoaded && messagesLoaded'>
    <UserLeavingDialog :confirm='confirm' @updateConfirm='updateConfirm'/>
    <InfiniteMessageScroll :key='rerender' :messages='alreadyTyped' />

    <div v-if='currentlyTypingUsers.length !== 0' class='typing q-mt-md'
         :class="Dark.isActive ? 'input-bottom-dark' : 'input-bottom-white'">
      <div :class="Dark.isActive ? 'yellow-text' : 'black-text'" class='typing-font q-ml-sm typing-hover cursor-pointer'
           v-for='(user, index) in currentlyTypingUsers' v-bind:key='index'>
        <p>{{ user }} <span v-if='index !== currentlyTypingUsers.length - 1'>,</span></p>

        <div class='text' :class="Dark.isActive ? 'black-scroll-bar input-bottom-dark' : 'white-scroll-bar input-bottom-white'">
          <p class='q-ma-lg'>{{ currentlyTypingMessages[index] }}</p>
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
import { AppVisibility, Dark, date } from 'quasar';
import { Message } from 'components/models';
import { User } from 'src/components/models';
import { mapActions } from 'vuex';
import UserLeavingDialog from 'components/UserLeavingDialog.vue';
import InfiniteMessageScroll from 'components/InfiniteMessageScroll.vue';


export default defineComponent({
  name: 'PageIndex',
  components: { InfiniteMessageScroll, UserLeavingDialog },
  data() {
    return {
      Dark: Dark,
      date: date,
      rerender: false,
      myMessage: '',
      confirm: false,
      loading: false
    };
  },
  computed: {
    activeChannel() {
      return this.$store.state.channelStore.activeChannel;
    },
    activeChannelName() {
      return this.$store.state.channelStore.activeChannel?.name;
    },
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
        return ['@', '/join', '/list', '/invite', '/kick', '/cancel'];
      }
      if (this.iAmOwner && this.isPublic) {
        return ['@', '/join', '/list', '/invite', '/kick', '/quit', '/cancel'];
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
      if (this.$store.state.channelStore.activeChannel === null || this.$store.state.channelStore.messages[this.$store.state.channelStore.activeChannel!.name] === undefined) {
        return [];
      }
      return this.$store.state.channelStore.messages[this.$store.state.channelStore.activeChannel!.name].messages;
    },
    currentlyTypingUsers: function(): string[] {
      if (this.$store.state.channelStore.activeChannel === null || this.$store.state.channelStore.currentlyTyping[this.$store.state.channelStore.activeChannel!.name] === undefined) {
        return [];
      }
      let arr = [];
      for (let item in this.$store.state.channelStore.currentlyTyping[this.$store.state.channelStore.activeChannel!.name])
        arr.push(item)
      return arr;
    },
    currentlyTypingMessages: function(): string[] {
      if (this.$store.state.channelStore.activeChannel === null || this.$store.state.channelStore.currentlyTyping[this.$store.state.channelStore.activeChannel!.name] === undefined) {
        return [];
      }
      let arr = [];
      for (let item in this.$store.state.channelStore.currentlyTyping[this.$store.state.channelStore.activeChannel!.name])
        arr.push(this.$store.state.channelStore.currentlyTyping[this.$store.state.channelStore.activeChannel!.name][item].message)
      return arr;
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
          }).catch((err) => {
            this.showNotification(err.response?.data.message);
          });
        }
      //revoke from private channel, by admin
      } else if (this.myMessage.includes('/revoke') && this.actions.includes('/revoke')) {
        let nickname = this.splitMessage('/revoke');
        let user = this.$store.state.channelStore.activeChannel?.members.find((x) => x.username === nickname);
        if (user) {
          this.$store.dispatch('channelStore/revokeUser', {user: user} );
        } else {
          this.showNotification('User is not in channel.');
        }
      // invite
      } else if (this.myMessage.includes('/invite') && this.actions.includes('/invite')) {
        let nickname = this.splitMessage('/invite');
        let user = this.$store.state.channelStore.activeChannel?.members.find((x) => x.username === nickname);
        if (!user) {
          this.$store.dispatch('channelStore/inviteUser', nickname);
        } else {
          this.showNotification('User is already in channel.');
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
    showNotification(message: string) {
      this.$q.notify({
        color: 'red-4',
        textColor: 'white',
        position: 'top',
        icon: 'warning',
        message: message
      });
    },
    splitMessage(command: string): string {
      let split = this.myMessage.split(command);
      let name = '';
      if (split.length > 1) {
        name = split[1].trim();
      } else {
        name = split[0].trim();
      }
      return name;
    },
    ...mapActions('channelStore', ['addMessage']),
    addCommandToInput(action: string): void {
      this.myMessage = this.myMessage.concat(' ', action);
    },
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
      handler()
      {
        console.log(this.notifications);
        if (!AppVisibility.appVisible) {
          this.notifications.forEach(notification => {
            if (!this.$store.state.authStore.user?.preference.notificationsOn || notification.text.includes('@') ) {

              let message =
                `Channel: ${notification.channel.name}\nUser: ${notification.user.username}\n${notification.text.substring(0, 50)}...`;

              if (!('Notification' in window)) {
                alert('This browser does not support desktop notification');
              }
              else if (Notification.permission === 'granted') {
                new Notification('VoidMessenger', {body: message});
              }
              else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then(function (permission) {
                  if (permission === 'granted') {
                    new Notification('VoidMessenger', {body: message});
                  }
                });
              }
            }
          });
          if (this.notifications.length > 0) {
            this.$store.commit('channelStore/REMOVE_NOTIFICATIONS');
          }
        }
      }
,
      deep: true
    },
    activeChannelName: {
      handler() {
        this.rerender = !this.rerender;
      },
      deep: true
    },
    myMessage: {
      handler() {
        this.$store.dispatch('channelStore/addMessageCurrentlyTyping', { channel: this.$store.state.channelStore.activeChannel!.name, message: this.myMessage });
      }
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
  max-width: 80%;
  font-size: 16px;
  position: absolute;
  bottom: 180px;
  color: white;
  word-wrap: break-word;
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
