import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, ManyToOne, EntityRepository, Repository } from "typeorm"
import { Category } from "./Category"
import { Topic } from "./Topic"


@Entity()
export class Blogs {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "text"
    })
    title_blog: string    


    @Column({type: "text"
    })
    desc_blog: string

    @Column({type: "text"
    })
    content_blog: string

    @Column({
    })
    by_user: string


    @Column()
    img_thum: string


    @ManyToOne((type) => Topic)
    @JoinColumn({name: "topic_id"})
    topic: Topic


}