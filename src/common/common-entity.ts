import {
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export abstract class CommonEntity {
  static readonly DEFAULT_AVATAR = 'https://i.pravatar.cc/300';

  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  toJSON() {
    const obj: any = { ...this };

    if (this.createdAt instanceof Date) {
      obj.createdAt = this.createdAt.toISOString();
    }
    if (this.updatedAt instanceof Date) {
      obj.updatedAt = this.updatedAt.toISOString();
    }

    for (const [key, val] of Object.entries(obj)) {
      if (val && typeof val === 'object') {
        if (typeof (val as any).toJSON === 'function') {
          obj[key] = (val as any).toJSON();
        } else if (Array.isArray(val)) {
          obj[key] = val.map((el) =>
            el && typeof el === 'object' && typeof (el as any).toJSON === 'function'
              ? (el as any).toJSON()
              : el,
          );
        }
      }
    }

    return obj;
  }
}
