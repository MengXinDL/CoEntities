import * as math from "mathjs";
import {pi, tau} from "mathjs";
console.clear();
// export class Position {
//     #r: number;
//     #theta1: number;
//     #theta2: number;
//     #standardization(){
//         if(this.r == 0) this.#theta1 = 0, this.#theta2 = 0;
//         if(this.r < 0) this.r = -this.r, this.#theta1 += pi;
//         while(this.#theta1 < -pi/2){
//             this.#theta1 += tau;
//         }
//         while(this.#theta1 > 3*pi/2){
//             this.#theta1 -= tau;
//         }
//         if(this.#theta1 >= pi / 2){
//             this.#theta1 = pi - this.#theta1;
//         }
//         while(this.#theta2 <= -pi){
//             this.theta2 += tau;
//         }
//         while(this.#theta2 > pi){
//             this.theta2 -= tau;
//         }
//     }
//     set(a: number, b: number, c: number){
//         let r: number = math.sqrt(a ** 2 + b ** 2 + c ** 2) as number;
//         let theta2: number = math.acos(b / r) as number;
//         let theta1: number = a / r / math.sin(theta2) as number;
//         this.#r = r;
//         this.#theta1 = theta1;
//         this.#theta2 = theta2;
//         this.#standardization()
//     }
//     constructor(type: "Theta", r: number, theta1: number, theta2: number);
//     constructor(type: "XYZ", x: number, y: number, z: number);
//     constructor(type: ("XYZ" | "Theta"), a: number, b: number, c:number){
//         if(type == "Theta"){
//             this.#r = a, this.#theta1 = b, this.#theta2 = c;
//         }else{
//             let r: number = math.sqrt(a ** 2 + b ** 2 + c ** 2) as number;
//             let theta2: number = math.acos(b / r) as number;
//             let theta1: number = math.acos(a / r / math.sin(theta2)) as number;
//             this.#r = r;
//             this.#theta1 = theta1;
//             this.#theta2 = theta2;
//         }
//     }
//     get x(): number{
//         return math.round(math.cos(this.#theta1) * this.#r * math.sin(this.#theta2), 15);
//     }
//     get y(): number{
//         return math.round(math.cos(this.#theta2) * this.#r, 15);
//     }
//     get z(): number{
//         return math.round(math.sin(this.#theta1) * this.#r * math.sin(this.#theta2), 15);
//     }
//     set x(a: number){ this.set(a, this.y, this.z); }
//     set y(a: number){ this.set(this.x, a, this.z); }
//     set z(a: number){ this.set(this.x, this.y, a); }
//     get r(): number      { return this.#r;      }
//     get theta1(): number { return this.#theta1; }
//     get theta2(): number { return this.#theta2; }
//     set r(a: number)     { this.#r = a;         }
//     set theta1(a: number){ this.#theta1 = a;    }
//     set theta2(a: number){ this.#theta2 = a;    }
//     rotate(facing: "X" | "Y" | "Z", theta: number){
//         /**
//          * 顺时针旋转
//          */
//         switch(facing){
//             case "X":
//                 console.log(this.x, this.y, this.z);
//                 let r: number = math.sin(this.#theta2) * this.#r;
//                 let angle = math.atan2(this.z, this.y);
//                 console.log(angle)
//                 angle += theta;
//                 this.set(this.x,r * math.sin(angle), r * math.cos(angle));
//                 break;
//             case "Y":
//                 this.#theta1 += theta;
//                 this.#theta1 %= tau;
//                 break;
//             case "Z":
//                 r = math.sin(this.#theta2) * this.#r;
//                 angle = math.atan2(this.x, this.y);
//                 angle += theta;
//                 this.set(r * math.cos(angle), r * math.sin(angle), this.z);
                
//                 break;
//         }
//     }
// }
export class vec2 {
    x: number;
    y: number;
    constructor(x:number, y:number){
        this.x = x, this.y = y;
    }
}
export class Coord {
    parent?: Coord;
    angle: number;
    offset: vec2;
    AbsoluteAngle: number;
    AbsoluteOffset: vec2;
    constructor(angle: number, offset: vec2) {
        this.angle = this.AbsoluteAngle = angle, 
        this.offset = this.AbsoluteOffset = offset;
    }
    setAbsolute() {
        let now = new Coord(this.angle, this.offset);
        now.parent = this.parent;
        const angle: number = 0;
        const offset: vec2 = new vec2(0, 0);
        while(now.parent){
            
            now = now.parent;
        }
    }
}