import HHuploadify from './HHuploadify'

export default class extends HHuploadify {
  constructor(options) {
    super(options)

    let defaults = {
      dragable: true,
    }

    options = this.options = this.merge(defaults, this.options)

    if (options.ingle) {
      options.dragable = false
    }

    let onQueueComplete = options.onQueueComplete
    options.onQueueComplete = () => {
      if (typeof onQueueComplete === 'function') {
        onQueueComplete()
      }
      if (options.dragable) {
        let $queue = $(options.container).find('.uploadify-queue')
        $queue.find('.uploadify-item').addClass('dragable')
        $queue.dragsort({
          dragSelector: '.uploadify-item',
          placeHolderTemplate: '<span class="uploadify-item drag-placeholder"></span>',
          dragBetween: true,
          dragEnd: () => {
            this.invoke(options.onDragEnd)
          },
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
