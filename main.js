/**
 * Created by kunnisser on 2017/4/12 0012.
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import Vuex from 'vuex';
import App from 'App.vue';
import Recommended from 'components/recommended/Recommended';
import Count from 'components/countlist/Count';
import audioPlaylist from 'components/audio/AudioPlaylist';
import Search from 'components/search/Search';
import MuseUi from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
import '../../static/animates.css';

Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(Vuex);
Vue.use(MuseUi);

const docEl = document.documentElement;
const metaEl = docEl.querySelector('meta[name = "viewport"]');

let d, rem, scale;
let deviceWidth = docEl.clientWidth;
d = window.devicePixelRatio || 1;
d === 1 && deviceWidth >= 540 && (deviceWidth = 540);
scale = 1 / d;
rem = deviceWidth * d / 10;
docEl.setAttribute('data-dpr', d);
metaEl.setAttribute('content', 'initial-scale = ' + scale + ',maximum-scale=' + scale + ',minimum-scale=' + scale + ',user-scalable = no');
docEl.style.fontSize = rem + 'px';
window.onresize = () => {
  let resizeRem = document.documentElement.clientWidth <= (540 * d) ? document.documentElement.clientWidth / 10 : 54 * d;
  docEl.style.fontSize = resizeRem + 'px';
};

window.rem2px = function (v) {
  v = parseFloat(v);
  return v * rem;
};

window.px2rem = function (v) {
  v = parseFloat(v);
  return v / rem;
};

const localStorge = window.localStorage;
localStorge.getItem('playlist') || localStorge.setItem('playlist', JSON.stringify([]));
localStorge.getItem('historyArr') || localStorge.setItem('historyArr', JSON.stringify([]));

const store = new Vuex.Store({
  state: {
    index: 0,
    isplaying: !1,
    currentTime: 0,
    duration: 0,
    toolbarVisible: !1,
    isLoop: !1,
    mode: 1,
    song: {
      index: null,
      id: null,
      mid: null,
      name: null,
      singer: null,
      albummid: null,
      albumpic: null
    },
    songlist: [],
    countinfo: [],
    playlist: JSON.parse(localStorge.getItem('playlist')),
    lyric: []
  },
  mutations: {
    isAudioShow (state, is) {
      state.isAudioShow = is.isAudioShow;
    },
    play (state) {
      state.song.id && (state.isplaying = !0);
    },
    pause (state) {
      state.isplaying = !1;
    },
    setPlayList (state, playlist) {
      let currentLS = JSON.parse(localStorge.getItem('playlist'));
      state.index = playlist.index;
      let songobj = playlist.songlist[state.index];
      let songdata = playlist.songlist[state.index].data;
      let musicdata = playlist.songlist[state.index].musicDate;
      let belongCD = playlist.songlist[state.index].belongCD;
      let checkId = songobj.songid || songdata.songid || musicdata.songid || belongCD.songid;
      let clsFlag = currentLS.findIndex((cls) => {
        return cls.id === checkId;
      });
      if (clsFlag < 0) {
        if (songdata) {
          songdata && state.playlist.push({
            id: songdata.songid,
            mid: songdata.songmid,
            name: songdata.songname,
            singer: songdata.singer[0].name,
            albummid: songdata.albummid
          });
        } else if (musicdata) {
          musicdata && state.playlist.push({
            id: musicdata.songid,
            mid: musicdata.songmid,
            name: musicdata.songname,
            singer: musicdata.singer[0].name,
            albummid: musicdata.albummid
          });
        } else if (belongCD) {
          belongCD && state.playlist.push({
            id: belongCD.songid,
            mid: belongCD.songmid,
            name: belongCD.songname,
            singer: belongCD.singer[0].name,
            albummid: belongCD.albummid
          });
        } else {
          state.playlist.push({
            id: songobj.songid,
            mid: songobj.songmid,
            name: songobj.songname,
            singer: songobj.singer[0].name,
            albummid: songobj.albummid
          });
        }
        state.song = state.playlist[state.playlist.length - 1];
        state.song['index'] = state.playlist.length - 1;
        localStorge.setItem('playlist', JSON.stringify(state.playlist));
      } else {
        state.song = state.playlist[clsFlag];
        state.song['index'] = clsFlag;
      }
    },
    setCountList (state, countList) {
      state.songlist = countList.songlist;
      state.countinfo = countList.countinfo;
    },
    updateCurrentTime (state, time) {
      state.currentTime = time;
    },
    updateDuration (state, time) {
      state.duration = time;
    }
  }
});

const routes = [
  {
    path: '/',
    name: 'index',
    redirect: '/recommended',
    component: App,
    children: [
      {
        path: 'recommended',
        component: Recommended
      },
      {
        path: 'count',
        component: Count
      },
      {
        path: 'audioPlaylist',
        component: audioPlaylist
      },
      {
        path: 'search',
        component: Search
      }
    ]
  },
  {
    path: '*',
    redirect: '/recommended'
  }
];

const router = new VueRouter({
  routes
});

const routerApp = new Vue({
  el: '#app',
  router,
  store,
  render: h => h('router-view') // 防止重复嵌套
});

export default routerApp;
