<template>
  <div class="count-wrapper" ref="countWrapper">
    <ul>
      <li>
        <mu-paper class="demo-paper" :zDepth="3">
          <div class="count-header">
            <i class="icon-arrow_downward" @click.prevent.stop="pathBack"></i>
            <div  v-if="countInfo.topinfo">
              <div class="ctheader-bg" v-bind:style="{backgroundImage: 'url(\''+ countInfo.topinfo.pic_album +'\')'}"></div>
              <div class="gradient-box"></div>
              <div class="countheader-info">
                <h2>{{countInfo.topinfo.ListName}}</h2>
                <p>{{countInfo.update_time}} 更新</p>
              </div>
            </div>
          </div>
        </mu-paper>
        <div class="count-list" v-if="countInfo.songlist">
          <div v-for="(countitem,index) in countInfo.songlist.slice(0,100)?countInfo.songlist.slice(0,100):countInfo.songlist" @click.prevent.stop="play(index,$event)">
            <mu-list>
              <mu-list-item :title="index+1 + '. ' + countitem.data.songname">
                <p><strong class="icon-account_circle"></strong><span v-for="singer in countitem.data.singer">{{singer.name}}</span><strong class="icon-album"></strong><strong>{{countitem.data.albumname}}</strong></p>
                <p v-if="countitem.data.albumdesc"><strong class="icon-satellite"></strong><strong>{{countitem.data.albumdesc}}</strong></p>
              </mu-list-item>
            </mu-list>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script type="text/ecmascript-6">
  import config from '../../data/config.json';
  import Bscroll from 'better-scroll';
  export default {
    name: 'count',
    data () {
      return {
        countInfo: {},
        songlist: {}
      };
    },
    created () {
      this.$http.jsonp(config.path.count, {params: {
        topid: this.$route.query.id,
        format: 'jsonp',
        inCharset: 'utf8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'yqq',
        needNewCode: 0
      },
        jsonp: 'jsonpCallback'
      }).then((response) => {
        this.countInfo = response.data;
        this.songlist = response.data.songlist;
        this.$store.commit('setCountList', {
          songlist: this.songlist,
          countinfo: this.countInfo
        });
        this.$nextTick(() => {
          this._initScroll();
        });
      });
    },
    methods: {
      pathBack () {
        if (!event._constructed) {
          return;
        }
        this.$router.push('/');
      },
      _initScroll () {
        this.countScroll = new Bscroll(this.$refs.countWrapper, {
          click: !0,
          probeType: 1
        });
      },
      play (index, event) {
        if (!event._constructed) {
          return;
        }
        this.$store.state['isplaying'] = !0;
        document.getElementById('music').play();
        this.$store.state['toolbarVisible'] = !0;
        this.$store.state['parentId'] = this.$route.query.id;
        this.$store.commit('setPlayList', {
          index: index,
          songlist: this.songlist
        });
        this.$parent.isAudioVisible = !0;
      }
    }
  };
</script>
<style rel="stylesheet/stylus" lang="stylus">
  @import "../../assets/stylus/mixin.styl";
  .count-wrapper
    position absolute
    width 100%
    top 0
    left 0
    bottom px2rem(100)
    overflow hidden
    .count-header
      font-size px2rem(50)
      position relative
      .ctheader-bg
        background-repeat  no-repeat
        background-size cover
        &:after
          display block
          content ''
          padding-top 100%
      .countheader-info
        position absolute
        left 0
        bottom 0
        z-index 99
        font-size px2rem(40)
        color #fff
        padding 0 px2rem(30)
        & p
          line-height px2rem(80)
          font-size px2rem(24)
      & i
        position absolute
        top px2rem(12)
        left px2rem(12)
        z-index 9
        color #fff
        background-color rgba(0, 0, 0, 0.6)
        border px2rem(1) solid rgb(0, 0, 0)
        border-radius 50%
      .gradient-box
        position absolute
        width 100%
        left 0
        bottom 0
        z-index 9
        background-image: -webkit-linear-gradient(top,transparent,currentColor 80%)
        &:after
          display block
          content ''
          padding-top 60%
    .count-list
      .mu-list
        padding px2rem(1) 0
        .mu-item-wrapper
          background-color hsla(0,2,3,.4)
          padding px2rem(10) 0
          .show-left
            padding-left px2rem(40)
          .mu-circle-ripple
            background-color darkseagreen
          .mu-item-content
            padding-left px2rem(12)
            .mu-item-title
              font-size px2rem(28)
              color #fff
              margin-bottom px2rem(16)
            & p
              color #fff
              font-size px2rem(24)
              line-height px2rem(32)
              & span
                margin-right px2rem(10)
                font-size px2rem(22)
                vertical-align top
                &:last-child
                  margin-right px2rem(20)
              & strong
                margin-right px2rem(10)
                font-weight normal
                vertical-align top
</style>
