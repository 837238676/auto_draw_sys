<template>
  <div>
    <div class="title-container"></div>
    <p>辛苦了！！！ 送给认真工作的你！</p>
    <h1 class="ksd-product-desctext">
      {{ title }}
    </h1>
    <h1></h1>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Dashboard",
  data() {
    return {
      Hlist: [
        "人就这么一辈子，开心也是一天，不开心也是一天，所以你一定要开心",
        "生活是属于每个人自己的感受，不属于任何别人的看法",
        "受了这些苦，一定是为了什么值得的东西",
        "希望有一天自己也成为一个小太阳去温暖别人",
        "拥有希望的人，和漫天的星星一样，是永远不会孤独的",
        "去更远的地方，见更亮的光",
        "凡是不能杀死你的，最终都会让你更强",
        "即使再小的帆也能远航",
        "永远相信美好的事情即将发生",
        "在谷底也要开花",
      ],
      title: "",
    };
  },
  computed: {
    ...mapGetters(["name"]),
  },
  mounted() {
    let ran = Math.random();
    ran = parseInt(ran * 10);
    this.title = this.Hlist[ran];
  },
};
</script>

<style lang="scss" scoped>
.title-container {
  height: 500px;
}
p {
  color: #8c888b;
  position: absolute;
  top: 0%;
  left: 3%;
  font-size: 24px;
}
.ksd-product-desctext {
  position: absolute;
  top: 14%;
  width: 100%;
  text-align: center;
  font-size: 38px;
  color: #8c888b;
  background: -webkit-linear-gradient(
    45deg,
    #70f7fe,
    #fbd7c6,
    #fdefac,
    #bfb5dd,
    #bed5f5
  );
  color: transparent;
  font: bold;
  letter-spacing: 2px;
  -webkit-background-clip: text;
  animation: ran 10s linear infinite;
}

@keyframes ran {
  0% {
    backgroud-position: 0 0;
  }

  100% {
    background-position: 2000px 0;
  }
}
</style>
