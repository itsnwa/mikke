<template>
  <div id="app">
    <div
      class="number-picker"
      v-if="selectingNumber"
      @click="selectingNumber = false"
    >
      <div class="number-picker--card">
        <div
          class="number"
          v-for="(number, index) in pointValues"
          :key="index"
          @click="setPoints(number)"
        >
          <span v-if="number === 50">Bull (50)</span>
          <span v-else>{{ number }}</span>
        </div>
      </div>
    </div>
    <div class="undo" :class="{ disabled: records.length <= 1 }" @click="undo">
      <svg
        width="16"
        height="15"
        viewBox="0 0 16 15"
        fill="white"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.1484 9.42969C15.1484 6.4375 13.125 4.375 9.78125 4.375H5.28906L3.59375 4.44531L4.83594 3.40625L6.60156 1.6875C6.76562 1.52344 6.86719 1.32812 6.86719 1.05469C6.86719 0.5625 6.52344 0.195312 5.99219 0.195312C5.77344 0.195312 5.52344 0.296875 5.35156 0.46875L1.16406 4.60156C0.984375 4.77344 0.882812 5.02344 0.882812 5.26562C0.882812 5.50781 0.984375 5.75781 1.16406 5.92969L5.35156 10.0625C5.52344 10.2344 5.77344 10.3359 5.99219 10.3359C6.52344 10.3359 6.86719 9.96875 6.86719 9.46875C6.86719 9.20312 6.76562 9.00781 6.60156 8.84375L4.83594 7.125L3.59375 6.08594L5.28906 6.16406H9.78906C12.0781 6.16406 13.3828 7.49219 13.3828 9.375C13.3828 11.2656 12.0781 12.6328 9.78906 12.6328H8.04688C7.51562 12.6328 7.14062 13.0391 7.14062 13.5312C7.14062 14.0234 7.51562 14.4297 8.04688 14.4297H9.86719C13.1641 14.4297 15.1484 12.4531 15.1484 9.42969Z"
        />
      </svg>
    </div>
    <div class="scores">
      <div class="score" v-for="(score, index) in scores" :key="index">
        {{ score }}
      </div>
    </div>
    <div class="players">
      <draggable
        v-model="players"
        v-bind="dragOptions"
        @start="drag = true"
        @end="drag = false"
        handle=".drag-handle"
      >
        <transition-group
          class="flex"
          type="transition"
          :name="!drag ? 'flip-list' : null"
        >
          <div
            class="player"
            :class="{
              hit: player.hit,
              playing: player.isPlaying
            }"
            v-for="(player, playerIndex) in players"
            :key="player.name"
          >
            <div
              class="name"
              @click="player.isPlaying ? null : selectPlayer(playerIndex)"
            >
              <div class="drag-handle">
                <svg
                  width="13"
                  height="8"
                  viewBox="0 0 13 8"
                  fill="white"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="0.755859" width="12" height="2" rx="1" />
                  <rect x="0.755859" y="6" width="12" height="2" rx="1" />
                </svg>
              </div>
              {{ player.name }}
              <div class="points" :class="{ blank: player.points === 0 }">
                {{ player.points }}
              </div>
            </div>
            <div class="player-scores">
              <div class="winning" v-if="player.finished">
                <img src="@/assets/winning.gif" />
              </div>
              <div
                class="player-score"
                v-for="(score, scoreIndex) in player.scores"
                :key="scoreIndex"
                @click="
                  player.isPlaying
                    ? increaseScore(playerIndex, score, scoreIndex)
                    : null
                "
              >
                <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M26 48.5333C38.4448 48.5333 48.5333 38.4448 48.5333 26C48.5333 13.5552 38.4448 3.46667 26 3.46667C13.5552 3.46667 3.46667 13.5552 3.46667 26C3.46667 38.4448 13.5552 48.5333 26 48.5333ZM26 52C40.3594 52 52 40.3594 52 26C52 11.6406 40.3594 0 26 0C11.6406 0 0 11.6406 0 26C0 40.3594 11.6406 52 26 52Z"
                    :fill="score >= 3 ? `white` : `transparent`"
                  />
                  <rect
                    width="4.08418"
                    height="40.8418"
                    rx="1"
                    transform="matrix(0.708377 -0.705834 0.708377 0.705834 10 13.1725)"
                    :fill="score >= 2 ? `white` : `transparent`"
                  />
                  <rect
                    width="4.08418"
                    height="40.8418"
                    rx="1"
                    transform="matrix(-0.708377 -0.705834 0.708377 -0.705834 13.0686 41.7103)"
                    :fill="score >= 1 ? `white` : `transparent`"
                  />
                </svg>
              </div>
            </div>
          </div>
        </transition-group>
      </draggable>
    </div>
    <div class="add-new-player">
      <div class="label">New player name</div>
      <input type="text" v-model="newPlayer" />
      <button
        class="button"
        :disabled="newPlayer.length < 2"
        @click="addPlayer"
      >
        Add
      </button>
      <div class="game-controller">
        <button class="button" @click="restartGame">Restart game</button>
        <button class="button" @click="resetGame">Reset</button>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable"
export default {
  name: "app",
  components: {
    draggable
  },
  data() {
    return {
      records: [],
      players: [],
      scores: ["20", "19", "18", "17", "16", "15", "14", "T", "D", "B"],
      scoreValues: [...Array(21).keys()].slice(1).reverse(),
      selectingNumber: false,
      selectedNumber: null,
      isTriple: false,
      isDouble: false,
      notDonePlayers: null,
      gameFinshed: false,
      newPlayer: "",
      drag: false
    }
  },
  computed: {
    pointValues() {
      if (this.isDouble) {
        return [...this.scoreValues, 50]
      } else {
        return this.scoreValues
      }
    },
    dragOptions() {
      return {
        animation: 200,
        disabled: false,
        ghostClass: "ghost"
      }
    }
  },
  methods: {
    restartGame() {
      this.records = []
      this.isTriple = false
      this.isDouble = false
      this.notDonePlayers = null
      this.players.forEach(player => {
        player.scores = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        player.points = 0
        player.finished = false
        player.hit = false
      })
    },
    resetGame() {
      this.players = []
      this.records = []
      this.selectingNumber = false
      this.selectedNumber = null
      this.isTriple = false
      this.isDouble = false
      this.notDonePlayers = null
    },
    addPlayer() {
      if (this.newPlayer.length >= 2) {
        this.players.push({
          name: this.newPlayer,
          scores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          points: 0,
          finished: false,
          hit: false,
          isPlaying: this.players.length <= 0 ? true : false
        })
        this.newPlayer = ""
        this.records.push(JSON.parse(JSON.stringify(this.players)))
      }
    },
    undo() {
      this.gameFinshed = false
      this.records.pop()
      this.players = JSON.parse(
        JSON.stringify(this.records[this.records.length - 1])
      )
    },
    setPoints(number) {
      this.isTriple ? this.scoreTriple(number) : this.scoreDouble(number)
    },
    scoreTriple(number) {
      let points = number * 3
      this.notDonePlayers.forEach(player => {
        player.points += points
        player.hit = true
        setTimeout(() => {
          player.hit = false
        }, 1000)
      })

      this.players.forEach(player => {
        if (player.scores.every(score => score === 3)) {
          // Check if player has the least amount of points
          let pointsList = this.players.map(player => player.points)
          let lowScore = Math.min.apply(Math, pointsList)
          let scoreIndex = pointsList.indexOf(lowScore)
          let bestPlayer = this.players[scoreIndex]

          if (bestPlayer.name === player.name) {
            player.finished = true
          }
        } else {
          player.finished = false
        }
      })

      this.selectingNumber = false
      this.selectedNumber = null
      this.isTriple = false
    },
    scoreDouble(number) {
      let points = number === 50 ? number : number * 2
      this.notDonePlayers.forEach(player => {
        player.points += points
        player.hit = true
        setTimeout(() => {
          player.hit = false
        }, 1000)
      })
      this.players.forEach(player => {
        if (player.scores.every(score => score === 3)) {
          // Check if player has the least amount of points
          let pointsList = this.players.map(player => player.points)
          let lowScore = Math.min.apply(Math, pointsList)
          let scoreIndex = pointsList.indexOf(lowScore)
          let bestPlayer = this.players[scoreIndex]

          if (bestPlayer.name === player.name) {
            player.finished = true
          }
        } else {
          player.finished = false
        }
      })
      this.selectingNumber = false
      this.selectedNumber = null
      this.isDouble = false
    },
    increaseScore(player, score, index) {
      if (this.players[player].scores[index] === 3) {
        // Check if other players are done, if not - give them points
        this.notDonePlayers = this.players.filter(
          player => player.scores[index] < 3
        )

        // Check if it's a number (20-14)
        if (index <= 6) {
          this.notDonePlayers.forEach(player => {
            player.points += this.scoreValues[index]
            player.hit = true
            setTimeout(() => {
              player.hit = false
            }, 1000)
          })
        } else if (index === 7) {
          // Triples
          this.selectingNumber = true
          this.isTriple = true
        } else if (index === 8) {
          // Doubles
          this.selectingNumber = true
          this.isDouble = true
        } else {
          // Bull
          this.notDonePlayers.forEach(player => {
            player.hit = true
            setTimeout(() => {
              player.hit = false
            }, 2000)
            player.points += 25
          })
        }
        this.$forceUpdate()
      } else {
        this.players[player].scores[index] =
          this.players[player].scores[index] + 1
        this.$forceUpdate()
      }
      if (this.players[player].scores.every(score => score === 3)) {
        // Check if player has the least amount of points
        let pointsList = this.players.map(player => player.points)
        let lowScore = Math.min.apply(Math, pointsList)
        let scoreIndex = pointsList.indexOf(lowScore)
        let bestPlayer = this.players[scoreIndex]

        // Check if all scores are 0 and no one is finished
        if (pointsList.every(score => score === 0) && !this.gameFinshed) {
          this.players[player].finished = true
          this.gameFinshed = true
        } else if (
          bestPlayer.name === this.players[player].name &&
          !this.gameFinished
        ) {
          this.players[player].finished = true
          this.gameFinshed = true
        }
      } else {
        this.players[player].finished = false
      }
      this.records.push(JSON.parse(JSON.stringify(this.players)))
    },
    selectPlayer(index) {
      const prevPlayer = this.players.find(player => player.isPlaying)
      if (prevPlayer) {
        prevPlayer.isPlaying = false
        this.players[index].isPlaying = true
        this.records.push(JSON.parse(JSON.stringify(this.players)))
      } else {
        this.players[index].isPlaying = true
        this.records.push(JSON.parse(JSON.stringify(this.players)))
      }
    }
  }
}
</script>

<style lang="scss">
.undo {
  position: absolute;
  left: 0;
  top: 0;
  width: 4rem;
  height: var(--header-height);
  border-bottom: 1px solid var(--border-color);
  border-right: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  &.disabled {
    pointer-events: none;
    svg {
      opacity: 0.4;
    }
  }
}
.scores {
  position: absolute;
  left: 0;
  top: var(--header-height);
  width: 4rem;
  height: calc(100vh - var(--header-height));
  display: flex;
  flex-direction: column;
  user-select: none;
  pointer-events: none;
  padding: 0 0 env(safe-area-inset-bottom) 0;
  touch-action: none;
}
.score {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--border-color);
  border-right: 1px solid var(--border-color);
  line-height: 0;
  font-size: 1rem;
  min-height: 2.06rem;
  font-weight: bold;
  user-select: none;
  &:last-of-type {
    border-bottom: 0;
  }
}
.players {
  height: 100vh;
  width: calc(100vw - 4rem);
  position: absolute;
  left: 4rem;
  top: 0;
  user-select: none;
  padding: 0 0 env(safe-area-inset-bottom) 0;
  .flex {
    display: flex;
    width: 100%;
    height: 100vh;
  }
}
.player {
  position: relative;
  flex: 1;
  display: inline-flex;
  flex-direction: column;
  user-select: none;
  &.hit {
    .name {
      background-color: rgb(236, 84, 73);
    }
    .points {
      color: white;
    }
  }
  &.playing {
    background-color: hsla(0, 0%, 100%, 0.06);
    .name {
      color: rgb(43, 255, 156);
    }
  }
  &:last-of-type {
    .name {
      border-right: 0;
    }
    .player-score {
      border-right: 0;
    }
  }
}
.winning {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;
  img {
    width: 125%;
    height: 100%;
  }
}
.name {
  position: relative;
  flex: 0 0 var(--header-height);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: bold;
  text-align: center;
  user-select: none;
  transition: background-color 1s ease;
  border-right: 1px solid var(--border-color);
  .points {
    font-weight: normal;
    margin-top: 0.25rem;
    color: rgb(135, 135, 146);
    transition: color 1s ease;
    user-select: none;
    &.blank {
      color: rgb(56, 56, 61);
    }
  }
  .drag-handle {
    margin-top: -12px;
    padding-bottom: 4px;
    svg {
      opacity: 0.1;
    }
  }
}
.player-scores {
  display: flex;
  flex-direction: column;
  height: calc(100vh - var(--header-height));
  user-select: none;
  touch-action: pan-x;
}
.player-score {
  position: relative;
  flex: 1;
  border-bottom: 1px solid var(--border-color);
  border-right: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  &:hover {
    &:after {
      position: absolute;
      content: "";
      height: 100%;
      width: 200vw;
      background-color: #666;
      z-index: -100;
      opacity: 0.2;
    }
  }
  &:last-of-type {
    border-bottom: 0;
  }
  svg {
    width: 2rem;
    height: 2rem;
  }
}
.number-picker {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: hsla(0, 0, 0%, 0.9);
  z-index: 1000;
}

.number-picker--card {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  height: 50vh;
  border-radius: 16px;
  color: white;
  z-index: 100;
  overflow: hidden;
  user-select: none;
}

.number {
  --border-color: rgb(36, 36, 36);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  background-color: var(--bg-color);
  user-select: none;
  &:hover {
    background-color: var(--border-color);
  }
  &:nth-of-type(4n + 1) {
    border-bottom: 1px solid var(--border-color);
    border-right: 1px solid var(--border-color);
  }
  &:nth-of-type(4n + 2) {
    border-bottom: 1px solid var(--border-color);
    border-right: 1px solid var(--border-color);
  }
  &:nth-of-type(4n + 3) {
    border-bottom: 1px solid var(--border-color);
    border-right: 1px solid var(--border-color);
  }
  &:nth-of-type(4n + 4) {
    border-bottom: 1px solid var(--border-color);
  }
}
.add-new-player {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  position: absolute;
  left: 100vw;
  top: 0;
}
input {
  margin-top: 1rem;
  font-size: 1rem;
  -moz-appearance: none;
  border-radius: 0.3rem;
  padding: 0.8rem 1rem;
  outline: none;
  border: 0;
}
.button {
  -moz-appearance: none;
  background-color: white;
  border-radius: 0.3rem;
  padding: 0.8rem 1rem;
  margin-top: 2rem;
  margin-right: 0.5rem;
  &:last-of-type {
    margin-right: 0;
  }
}
.ghost {
  opacity: 0;
}
.flip-list-move {
  transition: transform 0.5s;
}
</style>
