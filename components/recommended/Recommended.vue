<template>
  <div class="recommended" ref="recomlist">
    <ul>
      <li>
        <mu-list>
          <div v-for="recom in toplist"  @click="defaultClick(recom.id,$event)">
            <mu-list-item :title="recom.topTitle">
              <mu-avatar :src="recom.picUrl" slot="leftAvatar"/>
              <p v-for="(songlist,index) in recom.songList">{{index+1}}<span>{{songlist.songname}}</span>{{songlist.singername}}</p>
              <p><strong class="icon-headset"></strong><strong>{{recom.listenCount | listenCount}}</strong></p>
            </mu-list-item>
          </div>
        </mu-list>
      </li>
    </ul>
  </div>
</template>
<script type="text/ecmascript-6">
  import config from '../../data/config.json';
  import Bscroll from 'better-scroll';
  export default {
    name: 'recommended',
    data () {
      return {
        toplist: ''
      };
    },
    created () {
      this.$http.jsonp(config.path.recommended, {
        params: {
          g_tk: 5381,
          uin: 0,
          format: 'jsonp',
          inCharset: 'utf8',
          outCharset: 'utf-8',
          notice: 0,
          platform: 'h5',
          needNewCode: 1,
          _: new Date().getTime()
        },
        jsonp: 'jsonpCallback'
      }).then((response) => {
        this.toplist = response.data.data.topList;
        this.$nextTick(() => {
          this._initScroll();
        });
      });
    },
    methods: {
        _initScroll () {
          this.scrollView = new Bscroll(this.$refs.recomlist, {
             click: !0,
             probeType: 1
          });
        },
        defaultClick (id, event) {
          if (!event._constructed) {
              return;
          }
          this.$router.push(`count?id=${id}`);
        }
    },
    filters: {
      listenCount: num => {
          return ` ${Math.round(num / 1000) / 10}万`;
      }
    }
  };
</script>
<style rel="stylesheet/stylus" lang="stylus">
  @import '../../assets/stylus/mixin.styl';
  .recommended
    position absolute
    width 100%
    top 0
    left 0
    bottom px2rem(100)
    overflow hidden
    .mu-list
      padding 0
      & a
        display block
      .mu-item-wrapper
        background-color hsla(0,0,0,.4)
        margin-bottom px2rem(1)
        .mu-circle-ripple
          background-color #fff
        .mu-item
        .show-left
          padding-left px2rem(12)
        .has-avatar
          min-height auto
          max-height none
          width auto
          .mu-item-left
            position inherit
            width px2rem(144)
            height auto
            max-height none
            left 0
            .mu-avatar
              width px2rem(144)
              height px2rem(144)
        .mu-item-content
          padding-left px2rem(12)
          .mu-item-title
            font-size px2rem(28)
            color #fff
            margin-bottom px2rem(10)
          & p
            display block
            width px2rem(560)
            font-size px2rem(24)
            line-height px2rem(34)
            white-space nowrap
            overflow hidden
            text-overflow ellipsis
            color #cecece
            & span
              padding 0 px2rem(16)
              font-size px2rem(24)
              color #fff
            & strong
              font-size px2rem(20)
              color #fff
</style>
