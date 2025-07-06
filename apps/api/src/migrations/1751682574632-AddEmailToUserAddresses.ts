import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmailToUserAddresses1751682574632 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE user_addresses 
            ADD COLUMN email varchar(255) NOT NULL,
//             ADD CONSTRAINT user_addresses_email_check CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$')
        `);

    // If there is a default value or if existing data needs to be filled
    await queryRunner.query(`
            UPDATE user_addresses SET email = users.email
            FROM users WHERE user_addresses.user_id = users.id
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE user_addresses DROP COLUMN email`);
  }
}
