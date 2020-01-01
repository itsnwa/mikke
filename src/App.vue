<template>
  <div id="app">
    <div class="number-picker" v-if="selectingNumber">
      <div
        class="number"
        v-for="(number, index) in scoreValues"
        :key="index"
        @click="setPoints(number)"
      >
        {{ number }}
      </div>
    </div>
    <div class="undo" :class="{ disabled: records.length <= 1 }" @click="undo">
      Undo
    </div>
    <div class="scores">
      <div class="score" v-for="(score, index) in scores" :key="index">
        {{ score }}
      </div>
    </div>
    <div class="players">
      <div
        class="player"
        :class="{ hit: player.hit }"
        v-for="(player, playerIndex) in players"
        :key="playerIndex"
      >
        <div class="name">
          <img class="avatar" :src="player.avatar" />
          {{ player.name }}
          <div class="points">
            {{ player.points }}
          </div>
        </div>
        <div class="player-scores">
          <div class="winning" v-if="player.finished">
            <img src="./assets/winning.gif" />
          </div>
          <div
            class="player-score"
            v-for="(score, scoreIndex) in player.scores"
            :key="scoreIndex"
            @click="increaseScore(playerIndex, score, scoreIndex)"
          >
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M26 48.5333C38.4448 48.5333 48.5333 38.4448 48.5333 26C48.5333 13.5552 38.4448 3.46667 26 3.46667C13.5552 3.46667 3.46667 13.5552 3.46667 26C3.46667 38.4448 13.5552 48.5333 26 48.5333ZM26 52C40.3594 52 52 40.3594 52 26C52 11.6406 40.3594 0 26 0C11.6406 0 0 11.6406 0 26C0 40.3594 11.6406 52 26 52Z"
                :fill="score === 3 ? `white` : `transparent`"
              />
              <rect
                width="4.08418"
                height="40.8418"
                rx="1"
                transform="matrix(0.708377 -0.705834 0.708377 0.705834 10 13.1725)"
                :fill="score > 1 ? `white` : `transparent`"
              />
              <rect
                width="4.08418"
                height="40.8418"
                rx="1"
                transform="matrix(-0.708377 -0.705834 0.708377 -0.705834 13.0686 41.7103)"
                :fill="score > 0 ? `white` : `transparent`"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moggAvatar from "./assets/møgg.jpg";
import michaelAvatar from "./assets/michael.jpg";
import nichlasAvatar from "./assets/nichlas.jpg";
import matsAvatar from "./assets/mats.jpg";
import ulleAvatar from "./assets/ulle.jpg";

export default {
  name: "app",
  data() {
    return {
      records: [],
      players: [
        {
          name: "Mats",
          scores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          points: 0,
          avatar: matsAvatar,
          finished: false,
          hit: false
        },
        {
          name: "Nichlas",
          scores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          points: 0,
          avatar: nichlasAvatar,
          finished: false,
          hit: false
        },
        {
          name: "Møgg",
          scores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          points: 0,
          avatar: moggAvatar,
          finished: false,
          hit: false
        },
        {
          name: "Michael",
          scores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          points: 0,
          avatar: michaelAvatar,
          finished: false,
          hit: false
        },
        {
          name: "Ulle",
          scores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          points: 0,
          avatar: ulleAvatar,
          finished: false,
          hit: false
        }
      ],
      scores: ["20", "19", "18", "17", "16", "15", "14", "T", "D", "B"],
      scoreValues: [...Array(21).keys()].slice(1).reverse(),
      selectingNumber: false,
      selectedNumber: null,
      isTriple: false,
      isDouble: false,
      notDonePlayers: null
    };
  },
  methods: {
    undo() {
      this.records.pop();
      this.players = JSON.parse(
        JSON.stringify(this.records[this.records.length - 1])
      );
    },
    setPoints(number) {
      this.isTriple ? this.scoreTriple(number) : this.scoreDouble(number);
    },
    scoreTriple(number) {
      let points = number * 3;
      this.notDonePlayers.forEach(player => {
        player.points += points;
        player.hit = true;
        setTimeout(() => {
          player.hit = false;
        }, 1000);
      });
      this.selectingNumber = false;
      this.selectedNumber = null;
      this.isTriple = false;
    },
    scoreDouble(number) {
      let points = number * 2;
      this.notDonePlayers.forEach(player => {
        player.points += points;
        player.hit = true;
        setTimeout(() => {
          player.hit = false;
        }, 1000);
      });
      this.selectingNumber = false;
      this.selectedNumber = null;
      this.isDouble = false;
    },
    increaseScore(player, score, index) {
      if (this.players[player].scores[index] === 3) {
        // Check if other players are done, if not - give them points
        this.notDonePlayers = this.players.filter(
          player => player.scores[index] < 3
        );

        // Check if it's a number (20-14)
        if (index <= 6) {
          this.notDonePlayers.forEach(player => {
            player.points += this.scoreValues[index];
            player.hit = true;
            setTimeout(() => {
              player.hit = false;
            }, 1000);
          });
        } else if (index === 7) {
          // Triples
          this.selectingNumber = true;
          this.isTriple = true;
        } else if (index === 8) {
          // Doubles
          this.selectingNumber = true;
          this.isDouble = true;
        } else {
          // Bull
          this.notDonePlayers.forEach(player => {
            player.hit = true;
            setTimeout(() => {
              player.hit = false;
            }, 1000);
            player.points += 25;
          });
        }
        this.$forceUpdate();
      } else {
        this.players[player].scores[index] =
          this.players[player].scores[index] + 1;
        this.$forceUpdate();
      }
      if (this.players[player].scores.every(score => score === 3)) {
        // Check if player has the least amount of points
        let pointsList = this.players.map(player => player.points);
        let lowScore = Math.min.apply(Math, pointsList);
        let scoreIndex = pointsList.indexOf(lowScore);
        let bestPlayer = this.players[scoreIndex];

        if (bestPlayer.name === this.players[player].name) {
          this.players[player].finished = true;
        }
      } else {
        this.players[player].finished = false;
      }
      this.records.push(JSON.parse(JSON.stringify(this.players)));
    }
  },
  mounted() {
    this.records.push(JSON.parse(JSON.stringify(this.players)));
  }
};
</script>

<style lang="scss">
#app {
  display: flex;
  height: 100%;
}
.undo {
  position: fixed;
  left: 0;
  top: 0;
  width: 100px;
  height: 120px;
  border-bottom: 1px solid #333;
  border-right: 1px solid #333;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  &.disabled {
    color: #333;
    pointer-events: none;
  }
}
.scores {
  width: 100px;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.score {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #333;
  border-right: 1px solid #333;
  &:first-of-type {
    margin-top: 120px;
  }
  &:last-of-type {
    border-bottom: 0;
  }
}
.players {
  display: flex;
  flex: 1;
  height: 100vh;
}
.player {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #333;
  &.hit {
    .name {
      background-color: rgb(236, 84, 73);
    }
  }
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
  &:last-of-type {
    border: 0;
  }
}
.winning {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  img {
    max-width: 100%;
  }
}
.name {
  flex: 0 0 120px;
  border-bottom: 1px solid #333;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  line-height: 1.5;
  text-align: center;
  transition: background-color 1s ease;
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  .points {
    font-size: 18px;
    margin-top: 0.5rem;
    color: #999;
  }
}
.player-scores {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.player-score {
  position: relative;
  flex: 1;
  border-bottom: 1px solid #333;
  display: flex;
  align-items: center;
  justify-content: center;
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
    border: 0;
  }
  svg {
    width: 56px;
    height: 56px;
  }
}
.number-picker {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 512px;
  height: 512px;
  border-radius: 16px;
  color: white;
  z-index: 100;
  overflow: hidden;
}
.number {
  --border-color: rgb(36, 36, 36);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  background-color: rgb(26, 26, 26);
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
</style>
