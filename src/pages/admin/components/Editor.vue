<template>
    <div class="editor-wrapper">
      <div :id="editorId"></div>
    </div>
</template>

<script>
import Editor from 'wangeditor'
import 'wangeditor/release/wangEditor.min.css'
export default {
  name: 'Editor',
  props: {
    value: {
      type: String,
      default: ''
    },
    valueType: {
      type: String,
      default: 'html',
      validator: (val) => {
        // return this.oneOf(val, ['html', 'text'])
        let validList = ['html', 'text']
        for (let i = 0; i < validList.length; i++) {
          if (val === validList[i]) {
            return true
          }
        }
      }
    },
    changeInterval: {
      type: Number,
      default: 200
    }
    // cache: {
    //   type: Boolean,
    //   default: true
    // }
  },
  data () {
    return {
      currentValue: this.value
    }
  },
  computed: {
    editorId () {
      return `editor${this._uid}`
    }
  },
  methods: {
    setHtml (val) {
      this.editor.txt.html(val)
    }
  },
  mounted () {
    this.editor = new Editor(`#${this.editorId}`)
    this.editor.customConfig.onchange = (html) => {
    //   let text = this.editor.txt.text()
      this.currentValue = html
    //   if (this.cache) localStorage.editorCache = html
    //   this.$emit('input', this.valueType === 'html' ? html : text)
    //   this.$emit('on-change', html, text)
    }
    this.editor.customConfig.onchangeTimeout = this.changeInterval
    this.editor.create()
    // let html = this.value
    // if (html) this.editor.txt.html(html)
  },
  watch: {
    'value' (val) {
      if (this.currentValue !== val) {
        this.currentValue = val
        this.setHtml(val)
      }
    },
    'currentValue' (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$emit('input', newVal)
        this.$emit('on-change', newVal)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.editor-wrapper *{
  z-index: 100 !important;
}
</style>
