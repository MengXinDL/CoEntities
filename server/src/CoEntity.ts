import { CoHandler, CoHandlerActiveStatus } from "./CoHandler";
import { Coord } from "./Transform1";
export class CoEntity {
    entity: GameEntity;
    parent: CoEntity | null = null;
    children: CoEntity[] = [];
    coord: Coord;
    static build(entity: GameEntity): CoEntity {
        if (CoHandler.getActiveStatus() == CoHandlerActiveStatus.RESTING) CoHandler.resume();
        let e = new Proxy(new CoEntity(entity), {
            get: function(target: CoEntity, prop: string) {
                if (prop in target) return target[prop as keyof CoEntity];
                if (prop in target.entity) return target.entity[prop as keyof GameEntity];
                return undefined;
            },
            set: function(target: CoEntity, prop: keyof CoEntity | keyof GameEntity, value) {
                if (prop in target) target[prop as keyof CoEntity] = value;
                // @ts-ignore
                else if (prop in target.entity) target.entity[prop as keyof GameEntity] = value;
                else return false;
                return true;
            }
        });
        CoHandler.CoEntities.push(e);
        return e;
    }

    constructor(entity: GameEntity) {
        this.entity = entity;
        this.coord = new Coord(new GameVector3(0, 0, 0), new GameVector3(0, 0, 0), this.entity.id + "'s Coord");
    }
}