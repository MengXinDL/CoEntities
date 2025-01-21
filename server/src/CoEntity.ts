import { CoHandler, CoHandlerActiveStatus } from "./CoHandler";

export class CoEntity {
    private static cnt = 0;
    public static get CoEntities(): CoEntity[] {
        return Array.from(CoEntity.CoForest.values(), (v) => v.proxy);
    }
    private static CoForest: Map<string, { node: CoEntity, proxy: CoEntity }> = new Map();
    public entity: GameEntity;
    public parent: CoEntity | null = null;
    public get children() {
        return this.chd;
    }
    private chd: CoEntity[] = [];
    public relativePosition: GameVector3 = new GameVector3(0, 0, 0);
    public relativeQuaternion: GameQuaternion = new GameQuaternion(1, 0, 0, 0);
    public readonly id: string = (CoEntity.cnt++).toString(16).padStart(8, '0');

    static build(entity: GameEntity): CoEntity {
        if (CoHandler.getActiveStatus() == CoHandlerActiveStatus.RESTING) CoHandler.resume();
        let node = new CoEntity(entity), proxy = new Proxy(node, {
            get: function (target: CoEntity, prop: string) {
                if (prop in target) return target[prop as keyof CoEntity];
                if (prop in target.entity) return target.entity[prop as keyof GameEntity];
                return undefined;
            },
            set: function (target: CoEntity, prop: keyof CoEntity | keyof GameEntity, value) {
                if (prop in target) {
                    if (prop == "parent" && value != null) {
                        target.parent?.removeChildren(target);
                        value.appendChildren(target);
                    }
                    // @ts-ignore
                    if (prop != "children") target[prop as keyof CoEntity] = value;
                }
                // @ts-ignore
                else if (prop in target.entity) target.entity[prop as keyof GameEntity] = value;
                else return false;
                return true;
            }
        });
        CoEntity.CoForest.set(node.id, {node,proxy});
        return proxy;
    }

    private constructor(entity: GameEntity) {
        this.entity = entity;
    }

    appendChildren(...children: CoEntity[]) {
        children.forEach((child) => {
            if (child.parent != null) throw new Error(`Cannot append a child that already has a parent; (Co)Entity ${child.id} already has a parent`);
            const childNode = CoEntity.CoForest.get(child.id)?.node;
            if (childNode) childNode.parent = this; // 避开代理的自动绑定逻辑
            this.chd.push(child);
        });
    }

    removeChildren(...children: CoEntity[]) {
        children.forEach((child) => {
            let index = this.chd.indexOf(child);
            if (index == -1) throw new Error(`Cannot remove a child that is not in the children list; (Co)Entity ${this.id} does not have the child`);
            child.parent = null;
            this.chd.splice(index);
        });
    }

    destroy() {
        // 解绑关系
        this.unbind();
        // 销毁实体
        this.entity.destroy();
        // 删除记录
        CoEntity.CoEntities.splice(CoEntity.CoEntities.indexOf(this));
    }

    unbind() {
        this.parent?.removeChildren(this);
        this.removeChildren(...this.children);
    }
}