<template>
  <div>
    <h1>Welcome!</h1>
    <input type="text" v-model="newRoomName" placeholder="Room name" />
    <input type="text" v-model="newRoomPassword" placeholder="optional" />
    <button @click.prevent="createRoom">Create room</button>
    <button @click.prevent="joinRoom">Join room</button>
  </div>
</template>

<script>
import firebase, { db } from "@/db"
export default {
  data() {
    return {
      newRoomName: "",
      newRoomPassword: ""
    }
  },
  methods: {
    async createRoom() {
      const roomRef = await db.collection("rooms").doc(this.newRoomName)

      // Make sure room name is not already taken
      const roomRefSnapshot = await roomRef.get()
      if (roomRefSnapshot.exists) {
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
      const roomRef = await db.collection("rooms").doc(this.newRoomName)
      const roomRefSnapshot = await roomRef.get()
      // Check if room exists
      if (!roomRefSnapshot.exists) {
        return
      }
      // Check if room has password
      if (roomRefSnapshot.data().password === this.newRoomPassword) {
        // Enter room
        this.$router.push(`/${this.newRoomName}`)
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
