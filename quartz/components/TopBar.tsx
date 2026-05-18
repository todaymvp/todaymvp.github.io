import { QuartzComponent } from "../cfg"

const TopBar: QuartzComponent = () => (
  <div class="top-bar">
    <div class="top-bar-inner">
      <a href="/" class="top-avatar-link">
        <img src="static/head.jpeg" alt="avatar" class="top-avatar" />
      </a>
      <div class="top-info">
        <div class="top-name">today</div>
        <div class="top-motto">「于无声处听惊雷，于二进制中见天地」</div>
      </div>
      <div class="top-nav">
        <a href="/">首页</a>
        <a href="/tags">标签</a>
        <a href="/navigation">导航</a>
      </div>
    </div>
  </div>
)

export default TopBar
