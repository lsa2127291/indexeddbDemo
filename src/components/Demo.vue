<template>
  <div class="demo">
    <canvas id='canvas' width="1000" height="1000"></canvas>
  </div>
</template>
<script>
let fabric = window.fabric
export default {
  name: 'Demo',
  mounted () {
    const fabric = window.fabric
    const canvas = new fabric.Canvas('canvas')
    const rect = new fabric.Rect({
        top : 100,
        left : 100,
        width : 60,
        height : 70,
        fill : 'red'
    })
    canvas.add(rect)
    var line = this.makeLine([ 100, 100, 50, 50 ])
    canvas.add(line)
    rect.line = line
    line.rect = rect
    canvas.on('object:moving', function(e) {
      var p = e.target;
      p.line && p.line.set({ 'x1': p.left, 'y1': p.top })
      p.rect && p.rect.set({ 'top': p.y2 + p.top, 'left': p.x2 + p.left, 'selectable': true})
      canvas.renderAll();
    })
  },
  methods: {
    makeLine (coords) {
      return new fabric.Line(coords, {
        fill: 'red',
        stroke: 'red',
        strokeWidth: 5
      });
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
