<template>
    <div class="searchview">
      <mu-appbar title="搜索歌曲"></mu-appbar>
      <div class="searchBar">
          <form id="searchform" method="get" action="#">
            <div class="search-wrap">
              <i class="icon icon-search"></i>
              <mu-text-field type="search" v-model="searchkey" @focus="insetWords" hintText="搜索歌曲歌单专辑" fullWidth underlineClass="searchline" underlineFocusClass="searchlineForce"/>
              <div class="clear" v-show="showclear" @click.stop="cancelSearch">取消</div>
            </div>
          </form>
      </div>
      <div class="hotsearch-wrap" v-show="!showclear">
        <div class="hk-title">【热门搜索】</div>
        <mu-chip class="demo-chip" v-for="item in hotkeyArr" @click.stop="hotSearch(item.k)">
          {{item.k}}
        </mu-chip>
      </div>
      <div class="history-wrap" v-show="historyVisible && !searchListArr.length">
        <div class="ht-item" v-for="(item, index) in reverseArr" @click.prevent.stop="searchfast(item)">
          <i class="icon-schedule"></i>
          {{item}}
          <i class="icon-close abs" @click.prevent.stop="delhtItem(historyArr.length - 1 - index)"></i>
        </div>
        <div class="clearbtn" @click.stop="clearHistory" v-show="historyArr.length">清空记录</div>
      </div>
      <div class="searchlist-wrap" ref="searchwrap" v-show="searchListArr.length">
        <ul>
          <li class="searchitem" v-for="(item, index) in searchListArr" @click.prevent.stop="play(index,$event)">
            <i class="icon-music_note"></i>
            {{item.songname}}
            <span>{{item.singer[0].name}}</span>
          </li>
        </ul>
      </div>
    </div>
</template>
<script type="text/ecmascript-6">
  import config from '../../data/config.json';
  import Bscroll from 'better-scroll';
  export default {
    name: 'search',
    data () {
      return {
        showclear: !1,
        hotkeyArr: [],
        searchkey: '',
        searchListArr: [],
        localstorge: window.localStorage,
        historyArr: [],
        historyVisible: !1,
        addhistory: !1,
        reverseArr: []
      };
    },
    created () {
      this.$http.jsonp(config.path.hotkey, {params: {
        g_tk: 5381,
        uin: 0,
        format: 'json',
        inCharset: 'utf-8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'h5',
        needNewCode: 1,
        _: 1501051881164
      },
        jsonp: 'jsonpCallback'}).then(res => {
        this.hotkeyArr = res.data.data.hotkey;
      });
      this.historyArr = JSON.parse(this.localstorge.getItem('historyArr'));
      this.reverseArr = this.historyArr.concat();
      this.reverseArr.reverse();
    },
    mounted () {
      this.reslistScroll = new Bscroll(this.$refs.searchwrap, {
        click: !0,
        probeType: 3
      });
      document.getElementById('searchform').onsubmit = () => {
        this.addhistory = !0;
        this.searchHandle(this.searchkey);
        return false;
      };
    },
    methods: {
      insetWords () {
        this.showclear = !0;
        this.historyVisible = !0;
      },
      cancelSearch () {
        this.showclear = !1;
        this.searchkey = '';
        this.historyVisible = !1;
        this.searchListArr = [];
      },
      clearHistory () {
        this.localstorge.setItem('historyArr', JSON.stringify([]));
        this.historyArr = [];
        this.reverseArr = [];
      },
      delhtItem (index) {
        this.historyArr.splice(index, 1);
        this.localstorge.setItem('historyArr', JSON.stringify(this.historyArr));
        this.reverseArr = this.historyArr.concat();
        this.reverseArr.reverse();
      },
      searchHandle (key) {
          key.trim() && this.$http.jsonp(config.path.search, {
            params: {
              g_tk: 5381,
              uin: 0,
              format: 'jsonp',
              inCharset: 'utf-8',
              outCharset: 'utf-8',
              notice: 0,
              platform: 'h5',
              needNewCode: 1,
              w: this.searchkey,
              zhidaqu: 1,
              catZhida: 1,
              t: 0,
              flag: 1,
              ie: 'utf-8',
              sem: 1,
              aggr: 0,
              perpage: 20,
              n: 20,
              p: 2,
              remoteplace: 'txt.mqq.all',
              _: '1501060806285'
              },
            jsonp: 'jsonpCallback'
          }).then(res => {
          this.searchListArr = res.data.data.song.list;
          this.historyVisible = !1;
          let checkRepeat = this.historyArr.findIndex((ha) => {
            return ha === key;
          }) < 0;
          if (this.addhistory && checkRepeat) {
            this.historyArr.push(this.searchkey);
            this.historyArr.length - 7 > 0 && (this.historyArr = this.historyArr.slice(this.historyArr.length - 7));
            this.localstorge.setItem('historyArr', JSON.stringify(this.historyArr));
            this.reverseArr = this.historyArr.concat();
            this.reverseArr.reverse();
          }
          this.$nextTick(() => {
            this.reslistScroll.refresh();
          });
        });
      },
      searchfast (item) {
        this.searchkey = item;
        this.searchHandle(this.searchkey);
      },
      hotSearch (key) {
        this.addhistory = !0;
        this.insetWords();
        this.searchfast(key);
      },
      play (index, e) {
        if (!e._constructed) {
          return;
        }
        this.$store.state['isplaying'] = !0;
        document.getElementById('music').play();
        this.$store.state['toolbarVisible'] = !0;
        this.$store.commit('setPlayList', {
          index: index,
          songlist: this.searchListArr
        });
        this.$parent.isAudioVisible = !0;
      }
    }
  };
</script>
<style rel="stylesheet/stylus" lang="stylus">
  @import '../../assets/stylus/mixin.styl';
  .searchview
    font-size px2rem(40)
    color #fff
    .mu-appbar
      background-color rgba(255,255,255,0.4)
      height px2rem(64)
      box-sizing border-box
      .mu-appbar-title
        font-size px2rem(24)
        line-height px2rem(64)
    .searchBar
      padding px2rem(30) px2rem(20)
      background-color rgba(255,255,255,0.2)
      .search-wrap
        display flex
        height px2rem(80)
        align-items center
        justify-content center
        background-color rgba(255,255,255,0.4)
        border-radius px2rem(6)
        padding-right px2rem(10)
        .icon
          width px2rem(60)
          flex 0 0 px2rem(60)
          text-align center
          font-size px2rem(40)
        .clear
          width px2rem(60)
          text-align center
          padding 0 px2rem(10)
          font-size px2rem(24)
        .mu-text-field
          flex 1
          color #fff
          font-size px2rem(24)
          min-height auto
          height px2rem(60)
          margin-bottom 0
          .mu-text-field-content
            padding 0
            .mu-text-field-hint
              line-height px2rem(60)
            & input
              height px2rem(60)
              font-size px2rem(24)
        .searchline
          background-color #fff
        .searchlineForce
          background-color aqua
    .hotsearch-wrap
      .hk-title
        width 100%
        height px2rem(80)
        line-height px2rem(80)
        padding-left px2rem(20)
        font-size px2rem(28)
        background-color rgba(255,255,255,0.1)
        box-sizing border-box
      .demo-chip
        font-size px2rem(28)
        border-radius px2rem(16)
        line-height px2rem(32)
        padding px2rem(6) px2rem(12)
        margin-left px2rem(20)
        background-color rgba(0,0,0,0.4)
        color #fff
    .searchlist-wrap
      position absolute
      width 100%
      top px2rem(204)
      left 0
      bottom px2rem(100)
      overflow hidden
      & ul
        width 100%
        padding px2rem(20)
        box-sizing border-box
        & li
          width 100%
          font-size px2rem(30)
          padding px2rem(30) 0
          background-color rgba(0,0,0,0.4)
          padding-left px2rem(20)
          box-sizing border-box
          margin-bottom px2rem(2)
          & span
            margin-left px2rem(20)
            font-size px2rem(24)
    .history-wrap
      background-color rgba(0,0,0,0.2)
      .clearbtn
        width 100%
        height px2rem(60)
        line-height px2rem(60)
        text-align center
        background-color rgba(0,0,0,0.2)
        font-size px2rem(28)
      .ht-item
        position relative
        font-size px2rem(28)
        padding px2rem(16)
        box-sizing border-box
        color #fff
        border-bottom px2rem(1) solid #dcdcdc
        .abs
          position absolute
          right px2rem(16)
          top px2rem(22)
      .ht-item:last-child
        border-bottom none
</style>
