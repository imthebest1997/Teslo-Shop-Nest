import { Product } from "../../products/entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text',{ 
        unique: true 
    })
    email: string;

    @Column({
        type: 'text',
        select: false,
    })
    password: string;

    @Column({
        type: 'varchar',
        length: 100,
    })
    fullName: string;
    
    @Column({
        type: 'bool',
        default: true,
    })
    isActive: boolean;

    @Column('text',{
        array: true,
        default: ['user'],
    })
    role: string[];


    @OneToMany(
        () => Product,
        (product) => product.user,
        {
            cascade: true,
        }
    )
    products: Product[];

    @BeforeInsert()
    checkFieldBeforeInsert() {
        this.email = this.email.toLowerCase().trim();        
    }

    @BeforeUpdate()
    checkFieldBeforeUpdate() {
        this.checkFieldBeforeInsert();        
    }
}
