import * as math from 'mathjs';

function quaternionToAxis(q: GameQuaternion){
  const angle = Math.acos(q.w);
  const sin = Math.sin(angle);
  return {
    angle: angle * 2,
    axis: new GameVector3(q.x / sin, q.y / sin, q.z / sin)
  }
}


function quaternionToMatrix(q: GameQuaternion): math.Matrix {
  const {w, x, y, z} = q;

  const r11 = 1 - 2 * (y * y + z * z);
  const r12 = 2 * (x * y - w * z);
  const r13 = 2 * (x * z + w * y);

  const r21 = 2 * (x * y + w * z);
  const r22 = 1 - 2 * (x * x + z * z);
  const r23 = 2 * (y * z - w * x);

  const r31 = 2 * (x * z - w * y);
  const r32 = 2 * (y * z + w * x);
  const r33 = 1 - 2 * (x * x + y * y);

  return math.matrix([
    [r11, r12, r13],
    [r21, r22, r23],
    [r31, r32, r33]
  ]);
}

function matrixToQuaternion(R: math.Matrix): [number, number, number, number] {
  const trace = R.get([0, 0]) + R.get([1, 1]) + R.get([2, 2]);

  if (trace > 0) {
    const s = 0.5 / Math.sqrt(trace + 1.0);
    const w = 0.25 / s;
    const x = (R.get([2, 1]) - R.get([1, 2])) * s;
    const y = (R.get([0, 2]) - R.get([2, 0])) * s;
    const z = (R.get([1, 0]) - R.get([0, 1])) * s;
    return [w, x, y, z];
  } else {
    if (R.get([0, 0]) > R.get([1, 1]) && R.get([0, 0]) > R.get([2, 2])) {
      const s = 2.0 * Math.sqrt(1.0 + R.get([0, 0]) - R.get([1, 1]) - R.get([2, 2]));
      const w = (R.get([2, 1]) - R.get([1, 2])) / s;
      const x = 0.25 * s;
      const y = (R.get([0, 1]) + R.get([1, 0])) / s;
      const z = (R.get([0, 2]) + R.get([2, 0])) / s;
      return [w, x, y, z];
    } else if (R.get([1, 1]) > R.get([2, 2])) {
      const s = 2.0 * Math.sqrt(1.0 + R.get([1, 1]) - R.get([0, 0]) - R.get([2, 2]));
      const w = (R.get([0, 2]) - R.get([2, 0])) / s;
      const x = (R.get([0, 1]) + R.get([1, 0])) / s;
      const y = 0.25 * s;
      const z = (R.get([1, 2]) + R.get([2, 1])) / s;
      return [w, x, y, z];
    } else {
      const s = 2.0 * Math.sqrt(1.0 + R.get([2, 2]) - R.get([0, 0]) - R.get([1, 1]));
      const w = (R.get([1, 0]) - R.get([0, 1])) / s;
      const x = (R.get([0, 2]) + R.get([2, 0])) / s;
      const y = (R.get([1, 2]) + R.get([2, 1])) / s;
      const z = 0.25 * s;
      return [w, x, y, z];
    }
  }
}


function rotateVec(vec: GameVector3, rot: GameQuaternion){
  let {axis, angle} = quaternionToAxis(rot);
  let vpara = axis.scale(axis.dot(vec));
  let vvert = vec.sub(vpara);
  let w = axis.cross(vec);
  let vert = vvert.scale(Math.cos(angle)).add(w.scale(Math.sin(angle)));
  return vert.add(vpara);
}



export function absoluteToRelative(
  fQuater: GameQuaternion, fPos: GameVector3,
  cQuater: GameQuaternion, cPos: GameVector3
){
  const xAxis = rotateVec(new GameVector3(1, 0, 0), fQuater);
  const yAxis = rotateVec(new GameVector3(0, 1, 0), fQuater);
  const zAxis = xAxis.cross(yAxis);
  
  let rPos = cPos.sub(fPos);


  const fMat = quaternionToMatrix(fQuater);
  const cMat = quaternionToMatrix(cQuater);

  let rQuater = matrixToQuaternion(math.divide(cMat, fMat) as math.Matrix);
  return {
    rPos: new GameVector3(
      rPos.dot(xAxis),
      rPos.dot(yAxis),
      rPos.dot(zAxis)
    ),
    rQuater
  }
}

export function relativeToAbsolute(
  fQuater: GameQuaternion, fPos: GameVector3,
  rQuater: GameQuaternion, rPos: GameVector3
){
  const xAxis = rotateVec(new GameVector3(1, 0, 0), fQuater);
  const yAxis = rotateVec(new GameVector3(0, 1, 0), fQuater);
  const zAxis = xAxis.cross(yAxis);

  const fMat = quaternionToMatrix(fQuater);
  const rMat = quaternionToMatrix(rQuater);

  let cMat = math.multiply(rMat, fMat) as math.Matrix;
  let cQuater = matrixToQuaternion(cMat);
  let cPos = xAxis.scale(rPos.x).add(yAxis.scale(rPos.y)).add(zAxis.scale(rPos.z)).add(fPos);
  return {
    cPos,
    cQuater
  }
}