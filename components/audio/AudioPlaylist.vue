<template>
  <div class="playlist-wrap">
    <div class="pl-header">
      <i class="icon-navigate_before" @click.prevent.stop="pathBack"></i>
      播放列表
      <i class="icon-delete" @click.prevent.stop="removeAllPlist"></i>
    </div>
    <div class="pl-box" ref="plWrapper">
      <ul>
        <li>
          <div class="empty-info" v-show="!audioPlaylist.length"><i class="icon-filter"></i>暂无曲目，请从曲库中添加！</div>
          <mu-list v-show="audioPlaylist.length">
            <mu-list-item v-for="(ad, index) in audioPlaylist"  :title="index+1 + '. ' + ad.name" @click.prevent.stop="play(index, $event)">
              <p>{{ad.singer}}</p>
              <i class="icon-close"  @click.prevent.stop="delSong(index, $event)"></i>
            </mu-list-item>
          </mu-list>
        </li>
      </ul>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import Bscroll from 'better-scroll';
  export default {
    name: 'audioPlaylist',
    data () {
      return {
        audioPlaylist: [],
        plScroll: {}
      };
    },
    methods: {
      pathBack () {
        window.history.go(-1);
      },
      removeAllPlist () {
        window.localStorage.setItem('playlist', JSON.stringify([]));
        this.audioPlaylist = JSON.parse(window.localStorage.getItem('playlist'));
        this.$store.state.playlist = this.audioPlaylist;
      },
      play (index, e) {
        if (!e._constructed) {
          return;
        }
        this.$store.state.song = this.$store.state.playlist[index];
        document.getElementById('music').play();
        this.$parent.isAudioVisible = !0;
        this.$store.state['isplaying'] = !0;
        this.$store.state['toolbarVisible'] = !0;
      },
      delSong (index, e) {
        if (!e._constructed) {
          return;
        }
        this.audioPlaylist.splice(index, 1);
        window.localStorage.setItem('playlist', JSON.stringify(this.audioPlaylist));
        this.$store.state.playlist = this.audioPlaylist;
        this.plScroll && (this.plScroll.refresh(), this.plScroll.maxScrollY = this.plScroll.wrapperHeight - this.plScroll.scrollerHeight);
      }
    },
    created () {
      this.audioPlaylist = JSON.parse(window.localStorage.getItem('playlist'));
      this.$nextTick(() => {
        this.plScroll = new Bscroll(this.$refs.plWrapper, {
          click: !0,
          probeType: 1
        });
      });
    }
  };
</script>
<style rel="stylesheet/stylus" lang="stylus">
  @import "../../assets/stylus/mixin.styl";
  .playlist-wrap
    position absolute
    width 100%
    top 0
    left 0
    bottom px2rem(100)
    overflow hidden
    font-size px2rem(34)
    line-height px2rem(80)
    .pl-header
      color #fff
      height px2rem(80)
      text-align center
      z-index 99
      background-color rgba(0,0,0,0.2)
      box-shadow px2rem(0) px2rem(4) px2rem(4) rgba(0,0,0,0.4)
      & i
        position absolute
        left px2rem(12)
        font-size px2rem(50)
        line-height px2rem(80)
      .icon-delete
        left auto
        font-size px2rem(40)
        right px2rem(12)
    .pl-box
      width 100%
      background-color rgba(0,0,0,0.2)
      position absolute
      top px2rem(80)
      bottom px2rem(0)
      overflow hidden
      .empty-info
        font-size px2rem(30)
        color #fff
        width 100%
        text-align center
        padding-top px2rem(30)
        & i
          margin-right px2rem(15)
      .mu-list
        color #fff
        .mu-item-wrapper
          border-bottom px2rem(1) solid #fff
          .mu-item
            padding px2rem(16)
            min-height auto
            & p
              font-size px2rem(26)
              line-height px2rem(40)
              color #fff
            .mu-item-title
              color #fff
              font-size px2rem(30)
              line-height px2rem(50)
            & i
              font-size px2rem(40)
              position absolute
              right px2rem(12)
              top px2rem(16)
              line-height px2rem(90)
              color #fff
</style>
