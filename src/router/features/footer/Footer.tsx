export default function Footer() {
    return (
        <div className='flex flex-col gap-y-2 mt-5'>
            <div className='flex items-center gap-x-8 font-bold text-onSurface'>
                <span>Правообладателям</span>
                <span>Пользовательское соглашение</span>
                <span>Контакты</span>
            </div>
            <span className='font-medium text-onSurfaceVariant'>
                Сервис smashup.ru может содержать информацию, не предназначенную для
                несовершеннолетних
            </span>
        </div>
    );
}
