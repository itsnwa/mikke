<template>
  <div>
    <div class="options" v-if="!newRoomFormActive && !existingRoomFormActive">
      <div class="option" @click="openNewRoomForm">
        <h3>Create new room</h3>
        <span>
          Set up a new room and let your friends and familiy join you
        </span>
      </div>
      <div class="option" @click="openExistingRoomForm">
        <h3>Join existing room</h3>
        <span>
          Already have a room set up or got an invite from a dart buddy?
        </span>
      </div>
    </div>
    <div class="form" v-if="newRoomFormActive">
      <label>New room name</label>
      <input type="text" v-model="newRoomName" placeholder="Room name" />
      <input type="text" v-model="newRoomPassword" placeholder="optional" />
      <button @click.prevent="createRoom">Create room</button>
      <button @click.prevent="cancel">Cancel</button>
    </div>
    <div class="form" v-if="existingRoomFormActive">
      <label>Room name</label>
      <input type="text" v-model="existingRoomName" placeholder="Room name" />
      <button @click.prevent="joinRoom">Join room</button>
      <button @click.prevent="cancel">Cancel</button>
    </div>
    <div class="form" v-if="passwordPromptActive">
      <label>Enter password</label>
      <input type="text" v-model="existingRoomPassword" />
      <button @click.prevent="joinWithPassword">Let me in!</button>
    </div>
  </div>
</template>

<script>
import firebase, { db } from "@/db"
export default {
  data() {
    return {
      newRoomName: "",
      newRoomPassword: "",
      existingRoomName: "",
      existingRoomPassword: "",
      roomRefSnapshot: null,
      passwordPromptActive: false,
      newRoomFormActive: false,
      existingRoomFormActive: false
    }
  },
  methods: {
    cancel() {
      this.newRoomName = ""
      this.newRoomPassword = ""
      this.existingRoomName = ""
      this.existingRoomPassword = ""
      this.roomRefSnapshot = null
      this.newRoomFormActive = false
      this.existingRoomFormActive = false
      this.passwordPromptActive = false
    },
    openNewRoomForm() {
      this.existingRoomFormActive = false
      this.newRoomFormActive = true
    },
    openExistingRoomForm() {
      this.newRoomFormActive = false
      this.existingRoomFormActive = true
    },
    async createRoom() {
      const roomRef = await db.collection("rooms").doc(this.newRoomName)

      // Make sure room name is not already taken
      this.roomRefSnapshot = await roomRef.get()
      if (this.roomRefSnapshot.exists) {
        return
      }

      // Room name is not taken, navigate to new game room
      this.$router.push(`/${this.newRoomName}`)

      // Set game room in db
      roomRef.set({
        name: this.newRoomName,
        password: this.newRoomPassword ? this.newRoomPassword : "",
        players: []
      })
    },
    async joinRoom() {
      const roomRef = await db.collection("rooms").doc(this.existingRoomName)
      this.roomRefSnapshot = await roomRef.get()
      // Check if room exists
      if (!this.roomRefSnapshot.exists) {
        return
      }
      if (this.roomRefSnapshot.data().password) {
        this.passwordPromptActive = true
      } else {
        this.$router.push(`/${this.existingRoomName}`)
      }
    },
    joinWithPassword() {
      if (this.existingRoomPassword != this.roomRefSnapshot.data().password) {
        this.cancel()
        return
      } else {
        this.$router.push(`/${this.existingRoomName}`)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.options {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 2rem;
  align-content: center;
  height: 100vh;
  max-width: 920px;
  margin: 0 auto;
  padding: 2rem;
  user-select: none;
  @media (min-width: 700px) {
    grid-template-columns: 1fr 1fr;
  }
}
.option {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  border: 1px solid #333;
  border-radius: 6px;
  min-height: 200px;
  padding: 1rem;
  cursor: pointer;
  h3 {
    margin: 0 0 0.5rem 0;
    font-weight: 500;
  }
  span {
    color: #666;
    font-weight: 300;
  }
  &:hover {
    background-color: #141414;
  }
}
</style>
