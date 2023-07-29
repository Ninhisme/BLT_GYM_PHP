import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, EntityRepository, Repository } from "typeorm"
import { Product } from "./Product"
import { Blogs } from "./BLogs"

@Entity()
export class Topic {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 100,
    })
    topic: string

    @OneToMany(() => Blogs, (blogs) => blogs.topic)
    blogs: Blogs[]

    // @OneToMany(() => Product, (product) => product.category)
    // products: Product[]

}

