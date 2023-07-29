import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, ManyToOne, EntityRepository, Repository } from "typeorm"
import { Category } from "./Category"


@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 100,
    })
    product_name: string    


    @Column({
    })
    product_img: string

    @Column({
    })
    product_desc: string

    @Column({
    })
    by_producer: string


    @Column()
    main_price: number

    @Column()
    sale_price: number


    @Column()
    date: Date

    @Column({
    })
    status: string

    @ManyToOne((type) => Category)
    @JoinColumn({name: "category_id"})
    category: Category


}


