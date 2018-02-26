class wobbleOverlay {
  constructor(element) {
    this.element = element
    this.path = element.querySelectorAll('path')
    this.points = 12
    this.curve = 20 //curyness of curve
    this.amplitude = 80 //height of 2 curves
    this.midpoint = this.amplitude / 2
    this.width = 600 //fit wave to this width (viewBox width)
    this.wavelength = this.width / this.points //the length of each curve
  }

  animate() {

    var direction = 1 //forward = 1, backwards = -1
    var states = []
    for(var i = 0; i < this.amplitude; i++) {
      states.push(this.draw(i))
      var newPath = document.createElementNS("http://www.w3.org/2000/svg", 'path')
      newPath.setAttribute('d',this.draw(i))
      newPath.setAttribute('stroke-opacity','0.1')
      newPath.setAttribute('stroke','red')
      newPath.setAttribute('fill','transparent')
      this.element.appendChild(newPath)
    }

    console.log(states)

  }


  draw(amplitude) {
    var str = `M 0, ${this.midpoint}`
    var up = true

    var x1delta = (this.wavelength / 2) + this.curve
    var x2delta = (this.wavelength / 2) - this.curve

    for(var i = 0; i < this.points; i++) {

      var x = (i + 1) * this.wavelength
      var y = this.midpoint

      var x1 = x - x1delta
      var x2 = x - x2delta

      var y1 = up ? (this.midpoint * 2) - amplitude : amplitude
      up = up ? false : true

      str += ` C ${x1} ${y1} ${x2} ${y1} ${x} ${y}`
    }

    //close path
    str += ` L ${this.points * this.wavelength} 0 L 0 0 Z`
    return str

  }



}

(function() {
  var sea = document.querySelector('.sea')
  var wobble = new wobbleOverlay(sea);
  //wobble.draw()
  wobble.animate()


}());
