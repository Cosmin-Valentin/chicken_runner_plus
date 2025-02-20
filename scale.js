export function scaleGame() {
  const scaleContainer = document.querySelector('.scale-container')
  const headerHeight = document.querySelector('header').offsetHeight
  const availableHeight = window.innerHeight - headerHeight

  const widthScale = window.innerWidth / 1000
  const heightScale = availableHeight / 500
  const scale = Math.min(widthScale, heightScale)

  scaleContainer.style.width = '1000px'
  scaleContainer.style.height = '500px'
  scaleContainer.style.transform = `scale(${scale})`
}
