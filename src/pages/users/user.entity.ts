import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['customId'])
export class User extends BaseEntity{
    @ApiProperty({description: '사용자 고유번호', example: '1'})
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({description: '사용자 아이디', example: 'jswcyber'})
    @Column()
    customId: string;

    @ApiProperty({description: '사용자 이름', example: '정성욱'})
    @Column({ length: 30 })
    name: string;

    @ApiProperty({description: '사용자 이메일', example: 'jswcyber@naver.com'})
    @Column({ length: 60 })
    email: string;

    @ApiProperty({description: '사용자 비밀번호', example: 'Qlalfqjsgh1234!@'})
    @Column()
    password: string;

    @ApiProperty({description: '사용자 권한', example: 'admin'})
    @Column({ default:1 })
    role: number;

    @ApiProperty({description: 'Refresh Token'})
    @Column({ nullable: true })
    refreshToken: string;

    @ApiProperty({description: '생성일'})
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @ApiProperty({description: '수정일'})
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @ApiProperty({description: '삭제일'})
    @Column({ type: 'timestamp', nullable: true })
    deletedAt: Date;

    @ApiProperty({description: '삭제여부'})
    @Column({ default: false })
    isDeleted: boolean;
}