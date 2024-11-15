import banner from '@/assets/banner.png';

export default function Banner() {
    return (
        <img src={banner} alt='Banner' className='border rounded-[50px] w-full' draggable={false} />
    );
}
