import { useParams } from 'react-router-dom';
import MashupCollection from '@/router/features/mashupCollection/MashupCollection.tsx';
import MashupThumb from '@/router/shared/mashup/MashupThumb.tsx';
import radio from '@/assets/radio.png';

export default function PlaylistPage() {
    const params = useParams();

    if (!params.playlistId) return;

    return (
        <MashupCollection title='Плейлист' name={`Номер ${params.playlistId}`}>
            <MashupThumb
                img={radio}
                title='Развлекайтесь на 180db'
                author='LeonidM'
                length='2:26'
            />
            <MashupThumb
                img={radio}
                title='Развлекайтесь на 180db'
                author='LeonidM'
                length='2:26'
            />
            <MashupThumb
                img={radio}
                title='Развлекайтесь на 180db'
                author='LeonidM'
                length='2:26'
            />
            <MashupThumb
                img={radio}
                title='Развлекайтесь на 180db'
                author='LeonidM'
                length='2:26'
            />
            <MashupThumb
                img={radio}
                title='Развлекайтесь на 180db'
                author='LeonidM'
                length='2:26'
            />
            <MashupThumb
                img={radio}
                title='Развлекайтесь на 180db'
                author='LeonidM'
                length='2:26'
            />
            <MashupThumb
                img={radio}
                title='Развлекайтесь на 180db'
                author='LeonidM'
                length='2:26'
            />
            <MashupThumb
                img={radio}
                title='Развлекайтесь на 180db'
                author='LeonidM'
                length='2:26'
            />
            <MashupThumb
                img={radio}
                title='Развлекайтесь на 180db'
                author='LeonidM'
                length='2:26'
            />
            <MashupThumb
                img={radio}
                title='Развлекайтесь на 180db'
                author='LeonidM'
                length='2:26'
            />
        </MashupCollection>
    );
}
