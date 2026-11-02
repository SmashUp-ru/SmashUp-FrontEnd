import { describe, expect, it } from 'vitest';
import { emailField, newPasswordField, usernameField } from '@/router/shared/schemas/fields.ts';
import { changePasswordFormSchema } from '@/router/shared/schemas/changePassword.ts';
import { changeEmailFormSchema } from '@/router/shared/schemas/changeEmail.ts';

const ok = (schema: { safeParse: (v: unknown) => { success: boolean } }, v: unknown) =>
    schema.safeParse(v).success;

describe('usernameField — как на бэке: 2–32, не одни цифры', () => {
    it('принимает 2 и 32 символа, пробел и кириллицу', () => {
        expect(ok(usernameField, 'Ая')).toBe(true);
        expect(ok(usernameField, 'a'.repeat(32))).toBe(true);
        expect(ok(usernameField, 'DJ Иван_2')).toBe(true);
    });
    it('отклоняет 1 и 33 символа и одни цифры', () => {
        expect(ok(usernameField, 'Я')).toBe(false);
        expect(ok(usernameField, 'a'.repeat(33))).toBe(false);
        expect(ok(usernameField, '1234')).toBe(false);
    });
});

describe('emailField', () => {
    it('принимает длинный корпоративный адрес (раньше лимит был 32)', () => {
        expect(ok(emailField, 'konstantin.konstantinopolsky@company-name.ru')).toBe(true);
    });
    it('отклоняет не-адрес (раньше в смене почты проходила любая строка от 3 символов)', () => {
        expect(ok(emailField, 'abc')).toBe(false);
        expect(ok(changeEmailFormSchema, { email: 'abc', password: 'x' })).toBe(false);
    });
});

describe('newPasswordField — строго целиком', () => {
    it('принимает допустимый пароль', () => {
        expect(ok(newPasswordField, 'qwerty_123!')).toBe(true);
    });
    it('отклоняет кириллицу и пробел рядом с 8 допустимыми символами', () => {
        expect(ok(newPasswordField, 'пароль qwerty123')).toBe(false);
        expect(ok(newPasswordField, 'qwerty123 ')).toBe(false);
    });
});

describe('changePasswordFormSchema', () => {
    it('новый пароль не может совпадать с текущим', () => {
        const r = changePasswordFormSchema.safeParse({
            oldPassword: 'qwerty123',
            newPassword: 'qwerty123',
            newPasswordAgain: 'qwerty123'
        });
        expect(r.success).toBe(false);
    });
    it('повтор должен совпадать', () => {
        expect(
            ok(changePasswordFormSchema, {
                oldPassword: 'old_pass1',
                newPassword: 'new_pass1',
                newPasswordAgain: 'new_pass2'
            })
        ).toBe(false);
    });
});
