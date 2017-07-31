<template>
  <div class="footernav">
    <mu-paper v-show="!toolbarVisible">
      <mu-bottom-nav @change="handleChange">
        <mu-bottom-nav-item value="recommended" title="推荐" rippleColor="#fff">
          <i class="icon-notes"></i>
        </mu-bottom-nav-item>
        <mu-bottom-nav-item value="radio" title="电台" rippleColor>
          <i class="icon-radio"></i>
        </mu-bottom-nav-item>
        <mu-bottom-nav-item value="search" title="搜索" rippleColor>
          <i class="icon-search"></i>
        </mu-bottom-nav-item>
        <mu-bottom-nav-item value="user" title="当前" rippleColor v-show="currentFlag">
          <i class="icon-play_circle_filled"></i>
        </mu-bottom-nav-item>
      </mu-bottom-nav>
    </mu-paper>
    <mu-paper v-show="toolbarVisible">
      <mu-flexbox>
        <mu-flexbox-item class="flex-demo">
          <div class="playbar" @click.prevent.stop="backAudioView">
            <div class="leftbar"><div :style="'transform:rotateZ('+leftdeg+'deg)'"></div></div>
            <div class="rightbar"><div :style="'transform:rotateZ('+rightdeg+'deg)'"></div></div>
            <img :src="song.albumpic">
          </div>
        </mu-flexbox-item>
        <mu-flexbox-item class="flex-demo">
          <mu-icon-button><i class="icon-skip_previous" @click="prevPlay"></i></mu-icon-button>
        </mu-flexbox-item>
        <mu-flexbox-item class="flex-demo">
          <mu-icon-button><i :class="playIcon?'icon-pause':'icon-play_arrow'" @click="togglePlay"></i></mu-icon-button>
        </mu-flexbox-item>
        <mu-flexbox-item class="flex-demo">
          <mu-icon-button><i class="icon-skip_next" @click="nextPlay"></i></mu-icon-button>
        </mu-flexbox-item>
        <mu-flexbox-item class="flex-demo">
          <mu-icon-button><i class="icon-queue_music" @click="openPlaylist"></i></mu-icon-button>
        </mu-flexbox-item>
        <mu-flexbox-item class="flex-demo">
          <mu-icon-button><i class="icon-forward" @click="changeIndexNav"></i></mu-icon-button>
        </mu-flexbox-item>
      </mu-flexbox>
    </mu-paper>
  </div>
</template>
<script type="text/ecmascript-6">
  import {mapState, mapMutations} from 'vuex';
  export default {
    name: 'recommended',
    data () {
      return {
        playingMusic: {},
        currentIndex: null
      };
    },
    computed: {
      ...mapState(['toolbarVisible', 'isplaying', 'song', 'currentTime', 'duration']),
      playIcon () {
          if (this.isplaying) {
              return !0;
          } else {
              return !1;
          }
      },
      rightdeg () {
        let deg = -180;
        this.currentTime && (deg = -180 + parseInt(this.currentTime / this.duration * 360) >= 0 ? 0 : -180 + parseInt(this.currentTime / this.duration * 360));
        return deg;
      },
      leftdeg () {
        let deg = parseInt(this.currentTime / this.duration * 360) >= 180 ? -360 + parseInt(this.currentTime / this.duration * 360) : -182;
        return deg;
      },
      currentFlag () {
        this.currentIndex = this.$store.state['song'].index;
        return this.$store.state['song'].id;
      }
    },
    mounted () {
      this.playingMusic = document.getElementById('music');
      this.playingMusic.addEventListener('ended', () => {
        this.nextPlay();
      });
    },
    methods: {
      ...mapMutations(['play', 'pause']),
      handleChange (val) {
        if (val === 'user') {
          this.$store.state['toolbarVisible'] = !0;
          return;
        }
        this.$parent.isAudioVisible = !1;
        this.$router.push(val);
      },
      togglePlay () {
         this.$store.state['isplaying'] ? (this.pause(), this.playingMusic.pause()) : (this.play(), this.playingMusic.play());
      },
      openPlaylist () {
          this.$router.push('audioPlaylist');
          this.$parent.isAudioVisible = !1;
      },
      backAudioView () {
        this.$parent.isAudioVisible = !0;
      },
      changeIndexNav () {
        this.$store.state['toolbarVisible'] = !1;
      },
      nextPlay () {
        if (this.$store.state.mode === 1) {
          this.currentIndex++;
          this.currentIndex >= this.$store.state.playlist.length && (this.currentIndex = 0);
        }
        this.$store.state.song = this.$store.state.playlist[this.currentIndex];
        this.play();
        this.playingMusic.play();
      },
      prevPlay () {
        if (this.$store.state.mode === 1) {
          this.currentIndex--;
          this.currentIndex < 0 && (this.currentIndex = this.$store.state.playlist.length - 1);
        }
        this.$store.state.song = this.$store.state.playlist[this.currentIndex];
        this.play();
        this.playingMusic.play();
      }
    }
  };
</script>
<style rel="stylesheet/stylus" lang="stylus">
  @import '../../assets/stylus/mixin.styl';
  .footernav
    position absolute
    left 0
    bottom 0
    width 100%
    z-index 9999
    box-shadow px2rem(0) px2rem(-4) px2rem(4) rgba(255,255,255,0.1)
    background-color: rgba(8,7,7,0.4);
    .playbar
      width px2rem(84)
      height px2rem(84)
      border-radius px2rem(84)
      overflow hidden
      top px2rem(8)
      display flex
      position relative
      margin 0 auto
      & img
        display block
        width px2rem(80)
        height px2rem(80)
        border-radius 50%
        position absolute
        top px2rem(2)
        left px2rem(2)
      .leftbar, .rightbar
        width px2rem(42)
        height px2rem(84)
        position relative
        overflow hidden
      .leftbar
        border-radius px2rem(84) 0 0 px2rem(84)
      .rightbar
        border-radius 0 px2rem(84) px2rem(84) 0
      .rightbar div, .leftbar div
        background-color aqua
        display block
        width px2rem(42)
        height px2rem(84)
        transform-origin left center
        animation flicker 3s infinite
        border-radius 0 px2rem(84) px2rem(84) 0
      .leftbar div
        transform-origin right center
        border-radius px2rem(84) 0 0 px2rem(84)
    .mu-circle-ripple
      background-color #fff
    & i
      font-size px2rem(40)
      color #fff
    & span
      font-size px2rem(24)
      color #fff
    .mu-bottom-item-active
      .mu-bottom-item-text
        font-size px2rem(24)
        color #fff
    .mu-icon-button
      vertical-align middle
      padding 0
      width px2rem(80)
      height px2rem(80)
      & i
        width 100%
        height 100%
        position absolute
        line-height px2rem(80)
        top 0
        left 0

  @keyframes flicker {
    0% {
      opacity 1
    }
    50% {
      opacity 0.2
    }
    100% {
      opacity 1
    }
  }
</style>
