import HHuploadify from './HHuploadify'
import {foreach, invoke, merge} from './functions'

export default class extends HHuploadify {
  constructor(options) {
    super(options)

    let defaults = {
      dragable: true,
    }

    this.options = merge(defaults, this.options)

    if (this.options.ingle) {
      this.options.dragable = false
    }

    let onQueueComplete = this.options.onQueueComplete
    this.options.onQueueComplete = () => {
      if (typeof onQueueComplete === 'function') {
        onQueueComplete()
      }
      if (this.options.dragable) {
        let $queue = $(this.options.container).find('.uploadify-queue')
        $queue.find('.uploadify-item').addClass('dragable')
        $queue.dragsort({
          dragSelector: '.uploadify-item',
          placeHolderTemplate: '<span class="uploadify-item drag-placeholder"></span>',
          dragBetween: true,
        })
      }
    }
  }
  onSelectFiles() {
    super.onSelectFiles()

    if (this.options.dragable) {
      $(this.options.container).find('.uploadify-queue').dragsort("destroy")
    }
  }
}
