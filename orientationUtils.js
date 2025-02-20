export function showLandscapeModal() {
  const modal = document.createElement('div')
  modal.id = 'landscape-modal'
  modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent backdrop */
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999; /* Ensure it's on top */
    `

  const modalContent = document.createElement('div')
  modalContent.style.cssText = `
      background-color: white;
      padding: 20px;
      border-radius: 5px;
      text-align: center;
    `
  modalContent.innerHTML =
    '<p>Please rotate your device to landscape mode for the best experience.</p>'

  modal.appendChild(modalContent)
  document.body.appendChild(modal)
}

export function hideLandscapeModal() {
  const modal = document.getElementById('landscape-modal')
  if (modal) {
    modal.remove()
  }
}

export function checkOrientation(fOne, fTwo) {
  if (window.innerWidth > window.innerHeight) {
    hideLandscapeModal()
    if (typeof fOne === 'function' && typeof fTwo === 'function') {
      fOne()
      fTwo()
    }
  } else {
    showLandscapeModal()
  }
}
