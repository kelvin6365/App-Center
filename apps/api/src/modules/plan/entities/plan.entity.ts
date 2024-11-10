import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { PricingTiers } from './pricing.tier.entity';
import { Subscription } from './subscription.entity';

@Entity('plans')
export class Plan extends BaseEntity {
  @Column({ type: 'jsonb' })
  name: { [key: string]: string };

  @Column({ type: 'jsonb' })
  description: { [key: string]: string };

  @Column({
    name: 'max_tenants',
  })
  maxTenants: number;

  @Column({
    name: 'product_id',
  })
  productId: string;

  @Column({
    name: 'app_creation_limit',
  })
  appCreationLimit: number;

  @Column({
    name: 'storage_limit',
  })
  storageLimit: number;

  @Column({
    name: 'is_active',
  })
  isActive: boolean;

  //pricing tires
  @OneToMany(() => PricingTiers, (pricingTiers) => pricingTiers.plan, {
    cascade: true,
  })
  @JoinColumn({ name: 'id' })
  pricingTiers: PricingTiers[];

  @OneToMany(() => Subscription, (subscription) => subscription.plan, {
    cascade: true,
  })
  @JoinColumn({ name: 'id' })
  subscriptions: Subscription[];
}
