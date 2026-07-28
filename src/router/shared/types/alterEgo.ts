import { User } from '@/store/entities/user.ts';

/** Пользователь, возвращаемый /register/alter_ego и /login/alter_ego. */
export type AlterEgoAuthResponse = User & {
    token: string;
};
