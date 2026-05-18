import { QuartzComponent } from "../cfg"

const Busuanzi: QuartzComponent = () => (
  <div style="text-align:center; margin: 2rem 0; color: var(--gray); font-size:0.9rem;">
    <span id="busuanzi_container_site_pv">
      👀 总访问量 <span id="busuanzi_value_site_pv"></span> 次
    </span>
    &nbsp;|&nbsp;
    <span id="busuanzi_container_site_uv">
      🧑‍💻 访客数 <span id="busuanzi_value_site_uv"></span> 人
    </span>
    <script async src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"></script>
  </div>
)

export default Busuanzi
