import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, EntityRepository, Repository } from "typeorm"
import { Product } from "./Product"

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 100,
    })
    category: string

    @OneToMany(() => Product, (product) => product.category)
    products: Product[]

}

