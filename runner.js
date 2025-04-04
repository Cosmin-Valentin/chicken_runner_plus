import { checkOrientation } from './orientationUtils.js'

const runnerContainer = document.querySelector('.runner-container')

if (runnerContainer) {
  const chicken = document.getElementById('chicken')
  const colorBubble = document.getElementById('color-bubble')
  const blackBubble = document.getElementById('black-bubble')
  const cactus = document.querySelector('.cactus')
  const pixelsLight = document.querySelector('.pixels.group-1')
  const pixelsDark = document.querySelector('.pixels.group-2')
  const skies = document.querySelectorAll('.sky')
  const prompt = document.getElementById('prompt')
  const legend = document.querySelector('.legend')
  const info = document.querySelector('.info')
  let hit = false
  let counter = 0
  let circadianInterval
  let avoidObs = false
  let blackEnabled = false

  if (isMobile()) {
    info.textContent = 'Double TAP to start'
    checkOrientation(giveInfo)
    addOrientationEventListeners(giveInfo)
  } else {
    giveInfo()
  }

  function init() {
    activateElements(3)
    circadianInterval = setupCircadianShift()
    displayLegend()
    document.addEventListener('keydown', handleAction)
    runnerContainer.addEventListener('touchstart', jumpForMobile)
  }

  function moveObstacle(obstacle, speed) {
    const sandboxWidth = runnerContainer.offsetWidth
    let x = sandboxWidth

    if (obstacle.classList.contains('hidden')) {
      obstacle.classList.remove('hidden')
    }

    requestAnimationFrame(animate)

    function animate() {
      x -= speed
      if (x < -obstacle.offsetWidth) {
        x = sandboxWidth
      }
      obstacle.style.transform = `translateX(${x}px)`

      if (
        obstacle.classList.contains('obstacle') &&
        checkCollision(x, obstacle)
      ) {
        handleCollision()
      } else {
        continueAnimation()
      }
    }

    function handleCollision() {
      if (!obstacle.classList.contains('cactus')) {
        if (hit) {
          counter = counter + 5
          obstacle.classList.remove('wobble')
          obstacle.classList.add('shrink')
          setTimeout(function () {
            resetObstacle()
          }, 200)
        } else {
          gameOver()
        }
      } else {
        gameOver()
      }
    }

    function continueAnimation() {
      if (x !== sandboxWidth) {
        requestAnimationFrame(animate)
      } else {
        setTimeout(() => {
          requestAnimationFrame(animate)
        }, getRandomCount(3) * 1000)
      }
    }

    function resetObstacle() {
      x = sandboxWidth
      obstacle.style.transform = `translateX(${x}px)`
      obstacle.classList.remove('shrink')
      obstacle.classList.add('wobble')
      setTimeout(() => {
        requestAnimationFrame(animate)
      }, getRandomCount(3) * 1000)
      hit = false
    }
  }

  function moveGround(speed) {
    moveObstacle(pixelsLight, speed)
    setTimeout(function () {
      moveObstacle(pixelsDark, speed)
    }, 2000)
  }

  function gameOver() {
    runnerContainer.classList.add('over')
    prompt.classList.remove('hidden')
    prompt.classList.add('flex')
    clearInterval(circadianInterval)
    document.removeEventListener('keydown', handleAction)
    runnerContainer.removeEventListener('touchstart', jumpForMobile)
    document.addEventListener('keydown', () => location.reload())
    document.addEventListener('touchstart', () => location.reload())
  }

  function getRandomCount(num) {
    return Math.floor(Math.random() * num)
  }

  function checkCollision(obstacleLeft, obstacle) {
    const chickenTop = parseInt(
      window.getComputedStyle(chicken).getPropertyValue('top')
    )
    const isObstacleInRange = obstacleLeft < 160 && obstacleLeft > 50
    const isChickenSqashing = chickenTop < 332 && chickenTop > 320
    const isChickenHit = chickenTop > 333
    const hasChickenCrouched = chickenTop > 390

    if (!isObstacleInRange) {
      return false
    }

    if (obstacle === blackBubble) {
      if (!hasChickenCrouched) {
        return true
      } else {
        avoidObs = true
        return false
      }
    }

    if (isChickenSqashing) {
      hit = true
      avoidObs = false
      return true
    } else if (isChickenHit) {
      avoidObs = false
      return true
    } else {
      avoidObs = true
    }
  }

  function handleAction(e) {
    const actions = {
      ArrowUp: () => performAction('jump'),
      ArrowDown: () => performAction('crouch')
    }

    if (actions[e.key]) {
      actions[e.key]()
    }
  }

  function performAction(actionName) {
    if (!chicken.classList.contains(actionName)) {
      chicken.classList.remove('walk')
      chicken.classList.add(actionName)
    }

    setTimeout(function () {
      chicken.classList.remove(actionName)
      if (avoidObs) {
        counter++
        avoidObs = false
      }
      document.querySelector('.score b').textContent = counter
      chicken.classList.add('walk')
      if (counter >= 50 && !blackEnabled) {
        blackEnabled = true
        enableBackBubble()
      }
    }, 500)
  }

  function setupCircadianShift() {
    let x = 1
    return setInterval(function () {
      skies.forEach((el) => el.classList.remove('active'))
      skies[x].classList.add('active')
      x = x < skies.length - 1 ? x + 1 : 0
    }, 15000)
  }

  function giveInfo() {
    document.addEventListener('keydown', startGame)
    document.addEventListener('pointerup', detectDoubleTap(500))
    runnerContainer.addEventListener('doubletap', startMobileGame)
  }

  function startGame(e) {
    const actionMap = {
      ArrowUp: 'jump',
      ArrowDown: 'crouch'
    }

    if (actionMap[e.key]) {
      performAction(actionMap[e.key])
      removeStartListeners()
      info.classList.add('hidden')
      init()
    }
  }

  function startMobileGame() {
    performAction('jump')
    removeStartListeners()
    info.classList.add('hidden')
    init()
  }

  function removeStartListeners() {
    document.removeEventListener('keydown', startGame)
    document.removeEventListener('pointerup', detectDoubleTap(500))
    runnerContainer.removeEventListener('doubletap', startMobileGame)
  }

  function activateElements(speed) {
    if (!blackEnabled) {
      moveObstacle(colorBubble, speed)
      setTimeout(function () {
        moveObstacle(cactus, speed)
      }, 5000)
      moveGround(speed)
    } else {
      moveObstacle(blackBubble, speed)
    }
  }

  function enableBackBubble() {
    legend.textContent = 'Watch your head and CROUCH DOWN!'
    displayLegend()
    setTimeout(function () {
      activateElements(3)
    }, 5000)
  }

  function displayLegend() {
    setTimeout(function () {
      legend.classList.remove('hidden')
    }, 5000)
    setTimeout(function () {
      if (!legend.classList.contains('hidden')) {
        legend.classList.add('hidden')
      }
    }, 15000)
  }

  function jumpForMobile(e) {
    performAction('jump')
    e.preventDefault()
  }
}

function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/i.test(
    navigator.userAgent
  )
}

function addOrientationEventListeners(f) {
  window.addEventListener('orientationchange', () => checkOrientation(f))
  window.addEventListener('resize', () => checkOrientation(f))
}

function detectDoubleTap(doubleTapMs) {
  let timeout,
    lastTap = 0
  return function detectDoubleTap(event) {
    const currentTime = new Date().getTime()
    const tapLength = currentTime - lastTap
    if (0 < tapLength && tapLength < doubleTapMs) {
      event.preventDefault()
      const doubleTap = new CustomEvent('doubletap', {
        bubbles: true,
        detail: event
      })
      event.target.dispatchEvent(doubleTap)
    } else {
      timeout = setTimeout(() => clearTimeout(timeout), doubleTapMs)
    }
    lastTap = currentTime
  }
}
