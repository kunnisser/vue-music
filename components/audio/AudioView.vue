<template>
  <div class="audio-wrap">
    <div class="audio-header">
      <i class="icon-navigate_before" @click.prevent.stop="backCount"></i>
      <div class="audio-title">{{song.name}}</div>
      <i class="mode-control" :class="setMode" @click.stop="changeMode"></i>
    </div>
    <div class="audio-box">
      <audio id="music" :src="dataurl" autoplay="autoplay" v-on:timeupdate="updateTime"></audio>
    </div>
    <div class="audio-panel">
      <div class="audio-thumb">
        <img :src="backPic" v-show="!lyricsVisible" @click.prevent.stop="showLyrics($event)">
        <div class="audio-lyrics" ref="lyricView" v-show="lyricsVisible" @click.prevent.stop="hideLyrics">
          <ul>
            <li v-for="data in lyric" v-bind:class="data[0][1]"><p>{{data[1]}}</p></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="audio-toolbar">
      <div class="timerdata"><span>{{showCurrentTime}}</span></div>
      <div class="music-slider" ref="slider">
        <mu-slider v-model="progress"/>
      </div>
      <div class="timerdata"><span>{{showDuration}}</span></div>
    </div>
    <div class="audio-bg" v-bind:style="{backgroundImage: 'url(\'' +backPic + '\')'}">
      <div class="audio-mask"></div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import {mapState} from 'vuex';
  import config from '../../data/config.json';
  import Bscroll from 'better-scroll';
  export default {
    name: 'audio',
    data () {
      return {
        currentId: null,
        backpic: '',
        audio: {},
        progress: 0,
        modifyFlag: !1,
        autoFlag: !0,
        lyricsVisible: !0,
        lyricsTimerArr: [],
        lyricStr: [],
        cur: ''
      };
    },
    mounted () {
      let sliderHandler = document.querySelector('.mu-slider');
      sliderHandler.addEventListener('touchstart', () => {
        this.autoFlag = !1;
      });
      sliderHandler.addEventListener('mousedown', () => {
        this.autoFlag = !1;
      });
      sliderHandler.addEventListener('touchcancel', () => {
        this.endChosebuoy();
      });
      sliderHandler.addEventListener('touchend', () => {
        this.endChosebuoy();
      });
      sliderHandler.addEventListener('mouseup', () => {
        this.endChosebuoy();
      });
      sliderHandler.addEventListener('mouseleave', () => {
        this.endChosebuoy();
      });
    },
    methods: {
      endChosebuoy () {
        this.autoFlag = !0;
        document.getElementById('music').currentTime = this.progress / 100 * document.getElementById('music').duration;
        document.getElementById('music').play();
        this.$store.state.isplaying = !0;
      },
      backCount () {
        this.$parent.isAudioVisible = !1;
      },
      updateTime () {
        document.getElementById('music').duration && (this.$store.commit('updateCurrentTime', parseInt(document.getElementById('music').currentTime)),
          this.$store.commit('updateDuration', parseInt(document.getElementById('music').duration)));
        this.autoFlag && (this.progress = this.$store.state['currentTime'] / this.$store.state['duration'] * 100);
      },
      showLyrics () {
        this.lyricsVisible = !0;
      },
      hideLyrics (event) {
        if (!event._constructed) {
          return;
        }
        this.lyricsVisible = !1;
      },
      changeMode () {
        this.$store.state.mode === 1 ? (this.$store.state.mode = 2) : (this.$store.state.mode = 1);
      }
    },
    computed: {
      ...mapState(['isplaying', 'song', 'isLoop', 'lyric']),
      ...mapState({
        dataurl (state) {
          if (state.song.id === 'undefined') {
            this.currentId = state.song.data.songid;
          } else {
            this.currentId = state.song.id;
          }
          if (this.currentId) {
            return config.path.streamheader + this.currentId + config.path.streamfooter;
          } else {
            return '';
          }
        },
        isAutoPlay (state) {
          return state.isplaying;
        },
        backPic (state) {
          if (state.song.albummid) {
            this.backpic = config.path.basePicpath + state.song.albummid + config.path.basePicbackname;
            state.song.albumpic = this.backpic;
            return this.backpic;
          } else {
            return '';
          }
        },
        showCurrentTime (state) {
          let min = Math.floor(state.currentTime / 60).toString().length === 1 ? '0' + Math.floor(state.currentTime / 60).toString() : Math.floor(state.currentTime / 60).toString();
          let sec = ((state.currentTime % 60).toString().length === 1) ? '0' + (state.currentTime % 60).toString() : (state.currentTime % 60).toString();
          this.cur = this.lyricsTimerArr.sort((a, b) => {
            return Math.abs(a - state.currentTime) - Math.abs(b - state.currentTime);
          })[0];
          if (this.cur) {
            if (this.lyric[this.cur]) {
              for (let i in this.lyric) {
                i === this.cur ? (this.lyric[this.cur][0][1] = 'curActive') : (this.lyric[i][0][1] = '');
              }
              let lyricEle = document.querySelector('.curActive');
              lyricEle && this.lyricScroll && this.lyricScroll.scrollToElement(lyricEle, 300, 0, true);
            }
          }
          let ct = min + ' : ' + sec;
          return ct;
        },
        showDuration (state) {
          let min = Math.floor(state.duration / 60).toString().length === 1 ? '0' + Math.floor(state.duration / 60).toString() : Math.floor(state.duration / 60).toString();
          let sec = ((state.duration % 60).toString().length === 1) ? '0' + (state.duration % 60).toString() : (state.duration % 60).toString();
          let ct = min + ' : ' + sec;
          return ct;
        },
        setMode (state) {
          if (state.mode === 1) {
            return 'icon-repeat';
          }
          if (state.mode === 2) {
            return 'icon-repeat_one';
          }
        }
      })
    },
    watch: {
      song (song) {
        this.$store.state['lyric'] = {};
        this.progress = 0;
        this.$http.jsonp(config.path.lyric + song.id, {'jsonp': 'callback'}).then((response) => {
          this.lyricStr = decodeURIComponent(escape(window.atob(response.data.lyric)));
        if (this.lyricStr.split('[').slice(5).length > 0) {
          this.lyricStr && (this.$store.state['lyric'] = this.lyricStr.split('[').slice(5).map((str) => {
              let t = str.split(']');
          t[0] = t[0].split(':');
          if (t[1].length > 1) {
            return {[parseInt(t[0][0] * 60) + parseInt(t[0][1])]: [[t[0]], t[1]]};
          }
        }).reduce((a, b) => {
            return {...a, ...b};
        }));
        } else {
          this.$store.state['lyric'] = {'0': [[], '此歌曲为没有填词的纯音乐，请您欣赏']};
        }
        this.lyricsTimerArr = [];
        for (let i in this.$store.state['lyric']) {
          this.lyricsTimerArr.push(i);
        }
        this.lyricsTimerArr = this.lyricsTimerArr.slice(0, this.lyricsTimerArr.length - 1);
        this.$nextTick(() => {
          this.lyricScroll = new Bscroll(this.$refs.lyricView, {
          click: !0,
          probeType: 3
        });
        this.lyricsVisible = !1;
      });
      });
      }
    }
  };
</script>
<style rel="stylesheet/stylus" lang="stylus">
  @import '../../assets/stylus/mixin.styl';
  .audio-wrap
    position absolute
    width 100%
    top 0
    left 0
    bottom 0
    z-index 99
    .audio-header
      font-size px2rem(50)
      height px2rem(80)
      z-index 99
      position relative
      color #fff
      background-color rgba(0,0,0,0.2)
      box-shadow px2rem(0) px2rem(4) px2rem(4) rgba(0,0,0,0.4)
      & i
        display block
        position absolute
        top px2rem(12)
        z-index 999
      .icon-navigate_before
        left px2rem(4)
      .audio-title
        text-align center
        font-size px2rem(34)
        line-height px2rem(80)
      .mode-control
        top px2rem(20)
        right px2rem(18)
        font-size px2rem(40)
    .audio-box
      display none
    .audio-panel
      width 100%
      position absolute
      top px2rem(80)
      bottom px2rem(300)
      z-index 999
      .audio-thumb
        position relative
        height 100%
        & img
          display block
          width px2rem(400)
          height px2rem(400)
          border px2rem(10) solid rgba(0,0,0,0.8)
          border-radius 50%
          box-shadow px2rem(2) px2rem(4) px2rem(8) rgba(0,0,0,0.6)
          animation rotateInfinite 15s linear infinite;
          position absolute
          left 50%
          top 50%
          margin-left px2rem(-200)
          margin-top px2rem(-200)
        .audio-lyrics
          width 100%
          height 100%
          overflow hidden
          font-size px2rem(28)
          color #fff
          box-sizing border-box
          margin-top px2rem(80)
          & li
            text-align center
            line-height px2rem(60)
            & p
              max-width px2rem(600)
              overflow hidden
              text-overflow ellipsis
              white-space word-break
              margin 0 auto
              opacity 0.6
              color #f0f0f0
          .curActive
            & p
              opacity 1
              color #fff
    .model-control
      width 100%
      height px2rem(80)
      position absolute
      bottom px2rem(180)
      color #fff
      z-index 999
      font-size px2rem(24)
    .audio-toolbar
      width 100%
      height px2rem(80)
      position absolute
      bottom px2rem(100)
      display flex
      align-items center
      .timerdata
        flex 1
        width 100%
        text-align center
        position relative
        z-index 99999
        & span
          font-size px2rem(22)
          color #fff
      .music-slider
        flex 0 0 px2rem(500)
        width px2rem(500)
        margin 0 auto
        position relative
        z-index 999
        .mu-slider
          margin-bottom 0
          .mu-slider-track
            height px2rem(4)
            margin-top 0
            background-color #fff
          .mu-slider-fill
            height px2rem(4)
            margin-top 0
            background-color rgba(0,0,0,0.8)
          .mu-slider-thumb
            width px2rem(30)
            height px2rem(30)
            margin-top px2rem(2)
            background-color #111
            .mu-focus-ripple-wrapper
              width px2rem(50)
              height px2rem(50)
              color: #fff
              top px2rem(-10)
              left px2rem(-10)
    .audio-bg
      position absolute
      z-index 9
      width 100%
      height 100%
      top 0
      left 0
      background-repeat no-repeat
      background-size 100% 100%
      .audio-mask
        position absolute
        width 100%
        height 100%
        top 0
        left 0
        z-index 10
        background-color rgba(0,0,0,0.6)
</style>
