import axios from 'axios'
import { $ } from './bling'

function ajaxHeart(e) {
  e.preventDefault();

  axios
    // post to the action of the heart form
    .post(this.action)
    .then(res => {
      // update button via the `name` attribute (heart)
      const isHearted = this.heart.classList.toggle('heart__button--hearted');
      // update total hearts in nav bar
      $('.heart-count').textContent = res.data.hearts.length;
      // add floaty heart animation
      if (isHearted) {
        this.heart.classList.add('heart__button--float');
        // once the animation is over, remove the CSS class so that it can occur again
        setTimeout(() => this.heart.classList.remove('heart__button--float'), 2500);
      }
    })
    .catch(console.error);
}

export default ajaxHeart;
