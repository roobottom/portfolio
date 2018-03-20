class wobbleOverlay {
  constructor(element) {
    this.element = element
    this.path = element.querySelectorAll('path')
    this.points = 2
    this.phase = 10 //phase angle
    this.amplitude = 80 //height of 2 phases
    this.midpoint = this.amplitude / 2
    this.width = 600 //fit wave to this width (viewBox width)
    this.wavelength = this.width / this.points //the length of each phase
  }

  run(amplitude,repeat,reducer,direction) {

    var that = this
    if(!direction) direction = 1
    if(!reducer) reducer = 20

    that.animate({
      duration: 500,
      timing(t) {
        return t < 0.5
            ? 0.5 * (1.0 - Math.sqrt(1.0 - 4.0 * t * t))
            : 0.5 * (Math.sqrt((3.0 - 2.0 * t) * (2.0 * t - 1.0)) + 1.0);
      },
      draw(progress) {

        var adjustedAmplitude
        adjustedAmplitude = direction * Math.floor(amplitude - ((progress * 2) * amplitude))

        drawPath(adjustedAmplitude)
      },
      cb() {

        if(repeat != 0) {
          repeat = repeat - 1;

          if(direction == 1) {
            direction = -1
          }
          else {
            direction = 1
          }

          amplitude = amplitude - (repeat * reducer )

          that.run(amplitude,repeat,reducer,direction)
        }

      }
    })

    var drawPath = (n) => {
      this.path[0].setAttribute('d',this.drawPath(n))
    }

  }

  animate({timing, draw, duration,cb}) {

    let start = performance.now();
    let i = 0;
    requestAnimationFrame(function animate(time) {
      // timeFraction goes from 0 to 1
      let timeFraction = (time - start) / duration;
      if (timeFraction > 1) timeFraction = 1;
      if (timeFraction == 1) {
        cb()
      }
      else {
        // calculate the current animation state
        let progress = timing(timeFraction)
        draw(progress); // draw it
        requestAnimationFrame(animate);
      }


    });
  }


  drawPath(amplitude) {
    var str = `M 0, ${this.midpoint}`
    var up = true

    var x1delta = (this.wavelength / 2) + this.phase
    var x2delta = (this.wavelength / 2) - this.phase

    for(var i = 0; i < this.points; i++) {

      var x = (i + 1) * this.wavelength
      var y = this.midpoint

      //calculate the phase angle
      var x1 = x - x1delta
      var x2 = x - x2delta

      //calculte the hight/depth of this wave
      var y1 = up ? this.midpoint + (amplitude/2) : this.midpoint - (amplitude/2)
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
  wobble.run(80,10)


}());
