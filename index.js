game.width = 600
game.height = 600
const ctx = game.getContext("2d")
const GREEN = "rgb(0, 255, 0)"
const BACKGROUND = "rgb(50, 50, 50)"
const POINT_WIDTH = 10
const POINT_HEIGHT = 10
const FPS = 60

let dz = 2
let angleY = 0
let angleX = 0
let angleZ = 0
const dt = 1 / FPS
const pressedKeys = {}
const NEAR = 0.01

function clear(){
  ctx.fillStyle = BACKGROUND
  ctx.fillRect(0, 0, game.width, game.height)
}

function placePoint(p){
  ctx.fillStyle = GREEN
  ctx.fillRect(p.x, p.y, POINT_WIDTH, POINT_HEIGHT)
  return {
    x: p.x,
    y: p.y
  } 
}

function pointGraphToScreen(p){
  return {
    x: (((p.x + 1) / 2) * game.width) - POINT_WIDTH / 2,
    y: ((1 - (p.y + 1) / 2) * game.height) - POINT_HEIGHT/ 2
  }
}

function point3DToGraph(p){
  return {
    x: p.x / p.z,
    y: p.y / p.z
  }
}

function getCubePoints(e){
  e /= 2
  return [
    {x: e, y: e, z: -e},
    {x: e, y: -e, z: -e},
    {x: -e, y: -e, z: -e},
    {x: -e, y: e, z: -e},

    {x: e, y: e, z: e},
    {x: e, y: -e, z: e},
    {x: -e, y: -e, z: e},
    {x: -e, y: e, z: e},
  ]
}

function drawLine(a, b){
  ctx.strokeStyle = GREEN
  ctx.beginPath()
  ctx.moveTo(a.x, a.y)
  ctx.lineTo(b.x, b.y)
  ctx.stroke()
}

function rotateZ(p, angle){
  const s = Math.sin(angle)
  const c = Math.cos(angle)
  return {
    x: p.x * c - p.y * s,
    y: p.x * s + p.y * c,
    z: p.z
  }
}

function rotateX(p, angle){
  const s = Math.sin(angle)
  const c = Math.cos(angle)
  return {
    x: p.x,
    y: p.z * s + p.y * c,
    z: p.z * c - p.y * s
  }
}

function rotateY(p, angle){
  const s = Math.sin(angle)
  const c = Math.cos(angle)
  return {
    x: p.x * c - p.z * s,
    y: p.y,
    z: p.x * s + p.z * c
  }
}

document.addEventListener("keydown", function(event){
  pressedKeys[event.key] = true
})

document.addEventListener("keyup", function(event){
  pressedKeys[event.key] = false
})

function handleEvents(){
  if (pressedKeys["w"]){
    dz += dt
  }
  if (pressedKeys["s"]){
    dz -= dt
  }
  if (pressedKeys["t"]){
    angleY += dt * Math.PI
  }
  if (pressedKeys["r"]){
    angleY -= dt * Math.PI
  }
  if (pressedKeys["g"]){
    angleX += dt * Math.PI
  }
  if (pressedKeys["f"]){
    angleX -= dt * Math.PI
  }
  if (pressedKeys["b"]){
    angleZ += dt * Math.PI
  }
  if (pressedKeys["v"]){
    angleZ -= dt * Math.PI
  }
}

function clipLine(p1, p2){
  const z1 = p1.z
  const z2 = p2.z
  if (z1 >= NEAR && z2 >= NEAR){
    return [p1, p2]
  }
  if (z1 < NEAR && z2 < NEAR){
    return null
  }
  const t = (NEAR - z1) / (z2 - z1)
  const clippedPoint = {
    x: p1.x + t * (p2.x - p1.x),
    y: p1.y + t * (p2.y - p1.y),
    z: NEAR
  };
  if (z1 < NEAR){
    return [clippedPoint, p2]
  }else{
    return [p1, clippedPoint]
  }
}

function incrementPoint(p){
  return {
    x: p.x,
    y: p.y,
    z: p.z + dz
  }
}

const points = getCubePoints(2)
const faces = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7]
]

function loop(){
  handleEvents()
  clear()
  for (const f of faces){
    for (let i = 0; i < f.length; i++){
      let a = points[f[i]]
      let b = points[f[(i + 1) % f.length]]
      a = rotateY(a, angleY)
      a = rotateX(a, angleX)
      a = rotateZ(a, angleZ)

      b = rotateY(b, angleY)
      b = rotateX(b, angleX)
      b = rotateZ(b, angleZ)
      
      a = incrementPoint(a)
      b = incrementPoint(b)
      let newPoints = clipLine(a, b)
      if (!newPoints){
        console.log(newPoints)
        continue
      }
      a = newPoints[0]
      b = newPoints[1]
      
      a = point3DToGraph(a)
      a = pointGraphToScreen(a)

      b = point3DToGraph(b)
      b = pointGraphToScreen(b)

      drawLine(a, b)
    }
  }
  setTimeout(loop, 1000 / FPS)
}

setTimeout(loop, 1000 / FPS)