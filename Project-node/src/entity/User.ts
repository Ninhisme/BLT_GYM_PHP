import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import { compareSync, hashSync  } from 'bcryptjs';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @BeforeInsert()
  hashPassword() {
      this.password = hashSync(this.password, 10);
  }

  // kiểm tra mật khẩu đúng hay không
  checkIfUnencryptedPasswordIsValid(password: string) {
      return compareSync(password, this.password);
  }
  
}